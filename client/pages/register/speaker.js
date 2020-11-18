import React, { Component } from "react";
import { Form, Button } from "semantic-ui-react";
import Layout from "../../components/Layout";

class RegisterSpeaker extends Component {
  state = {
    age: "",
    gender: "",
    country: "",
    languages: "",
  };

  render() {
    return (
      <Layout>
        <h3>Register new speaker</h3>

        <Form>
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

          <Button primary>Register</Button>
        </Form>
      </Layout>
    );
  }
}

export default RegisterSpeaker;
