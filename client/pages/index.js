import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";
import zarim from "../ethereum/zarim";
import Layout from "../components/Layout";

class App extends Component {
  state = {
    contract: null,
    speakersCount: null,
    nativeSpekaer: null,
    errorMessage: null,
  };

  componentDidMount = async () => {
    try {
      const contract = await zarim;
      const speakersCount = await contract.methods.getSpeakersCount(5).call();
      const nativeSpeaker = await contract.methods.nativeSpeakers(5, 0).call();

      this.setState({ contract, speakersCount, nativeSpeaker });
    } catch (err) {
      // Catch any errors for any of the above operations.
      this.setState({ errorMessage: err.message });
    }
  };

  renderNativeSpeakers() {
    const item = {
      header: this.state.nativeSpeaker,
      description: <a>View speaker</a>,
      fluid: true,
    };
    return <Card.Group items={[item]} />;
  }

  render() {
    return (
      <Layout>
        <div className="App">
          <h3>Open Sessions</h3>

          <Button
            floated="right"
            content="Register"
            icon="add circle"
            primary
          />

          {this.renderNativeSpeakers()}
        </div>
      </Layout>
    );
  }
}

export default App;
