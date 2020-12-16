import React, { Component } from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";
import zarim from "../ethereum/zarim";
import Layout from "../components/Layout";
import { Link } from "../routes";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

class Deposit extends Component {
  state = {
    contract: null,
    depositAmount: null,
    currentBalance: null,
    errorMessage: "",
    loading: false,
  };

  componentDidMount = async () => {
    try {
      const contract = await zarim;

      const accounts = await web3.eth.getAccounts();
      const currentBalance = await contract.methods
        .balanceOf(accounts[0])
        .call();

      this.setState({ contract, currentBalance });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: "" });

    const accounts = await web3.eth.getAccounts();

    try {
      await web3.eth.sendTransaction({
        from: accounts[0],
        to: this.state.contract.options.address,
        data: this.state.contract.methods.deposit().encodeABI(),
        value: this.state.depositAmount,
      });

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
        <h3>Current balance</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>{this.state.currentBalance} wei</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.depositAmount}
              onChange={(event) =>
                this.setState({
                  depositAmount: event.target.value,
                })
              }
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>
            Deposit
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default Deposit;
