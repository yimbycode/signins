const jsforce = require("jsforce");
const express = require("express");
const next = require("next");
const log = console.log;

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
  const params = {
    Email: email,
    FirstName: first,
    LastName: last
  };

  log("Creating new contact with", params)
  return conn.sobject("Contact").create(params);
}

function existingContact(conn, email) {
  const params = {
    Email: email
  };

  log("Looking for contact", params);

  return new Promise((resolve, reject) => {
    conn
      .sobject("Contact")
      .find(params)
      .limit(1)
      .execute((err, records) => {
        if (err) return reject(err, ercords);

        resolve(records);
      });
  });
}

function findCampaign(conn, name) {
  const params = {
    Name: name
  };

  console.log("finding Campaign with params", params);

  return new Promise((resolve, reject) => {
    conn
      .sobject("Campaign")
      .find(params)
      .limit(1)
      .execute((err, records) => {
        if (err) return reject(err);

        resolve(records);
      });
  });
}

async function createCampaign(conn, name) {
  // TODO add event type
  const params = {
    Name: name
  };

  log("creating campaign with params", params);

  // Create new campaign
  return await conn.sobject("Campaign").create(params);
}

async function findOrCreateCampaign(conn, name) {
  try {
    const campaign = await findCampaign(conn, name);

    if (campaign && campaign.length !== 0 && campaign[0].Id) {
      return campaign;
    }

    return await createCampaign(conn, name);
  } catch (err) {
    throw err;
  }
}

async function addCampaignMember(conn, campaignId, contactId) {
  const props = {
    ContactId: contactId,
    CampaignId: campaignId
  };
  log("Adding campaign member with ", props);
  return conn.sobject("campaignMember").create(props);
}

async function handleEmailCheck(req, res) {
  const { email, campaignId } = req.body;

  log("Handling Email Check", req.body);

  try {
    // First check if this email exists already
    const prevContact = await existingContact(conn, email);
    if (!prevContact || prevContact.length === 0) {
      log("Could not find contact", email)
      return res.json({
        email,
        message: "contact-does-not-exist"
      });
    }

    log("Found existing contact", prevContact);

    // wtf salesforce dont be mean
    // you're mean salesforce dont be that way
    const contactId = prevContact.id || prevContact[0].Id;

    // if we have an id, then add it to the campaign
    const resp = await addCampaignMember(conn, campaignId, contactId);

    // Success!
    log("Added person to campaign", prevContact, resp);
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
  const { email, firstName, lastName, campaignId } = req.body;

  try {
    const contact = await createContact(conn, email, firstName, lastName);
    await addCampaignMember(conn, campaignId, contact.id);

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

    // wtf salesforce
    let id = campaign.id || campaign[0].Id;

    return res.json({
      id,
      message: "success"
    });
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
    server.post("/api/contact", handleNewContact);

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
