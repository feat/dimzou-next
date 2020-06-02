import React from "react";
import Clamp from "@feat/feat-ui/lib/clamp";

/** lines控制行数，ellipsis 控制。。。 */
const Example = () => (
  <Clamp lines={3} ellipsis>
    企业培训机构里有相当的比例都是起源于一名众人叫好的讲师、一门精典叫座的好课，甚至是一个特殊的资源、一次特别的机遇。三四位讲师、七八个客户就足以支撑一个年收入数百万的小公司，只要控制好成本开销，每年利润也比较可观。但如果想要做大，就需要有开发新课的专业团队、有支持运营的
    <strong>平台投入</strong>
    ，最终也不见得能带来收入增长，这么一想，就这样的小日子过得也挺好，何必瞎折腾。
  </Clamp>
);

export default Example;
