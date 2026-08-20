import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";
import {design} from "./design-system";

type TreeNode = {
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

type QueryStep = {
  nodeId: string;
  decision: "split" | "take" | "skip";
  detail: string;
  add?: number;
};

const VALUES = [5, 8, 6, 3, 2, 7, 2, 6];
const QUERY_START_INDEX = 2;
const QUERY_END_INDEX = 6;
const INTRO_FRAMES = 50;
const LEAF_FRAMES = 48;
const BUILD_STEP_FRAMES = 26;
const QUERY_GAP_FRAMES = 36;
const QUERY_STEP_FRAMES = 24;
const OUTRO_FRAMES = 50;
const NODE_WIDTH = 104;
const NODE_HEIGHT = 54;
const LEAF_START_X = 88;
const LEAF_STRIDE = 140;
const LEVEL_GAP = 106;

const nodes: TreeNode[] = [];

const buildTree = (start: number, end: number, depth: number): TreeNode => {
  if (start === end) {
    const node = {id: `${start}-${end}`, start, end, sum: VALUES[start], depth, x: LEAF_START_X + start * LEAF_STRIDE, y: depth * LEVEL_GAP};
    nodes.push(node);
    return node;
  }
  const middle = Math.floor((start + end) / 2);
  const left = buildTree(start, middle, depth + 1);
  const right = buildTree(middle + 1, end, depth + 1);
  const node = {id: `${start}-${end}`, start, end, sum: left.sum + right.sum, depth, x: (left.x + right.x) / 2, y: depth * LEVEL_GAP, left: left.id, right: right.id};
  nodes.push(node);
  return node;
};

buildTree(0, VALUES.length - 1, 0);

const NODE_MAP = new Map(nodes.map((node) => [node.id, node]));
const LEAVES = nodes.filter((node) => node.start === node.end).sort((a, b) => a.start - b.start);
const INTERNAL_NODES = nodes.filter((node) => node.start !== node.end).sort((a, b) => b.depth - a.depth || a.start - b.start);
const BUILD_START = INTRO_FRAMES;
const INTERNAL_BUILD_START = BUILD_START + LEAF_FRAMES;
const QUERY_START = INTERNAL_BUILD_START + INTERNAL_NODES.length * BUILD_STEP_FRAMES + QUERY_GAP_FRAMES;

const QUERY_STEPS: QueryStep[] = [
  {nodeId: "0-7", decision: "split", detail: "部分重叠，拆分左右子树"},
  {nodeId: "0-3", decision: "split", detail: "部分重叠，继续向下查询"},
  {nodeId: "0-1", decision: "skip", detail: "区间在查询范围外，返回 0"},
  {nodeId: "2-3", decision: "take", detail: "区间完全覆盖，直接使用节点和", add: 9},
  {nodeId: "4-7", decision: "split", detail: "部分重叠，拆分左右子树"},
  {nodeId: "4-5", decision: "take", detail: "区间完全覆盖，直接使用节点和", add: 9},
  {nodeId: "6-7", decision: "split", detail: "部分重叠，继续向下查询"},
  {nodeId: "6-6", decision: "take", detail: "叶子节点在查询范围内", add: 2},
  {nodeId: "7-7", decision: "skip", detail: "区间在查询范围外，返回 0"},
];

const DURATION = QUERY_START + QUERY_STEPS.length * QUERY_STEP_FRAMES + OUTRO_FRAMES;
const {color, font, layout, radius, space} = design;

const tween = (frame: number, input: number[], output: number[]) => interpolate(frame, input, output, {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.16, 1, 0.3, 1),
});

const nodeRevealFrame = (node: TreeNode) => {
  if (node.start === node.end) return BUILD_START + node.start * 5;
  return INTERNAL_BUILD_START + INTERNAL_NODES.findIndex((candidate) => candidate.id === node.id) * BUILD_STEP_FRAMES;
};

const Eyebrow: React.FC<{children: React.ReactNode; inverse?: boolean}> = ({children, inverse}) => (
  <div style={{color: inverse ? "#8A8A8A" : color.muted, fontSize: 13, fontWeight: font.weight.semibold, letterSpacing: 1.6, lineHeight: 1}}>{children}</div>
);

