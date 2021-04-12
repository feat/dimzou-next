import { action } from '@storybook/addon-actions';
import Cache from '@/services/cache';
import CommentBundle from '../index';

const dataMap = {
  noContent: [],
  single: [
    {
      object_id: 7146112,
      parent_id: null,
      content:
        '<p>朱生。你说的是不是结集出版？ 我们可以做活的结集。比如朱先生文集2.0 和3.0可以有不同的内容，可以由7篇减少到5篇，诸如此类。</p>',
      id: 921,
      create_time: '2021-01-07T08:45:11.979167Z',
      last_modified: '2021-01-07T08:45:11.979648Z',
      deleted_at: null,
      blocked_at: null,
      user: {
        uid: 1016382589868,
        avatar:
          'https://pic3.feat.com/media/storage/avatars/7ZN3KIh2x8uLM8WlAqkm9HgYkiVF7O8FH8WzgU5Q.jpeg',
        expertise: '脚趾公弹钢琴',
        firstname: '廣才',
        lastname: '陳',
        username: '陳 廣才',
        timezone: 'America/New_York',
        timezone_utc_offset: '-05:00',
        is_online: false,
        location: 'New York',
        avatars: {},
      },
      content_type: 'reword',
      meta: {
        paragraph_id: 8339216,
        paragraph_type: 200,
      },
    },
  ],
  longComment: [
    {
      object_id: 7146112,
      parent_id: null,
      content:
        '<p>朱生。你说的是不是结集出版？ 我们可以做活的结集。比如朱先生文集2.0 和3.0可以有不同的内容，可以由7篇减少到5篇，诸如此类。</p>',
      id: 921,
      create_time: '2021-01-07T08:45:11.979167Z',
      last_modified: '2021-01-07T08:45:11.979648Z',
      deleted_at: null,
      blocked_at: null,
      user: {
        uid: 1016382589868,
        avatar:
          'https://pic3.feat.com/media/storage/avatars/7ZN3KIh2x8uLM8WlAqkm9HgYkiVF7O8FH8WzgU5Q.jpeg',
        expertise: '脚趾公弹钢琴',
        firstname: '廣才',
        lastname: '陳',
        username: '陳 廣才',
        timezone: 'America/New_York',
        timezone_utc_offset: '-05:00',
        is_online: false,
        location: 'New York',
        avatars: {},
      },
      children: [
        {
          object_id: 7146112,
          parent_id: 921,
          content:
            '<p>结集出版是没问题的，主要是互联网上更多的是持续出版。类似于专栏、频道这样的概念。</p>',
          id: 931,
          create_time: '2021-01-07T09:22:36.311691Z',
          last_modified: '2021-01-07T09:22:36.312158Z',
          deleted_at: null,
          blocked_at: null,
          user: {
            uid: 6020527171865,
            avatar: 'https://pic3.feat.com/media/default_avatar.jpg',
            expertise: null,
            firstname: 'Mumu',
            lastname: 'Zhu',
            username: 'Zhu Mumu',
            timezone: 'America/New_York',
            timezone_utc_offset: '-05:00',
            is_online: true,
            location: 'New York',
            avatars: {
              path: 'https://pic3.feat.com/media/default_avatar.jpg',
              sizes: {},
              default: true,
            },
          },
          children: [
            {
              object_id: 7146112,
              parent_id: 931,
              content:
                '<p>草稿本身就是一个持续出版的形式。另，可以有很多操作上的变通办法实现的。比如，你写好一章书，或一个单篇，你可以分成7天来出版。只要我们在交互上允许highligh要出版的内容，然后点击，出版。那么highlight 的内容就出版了。没有被highlight的内容不会在出版的内容里展现。这个交互需要杨先生来完成。他可以做到的。因为我们可以highlight 一个题目来表示要发行这个章节或单张也就可以具体到某个段落，就如我们要复制特定的内容一样。</p>',
              id: 932,
              create_time: '2021-01-07T09:28:29.724060Z',
              last_modified: '2021-01-07T09:28:29.724560Z',
              deleted_at: null,
              blocked_at: null,
              user: {
                uid: 1016382589868,
                avatar:
                  'https://pic3.feat.com/media/storage/avatars/7ZN3KIh2x8uLM8WlAqkm9HgYkiVF7O8FH8WzgU5Q.jpeg',
                expertise: '脚趾公弹钢琴',
                firstname: '廣才',
                lastname: '陳',
                username: '陳 廣才',
                timezone: 'America/New_York',
                timezone_utc_offset: '-05:00',
                is_online: false,
                location: 'New York',
                avatars: {},
              },
              children: [
                {
                  object_id: 7146112,
                  parent_id: 932,
                  content:
                    '<p>草稿本身是不出版的呀，我们现在只有公开编辑跟小组编辑两种模式，非公开编辑的草稿是不会开放给公众查看的。我们目前类似持续出版概念的只有“分类”，文章会持续不断的动态加入到分类里。比如我写一个小说，每次发布一个章节，我是希望这个章节是在这个小说下面发布的，读者可以很方便的查看之前的章节或者查看目录。但是目前的部分出版就只是那个章节被孤零零的出版了，跟其他章节是没关系的。而我也不可能把我的草稿开放给读者访问。</p>',
                  id: 935,
                  create_time: '2021-01-07T09:52:52.194302Z',
                  last_modified: '2021-01-07T09:52:52.194781Z',
                  deleted_at: null,
                  blocked_at: null,
                  user: {
                    uid: 6020527171865,
                    avatar: 'https://pic3.feat.com/media/default_avatar.jpg',
                    expertise: null,
                    firstname: 'Mumu',
                    lastname: 'Zhu',
                    username: 'Zhu Mumu',
                    timezone: 'America/New_York',
                    timezone_utc_offset: '-05:00',
                    is_online: true,
                    location: 'New York',
                    avatars: {
                      path: 'https://pic3.feat.com/media/default_avatar.jpg',
                      sizes: {},
                      default: true,
                    },
                  },
                  children: [],
                  content_type: 'reword',
                  meta: {
                    paragraph_id: 8339216,
                    paragraph_type: 200,
                  },
                },
              ],
              content_type: 'reword',
              meta: {
                paragraph_id: 8339216,
                paragraph_type: 200,
              },
            },
          ],
          content_type: 'reword',
          meta: {
            paragraph_id: 8339216,
            paragraph_type: 200,
          },
        },
      ],
      content_type: 'reword',
      meta: {
        paragraph_id: 8339216,
        paragraph_type: 200,
      },
    },
  ],
  longList: [
    {
      object_id: 7115176,
      parent_id: null,
      content:
        '<p>你意思是要确定创建的内容的本身的总长度上有没有限制的问题。请你去Medium看看。他们的内容规模其实是有一个限制的，就是他们主张内容长度在，七分钟可以读得完。我去验证一下。再告诉你，然后我们就跟他们的做法。</p>',
      id: 914,
      create_time: '2021-01-07T07:40:29.891479Z',
      last_modified: '2021-01-07T07:40:29.892200Z',
      deleted_at: null,
      blocked_at: null,
      user: {
        uid: 1016382589868,
        avatar:
          'https://pic3.feat.com/media/storage/avatars/7ZN3KIh2x8uLM8WlAqkm9HgYkiVF7O8FH8WzgU5Q.jpeg',
        expertise: '脚趾公弹钢琴',
        firstname: '廣才',
        lastname: '陳',
        username: '陳 廣才',
        timezone: 'America/New_York',
        timezone_utc_offset: '-05:00',
        is_online: false,
        location: 'New York',
        avatars: {},
      },
      children: [
        {
          object_id: 7115176,
          parent_id: 914,
          content:
            '<p>这个跟内容有关，如果是类似medium的文章，medium的建议是6～7分钟，但是不是硬性限制。如果是小说的话目前在线小说比较多是一章3000～6000字，但是也有写10000～20000字的人。我手头一本纸质书的最长章节大约60000多字。</p>\n<p>除了文章长度，参与者数量也是要考虑的。参与者数量多的话，目前的编辑模式冲突会更容易发生，更难解决。</p>',
          id: 916,
          create_time: '2021-01-07T07:53:32.312072Z',
          last_modified: '2021-01-07T07:53:32.312681Z',
          deleted_at: null,
          blocked_at: null,
          user: {
            uid: 6020527171865,
            avatar: 'https://pic3.feat.com/media/default_avatar.jpg',
            expertise: null,
            firstname: 'Mumu',
            lastname: 'Zhu',
            username: 'Zhu Mumu',
            timezone: 'America/New_York',
            timezone_utc_offset: '-05:00',
            is_online: true,
            location: 'New York',
            avatars: {
              path: 'https://pic3.feat.com/media/default_avatar.jpg',
              sizes: {},
              default: true,
            },
          },
          children: [
            {
              object_id: 7115176,
              parent_id: 916,
              content:
                '<p>是这样的。如果内容长度超过了我们系统能「流畅」处理的程度。应该让作者另起一个篇幅。</p>\n<p>之前我们就将一部圣经塞入一个「单章节」里，结果很卡。但如果一个内容的长度可以和medium 容忍的长度，我相信也足够可以的。</p>\n<p>Medium 里可以容纳40万字。</p>\n<p>整本圣经的字数是93万字。我觉得如果这包含草稿被否缺的内容数据，你觉得40万字作为一个章节的最大长度是否可以做到很流畅度地展示？</p>\n<p>其实我们的解决方案就是通过结果做对比。比如说，我对第3 段落进行修改，修改成3、4、5段； 另外一个则对第3段进行修改，结果是成为3、4 两段；第3个人的段落没有增加，只是内容发生变化；第4个编辑者则干脆删除第3段。你看看到所有呈交上来的不同版本的。到最后，管理员可以决定要那个版本，若要第一个提交版本，意味着她批准了3、4、5段。。。。如此类推。</p>',
              id: 917,
              create_time: '2021-01-07T08:08:25.227615Z',
              last_modified: '2021-01-07T08:20:40.460938Z',
              deleted_at: null,
              blocked_at: null,
              user: {
                uid: 1016382589868,
                avatar:
                  'https://pic3.feat.com/media/storage/avatars/7ZN3KIh2x8uLM8WlAqkm9HgYkiVF7O8FH8WzgU5Q.jpeg',
                expertise: '脚趾公弹钢琴',
                firstname: '廣才',
                lastname: '陳',
                username: '陳 廣才',
                timezone: 'America/New_York',
                timezone_utc_offset: '-05:00',
                is_online: false,
                location: 'New York',
                avatars: {},
              },
              children: [
                {
                  object_id: 7115176,
                  parent_id: 917,
                  content:
                    '<p>圣经那一篇其实经过这两个月的优化现在已经不是很卡了。进一步优化的话应该能做到流畅编辑的。</p>\n<p>这里主要是考虑代价的问题，如果有大量的圣经这种规模的需求，那我们在数据结构、API等的设计上就要考虑对这种情况进行优化。</p>',
                  id: 918,
                  create_time: '2021-01-07T08:22:41.987197Z',
                  last_modified: '2021-01-07T08:22:41.987733Z',
                  deleted_at: null,
                  blocked_at: null,
                  user: {
                    uid: 6020527171865,
                    avatar: 'https://pic3.feat.com/media/default_avatar.jpg',
                    expertise: null,
                    firstname: 'Mumu',
                    lastname: 'Zhu',
                    username: 'Zhu Mumu',
                    timezone: 'America/New_York',
                    timezone_utc_offset: '-05:00',
                    is_online: true,
                    location: 'New York',
                    avatars: {
                      path: 'https://pic3.feat.com/media/default_avatar.jpg',
                      sizes: {},
                      default: true,
                    },
                  },
                  children: [
                    {
                      object_id: 7115176,
                      parent_id: 918,
                      content:
                        '<p>你考虑得很周到。我门要预计到将来会有很多有才华的团队利用这个模块来做大项目。</p>\n<p>我务求你在解决这些难题上一展所长，发挥你的才华出来。</p>\n<p>如果将整部圣经一部一部来排列的，就更价不卡。 但作为草稿-可能成书6万字的草稿内容长度可能会是5-至10倍，另外是否要将评论（意见）内容包括在里面？这个难点要解决。</p>',
                      id: 919,
                      create_time: '2021-01-07T08:33:20.560052Z',
                      last_modified: '2021-01-07T08:36:50.636989Z',
                      deleted_at: null,
                      blocked_at: null,
                      user: {
                        uid: 1016382589868,
                        avatar:
                          'https://pic3.feat.com/media/storage/avatars/7ZN3KIh2x8uLM8WlAqkm9HgYkiVF7O8FH8WzgU5Q.jpeg',
                        expertise: '脚趾公弹钢琴',
                        firstname: '廣才',
                        lastname: '陳',
                        username: '陳 廣才',
                        timezone: 'America/New_York',
                        timezone_utc_offset: '-05:00',
                        is_online: false,
                        location: 'New York',
                        avatars: {},
                      },
                      children: [
                        {
                          object_id: 7115176,
                          parent_id: 919,
                          content:
                            '<p>修改版本、评论这些其实问题不大，我们只需要按需加载、展示即可，屏幕大小是有限的，用户同一时间需要的数据也是有限的，同时用户的注意力也是有限的。我们现在很多地方卡的问题主要是数据结构的设计上既没有为读取优化，也没有为插入、修改优化，导致看也慢、改也慢。</p>',
                          id: 923,
                          create_time: '2021-01-07T08:50:48.208441Z',
                          last_modified: '2021-01-07T08:50:48.208903Z',
                          deleted_at: null,
                          blocked_at: null,
                          user: {
                            uid: 6020527171865,
                            avatar:
                              'https://pic3.feat.com/media/default_avatar.jpg',
                            expertise: null,
                            firstname: 'Mumu',
                            lastname: 'Zhu',
                            username: 'Zhu Mumu',
                            timezone: 'America/New_York',
                            timezone_utc_offset: '-05:00',
                            is_online: true,
                            location: 'New York',
                            avatars: {
                              path:
                                'https://pic3.feat.com/media/default_avatar.jpg',
                              sizes: {},
                              default: true,
                            },
                          },
                          children: [
                            {
                              object_id: 7115176,
                              parent_id: 923,
                              content:
                                '<p>嗯，你你应该立即指导工程师去做优化。</p>',
                              id: 924,
                              create_time: '2021-01-07T08:53:23.812731Z',
                              last_modified: '2021-01-07T08:53:23.813207Z',
                              deleted_at: null,
                              blocked_at: null,
                              user: {
                                uid: 1016382589868,
                                avatar:
                                  'https://pic3.feat.com/media/storage/avatars/7ZN3KIh2x8uLM8WlAqkm9HgYkiVF7O8FH8WzgU5Q.jpeg',
                                expertise: '脚趾公弹钢琴',
                                firstname: '廣才',
                                lastname: '陳',
                                username: '陳 廣才',
                                timezone: 'America/New_York',
                                timezone_utc_offset: '-05:00',
                                is_online: false,
                                location: 'New York',
                                avatars: {},
                              },
                              children: [
                                {
                                  object_id: 7115176,
                                  parent_id: 924,
                                  content:
                                    '<p>这个最近一直在进行，一些常用接口已经做了修改。不过因为涉及到基础数据结构怎么保存的问题，最底层的部分还没有决定修改方案。</p>',
                                  id: 926,
                                  create_time: '2021-01-07T08:57:03.321296Z',
                                  last_modified: '2021-01-07T08:57:03.321762Z',
                                  deleted_at: null,
                                  blocked_at: null,
                                  user: {
                                    uid: 6020527171865,
                                    avatar:
                                      'https://pic3.feat.com/media/default_avatar.jpg',
                                    expertise: null,
                                    firstname: 'Mumu',
                                    lastname: 'Zhu',
                                    username: 'Zhu Mumu',
                                    timezone: 'America/New_York',
                                    timezone_utc_offset: '-05:00',
                                    is_online: true,
                                    location: 'New York',
                                    avatars: {
                                      path:
                                        'https://pic3.feat.com/media/default_avatar.jpg',
                                      sizes: {},
                                      default: true,
                                    },
                                  },
                                  children: [],
                                  content_type: 'reword',
                                  meta: {
                                    paragraph_id: 8308295,
                                    paragraph_type: 200,
                                  },
                                },
                              ],
                              content_type: 'reword',
                              meta: {
                                paragraph_id: 8308295,
                                paragraph_type: 200,
                              },
                            },
                          ],
                          content_type: 'reword',
                          meta: {
                            paragraph_id: 8308295,
                            paragraph_type: 200,
                          },
                        },
                      ],
                      content_type: 'reword',
                      meta: {
                        paragraph_id: 8308295,
                        paragraph_type: 200,
                      },
                    },
                  ],
                  content_type: 'reword',
                  meta: {
                    paragraph_id: 8308295,
                    paragraph_type: 200,
                  },
                },
              ],
              content_type: 'reword',
              meta: {
                paragraph_id: 8308295,
                paragraph_type: 200,
              },
            },
          ],
          content_type: 'reword',
          meta: {
            paragraph_id: 8308295,
            paragraph_type: 200,
          },
        },
      ],
      content_type: 'reword',
      meta: {
        paragraph_id: 8308295,
        paragraph_type: 200,
      },
    },
  ],
};

