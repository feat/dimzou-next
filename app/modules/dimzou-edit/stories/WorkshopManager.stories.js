import { useEffect, useMemo, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import classNames from 'classnames';
import composeRefs from '@seznam/compose-react-refs';
import listToTree from '@/utils/listToTree';
import ButtonBase from '@feat/feat-ui/lib/button/ButtonBase';
import Button from '@feat/feat-ui/lib/button/Button';
import Icon from '../components/Icon';

import styles from './WorkshopManager.module.scss';

const desc = `
  用户新建内容是会创建草稿，用户可以单独创建封面用来组织草稿
`;
export default {
  title: 'Dimzou/Workshop',
  decorators: [],
  parameters: {
    docs: {
      description: {
        component: desc,
      },
    },
  },
};

// 当前的情况
//

const initialNodes = [
  {
    id: 1,
    type: 'bundle',
    name: '封面一',
  },
  {
    id: 2,
    type: 'bundle',
    name: '封面二',
    cover: {
      title: '封面二',
      summary: '摘要数据',
    },
  },
  {
    id: 3,
    type: 'file',
    name: '文章一',
    parent_id: 2,
  },
  {
    id: 123,
    type: 'title',
    name: '标题一',
    parent_id: 3,
  },
  {
    id: 456,
    type: 'title',
    name: '标题二',
    parent_id: 3,
  },
  {
    id: 4,
    type: 'file',
    parent_id: 2,
    name: '文章二',
    sort: 1,
  },
  {
    id: 5,
    type: 'file',
    parent_id: 2,
    name: '文章三',
    sort: 2,
  },
  {
    id: 6,
    type: 'file',
    name: '生产管理',
    parent_id: 1,
    sort: 1,
  },
  {
    id: 7,
    type: 'file',
    name: '销售管理',
    parent_id: 1,
    sort: 2,
  },
  {
    id: 8,
    type: 'file',
    name: '文章八',
  },
];

const NewItemForm = (props) => {
  const [name, setName] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit({ name, type: props.type });
      }}
    >
      <span
        className="size_xs margin_r_5"
        style={{ padding: 2, display: 'inline-block' }}
      >
        <Icon name={props.type === 'bundle' ? 'book' : 'page'} />
      </span>
      <input
        name="name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
        autoFocus
        placeholder={props.placeholder}
        onBlur={() => {
          if (!name) {
            props.onCancel();
          }
        }}
      />
      <button type="submit" style={{ display: 'none' }}>
        submit
      </button>
    </form>
  );
};

const Node = (props) => {
  const { data, level } = props;
  const [collapsed, setCollapsed] = useState(false);
  const isActive = data.id === props.activeNodeId;
  const [{ isShallowOver }, drop] = useDrop({
    accept: 'node',
    canDrop: (item) => {
      if (item.payload.type === 'bundle') {
        return false;
      }
      return (
        data.type === 'bundle' &&
        item.payload.parent_id !== data.id &&
        item.payload.id !== data.id
      );
    },
    drop: (item) => {
      props.moveNode(item.payload, data);
    },
    collect: (monitor) => ({
      isShallowOver: monitor.isOver() && monitor.canDrop(),
      item: monitor.getItem(),
    }),
  });
  const [, drag] = useDrag({
    item: {
      type: 'node',
      payload: {
        type: data.type,
        id: data.id,
        parent_id: data.parent_id,
        sort: data.sort,
      },
    },
    canDrag: () => data.type !== 'title',
  });
  let icon;
  if (data.type === 'bundle') {
    icon = 'book';
  } else if (data.type === 'title') {
    icon = 'heading';
  } else {
    icon = 'page';
  }

  return (
    <div>
      <div
        className={classNames(styles.node__line, {
          [styles.dragOver]: isShallowOver,
          [styles.isActive]: isActive,
        })}
        style={{
          paddingLeft: level * 20,
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          props.onClick(isActive ? undefined : data.id);
        }}
        ref={composeRefs(drag, drop)}
      >
        <ButtonBase
          className="size_xs margin_r_5"
          style={{ padding: 2 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (
              (data.children && data.children.length) ||
              (data.outlines && data.outlines.length)
            ) {
              setCollapsed((prev) => !prev);
            }
          }}
        >
          <Icon name={icon} />
        </ButtonBase>
        {data.name}
      </div>
      {!collapsed && (
        <div>
          {data.children &&
            data.children.map((item) => (
              <Node
                key={item.id}
                data={item}
                activeNodeId={props.activeNodeId}
                level={props.level + 1}
                onClick={props.onClick}
                moveNode={props.moveNode}
              />
            ))}
          {data.outlines &&
            data.outlines.map((item) => (
              <Node
                key={item.id}
                data={item}
                activeNodeId={props.activeNodeId}
                level={props.level + 1}
                onClick={props.onClick}
                moveNode={props.moveNode}
              />
              // <div
              //   className={styles.node_line}
              //   style={{ paddingLeft: 20 * (props.level + 1) }}
              // >
              //   <span
              //     className="size_xs"
              //     style={{ display: 'inline-block', textAlign: 'center' }}
              //   >
              //     T
              //   </span>
              //   {item.name}
              // </div>
            ))}
        </div>
      )}
    </div>
  );
};

