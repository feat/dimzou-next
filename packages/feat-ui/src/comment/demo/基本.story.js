import React from "react";
import Comment from "@feat/feat-ui/lib/comment";
import Avatar from "@feat/feat-ui/lib/avatar";

/** 基础评论样式 */
const Example = () => (
  <Comment.List>
    <Comment.Wrap>
      <Comment modifier="I">
        <Comment.Avatar>
          <Avatar
            size="sm"
            username="kongkx"
          />
        </Comment.Avatar>
        <Comment.Main>
          <Comment.Header>
            <Comment.Author>Michael Jackson</Comment.Author>
            <Comment.Desc>Carrabia Style Food Cooking</Comment.Desc>
            <Comment.Meta>Nov 12. 2016</Comment.Meta>
          </Comment.Header>
          <Comment.Content>
                 I hate Apple new OS
     so that I am going to give up Mac Pro for my future studio . Many freinds of mine recommend me with new Win 10 pro that will be launched this summer time.
          </Comment.Content>
        </Comment.Main>
      </Comment>
    </Comment.Wrap>
  </Comment.List>
);

export default Example;