const userMap = {
  kongkx: {
    uid: 9216382589813,
    avatar: 'https://pic3.feat.com/media/9216382589813/avatar/blob_5kBQegz',
    expertise: 'UI 设计',
    firstname: 'Kyra',
    lastname: 'Wolff',
    username: 'Kyra Wolff',
    timezone: 'Asia/Tokyo',
    timezone_utc_offset: '+09:00',
    is_online: false,
    location: 'JPN',
    avatars: {},
  },
};

export default {
  title: 'Comment/CommentBundle',
  component: CommentBundle,
  argTypes: {
    containerWidth: {
      control: {
        type: 'select',
        options: [320, 600, 800],
      },
    },
    comments: {
      control: {
        type: 'select',
        options: Object.keys(dataMap),
      },
    },
    currentUser: {
      control: {
        type: 'select',
        options: Object.keys(userMap),
      },
    },
    bundleState: {
      table: {
        disable: true,
      },
    },
    cache: {
      table: {
        disable: true,
      },
    },
    style: {
      table: {
        disable: true,
      },
    },
    className: {
      table: {
        disable: true,
      },
    },
  },
};

const loadMore = action('loadMore');
const cache = new Cache();
export const Template = (args) => {
  const { comments, currentUser, containerWidth, ...rest } = args;
  return (
    <div
      style={{
        width: containerWidth,
        margin: '0 auto',
        position: 'relative',
        height: 2000,
      }}
    >
      <div
        style={{ position: 'absolute', width: '100%', left: 0, height: 500 }}
      >
        <CommentBundle
          loadMore={loadMore}
          cache={cache}
          bundleState={{
            nodeId: '255794',
            rewordingId: 7146112,
            rootCount: dataMap[comments].length,
            comments: dataMap[comments],
            isInitialized: true,
          }}
          entityCapabilities={{
            canComment: true,
            commentLimit: 1,
            maxReplyLimit: 1,
          }}
          currentUser={userMap[currentUser]}
          {...rest}
        />
      </div>
    </div>
  );
};
Template.args = {
  comments: 'longComment',
  currentUser: 'kongkx',
  containerWidth: 600,
  showAvatar: false,
};
// export const LongComment = () => <CommentBundle {...bundleData2} />;

// export const MultiStackComment = () => <CommentBundle {...bundleData3} />;
