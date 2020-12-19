import React from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "../routes";

export default () => {
  return (
    <Menu style={{ marginTop: "10px" }}>
      <Link route="/">
        <a className="item">Dashboard</a>
      </Link>

      <Menu.Menu position="right">
        <Link route="/">
          <a className="item">Sessions</a>
        </Link>

        <Link route="/register/speaker">
          <a className="item">Register</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};
