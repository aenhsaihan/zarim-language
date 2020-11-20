import React, { Component } from "react";
import { Form, Button, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import zarim from "../../ethereum/zarim";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";

class RegisterSpeaker extends Component {
  state = {
    age: "",
    gender: "",
    country: "",
    languages: "",
    errorMessage: "",
    web3: null,
    accounts: null,
    contract: null,
    loading: false,
  };

  componentDidMount = async () => {
    try {
      //   const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const contract = await zarim;

      this.setState({ web3, accounts, contract });
    } catch (err) {
      // Catch any errors for any of the above operations.
      this.setState({ errorMessage: err.message });
    }
  };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: "" });

    try {
      await this.state.contract.methods
        .registerSpeaker(1, 2, 3, [5])
        .send({ from: this.state.accounts[0] });

      Router.pushRoute("/");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <Layout>
        <h3>Register new speaker</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Age</label>
            <input
              value={this.state.age}
              onChange={(event) => this.setState({ age: event.target.value })}
            />
          </Form.Field>

          <Form.Field>
            <label>Gender</label>
            <input
              value={this.state.gender}
              onChange={(event) =>
                this.setState({ gender: event.target.value })
              }
            />
          </Form.Field>

          <Form.Field>
            <label>Country</label>
            <input
              value={this.state.country}
              onChange={(event) =>
                this.setState({ country: event.target.value })
              }
            />
          </Form.Field>

          <Form.Field>
            <label>Native language(s)</label>
            <input
              value={this.state.languages}
              onChange={(event) =>
                this.setState({ languages: event.target.value })
              }
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>
            Register
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default RegisterSpeaker;
