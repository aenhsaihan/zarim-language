import React, { Component } from "react";
import { Card, Button, Message, Form } from "semantic-ui-react";
import zarim from "../ethereum/zarim";
import Layout from "../components/Layout";
import { Link } from "../routes";
import web3 from "../ethereum/web3";

class App extends Component {
  state = {
    contract: "",
    errorMessage: "",
    currentBalance: "",
    loading: false,
    language: "",
    price: "",
    duration: "",
    availableSession: "",
    isSessionOpen: "",
  };

  componentDidMount = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      const contract = await zarim;

      const closedSessionsCount = await contract.methods
        .getClosedSessionsCount(accounts[0])
        .call();

      this.getClosedSessions(closedSessionsCount, contract, accounts);

      const currentBalance = await contract.methods
        .balanceOf(accounts[0])
        .call();

      const availableSession = await contract.methods
        .sessions(accounts[0])
        .call();

      this.setState({
        accounts,
        contract,
        currentBalance,
        availableSession,
      });
    } catch (err) {
      // Catch any errors for any of the above operations.
      this.setState({ errorMessage: err.message });
    }
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

  openSession = async (event) => {
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
      const availableSession = await this.state.contract.methods
        .sessions(this.state.accounts[0])
        .call();

      this.setState({ loading: false, availableSession });
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

  closeSession = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: "" });

    try {
      await web3.eth.sendTransaction({
        from: this.state.accounts[0],
        to: this.state.contract.options.address,
        data: this.state.contract.methods
          .closeSession(this.state.accounts[0])
          .encodeABI(),
      });

      this.setState({ isSessionOpen: false });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    } finally {
      const closedSessionsCount = await this.state.contract.methods
        .getClosedSessionsCount(this.state.accounts[0])
        .call();

      this.getClosedSessions(
        closedSessionsCount,
        this.state.contract,
        this.state.accounts
      );

      const availableSession = await this.state.contract.methods
        .sessions(this.state.accounts[0])
        .call();

      this.setState({ loading: false, availableSession });
    }
  };

  renderAvailableSessions() {
    const item = {
      header: this.state.availableSession.speaker,
      description: <a>Enter session</a>,
      fluid: true,
    };

    if (this.state.availableSession.open) {
      return (
        <React.Fragment>
          <h3>Available Sessions</h3>
          <Button
            loading={this.state.loading}
            onClick={this.closeSession}
            floated="right"
            content="Close"
            primary
          />
          <Card.Group items={[item]} />
        </React.Fragment>
      );
    }
  }

  renderClosedSessions() {
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
  }

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
          <Form onSubmit={this.openSession}>
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

          {this.renderAvailableSessions()}

          <h3>Closed Sessions</h3>

          {this.renderClosedSessions()}

          <Form error={!!this.state.errorMessage}>
            <Message error header="Oops!" content={this.state.errorMessage} />
          </Form>
        </div>
      </Layout>
    );
  }
}

export default App;
