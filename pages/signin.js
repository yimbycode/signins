import {
  Pane,
  Heading,
  TextInput,
  majorScale,
  Label,
  Button
} from "evergreen-ui";
import "whatwg-fetch";
import { Paragraph } from "../node_modules/evergreen-ui/commonjs/typography";

const FormField = ({ label, placeholder, value, onChange }) => (
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
    />
  </Pane>
);

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: "", isFullSignupForm: true };

    this.handleEmail = this.handleEmail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const url = new URL(window.location.href);
    this.campaignId = url.searchParams.get("id");
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.campaignId);
    fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.email,
        campaignId: this.campaignId
      })
    });
  }

  handleFirstName(event) {}
  handleLastName(event) {}
  handleAddress(event) {}
  handleCity(event) {}
  handleState(event) {}
  handleState(event) {}
  handleZipcode(event) {}
  handleOccupation(event) {}
  handleEmployer(event) {}

  handleEmail(event) {
    this.setState({ email: event.target.value });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
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
                👋 Woah we haven't seen you before!
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
                    label={"Your State"}
                    placeholder={"ex: 94102"}
                    value={this.state.zipcode}
                    onChange={this.handleZipcode}
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

            <Button>Submit</Button>
          </Pane>
        </Pane>
      </form>
    );
  }
}

export default SignIn;
