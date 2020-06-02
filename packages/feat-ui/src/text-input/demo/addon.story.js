import React from "react";

import TextInput from "@feat/feat-ui/lib/text-input";
import { Row, Col } from "@feat/feat-ui/lib/grid";
import Button from "@feat/feat-ui/lib/button";

/** TextInput - Basic */
const Example = (props) => (
  <div>
    <h3>Addon After</h3>
    <p>样式需要自行定义</p>
    <Row flex gutter={24}>
      <Col>
        <TextInput
          placeholder="verifiction code"
          addonAfter={<Button>Send Code</Button>}
        />
      </Col>
      <Col>
        <TextInput
          placeholder="verifiction code"
          size="md"
          addonAfter={<Button size="md">Send Code</Button>}
        />
      </Col>
      <Col>
        <TextInput
          placeholder="placeholder"
          size="lg"
          addonAfter={<Button size="lg">Send Code</Button>}
        />
      </Col>
    </Row>
  </div>
);

export default Example;
