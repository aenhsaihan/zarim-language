import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";
import zarim from "../ethereum/zarim";
import "semantic-ui-css/semantic.min.css";
import Layout from "../components/Layout";

class App extends Component {
  static async getInitialProps() {
    const contract = await zarim;
    const speakersCount = await contract.methods.getSpeakersCount(0).call();
    const nativeSpeaker = await contract.methods.nativeSpeakers(0, 0).call();

    return { speakersCount, contract, nativeSpeaker };
  }

  renderNativeSpeakers() {
    const item = {
      header: this.props.nativeSpeaker,
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
          <div>{this.renderNativeSpeakers()}</div>
          <Button content="Register" icon="add circle" primary />
        </div>
      </Layout>
    );
  }
}

export default App;
