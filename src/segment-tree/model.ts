export type TreeNode = {
  id: string;
  start: number;
  end: number;
  sum: number;
  depth: number;
  x: number;
  y: number;
  left?: string;
  right?: string;
};

export type QueryStep = {
  nodeId: string;
  decision: "split" | "take" | "skip";
  detail: string;
  add?: number;
};

export const VALUES = [5, 8, 6, 3, 2, 7, 2, 6];
export const QUERY_START_INDEX = 2;
export const QUERY_END_INDEX = 6;

export const timing = {
  intro: 48,
  leaves: 48,
  buildStep: 26,
  queryGap: 30,
  queryStep: 24,
  outro: 54,
} as const;

export const geometry = {
  nodeWidth: 104,
  nodeHeight: 56,
  leafStartX: 88,
  leafStride: 144,
  levelGap: 112,
} as const;

const mutableNodes: TreeNode[] = [];

const buildTree = (start: number, end: number, depth: number): TreeNode => {
  if (start === end) {
    const node = {
      id: `${start}-${end}`,
      start,
      end,
      sum: VALUES[start],
      depth,
      x: geometry.leafStartX + start * geometry.leafStride,
      y: depth * geometry.levelGap,
    };
    mutableNodes.push(node);
    return node;
  }

  const middle = Math.floor((start + end) / 2);
  const left = buildTree(start, middle, depth + 1);
  const right = buildTree(middle + 1, end, depth + 1);
  const node = {
    id: `${start}-${end}`,
    start,
    end,
    sum: left.sum + right.sum,
    depth,
    x: (left.x + right.x) / 2,
    y: depth * geometry.levelGap,
    left: left.id,
    right: right.id,
  };
  mutableNodes.push(node);
  return node;
};

buildTree(0, VALUES.length - 1, 0);

export const NODES = mutableNodes;
export const NODE_MAP = new Map(NODES.map((node) => [node.id, node]));
export const LEAVES = NODES.filter((node) => node.start === node.end).sort(
  (left, right) => left.start - right.start,
);
export const INTERNAL_NODES = NODES.filter(
  (node) => node.start !== node.end,
).sort((left, right) => right.depth - left.depth || left.start - right.start);

export const QUERY_STEPS: QueryStep[] = [
  {nodeId: "0-7", decision: "split", detail: "部分重叠，递归检查两个子区间"},
  {nodeId: "0-3", decision: "split", detail: "左侧部分重叠，继续向下查询"},
  {nodeId: "0-1", decision: "skip", detail: "区间无交集，剪枝并返回 0"},
  {nodeId: "2-3", decision: "take", detail: "区间完全覆盖，直接采用节点和", add: 9},
  {nodeId: "4-7", decision: "split", detail: "右侧部分重叠，递归检查子区间"},
  {nodeId: "4-5", decision: "take", detail: "区间完全覆盖，直接采用节点和", add: 9},
  {nodeId: "6-7", decision: "split", detail: "部分重叠，继续检查叶子节点"},
  {nodeId: "6-6", decision: "take", detail: "叶子位于查询范围，累加节点值", add: 2},
  {nodeId: "7-7", decision: "skip", detail: "区间无交集，剪枝并返回 0"},
];

export const BUILD_START = timing.intro;
export const INTERNAL_BUILD_START = BUILD_START + timing.leaves;
export const QUERY_START =
  INTERNAL_BUILD_START +
  INTERNAL_NODES.length * timing.buildStep +
  timing.queryGap;
export const SEGMENT_TREE_DURATION =
  QUERY_START + QUERY_STEPS.length * timing.queryStep + timing.outro;

export const getNodeRevealFrame = (node: TreeNode) => {
  if (node.start === node.end) {
    return BUILD_START + node.start * 5;
  }

  return (
    INTERNAL_BUILD_START +
    INTERNAL_NODES.findIndex((candidate) => candidate.id === node.id) *
      timing.buildStep
  );
};
