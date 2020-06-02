import React from "react";
import Button from "@feat/feat-ui/lib/button";

import Wrapper from "./Wrapper";

/** Button 有6种状态可选。 */
const Example = () => (
  <div>
    <h3>不同状态</h3>
    <div>
      <Wrapper>
        <Button type="primary">primary</Button>
      </Wrapper>
      <Wrapper>
        <Button type="dashed">dashed</Button>
      </Wrapper>
      <Wrapper>
        <Button type="danger">danger</Button>
      </Wrapper>
      <Wrapper>
        <Button type="default">default</Button>
      </Wrapper>
      <Wrapper>
        <Button type="link">link</Button>
      </Wrapper>
      <Wrapper>
        <Button type="merge">merge</Button>
      </Wrapper>
      <Wrapper>
        <Button type="primaryOutline">Primary</Button>
      </Wrapper>
      <Wrapper>
        <Button type="dangerOutline">Danger</Button>
      </Wrapper>
      <Wrapper>
        <Button type="linkOutline">Link</Button>
      </Wrapper>
      <Wrapper>
        <Button type="ok">OK</Button>
      </Wrapper>
      <Wrapper>
        <Button type="no">NO</Button>
      </Wrapper>
    </div>
    <h3>禁用</h3>
    <div>
      <Wrapper>
        <Button type="primary" disabled>
          primary
        </Button>
      </Wrapper>
      <Wrapper>
        <Button type="dashed" disabled>
          dashed
        </Button>
      </Wrapper>
      <Wrapper>
        <Button type="danger" disabled>
          danger
        </Button>
      </Wrapper>
      <Wrapper>
        <Button type="default" disabled>
          default
        </Button>
      </Wrapper>
      <Wrapper>
        <Button type="link" disabled>
          link
        </Button>
      </Wrapper>
      <Wrapper>
        <Button type="merge" disabled>
          merge
        </Button>
      </Wrapper>
      <Wrapper>
        <Button type="primaryOutline" disabled>Primary</Button>
      </Wrapper>
      <Wrapper>
        <Button type="dangerOutline" disabled>Danger</Button>
      </Wrapper>
      <Wrapper>
        <Button type="linkOutline" disabled>Link</Button>
      </Wrapper>
      <Wrapper>
        <Button type="ok" disabled>
          OK
        </Button>
      </Wrapper>
      <Wrapper>
        <Button type="no" disabled>
          NO
        </Button>
      </Wrapper>
    </div>
  </div>
);

export default Example;
