import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";
import zarim from "../ethereum/zarim";
import "semantic-ui-css/semantic.min.css";

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
      <div className="App">
        <div>{this.renderNativeSpeakers()}</div>
        <Button content="Register" icon="add circle" primary />
      </div>
    );
  }
}

export default App;
