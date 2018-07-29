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

const specialLink = id => `${window.location.href}signin?id=${id}`;

const SpecialLinkInfo = ({ id }) => {
  if (!id || id === "") return null;

  const link = specialLink(id);

  return (
    <Pane>
      <Heading is="h3" marginBottom={majorScale(2)}>
        ✨ Magic Link
      </Heading>
      <Paragraph marginBottom={majorScale(2)} maxWidth={600}>
        Your signin page is now active at the link below! Click it now to go to
        a signin or copy/paste it to use on several computers at once!
      </Paragraph>
      <Pane background="tint1" padding={majorScale(2)}>
        <a href={link}>{link}</a>
      </Pane>
    </Pane>
  );
};

class CampaignPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "", isLoading: false };

    this.handleName = this.handleName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();

    this.setState({ isLoading: true, id: "" });

    const resp = await fetch("/api/campaign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: this.state.name
      })
    });

    const json = await resp.json();

    // Oh shit error
    if (json.message !== "success" || !json.id) {
      console.error(json);
    }

    this.setState({ id: json.id, isLoading: false });
  }

  handleName(event) {
    this.setState({ name: event.target.value });
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
              Signin Page generator
            </Heading>

            <Paragraph marginBottom={majorScale(2)} maxWidth={600}>
              This tool helps you create a signin page for your events! 🙌
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
                value={this.state.name}
                onChange={this.handleName}
              />
            </Pane>

            <Button isLoading={this.state.isLoading}>
              {this.state.isLoading ? "Loading" : "Create"}
            </Button>

            <Pane marginTop={majorScale(4)}>
              <SpecialLinkInfo id={this.state.id} />
            </Pane>
          </Pane>
        </Pane>
      </form>
    );
  }
}

export default CampaignPicker;
