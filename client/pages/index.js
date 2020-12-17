import React, { Component } from "react";
import { Card, Button, Message, Form } from "semantic-ui-react";
import zarim from "../ethereum/zarim";
import Layout from "../components/Layout";
import { Link } from "../routes";
import web3 from "../ethereum/web3";

class App extends Component {
  state = {
    contract: "",
    speakersCount: "",
    nativeSpeaker: "",
    errorMessage: "",
    currentBalance: "",
    loading: false,
    language: "",
    price: "",
    duration: "",
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

      this.getClosedSessions(closedSessionsCount, contract, accounts);

      const currentBalance = await contract.methods
        .balanceOf(accounts[0])
        .call();

      this.setState({
        accounts,
        contract,
        speakersCount,
        nativeSpeaker,
        currentBalance,
      });
    } catch (err) {
      // Catch any errors for any of the above operations.
      this.setState({ errorMessage: err.message });
    }
  };

  getClosedSessions = async (closedSessionsCount, contract, accounts) => {
    const closedSessions = [];
    for (let index = 0; index < parseInt(closedSessionsCount); index++) {
      const closedSession = await contract.methods
        .closedSessions(accounts[0], index)
        .call();
      closedSessions.push(closedSession);
    }

    this.setState({ closedSessions });
  };

  withdraw = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: "" });

    try {
      await web3.eth.sendTransaction({
        from: this.state.accounts[0],
        to: this.state.contract.options.address,
        data: this.state.contract.methods.withdraw().encodeABI(),
      });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    } finally {
      const currentBalance = await this.state.contract.methods
        .balanceOf(this.state.accounts[0])
        .call();

      this.setState({ loading: false, currentBalance });
    }
  };

  renderNativeSpeakers() {
    if (this.state.closedSessions) {
      const items = this.state.closedSessions.map((session, idx) => {
        return {
          header: session.speaker,
          description: (
            <Link route={`/sessions/${session.speaker}`}>
              <a>See session</a>
            </Link>
          ),
          fluid: true,
          key: idx,
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

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: "" });

    try {
      await web3.eth.sendTransaction({
        from: this.state.accounts[0],
        to: this.state.contract.options.address,
        data: this.state.contract.methods
          .openSession(
            this.state.language,
            this.state.price,
            this.state.duration
          )
          .encodeABI(),
      });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <Layout>
        <div className="App">
          <h3>Current balance</h3>
          <label>{this.state.currentBalance} wei</label>
          <Button
            loading={this.state.loading}
            onClick={this.withdraw}
            floated="right"
            content="Withdraw"
            secondary
          />
          <Link route="/deposit">
            <a>
              <Button floated="right" content="Deposit" primary />
            </a>
          </Link>

          <h3>Open Session</h3>
          <Form onSubmit={this.onSubmit}>
            <Form.Field>
              <label>Language</label>
              <input
                value={this.state.language}
                onChange={(event) =>
                  this.setState({ language: event.target.value })
                }
              />
            </Form.Field>

            <Form.Field>
              <label>Price</label>
              <input
                value={this.state.price}
                onChange={(event) =>
                  this.setState({ price: event.target.value })
                }
              />
            </Form.Field>

            <Form.Field>
              <label>Duration</label>
              <input
                value={this.state.duration}
                onChange={(event) =>
                  this.setState({ duration: event.target.value })
                }
              />
            </Form.Field>

            <Button
              loading={this.state.loading}
              primary
              content="Open"
            ></Button>
          </Form>

          <h3>Closed Sessions</h3>
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

          <Form error={!!this.state.errorMessage}>
            <Message error header="Oops!" content={this.state.errorMessage} />
          </Form>
        </div>
      </Layout>
    );
  }
}

export default App;
