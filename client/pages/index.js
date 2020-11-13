import React, { Component } from "react";
import { Card } from "semantic-ui-react";
import zarim from "../ethereum/zarim";

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
        <h1>Good to Go!!!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <div>The stored value is: {this.props.speakersCount}</div>
        <div>{this.renderNativeSpeakers()}</div>
      </div>
    );
  }
}

export default App;
