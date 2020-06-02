import React from "react";
import Comment from "@feat/feat-ui/lib/comment";
import Avatar from "@feat/feat-ui/lib/avatar";

/** 模拟评论列表 */
const Example = () => (
  <Comment.List>
    <Comment.Wrap
      className="margin_b_12"
    >
      <Comment modifier="I" className="margin_b_12">
        <Comment.Avatar>
          <Avatar
            size="sm"
            username="kongkx"
          />
        </Comment.Avatar>
        <Comment.Main>
          <Comment.Header>
            <Comment.Author>Michael Jackson</Comment.Author>
            <Comment.Desc>Thai Message Expert</Comment.Desc>
            <Comment.Meta>Nov 12. 2016</Comment.Meta>
          </Comment.Header>
          <Comment.Content>
                 I hate Apple new OS
     so that I am going to give up Mac Pro for my future studio . Many freinds of mine recommend me with new Win 10 pro that will be launched this summer time.
          </Comment.Content>
        </Comment.Main>
      </Comment>
      <Comment.List noIndent>
        <Comment.Wrap className="margin_b_12">
          <Comment modifier="I">
            <Comment.Avatar className="padding_l_12">
              <Avatar
                size="xxs"
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
                     Wow, great ! I am sure It’s not easy to archive of these reputations. Good luck Mary.
              </Comment.Content>
            </Comment.Main>
          </Comment>
        </Comment.Wrap>
      </Comment.List>
    </Comment.Wrap>
  </Comment.List>
);

export default Example;
