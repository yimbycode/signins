/**
 * @overview An form that collects signins or redirects people to sign up
 */
import {
  Pane,
  Heading,
  TextInput,
  majorScale,
  Label,
  Button,
  toaster
} from "evergreen-ui";
import "whatwg-fetch";
import { Paragraph } from "../node_modules/evergreen-ui/commonjs/typography";

const FormField = ({ type = "text", label, placeholder, value, onChange }) => (
  <Pane marginBottom={majorScale(2)}>
    <Label htmlFor={32} size={400} display="block" marginBottom={majorScale(1)}>
      {label}
    </Label>
    <TextInput
      name={32}
      id={32}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      type={type}
    />
  </Pane>
);

/**
 * Returns a ready to go handler that sets the state variable
 * with the text input target value
 */
function buildHandler(self, type) {
  return event => self.setState({ [type]: event.target.value });
}

async function postJSON(path, body) {
  return fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  }).then(resp => resp.json());
}

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      lastName: "",
      firstName: "",
      address: "",
      city: "",
      state: "",
      zipcode: "",
      occupation: "",
      employer: "",
      isFullSignupForm: false,
      isLoading: false
    };

    this.handleEmailTrack = this.handleEmailTrack.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleSignup = this.handleSignup.bind(this);

    this.handleEmail = buildHandler(this, "email");
    this.handleLastName = buildHandler(this, "lastName");
    this.handleFirstName = buildHandler(this, "firstName");
    this.handleAddress = buildHandler(this, "address");
    this.handleCity = buildHandler(this, "city");
    this.handleState = buildHandler(this, "state");
    this.handleZipcode = buildHandler(this, "zipcode");
    this.handleOccupation = buildHandler(this, "occupation");
    this.handleEmployer = buildHandler(this, "employer");
  }

  componentDidMount() {
    const url = new URL(window.location.href);
    this.campaignId = url.searchParams.get("id");
  }

  handleError(err) {
    if (err.errorCode === "DUPLICATE_VALUE") {
      toaster.warning("You've already signed in! Go have fun!");
      console.warn(err);
      return;
    }

    toaster.danger(
      "😭 Something went wrong! Check the developer tools for more info."
    );
    console.error(err);
  }

  async handleEmailTrack(event) {
    event.preventDefault();

    this.setState({ isLoading: true });

    const response = await postJSON("/api/email", {
      email: this.state.email,
      campaignId: this.campaignId
    });

    // Grab "Bad" states/errors/warnings
    if (!response || response.err) {
      this.handleError(response.err || {});
      this.setState({ isLoading: false });
      return;
    }

    // TODO catch new people here
    if (response.message === "contact-does-not-exist") {
      toaster.notify("Hey we haven't seen you before!");
      this.setState({ isLoading: false, isFullSignupForm: true });
      return;
    }

    this.setState({ isLoading: false });
  }

  async handleSignup(event) {
    event.preventDefault();

    this.setState({
      isLoading: true
    })

    const response = await postJSON("/api/contact", {
      campaignId: this.campaignId,
      ...this.state // Just send it all #yolo
    });

    // Grab "Bad" states/errors/warnings
    if (!response || response.err) {
      this.handleError(response.err || {});
      this.setState({ isLoading: false, isFullSignupForm: false });
      return;
    }    

    toaster.notify("You're signed up and signed in.");

    this.setState({
      isFullSignupForm: false,
      isLoading: false
    })
  }

  render() {
    return (
      <form
        onSubmit={
          this.state.isFullSignupForm
            ? this.handleSignup
            : this.handleEmailTrack
        }
      >
        <Pane
          padding={"100px"}
          display="flex"
          alignItems="center"
          flexDirection="column"
        >
          <Pane>
            <Heading size={900} marginBottom={majorScale(2)}>
              Hi! Welcome to EVENT!
            </Heading>

            {this.state.isFullSignupForm ? (
              <Paragraph marginBottom={majorScale(2)}>
                👋 Let's sign you up as a YIMBY member!
              </Paragraph>
            ) : (
              <Paragraph marginBottom={majorScale(2)}>
                Please sign in below!
              </Paragraph>
            )}

            <Pane maxWidth={"400"} marginBottom={majorScale(2)}>
              <FormField
                label={"Your Email"}
                placeholder={"ex: yimbystar@gmail.com"}
                value={this.state.email}
                onChange={this.handleEmail}
                type="email"
              />

              {this.state.isFullSignupForm && (
                <React.Fragment>
                  {/* First Name */}
                  <FormField
                    label={"Your First Name"}
                    placeholder={"ex: Jane"}
                    value={this.state.firstName}
                    onChange={this.handleFirstName}
                  />

                  {/* Last Name */}
                  <FormField
                    label={"Your Last Name"}
                    placeholder={"ex: Jacobs"}
                    value={this.state.lastName}
                    onChange={this.handleLastName}
                  />

                  {/* Street Address */}
                  <FormField
                    label={"Your Street Address"}
                    placeholder={"ex: 123 YIMBY Causeway"}
                    value={this.state.address}
                    onChange={this.handleAddress}
                  />

                  {/* City */}
                  <FormField
                    label={"Your City"}
                    placeholder={"ex: San Francisco"}
                    value={this.state.city}
                    onChange={this.handleCity}
                  />

                  {/* State */}
                  <FormField
                    label={"Your State"}
                    placeholder={"ex: California"}
                    value={this.state.state}
                    onChange={this.handleState}
                  />

                  {/* Zip Code */}
                  <FormField
                    label={"Your Zipcode"}
                    placeholder={"ex: 94102"}
                    value={this.state.zipcode}
                    onChange={this.handleZipcode}
                    type="number"
                  />

                  {/* Occupation */}
                  <FormField
                    label={"Your Occupation"}
                    placeholder={"ex: Teacher"}
                    value={this.state.occupation}
                    onChange={this.handleOccupation}
                  />

                  {/* Employer */}
                  <FormField
                    label={"Your Employer"}
                    placeholder={"ex: Redding Elementary School"}
                    value={this.state.employer}
                    onChange={this.handleEmployer}
                  />
                </React.Fragment>
              )}
            </Pane>

            <Button isLoading={this.state.isLoading}>Submit</Button>
          </Pane>
        </Pane>
      </form>
    );
  }
}

export default SignIn;
