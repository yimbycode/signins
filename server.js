const jsforce = require("jsforce");
const express = require("express");
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const conn = new jsforce.Connection();

// Salesforce username and pass
const user = process.argv[2];
const pass = process.argv[3];

if (!user) {
  console.error("No salesforce user entered");
  process.exit(1);
}

if (!pass) {
  console.error("No salesforce pass entered");
  process.exit(1);
}

function createContact(conn, email, first, last) {
  return conn.sobject("Contact").create({
    Email: email,
    FirstName: first,
    LastName: last
  });
}

function existingContact(conn, email) {
  return new Promise((resolve, reject) => {
    conn
      .find({ Email: Email })
      .limit(1)
      .execute((err, records) => {
        if (err) return reject(err);

        resolve(records);
      });
  });
}

function findCampaign(conn, name) {
  return new Promise((resolve, reject) => {
    conn
      .sobject("Campaign")
      .find({ CampaignName: name }) // TODO: add event type
      .limit(1)
      .execute((err, records) => {
        if (err) return reject(err);

        resolve(records);
      });
  });
}

function createCampaign(conn, name) {
  // TODO add event type
  return conn.sobject("Campaign").create({
    Name: name
  });
}

async function findOrCreateCampaign(conn, name) {
  try {
    const campaign = await findCampaign(conn, name);
    if (campaign) {
      return campaign;
    }

    return await createCampaign(conn, name);
  } catch (err) {
    throw err;
  }
}

async function handleEmailCheck(req, res) {
  const { email } = req.body;

  try {
    // First check if this email exists already
    const prevContact = await existingContact(conn);
    if (!prevContact) {
      return res.json({
        email,
        message: "contact-doesnt-exist"
      });
    }

    // If it does, then add it to the campaign

    //TODO add to campaign
    const contactId = prevContact.id;

    res.json({
      prevContact,
      message: "success"
    });
  } catch (err) {
    res.json({
      err,
      message: "fail"
    });
  }
}

async function handleNewContact(req, res) {
  const { email, firstName, lastName } = req.body;

  try {
    const contact = await createContact(conn, email, firstName, lastName);

    res.json({
      contact: contact,
      message: "success"
    });
  } catch (err) {
    res.json({
      err,
      message: "fail"
    });
  }
}

async function handleFindOrCreateCampaign(req, res) {
  const { name } = req.body;

  try {
    const campaign = await findOrCreateCampaign(conn, name);
    campaign.id;
  } catch (err) {
    res.json({
      err,
      message: "fail"
    });
  }
}

conn.login(user, pass, (err, res) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  app.prepare().then(() => {
    const server = express();

    server.use(express.json());

    // record an email
    server.post("/api/email", handleEmailCheck);

    // Add a whole new contact to the address
    server.post("/api/newContact", handleNewContact);

    // returns a campaign id; either a brand new one or a previously existing one
    server.post("/api/campaign", handleFindOrCreateCampaign);

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  });
});
