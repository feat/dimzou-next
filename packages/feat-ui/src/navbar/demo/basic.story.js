import React from "react";

import Navbar from "@feat/feat-ui/lib/navbar";
import SvgIcon from "@feat/feat-ui/lib/svg-icon";
import Menu from "@feat/feat-ui/lib/menu";

/** __Menu__ - Navbar Example */
const Example = () => (
  <Navbar>
    <Navbar.Brand>
      <SvgIcon icon="feat-v2" width={100} height={32} />
    </Navbar.Brand>
    <Menu>
      <Menu.Item active>Home</Menu.Item>
      <Menu.Item>Content</Menu.Item>
      <Menu.Item>Next</Menu.Item>
    </Menu>
    <Navbar.Center>
      <Menu>
        <Menu.Item>Custom</Menu.Item>
      </Menu>
    </Navbar.Center>
    <Navbar.Right>
      <Menu>
        <Menu.Item icon>
          <SvgIcon icon="search" height={32} />
        </Menu.Item>
        <Menu.Item icon>
          <SvgIcon icon="add-book" height={32} />
        </Menu.Item>
        <Menu.Item icon>
          <SvgIcon icon="heart" height={32} />
        </Menu.Item>
        <Menu.Item icon>
          <SvgIcon icon="setting" height={32} />
        </Menu.Item>
        <Menu.Item icon>
          <SvgIcon icon="im" height={32} />
        </Menu.Item>
        <Menu.Item icon>
          <SvgIcon icon="translate-v2" height={32} />
        </Menu.Item>
        <Menu.Item icon>
          <SvgIcon icon="post" height={32} />
        </Menu.Item>
        <Menu.Item icon>
          <SvgIcon icon="logout" height={32} />
        </Menu.Item>
      </Menu>
    </Navbar.Right>
  </Navbar>
);

export default Example;
