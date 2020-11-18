import React from "react";
import { Menu } from "semantic-ui-react";

export default () => {
  return (
    <Menu>
      <Menu.Item>Zarim</Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item>Sessions</Menu.Item>

        <Menu.Item>+</Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};
