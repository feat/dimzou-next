import React from "react";
import Comment from "@feat/feat-ui/lib/comment";
import Avatar from "@feat/feat-ui/lib/avatar";

import data from "./data";
import CommentItem from "./Comment";

/** 模拟评论列表 */
const Example = () => (
  <div style={{ background: "#fffcf9", padding: 24 }}>
    <Comment.List>
      {data.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </Comment.List>
  </div>
);

export default Example;
