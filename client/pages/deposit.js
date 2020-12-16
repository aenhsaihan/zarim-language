import React, { Component } from "react";
import { Form, Button, Input } from "semantic-ui-react";
import zarim from "../ethereum/zarim";
import Layout from "../components/Layout";
import { Link } from "../routes";
import web3 from "../ethereum/web3";

class Deposit extends Component {
  state = {
    contract: null,
    errorMessage: null,
    depositAmount: null,
  };

  componentDidMount = async () => {
    try {
      const contract = await zarim;

      this.setState({ contract });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  };

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    try {
      await web3.eth.sendTransaction({
        from: accounts[0],
        to: this.state.contract.options.address,
        data: this.state.contract.methods.deposit().encodeABI(),
        value: this.state.depositAmount,
      });
    } catch (err) {}
  };

  render() {
    return (
      <Layout>
        <h3>Make a deposit</h3>

        <Form onSubmit={this.onSubmit}>
          <Form.Field>
            <label>Minimum Contribution</label>
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

          <Button primary>Deposit</Button>
        </Form>
      </Layout>
    );
  }
}

export default Deposit;
