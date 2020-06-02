import React from "react";

import TextInput from "@feat/feat-ui/lib/text-input";
import { Row, Col } from "@feat/feat-ui/lib/grid";

/** TextInput - Basic */
const Example = (props) => (
  <div>
    <h3>Prefix</h3>
    <Row flex gutter={24}>
      <Col>
        <TextInput placeholder="placeholder" prefix={<span>$</span>} />
      </Col>
      <Col>
        <TextInput
          placeholder="placeholder"
          size="md"
          prefix={<span>$</span>}
        />
      </Col>
      <Col>
        <TextInput
          placeholder="placeholder"
          size="lg"
          prefix={<span>$</span>}
        />
      </Col>
    </Row>
    <h3>Suffix</h3>
    <Row flex gutter={24}>
      <Col>
        <TextInput placeholder="placeholder" suffix={<span>case</span>} />
      </Col>
      <Col>
        <TextInput
          placeholder="placeholder"
          size="md"
          suffix={<span>case</span>}
        />
      </Col>
      <Col>
        <TextInput
          placeholder="placeholder"
          size="lg"
          suffix={<span>case</span>}
        />
      </Col>
    </Row>
    <h3>Prefix & Suffix</h3>
    <Row flex gutter={24}>
      <Col>
        <TextInput
          placeholder="placeholder"
          prefix="$"
          suffix={<span>case</span>}
        />
      </Col>
      <Col>
        <TextInput
          placeholder="placeholder"
          size="md"
          prefix="$"
          suffix={<span>case</span>}
        />
      </Col>
      <Col>
        <TextInput
          placeholder="placeholder"
          size="lg"
          prefix="$"
          suffix={<span>case</span>}
        />
      </Col>
    </Row>
  </div>
);

export default Example;
