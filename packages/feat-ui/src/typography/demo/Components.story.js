import React from "react";

import { Row, Col } from "@feat/feat-ui/lib/grid";

const Example = (props) => (
  <Row gutter={24}>
    <Col span={12} className="en">
      <div className="group">
        <h1>Headings</h1>
        <div>
          <h1>h1. Bootstrap heading</h1>
          <h2>h2. Bootstrap heading</h2>
          <h3>h3. Bootstrap heading</h3>
          <h4>h4. Bootstrap heading</h4>
          <h5>h5. Bootstrap heading</h5>
          <h6>h6. Bootstrap heading</h6>
        </div>
      </div>
      <div className="group">
        <h1>Body</h1>
        <div>`p`</div>
        <div>
          <p>Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam id dolor id nibh ultricies vehicula.</p>
          <p>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec ullamcorper nulla non metus auctor fringilla. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
                        Donec ullamcorper nulla non metus auctor fringilla.</p>
          <p>Maecenas sed diam eget risus varius blandit sit amet non magna. Donec id elit non mi porta gravida at eget metus. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>
        </div>
        <h2>Lead body copy</h2>
        <div>`.lead`</div>
        <div>
          <p className="lead">Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus.</p>
        </div>
      </div>
      <div className="group">
        <h1>Blockquotes</h1>
        <h2>Default blockquote</h2>
        <div>
          <blockquote>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
          </blockquote>
        </div>
        <h2>Blockquote options</h2>
        <h3>Naming a source</h3>
        <div>
          <blockquote>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
            <footer>Someone famous in <cite title="Source Title">Source Title</cite></footer>
          </blockquote>
        </div>
      </div>
      <div className="group">
        <h1>List</h1>
        <h2>Order</h2>
        <div>
          <ol>
            <li>Lorem ipsum dolor sit amet</li>
            <li>Consectetur adipiscing elit</li>
            <li>Integer molestie lorem at massa</li>
            <li>Facilisis in pretium nisl aliquet</li>
            <li>Nulla volutpat aliquam velit</li>
            <li>Faucibus porta lacus fringilla vel</li>
            <li>Aenean sit amet erat nunc</li>
            <li>Eget porttitor lorem</li>
          </ol>
        </div>
        <h2>Unorder</h2>
        <div>
          <ul>
            <li>Lorem ipsum dolor sit amet</li>
            <li>Consectetur adipiscing elit</li>
            <li>Integer molestie lorem at massa</li>
            <li>Facilisis in pretium nisl aliquet</li>
            <li>Nulla volutpat aliquam velit
              <ul>
                <li>Phasellus iaculis neque</li>
                <li>Purus sodales ultricies</li>
                <li>Vestibulum laoreet porttitor sem</li>
                <li>Ac tristique libero volutpat at</li>
              </ul>
            </li>
            <li>Faucibus porta lacus fringilla vel</li>
            <li>Aenean sit amet erat nunc</li>
            <li>Eget porttitor lorem</li>
          </ul>
        </div>
        <h2>Description</h2>
        <div>
          <dl> <dt>Description lists</dt>
            <dd>A description list is perfect for defining terms.</dd> <dt>Euismod</dt>
            <dd>Vestibulum id ligula porta felis euismod semper eget lacinia odio sem nec elit.</dd>
            <dd>Donec id elit non mi porta gravida at eget metus.</dd> <dt>Malesuada porta</dt>
            <dd>Etiam porta sem malesuada magna mollis euismod.</dd>
          </dl>
        </div>
      </div>
      <div className="group">
        <h1>Code</h1>
        <h2>Inline</h2>
        <div>
                    For example, <code>&lt;section&gt;</code>          should be wrapped as inline.
        </div>
      </div>
    </Col>
    <Col span={12} className="cn">
      <div className="group">
        <h1>标题</h1>
        <div>
          <h1>h1. 标题一 演示标题</h1>
          <h2>h2. 标题二 演示标题</h2>
          <h3>h3. 标题三 演示标题</h3>
          <h4>h4. 标题四 演示标题</h4>
          <h5>h5. 标题五 演示标题</h5>
          <h6>h6. 标题六 演示标题</h6>
        </div>
      </div>
      <div className="group">
        <h1>正文</h1>
        <div>`p`</div>
        <div>
          <p>近日作篆，须静室明窗，思虑纯一，纸墨笔砚都如人意，莫能拂闪，然后书，较平时为工。若匆促为之，必多败字，亦无有章法，盖艰难若此。病耶？益耶？﻿</p>
          <p>在我廿五岁至廿八岁四年中间，得到吴先生（吴昌硕）指教较多。听他议论，看他挥毫，使我胸襟更开豁，眼界更扩大。我从此特别注意气魂，注意骨法用笔，注意章法变化，自觉进步不少。﻿</p>
          <p>今天我们通用的执笔方法，可以说是积累了历代祖先的经验，适应高案高椅，用来写中、小字的一种比较贴切的形式（题榜大字又作别论）。如果认为从古以来执笔方式就是这样，或者认为今天我们把钟、王等人执笔方法学到手就能解决书法上的一切问题，那是错误的，没有历史观点。﻿</p>
        </div>
        <h2>Lead body copy</h2>
        <div>`.lead`</div>
        <div>
          <p className="lead">Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus.</p>
        </div>
      </div>
      <div className="group">
        <h1>引用区块</h1>
        <h2>默认引用区块</h2>
        <div>
          <blockquote>
            <p>《张迁碑》阴，“宗”字中直凡三折。古人用笔，三波三折，此其显而易见者也。郑海藏最知此意，故其书绝生动。﻿</p>
          </blockquote>
        </div>
        <h2>引用区块选项</h2>
        <h3>标记引用来源</h3>
        <div>
          <blockquote>
            <p>《张迁碑》阴，“宗”字中直凡三折。古人用笔，三波三折，此其显而易见者也。郑海藏最知此意，故其书绝生动</p>
            <footer>引用来自 <cite title="僧孚日录">《僧孚日录》﻿﻿﻿</cite></footer>
          </blockquote>
        </div>
      </div>
      <div className="group">
        <h1>列表</h1>
        <h2>有序列表</h2>
        <div>
          <ol>
            <li>列清单可以减轻焦虑</li>
            <li>列清单可以提升脑力</li>
            <li>列清单可以让人变专心</li>
            <li>列清单可以强化自尊心</li>
            <li>列清单可以厘清你的思绪</li>
            <li>列清单教会你预则立</li>
            <li>将所有想到的先写下来再说</li>
            <li>对清单内容进行分类、整理</li>
          </ol>
        </div>
        <h2>无序列表</h2>
        <div>
          <ul>
            <li>将自己的一天列清单</li>
            <li>将这一天的每一项行动项目再次细化</li>
            <li>将同类的行动项目归类</li>
            <li>将可重复的行动项目规整</li>
            <li>将不可重复的行动项目依逻辑列单
              <ul>
                <li>书单</li>
                <li>音乐</li>
                <li>电影单</li>
                <li>动漫</li>
              </ul>
            </li>
            <li>思考清单背后的个人习惯和价值观</li>
            <li>各大平台都推出了</li>
            <li>那些不上网或者对各路干货</li>
          </ul>
        </div>
        <h2>描述</h2>
        <div>
          <dl>
            <dt>检视清单</dt>
            <dd>虽然之前已经做过这个动作了，但是再做一次，是一定要判断好，什么事情可以等，什么事情不能等。</dd>
            <dt>压缩清单</dt>
            <dd>积累小胜，有时清单小一点，容易完成一点，可以提升士气。此外，别把生活中各个领域要完成的事情都塞到一张单子上，那会出问题。计划不同，目标不同，清单也要不同，这样你才不会觉得事情太多或事情都混成一堆。</dd>
            <dt>授权清单</dt>
            <dd>学会说“不”，拒绝一些事情或者授权外包出去。</dd>
          </dl>
        </div>
      </div>
      <div className="group">
        <h1>代码</h1>
        <h2>行内</h2>
        <div>
          例如这个 <code>&lt;section&gt;</code> 就应该是个行内代码。
        </div>
        <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur dolores, in. Aspernatur non numquam quisquam, neque autem ducimus, cupiditate eum repellendus quas velit tempore commodi officiis iste iure, distinctio sequi?</div>
      </div>
    </Col>
  </Row>
);

export default Example;
