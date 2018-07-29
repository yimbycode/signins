import {
  Pane,
  Heading,
  TextInput,
  majorScale,
  Label,
  Button,
  Paragraph
} from "evergreen-ui";
import "whatwg-fetch";

class CampaignPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "" };

    this.handleName = this.handleName.bind(this);
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
        name: this.state.name
      })
    });
  }

  handleName(event) {
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
              YIMBY RSVP generator
            </Heading>

            <Paragraph marginBottom={majorScale(2)} maxWidth={600}>
              This tool helps you create a signin page for your events. When you
              press "Create", you'll be redirected to a signin page.{" "}
              <b>The URL is special!</b> You can copy/paste the link and reuse
              it on other computers without creating a new campaign.
            </Paragraph>

            <Paragraph maxWidth={600} marginBottom={majorScale(4)}>
              This attendance data is incredibly valuable for us to track our
              membership's engagement and retain interested volunteers. The form
              also allows us to have non-member attendees join YIMBY Action and
              share their information on the spot. To request the attendance
              data for an event you have hosted,{" "}
              <a href="mailto:hello@yimbyaction.org">
                please contact YIMBY staff.
              </a>
            </Paragraph>

            <Pane maxWidth={"400"} marginBottom={majorScale(2)}>
              <Label
                htmlFor={32}
                size={400}
                display="block"
                marginBottom={majorScale(1)}
              >
                Campaign Name
              </Label>
              <TextInput
                name={32}
                id={32}
                placeholder="ex: Yimby Meetup 2020-10-3"
                value={this.state.email}
                onChange={this.handleEmail}
              />
            </Pane>

            <Button>Create</Button>
          </Pane>
        </Pane>
      </form>
    );
  }
}

export default CampaignPicker;