const CoverWidget = (props) => {
  const [state, setState] = useState(
    props.initialValues || { title: '', summary: '' },
  );
  return (
    <form
      className={styles.coverWrap}
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit(state);
      }}
    >
      <input
        value={state.title}
        autoFocus
        required
        placeholder="标题"
        onChange={(e) => {
          setState({
            ...state,
            title: e.target.value,
          });
        }}
      />
      <div>
        <textarea
          required
          value={state.summary}
          placeholder="摘要"
          onChange={(e) => {
            setState({
              ...state,
              summary: e.target.value,
            });
          }}
        />
      </div>
      <Button htmlType="submit">确认</Button>
    </form>
  );
};

const NodeContainer = (props) => {
  const [, drop] = useDrop({
    accept: 'node',
    canDrop: (item, monitor) =>
      monitor.isOver({ shallow: true }) && item.payload.parent_id,
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        props.onNodeDrop(item.payload);
      }
    },
  });

  return (
    <div style={{ height: '100%' }} ref={drop}>
      {props.children}
    </div>
  );
};

export const Demo01 = () => {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [nodes, setNodes] = useState(initialNodes);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [isAddingCover, setIsAddingCover] = useState(false);
  const tree = useMemo(
    () =>
      listToTree(nodes, {
        idKey: 'id',
        parentKey: 'parent_id',
      }),
    [nodes],
  );
  const activeNode = useMemo(
    () => {
      const node = nodes.find((item) => item.id === activeNodeId);
      const children = nodes.filter((item) => item.parent_id === activeNodeId);
      if (node) {
        return {
          ...node,
          children,
        };
      }
      return null;
    },
    [nodes, activeNodeId],
  );

  const activeBundleId = useMemo(
    () => {
      if (activeNode?.type === 'file') {
        return activeNode.parent_id;
      }
      return activeNode?.id;
    },
    [activeNode],
  );

  useEffect(
    () => {
      setIsCreatingFolder(false);
    },
    [activeNodeId],
  );

  const addNode = (values) => {
    const node = {
      ...values,
      // parent_id: activeBundleId,
      id: Date.now(),
    };
    setNodes([node, ...nodes]);
    setIsCreatingFolder(false);
  };

  const addFile = (values) => {
    const node = {
      ...values,
      // parent_id: activeBundleId,
      id: Date.now(),
    };
    setNodes([node, ...nodes]);
    setIsCreatingFile(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', minHeight: '70vh' }}>
        <div style={{ width: 300, border: '1px solid #ddd' }}>
          <div style={{ padding: 4, borderBottom: '1px solid #ddd' }}>
            <ButtonBase
              type="button"
              className="size_xs"
              onClick={() => {
                setIsCreatingFolder((prev) => !prev);
              }}
            >
              <Icon name="book" />
            </ButtonBase>
            <ButtonBase
              type="button"
              className="size_xs"
              onClick={() => {
                setIsCreatingFile((prev) => !prev);
              }}
            >
              <Icon name="page" />
            </ButtonBase>
          </div>
          <NodeContainer
            onNodeDrop={(dragNode) => {
              const nodeIndex = nodes.findIndex((n) => n.id === dragNode.id);
              const newNode = {
                ...nodes[nodeIndex],
                parent_id: undefined,
              };
              setNodes([
                ...nodes.slice(0, nodeIndex),
                ...nodes.slice(nodeIndex + 1),
                newNode,
              ]);
            }}
          >
            {isCreatingFolder && (
              <NewItemForm
                type="bundle"
                placeholder="封面"
                onSubmit={addNode}
                onCancel={() => {
                  setIsCreatingFolder(false);
                }}
              />
            )}
            {isCreatingFile && (
              <NewItemForm
                type="page"
                placeholder="草稿"
                onSubmit={addFile}
                onCancel={() => {
                  setIsCreatingFile(false);
                }}
              />
            )}
            {tree.map((item) => (
              <Node
                key={item.id}
                data={item}
                level={0}
                onClick={setActiveNodeId}
                isCreatingFolder={isCreatingFolder}
                activeBundleId={activeBundleId}
                activeNodeId={activeNodeId}
                addNode={addNode}
                moveNode={(dragNode, target) => {
                  const nodeIndex = nodes.findIndex(
                    (n) => n.id === dragNode.id,
                  );
                  const newNode = {
                    ...nodes[nodeIndex],
                    parent_id: target.id,
                  };
                  setNodes([
                    ...nodes.slice(0, nodeIndex),
                    newNode,
                    ...nodes.slice(nodeIndex + 1),
                  ]);
                }}
              />
            ))}
          </NodeContainer>
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              margin: '0 auto',
              height: '100%',
              maxWidth: 760,
              border: '1px solid #ddd',
            }}
          >
            {activeNode?.type === 'bundle' &&
              activeNode.cover && (
                <div>
                  <div
                    className="t-meta padding_12"
                    style={{ borderBottom: '1px solid #ddd' }}
                  >
                    当 文件夹 已经设置 “封面”
                    时，则展示封面。用户可以将内容集合出版
                  </div>
                  <div
                    className="padding_12"
                    style={{ borderBottom: '1px solid #ddd' }}
                  >
                    <div className={styles.coverWrap}>
                      <h1>{activeNode.cover.title}</h1>
                      <p>{activeNode.cover.summary}</p>
                    </div>
                  </div>
                  <div className="padding_12">
                    {activeNode.children.map((item) => (
                      <div key={item.id}>
                        <ButtonBase
                          onClick={() => {
                            setActiveNodeId(item.id);
                          }}
                        >
                          {item.name}
                        </ButtonBase>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            {activeNode?.type === 'bundle' &&
              !activeNode.cover && (
                <div>
                  <div
                    className="t-meta padding_12"
                    style={{ borderBottom: '1px solid #ddd' }}
                  >
                    用户选中封面，点击“发布”。封面内所有内容将打包出版，出版前需要设计封面，编辑版权信息。
                  </div>
                  <div
                    className="padding_12"
                    style={{ borderBottom: '1px solid #ddd' }}
                  >
                    {!activeNode.children.some(
                      (item) => item.type === 'bundle',
                    ) && (
                      <>
                        你可以为文件夹添加封面，然后成册发布
                        <Button
                          onClick={() => {
                            setIsAddingCover((prev) => !prev);
                          }}
                          className="margin_l_12"
                        >
                          {isAddingCover ? '取消添加' : '添加封面'}
                        </Button>
                        {isAddingCover && (
                          <CoverWidget
                            initialValues={{
                              title: activeNode.name,
                            }}
                            onSubmit={(data) => {
                              setIsAddingCover(false);
                              const nodeIndex = nodes.findIndex(
                                (item) => item.id === activeNode.id,
                              );
                              const newNode = {
                                ...nodes[nodeIndex],
                                name: data.title,
                                cover: data,
                              };
                              setNodes([
                                ...nodes.slice(0, nodeIndex),
                                newNode,
                                ...nodes.slice(nodeIndex + 1),
                              ]);
                            }}
                          />
                        )}
                      </>
                    )}
                  </div>
                  <div className="padding_12">
                    {!activeNode.children.length && '暂无内容'}
                    {activeNode.children.map((item) => (
                      <div key={item.id}>
                        <ButtonBase
                          onClick={() => {
                            setActiveNodeId(item.id);
                          }}
                        >
                          {item.name}
                        </ButtonBase>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            {activeNode?.type === 'file' && (
              <div>
                <div
                  className="t-meta padding_12"
                  style={{ borderBottom: '1px solid #ddd' }}
                >
                  选中某一草稿然后出版，该草稿将独立出版。
                </div>
                <div className="padding_12">{activeNode.name}</div>
              </div>
            )}
            {activeNode?.type === 'title' && (
              <div>
                <div
                  className="t-meta padding_12"
                  style={{ borderBottom: '1px solid #ddd' }}
                >
                  选中子标题，点击出版时，将出版该子标题下的内容片段（两个子标题之间的内容）
                </div>
                <div className="padding_12">{activeNode.name}</div>
              </div>
            )}
            {!activeNode && (
              <div className="padding_12">
                这个模型仅在演示草稿与封面的管理交互。
                <ul>
                  <li>将草稿放入封面</li>
                  <li>将草稿移出封面</li>
                  <li>将草稿移动到另一个封面</li>
                  <li>
                    不同侧栏状态下，不同的出版路径
                    <ul>
                      <li>选中封面，捆绑出版</li>
                      <li>选中草稿，草稿独立出版</li>
                      <li>选中草稿子标题，草稿片段出版</li>
                    </ul>
                  </li>
                </ul>
                <span>
                  此处添加封面、添加草稿的交互，仅为演示添加封面后/添加章节后的操作
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
