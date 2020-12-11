import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";
import zarim from "../ethereum/zarim";
import Layout from "../components/Layout";
import { Link } from "../routes";
import web3 from "../ethereum/web3";

class App extends Component {
  state = {
    contract: null,
    speakersCount: null,
    nativeSpeaker: null,
    errorMessage: null,
  };

  componentDidMount = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      const contract = await zarim;

      const speakersCount = await contract.methods.getSpeakersCount(5).call();
      const nativeSpeaker = await contract.methods.nativeSpeakers(0, 0).call();

      const closedSessionsCount = await contract.methods
        .getClosedSessionsCount(accounts[0])
        .call();
      console.log(closedSessionsCount);

      const closedSessions = [];
      for (let index = 0; index < parseInt(closedSessionsCount); index++) {
        const closedSession = await contract.methods
          .closedSessions(accounts[0], index)
          .call();
        closedSessions.push(closedSession);
      }
      console.log(closedSessions);

      this.setState({
        accounts,
        contract,
        speakersCount,
        nativeSpeaker,
        closedSessionsCount,
        closedSessions,
      });
    } catch (err) {
      // Catch any errors for any of the above operations.
      this.setState({ errorMessage: err.message });
    }
  };

  getClosedSessions = async (closedSessionsCount) => {
    const closedSessionss = [];
    for (let index = 0; index < parseInt(closedSessionsCount); index++) {
      const closedSession = await this.state.contract.methods
        .closedSessions(this.state.accounts[0], index)
        .call();
      closedSessions.push(closedSession);
      debugger;
    }

    this.setState({ closedSessions: closedSessionss });
  };

  renderNativeSpeakers() {
    // this.getClosedSessions().then((closedSessions) => {
    //   return <Card.Group items={items} />;
    // });
    // // debugger;
    // console.log("outside then");

    if (this.state.closedSessions) {
      const items = this.state.closedSessions.map((session) => {
        console.log(session.speaker);
        return {
          header: session.speaker,
          description: (
            <Link route={`/sessions/${session.speaker}`}>
              <a>Enter session</a>
            </Link>
          ),
          fluid: true,
        };
      });

      return <Card.Group items={items} />;
    }

    const item = {
      header: this.state.nativeSpeaker,
      description: (
        <Link route={`/sessions/${this.state.nativeSpeaker}`}>
          <a>Enter session</a>
        </Link>
      ),
      fluid: true,
    };
    return <Card.Group items={[item]} />;
  }

  render() {
    return (
      <Layout>
        <div className="App">
          <h3>Open Sessions</h3>

          <Link route="/register/speaker">
            <a>
              <Button
                floated="right"
                content="Register"
                icon="add circle"
                primary
              />
            </a>
          </Link>

          {this.renderNativeSpeakers()}
        </div>
      </Layout>
    );
  }
}

export default App;
