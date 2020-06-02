import React, { Component } from "react";
import PropTypes from "prop-types";

import Comment from "@feat/feat-ui/lib/comment";
import Avatar from "@feat/feat-ui/lib/avatar";

const SubComment = ({ comment, parent }) => (
  <Comment.Wrap>
    <Comment className="margin_b_12" modifier="I">
      <Comment.Avatar className="padding_l_12">
        <Avatar avatar={comment.avatar} round />
      </Comment.Avatar>
      <Comment.Main>
        <Comment.Author>{comment.full_name}</Comment.Author>
        <span className="margin_r_5">>></span>
        <Comment.Author>{parent.full_name}</Comment.Author>
        <Comment.Meta>{comment.createdAt}</Comment.Meta>
        <Comment.Content>{comment.content}</Comment.Content>
      </Comment.Main>
    </Comment>
    {comment.replys &&
      !!comment.replys.length && (
      <Comment.List noIndent>
        {comment.replys.map((sub) => (
          <SubComment key={sub.id} comment={sub} parent={comment} />
        ))}
      </Comment.List>
    )}
  </Comment.Wrap>
);

export default SubComment;
