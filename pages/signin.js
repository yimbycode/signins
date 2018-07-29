import {
  Pane,
  Heading,
  TextInput,
  majorScale,
  Label,
  Button
} from "evergreen-ui";
import "whatwg-fetch";

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: "" };

    this.handleEmail = this.handleEmail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.email
      })
    });
  }

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
              Hi! Welcome to YIMBY!
            </Heading>

            <Pane maxWidth={"400"} marginBottom={majorScale(2)}>
              <Label
                htmlFor={32}
                size={400}
                display="block"
                marginBottom={majorScale(1)}
              >
                Your Email
              </Label>
              <TextInput
                name={32}
                id={32}
                placeholder="ex: yimbystar@gmail.com"
                value={this.state.email}
                onChange={this.handleEmail}
              />
            </Pane>

            <Button>Submit</Button>
          </Pane>
        </Pane>
      </form>
    );
  }
}

export default Signup;
