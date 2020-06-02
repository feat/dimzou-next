import React, { Component } from "react";
import PropTypes from "prop-types";

import Comment from "@feat/feat-ui/lib/comment";
import Avatar from "@feat/feat-ui/lib/avatar";
import { Row, Col } from "@feat/feat-ui/lib/grid";

import SubComment from "./SubComment";

const CommentItem = ({ comment }) => (
  <Comment.Wrap>
    <Comment className="margin_b_12">
      <div>
        <Comment.Meta>{comment.createdAt}</Comment.Meta>
      </div>
      <Row flex>
        <Comment.Avatar>
          <Avatar
            avatar={comment.avatar}
            username={comment.full_name}
            round
          />
        </Comment.Avatar>
        <Col auto>
          <Comment.Author>{comment.full_name}</Comment.Author>
          <Comment.Desc>{comment.expertise}</Comment.Desc>
          <Comment.Content>{comment.content}</Comment.Content>
        </Col>
      </Row>
    </Comment>
    {comment.replys && !!comment.replys.length && (
      <Comment.List noIndent>
        {comment.replys.map((sub) => (
          <SubComment key={sub.id} comment={sub} parent={comment} />
        ))}
      </Comment.List>
    )}
  </Comment.Wrap>
);

export default CommentItem;