const Status: React.FC<{label: string; tone: "accent" | "success" | "neutral"}> = ({label, tone}) => {
  const foreground = tone === "success" ? color.success : tone === "accent" ? color.accent : color.ink;
  const background = tone === "success" ? color.successSoft : tone === "accent" ? color.accentSoft : color.surfaceMuted;
  return <div style={{display: "flex", alignItems: "center", gap: 10, height: 36, padding: "0 14px", border: `1px solid ${color.border}`, borderRadius: radius.pill, background, color: foreground, fontSize: 14, fontWeight: font.weight.semibold}}><span style={{width: 7, height: 7, borderRadius: "50%", background: foreground}} />{label}</div>;
};

const CodeRow: React.FC<{line: number; active: boolean; children: React.ReactNode}> = ({line, active, children}) => (
  <div style={{display: "flex", alignItems: "center", height: 43, padding: "0 12px", borderRadius: radius.small, background: active ? "#242424" : "transparent", color: active ? color.inverse : "#898989", fontFamily: font.mono, fontSize: 14, fontWeight: active ? font.weight.semibold : font.weight.regular}}>
    <span style={{width: 26, color: active ? "#5EA2EF" : "#4D4D4D"}}>{line}</span>{children}
  </div>
);

const Property: React.FC<{label: string; value: string}> = ({label, value}) => (
  <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", height: 36, borderBottom: `1px solid ${color.border}`}}>
    <span style={{color: color.muted, fontSize: 15}}>{label}</span><span style={{fontSize: 15, fontWeight: font.weight.semibold}}>{value}</span>
  </div>
);

