import React from "react";
import Anchor from "@feat/feat-ui/lib/anchor";
import { RectShape } from "@feat/feat-ui/lib/placeholder";

const { Link } = Anchor;

const Basic = () => (
  <div>
    <Anchor style={{ width: 500 }}>
      <Link href="#top">top</Link>
      <Link href="#middle">middle</Link>
      <Link href="#bottom">bottom</Link>
    </Anchor>
    <RectShape label="top" height={1080} id="top" />
    <RectShape label="middle" height={1080} id="middle" />
    <RectShape label="bottom" height={1080} id="bottom" />
  </div>
);

export default Basic;
