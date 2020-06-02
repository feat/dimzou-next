import React from "react";
import Card from "@feat/feat-ui/lib/card";
import Clamp from "@feat/feat-ui/lib/clamp";
import { RectShape } from "@feat/feat-ui/lib/placeholder";
import AvatarStamp from "@feat/feat-ui/lib/avatar/AvatarStamp";

/** 卡片的基本使用 */
const Example = () => (
  <div style={{ width: "400px" }}>
    <Card>
      <Card.Title style={{ maxHeight: "3em", overflow: "hidden" }}>
        <Clamp.LineTruncate lines={2} ellipsis>
          如果用不同的几何形状来划分不同的群体的典型日常活动姿势，比如白领三角形，工人倒梯形
        </Clamp.LineTruncate>
      </Card.Title>
      <Card.Image>
        <RectShape label="image" ratio={16 / 9} />
      </Card.Image>
      <Card.Content>
        <AvatarStamp
          className="margin_y_12"
          username="kongkx"
          meta={["expertise"]}
          expertise="Text"
        />
        <Clamp className="margin_y_12" lines={2} ellipsis>
          至于孕妇和老人，则都是C形，只不过，孕妇后倾，是正C；老人前倾，呈倒C。最原装的S形，脊柱的S。这就是人体躯干的“承重脊梁”，比如支撑起头部的颈椎、保护心肺脏器的胸椎、支撑起躯干的腰椎和维持上下半身协调的骨盆。
        </Clamp>
      </Card.Content>
    </Card>
  </div>
);

export default Example;