export const SegmentTree: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = tween(frame, [0, 36], [0, 1]);
  const isBuilding = frame < QUERY_START;
  const isQuerying = frame >= QUERY_START && frame < DURATION - OUTRO_FRAMES;
  const isComplete = frame >= DURATION - OUTRO_FRAMES;
  const queryFrame = Math.max(0, frame - QUERY_START);
  const rawQueryIndex = Math.floor(queryFrame / QUERY_STEP_FRAMES);
  const queryIndex = Math.min(QUERY_STEPS.length - 1, rawQueryIndex);
  const queryLocalFrame = queryFrame - queryIndex * QUERY_STEP_FRAMES;
  const queryStep = QUERY_STEPS[queryIndex];
  const visitedIds = new Set(QUERY_STEPS.slice(0, isComplete ? QUERY_STEPS.length : queryIndex).map((step) => step.nodeId));
  const takenIds = new Set(QUERY_STEPS.slice(0, isComplete ? QUERY_STEPS.length : queryIndex + (queryLocalFrame > 12 ? 1 : 0)).filter((step) => step.decision === "take").map((step) => step.nodeId));
  const skippedIds = new Set(QUERY_STEPS.slice(0, isComplete ? QUERY_STEPS.length : queryIndex + (queryLocalFrame > 12 ? 1 : 0)).filter((step) => step.decision === "skip").map((step) => step.nodeId));
  const accumulated = QUERY_STEPS.slice(0, isComplete ? QUERY_STEPS.length : queryIndex + (queryLocalFrame > 12 ? 1 : 0)).reduce((sum, step) => sum + (step.add ?? 0), 0);
  const currentBuildNode = INTERNAL_NODES[Math.min(INTERNAL_NODES.length - 1, Math.max(0, Math.floor((frame - INTERNAL_BUILD_START) / BUILD_STEP_FRAMES)))];
  const phaseLabel = isComplete ? "查询完成" : isQuerying ? "区间查询" : "构建线段树";
  const statusTone = isComplete ? "success" : isQuerying ? "accent" : "neutral";
  const activeCodeLine = isBuilding ? (frame < BUILD_START ? 1 : frame < INTERNAL_BUILD_START ? 2 : frame % BUILD_STEP_FRAMES < 13 ? 3 : 4) : queryStep.decision === "skip" ? 2 : queryStep.decision === "take" ? 3 : 4;
  const progress = Math.min(1, Math.max(0, frame / (DURATION - 1)));

  return (
    <AbsoluteFill style={{background: color.canvas, color: color.ink, fontFamily: font.sans, WebkitFontSmoothing: "antialiased", overflow: "hidden"}}>
      <div style={{position: "absolute", left: 0, right: 0, top: layout.headerHeight - 1, height: 1, background: color.border}} />
      <div style={{position: "absolute", left: 0, right: 0, bottom: 47, height: 1, background: color.border}} />

      <div style={{position: "absolute", left: layout.pageInset, right: layout.pageInset, top: 0, height: layout.headerHeight, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: enter}}>
        <div style={{display: "flex", alignItems: "center", gap: 14}}>
          <div style={{width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${color.borderStrong}`, borderRadius: radius.small, background: color.ink, color: color.inverse, fontFamily: font.mono, fontSize: 12, fontWeight: font.weight.semibold}}>ST</div>
          <div style={{fontSize: 15, fontWeight: font.weight.semibold}}>Algorithm Visualizer</div><div style={{width: 1, height: 18, background: color.borderStrong}} /><div style={{color: color.muted, fontSize: 14}}>Lesson 05</div>
        </div>
        <div style={{display: "flex", alignItems: "center", gap: 24, color: color.muted, fontSize: 14}}><span>8 elements</span><span>·</span><span>15 nodes</span><span>·</span><span>Range Sum</span></div>
      </div>

      <div style={{position: "absolute", left: layout.pageInset, right: layout.pageInset, top: layout.titleTop, display: "flex", justifyContent: "space-between", alignItems: "flex-end", opacity: enter, transform: `translateY(${(1 - enter) * 14}px)`}}>
        <div><Eyebrow>DATA STRUCTURE / SEGMENT TREE</Eyebrow><div style={{marginTop: 12, fontSize: 52, lineHeight: 1.08, letterSpacing: -1.8, fontWeight: font.weight.semibold}}>线段树</div></div>
        <div style={{width: 540, color: color.muted, fontSize: 18, lineHeight: 1.65}}>将数组递归划分为区间，并在节点中保存区间和。查询时跳过无关节点，直接复用被完全覆盖的区间。</div>
      </div>

      <section style={{position: "absolute", left: layout.pageInset, top: layout.contentTop, width: layout.stageWidth, height: layout.contentHeight, border: `1px solid ${color.borderStrong}`, borderRadius: radius.large, background: color.surface, overflow: "hidden", opacity: tween(frame, [8, 40], [0, 1]), transform: `translateY(${tween(frame, [8, 40], [16, 0])}px)`}}>
        <div style={{height: 88, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${space[4]}px`, borderBottom: `1px solid ${color.border}`}}>
          <div style={{display: "flex", alignItems: "center", gap: 24}}>
            <div style={{width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: radius.medium, background: color.surfaceMuted, border: `1px solid ${color.border}`, fontFamily: font.mono, fontSize: 14, fontWeight: font.weight.semibold}}>{isComplete ? "✓" : isQuerying ? "Q" : "B"}</div>
            <div><div style={{color: color.muted, fontSize: 13, fontWeight: font.weight.semibold, letterSpacing: 1.2}}>{isQuerying || isComplete ? `QUERY [${QUERY_START_INDEX}, ${QUERY_END_INDEX}]` : "BUILD TREE"}</div><div style={{marginTop: 6, fontSize: 22, fontWeight: font.weight.semibold}}>{isComplete ? "查询结果：20" : isQuerying ? queryStep.detail : frame < INTERNAL_BUILD_START ? "创建叶子节点" : `合并区间 [${currentBuildNode.start}, ${currentBuildNode.end}]`}</div></div>
          </div>
          <Status label={phaseLabel} tone={statusTone} />
        </div>

        <div style={{position: "absolute", left: 48, top: 120, width: 1152, height: 474}}>
          <svg width="1152" height="474" style={{position: "absolute", inset: 0}}>
            {nodes.filter((node) => node.left && node.right).flatMap((node) => ([node.left!, node.right!] as string[]).map((childId) => {
              const child = NODE_MAP.get(childId)!;
              const visible = frame >= Math.max(nodeRevealFrame(node), nodeRevealFrame(child));
              const edgeProgress = tween(frame, [Math.max(nodeRevealFrame(node), nodeRevealFrame(child)), Math.max(nodeRevealFrame(node), nodeRevealFrame(child)) + 12], [0, 1]);
              const queryActive = visitedIds.has(node.id) && (visitedIds.has(child.id) || queryStep.nodeId === child.id);
              return <line key={`${node.id}-${child.id}`} x1={node.x} y1={node.y + NODE_HEIGHT} x2={child.x} y2={child.y} stroke={queryActive && isQuerying ? color.accent : color.borderStrong} strokeWidth={queryActive && isQuerying ? 2 : 1.5} opacity={visible ? edgeProgress : 0} />;
            }))}
          </svg>

          {nodes.map((node) => {
            const revealFrame = nodeRevealFrame(node);
            const reveal = tween(frame, [revealFrame, revealFrame + 14], [0, 1]);
            const currentQuery = isQuerying && queryStep.nodeId === node.id;
            const taken = takenIds.has(node.id);
            const skipped = skippedIds.has(node.id);
            const builtActive = isBuilding && frame >= INTERNAL_BUILD_START && currentBuildNode?.id === node.id && frame < revealFrame + BUILD_STEP_FRAMES;
            const background = taken ? color.success : currentQuery ? color.accent : skipped ? color.surfaceMuted : color.surface;
            const foreground = taken || currentQuery ? color.inverse : skipped ? color.faint : color.ink;
            const borderColor = taken ? color.success : currentQuery || builtActive ? color.accent : skipped ? color.border : color.borderStrong;
            return (
              <div key={node.id} style={{position: "absolute", left: node.x - NODE_WIDTH / 2, top: node.y, width: NODE_WIDTH, height: NODE_HEIGHT, opacity: reveal, transform: `scale(${0.9 + reveal * 0.1})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `1px solid ${borderColor}`, borderRadius: radius.medium, background, color: foreground, zIndex: 2}}>
                <div style={{fontFamily: font.mono, fontSize: 18, lineHeight: 1, fontWeight: font.weight.semibold}}>{node.sum}</div>
                <div style={{marginTop: 6, fontFamily: font.mono, fontSize: 10, lineHeight: 1, opacity: 0.72}}>[{node.start}, {node.end}]</div>
              </div>
            );
          })}

          <div style={{position: "absolute", inset: 0}}>
            {LEAVES.map((leaf) => {
              const inRange = leaf.start >= QUERY_START_INDEX && leaf.end <= QUERY_END_INDEX;
              return <div key={leaf.id} style={{position: "absolute", left: leaf.x - 52, top: 428, width: 104, height: 38, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${isQuerying || isComplete ? inRange ? color.accent : color.border : color.border}`, borderRadius: radius.small, background: isQuerying || isComplete ? inRange ? color.accentSoft : color.surfaceMuted : color.surfaceMuted, color: inRange && (isQuerying || isComplete) ? color.accent : color.ink, fontFamily: font.mono, fontSize: 13}}>a[{leaf.start}] = {leaf.sum}</div>;
            })}
          </div>
        </div>

        <div style={{position: "absolute", left: 32, right: 32, bottom: 24, height: 48, display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${color.border}`}}>
          <div style={{display: "flex", gap: 22, color: color.muted, fontSize: 14}}><span style={{display: "flex", alignItems: "center", gap: 8}}><span style={{width: 9, height: 9, borderRadius: 2, background: color.accent}} />当前访问</span><span style={{display: "flex", alignItems: "center", gap: 8}}><span style={{width: 9, height: 9, borderRadius: 2, background: color.success}} />直接采用</span><span style={{display: "flex", alignItems: "center", gap: 8}}><span style={{width: 9, height: 9, borderRadius: 2, background: color.surfaceMuted, border: `1px solid ${color.borderStrong}`}} />剪枝跳过</span></div>
          <div style={{color: color.muted, fontSize: 14}}>Input&nbsp;&nbsp;<span style={{color: color.ink, fontFamily: font.mono}}>[{VALUES.join(", ")}]</span></div>
        </div>
      </section>

      <aside style={{position: "absolute", left: layout.sidebarLeft, top: layout.contentTop, width: layout.sidebarWidth, height: layout.contentHeight, display: "flex", flexDirection: "column", gap: space[2], opacity: tween(frame, [16, 44], [0, 1]), transform: `translateX(${tween(frame, [16, 44], [16, 0])}px)`}}>
        <section style={{height: 176, padding: space[3], border: `1px solid ${color.borderStrong}`, borderRadius: radius.large, background: color.surface}}>
          <Eyebrow>{isQuerying || isComplete ? "QUERY RESULT" : "CURRENT NODE"}</Eyebrow>
          <div style={{display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 22}}><div style={{fontFamily: font.mono, fontSize: 38, letterSpacing: -1.5, fontWeight: font.weight.semibold}}>{isQuerying || isComplete ? accumulated : frame < INTERNAL_BUILD_START ? "LEAF" : `[${currentBuildNode.start},${currentBuildNode.end}]`}</div><div style={{color: isComplete ? color.success : isQuerying ? color.accent : color.muted, fontSize: 15, fontWeight: font.weight.semibold}}>{isQuerying || isComplete ? `sum = ${accumulated}` : phaseLabel}</div></div>
          <div style={{marginTop: 18, color: color.muted, fontSize: 15, lineHeight: 1.55}}>{isComplete ? "9 + 9 + 2 = 20，查询结束。" : isQuerying ? queryStep.detail : frame < INTERNAL_BUILD_START ? "数组元素成为树的叶子节点。" : `tree[${currentBuildNode.start},${currentBuildNode.end}] = 左子树 + 右子树`}</div>
        </section>

        <section style={{height: 304, padding: space[3], borderRadius: radius.large, background: color.code}}>
          <Eyebrow inverse>PSEUDOCODE · {isBuilding ? "BUILD" : "QUERY"}</Eyebrow>
          <div style={{marginTop: 18}}>
            {isBuilding ? <><CodeRow line={1} active={activeCodeLine === 1}>build(node, left, right)</CodeRow><CodeRow line={2} active={activeCodeLine === 2}>&nbsp;&nbsp;if leaf: save value</CodeRow><CodeRow line={3} active={activeCodeLine === 3}>&nbsp;&nbsp;build left and right</CodeRow><CodeRow line={4} active={activeCodeLine === 4}>&nbsp;&nbsp;node.sum = left + right</CodeRow></> : <><CodeRow line={1} active={activeCodeLine === 1}>query(node, ql, qr)</CodeRow><CodeRow line={2} active={activeCodeLine === 2}>&nbsp;&nbsp;if outside: return 0</CodeRow><CodeRow line={3} active={activeCodeLine === 3}>&nbsp;&nbsp;if covered: return sum</CodeRow><CodeRow line={4} active={activeCodeLine === 4}>&nbsp;&nbsp;query left + right</CodeRow></>}
          </div>
        </section>

        <section style={{flex: 1, padding: space[3], border: `1px solid ${color.borderStrong}`, borderRadius: radius.large, background: color.surface}}>
          <Eyebrow>PROPERTIES</Eyebrow><div style={{marginTop: 14}}><Property label="构建复杂度" value="O(n)" /><Property label="区间查询" value="O(log n)" /><Property label="节点数量" value="2n - 1" /><Property label="查询区间" value="[2, 6]" /></div>
        </section>
      </aside>

      <div style={{position: "absolute", left: layout.pageInset, right: layout.pageInset, bottom: 23, height: 2, background: color.border}}><div style={{width: `${progress * 100}%`, height: "100%", background: isComplete ? color.success : color.accent}} /></div>
    </AbsoluteFill>
  );
};

export const SEGMENT_TREE_DURATION = DURATION;
