import type {ReactNode} from "react";
import {Easing, interpolate} from "remotion";
import {primer, surfaceStyle} from "../design-system";
import {
  geometry,
  getNodeRevealFrame,
  LEAVES,
  NODE_MAP,
  NODES,
  QUERY_END_INDEX,
  QUERY_START_INDEX,
  VALUES,
} from "./model";
import type {TimelineState} from "./timeline";

const {color, font, layout, radius, shadow, space, text} = primer;

export const tween = (frame: number, input: number[], output: number[]) =>
  interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const BranchGlyph = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="5" cy="4" r="2" fill="currentColor" />
    <circle cx="15" cy="4" r="2" fill="currentColor" />
    <circle cx="10" cy="16" r="2" fill="currentColor" />
    <path d="M5 6v2c0 2 1.5 3 3.5 3H10m5-5v2c0 2-1.5 3-3.5 3H10v3" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const AppHeader: React.FC<{frame: number}> = ({frame}) => {
  const enter = tween(frame, [0, 24], [0, 1]);
  return (
    <>
      <header
        style={{
          position: "absolute",
          inset: "0 0 auto",
          height: layout.headerHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `0 ${layout.pageInset}px`,
          background: color.canvasSubtle,
          borderBottom: `1px solid ${color.borderDefault}`,
          opacity: enter,
        }}
      >
        <div style={{display: "flex", alignItems: "center", gap: space[3]}}>
          <div
            style={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: radius.medium,
              background: color.foregroundDefault,
              color: color.foregroundOnEmphasis,
            }}
          >
            <BranchGlyph />
          </div>
          <strong style={{fontSize: 16, fontWeight: font.weight.semibold}}>Algorithm Lab</strong>
          <span style={{width: 1, height: 20, background: color.borderDefault}} />
          <span style={{...text.bodyMedium, color: color.foregroundMuted}}>Interactive lessons</span>
        </div>
        <div style={{display: "flex", alignItems: "center", gap: space[2]}}>
          <HeaderPill>8 elements</HeaderPill>
          <HeaderPill>15 nodes</HeaderPill>
          <div
            style={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${color.borderDefault}`,
              borderRadius: radius.medium,
              background: color.canvasDefault,
              color: color.foregroundMuted,
              fontFamily: font.mono,
              fontSize: 12,
              fontWeight: font.weight.semibold,
            }}
          >
            05
          </div>
        </div>
      </header>
      <div
        style={{
          position: "absolute",
          left: layout.pageInset,
          right: layout.pageInset,
          top: layout.headerHeight,
          height: layout.contextHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: tween(frame, [8, 32], [0, 1]),
        }}
      >
        <div style={{display: "flex", alignItems: "center", gap: space[2], ...text.bodyMedium}}>
          <span style={{color: color.accent, fontWeight: font.weight.semibold}}>data-structures</span>
          <span style={{color: color.foregroundMuted}}>/</span>
          <span style={{fontWeight: font.weight.semibold}}>segment-tree</span>
          <span
            style={{
              marginLeft: space[1],
              padding: "1px 7px",
              border: `1px solid ${color.borderDefault}`,
              borderRadius: radius.full,
              color: color.foregroundMuted,
              fontSize: 12,
            }}
          >
            lesson
          </span>
        </div>
        <nav style={{display: "flex", alignSelf: "stretch", gap: space[4]}}>
          <NavItem>概览</NavItem>
          <NavItem active>可视化</NavItem>
          <NavItem>复杂度</NavItem>
        </nav>
      </div>
    </>
  );
};

const HeaderPill: React.FC<{children: ReactNode}> = ({children}) => (
  <span
    style={{
      padding: "4px 10px",
      border: `1px solid ${color.borderDefault}`,
      borderRadius: radius.full,
      background: color.canvasDefault,
      color: color.foregroundMuted,
      fontSize: 12,
      lineHeight: "16px",
    }}
  >
    {children}
  </span>
);

const NavItem: React.FC<{children: ReactNode; active?: boolean}> = ({children, active}) => (
  <div
    style={{
      position: "relative",
      display: "flex",
      alignItems: "center",
      color: active ? color.foregroundDefault : color.foregroundMuted,
      fontSize: 14,
      fontWeight: active ? font.weight.semibold : font.weight.regular,
    }}
  >
    {children}
    {active ? (
      <span
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 2,
          background: "#fd8c73",
          borderRadius: radius.full,
        }}
      />
    ) : null}
  </div>
);

export const StatusLabel: React.FC<{
  label: string;
  tone: "accent" | "success" | "neutral";
}> = ({label, tone}) => {
  const foreground = tone === "success" ? color.success : tone === "accent" ? color.accent : color.foregroundMuted;
  const background = tone === "success" ? color.successMuted : tone === "accent" ? color.accentMuted : color.canvasSubtle;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: space[2],
        height: 32,
        padding: "0 12px",
        border: `1px solid ${color.borderDefault}`,
        borderRadius: radius.full,
        background,
        color: foreground,
        fontSize: 12,
        fontWeight: font.weight.semibold,
      }}
    >
      <span style={{width: 7, height: 7, borderRadius: "50%", background: foreground}} />
      {label}
    </div>
  );
};

const SectionLabel: React.FC<{children: ReactNode; inverse?: boolean}> = ({children, inverse}) => (
  <div
    style={{
      color: inverse ? color.codeMuted : color.foregroundMuted,
      fontSize: 12,
      lineHeight: "16px",
      fontWeight: font.weight.semibold,
      letterSpacing: 0.6,
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);

export const TreeStage: React.FC<{frame: number; state: TimelineState}> = ({frame, state}) => {
  const statusTone = state.isComplete ? "success" : state.isQuerying ? "accent" : "neutral";
  const toolbarTitle = state.isComplete
    ? "查询完成：区间和为 20"
    : state.isQuerying
      ? state.queryStep.detail
      : frame < 96
        ? "从数组元素创建叶子节点"
        : `合并区间 [${state.currentBuildNode.start}, ${state.currentBuildNode.end}]`;

  return (
    <section
      style={{
        ...surfaceStyle,
        position: "absolute",
        left: layout.pageInset,
        top: layout.contentTop,
        width: layout.stageWidth,
        height: layout.contentHeight,
        overflow: "hidden",
        opacity: tween(frame, [10, 38], [0, 1]),
        transform: `translateY(${tween(frame, [10, 38], [12, 0])}px)`,
      }}
    >
      <div
        style={{
          height: 92,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `0 ${space[4]}px`,
          borderBottom: `1px solid ${color.borderDefault}`,
          background: color.canvasSubtle,
        }}
      >
        <div>
          <div style={{display: "flex", alignItems: "center", gap: space[2]}}>
            <h1 style={{margin: 0, fontSize: 20, lineHeight: "32px", fontWeight: font.weight.semibold}}>
              线段树 · 区间和查询
            </h1>
            <span style={{fontFamily: font.mono, ...text.caption, color: color.foregroundMuted}}>query(2, 6)</span>
          </div>
          <div style={{marginTop: space[1], ...text.bodyMedium, color: color.foregroundMuted}}>{toolbarTitle}</div>
        </div>
        <StatusLabel label={state.phaseLabel} tone={statusTone} />
      </div>

      <TreeCanvas frame={frame} state={state} />

      <div
        style={{
          position: "absolute",
          left: space[4],
          right: space[4],
          bottom: 0,
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${color.borderDefault}`,
        }}
      >
        <div style={{display: "flex", gap: space[4]}}>
          <Legend colorValue={color.accent} label="当前访问" />
          <Legend colorValue={color.success} label="直接采用" />
          <Legend colorValue={color.canvasInset} label="剪枝跳过" border />
        </div>
        <div style={{...text.bodyMedium, color: color.foregroundMuted}}>
          Input&nbsp;&nbsp;
          <span style={{fontFamily: font.mono, color: color.foregroundDefault}}>[{VALUES.join(", ")}]</span>
        </div>
      </div>
    </section>
  );
};

const TreeCanvas: React.FC<{frame: number; state: TimelineState}> = ({frame, state}) => (
  <div style={{position: "absolute", left: 64, top: 124, width: 1152, height: 584}}>
    <svg width="1152" height="520" style={{position: "absolute", inset: 0}}>
      {NODES.filter((node) => node.left && node.right).flatMap((node) =>
        [node.left, node.right].map((childId) => {
          const child = NODE_MAP.get(childId as string)!;
          const revealFrame = Math.max(getNodeRevealFrame(node), getNodeRevealFrame(child));
          const edgeProgress = tween(frame, [revealFrame, revealFrame + 12], [0, 1]);
          const queryActive = state.visitedIds.has(node.id) && (state.visitedIds.has(child.id) || state.queryStep.nodeId === child.id);
          return (
            <line
              key={`${node.id}-${child.id}`}
              x1={node.x}
              y1={node.y + geometry.nodeHeight}
              x2={child.x}
              y2={child.y}
              stroke={queryActive && state.isQuerying ? color.accent : color.borderDefault}
              strokeWidth={queryActive && state.isQuerying ? 2 : 1.5}
              opacity={frame >= revealFrame ? edgeProgress : 0}
            />
          );
        }),
      )}
    </svg>

    {NODES.map((node) => {
      const revealFrame = getNodeRevealFrame(node);
      const reveal = tween(frame, [revealFrame, revealFrame + 14], [0, 1]);
      const currentQuery = state.isQuerying && state.queryStep.nodeId === node.id;
      const taken = state.takenIds.has(node.id);
      const skipped = state.skippedIds.has(node.id);
      const builtActive = state.isBuilding && frame >= 96 && state.currentBuildNode?.id === node.id && frame < revealFrame + 26;
      const background = taken ? color.successEmphasis : currentQuery ? color.accent : skipped ? color.canvasInset : color.canvasDefault;
      const foreground = taken || currentQuery ? color.foregroundOnEmphasis : skipped ? color.foregroundSubtle : color.foregroundDefault;
      const borderColor = taken ? color.successEmphasis : currentQuery || builtActive ? color.accent : color.borderDefault;
      return (
        <div
          key={node.id}
          style={{
            position: "absolute",
            left: node.x - geometry.nodeWidth / 2,
            top: node.y,
            width: geometry.nodeWidth,
            height: geometry.nodeHeight,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${borderColor}`,
            borderRadius: radius.medium,
            background,
            boxShadow: currentQuery ? shadow.floating : shadow.resting,
            color: foreground,
            opacity: reveal,
            transform: `scale(${0.92 + reveal * 0.08})`,
            zIndex: 2,
          }}
        >
          <div style={{fontFamily: font.mono, fontSize: 18, lineHeight: "20px", fontWeight: font.weight.semibold}}>{node.sum}</div>
          <div style={{marginTop: 3, fontFamily: font.mono, fontSize: 10, lineHeight: "12px", opacity: 0.72}}>[{node.start}, {node.end}]</div>
        </div>
      );
    })}

    {LEAVES.map((leaf) => {
      const inRange = leaf.start >= QUERY_START_INDEX && leaf.end <= QUERY_END_INDEX;
      const queryVisible = state.isQuerying || state.isComplete;
      return (
        <div
          key={`value-${leaf.id}`}
          style={{
            position: "absolute",
            left: leaf.x - 52,
            top: 460,
            width: 104,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${queryVisible && inRange ? color.accent : color.borderDefault}`,
            borderRadius: radius.small,
            background: queryVisible && inRange ? color.accentMuted : color.canvasSubtle,
            color: queryVisible && inRange ? color.accentEmphasis : color.foregroundDefault,
            fontFamily: font.mono,
            fontSize: 12,
          }}
        >
          a[{leaf.start}] = {leaf.sum}
        </div>
      );
    })}
  </div>
);

const Legend: React.FC<{colorValue: string; label: string; border?: boolean}> = ({colorValue, label, border}) => (
  <span style={{display: "flex", alignItems: "center", gap: space[2], ...text.bodyMedium, color: color.foregroundMuted}}>
    <span style={{width: 10, height: 10, borderRadius: 2, background: colorValue, border: border ? `1px solid ${color.borderDefault}` : undefined}} />
    {label}
  </span>
);

export const InsightSidebar: React.FC<{frame: number; state: TimelineState}> = ({frame, state}) => (
  <aside
    style={{
      position: "absolute",
      left: layout.sidebarLeft,
      top: layout.contentTop,
      width: layout.sidebarWidth,
      height: layout.contentHeight,
      display: "flex",
      flexDirection: "column",
      gap: space[3],
      opacity: tween(frame, [18, 42], [0, 1]),
      transform: `translateX(${tween(frame, [18, 42], [12, 0])}px)`,
    }}
  >
    <ResultCard frame={frame} state={state} />
    <CodeCard state={state} />
    <PropertiesCard />
  </aside>
);

const ResultCard: React.FC<{frame: number; state: TimelineState}> = ({frame, state}) => {
  const value = state.isQuerying || state.isComplete ? state.accumulated : frame < 96 ? "LEAF" : `[${state.currentBuildNode.start},${state.currentBuildNode.end}]`;
  const detail = state.isComplete
    ? "9 + 9 + 2 = 20，所有相关区间已合并。"
    : state.isQuerying
      ? state.queryStep.detail
      : frame < 96
        ? "每个数组元素对应一个叶子节点。"
        : `tree[${state.currentBuildNode.start},${state.currentBuildNode.end}] = left.sum + right.sum`;
  return (
    <section style={{...surfaceStyle, height: 200, padding: space[4]}}>
      <SectionLabel>{state.isQuerying || state.isComplete ? "Query result" : "Current node"}</SectionLabel>
      <div style={{display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: space[3]}}>
        <div style={{fontFamily: font.mono, fontSize: 40, lineHeight: "48px", letterSpacing: -1.4, fontWeight: font.weight.semibold}}>{value}</div>
        <div style={{paddingBottom: 5, color: state.isComplete ? color.success : state.isQuerying ? color.accent : color.foregroundMuted, fontSize: 14, fontWeight: font.weight.semibold}}>
          {state.isQuerying || state.isComplete ? `sum = ${state.accumulated}` : state.phaseLabel}
        </div>
      </div>
      <p style={{margin: `${space[3]}px 0 0`, ...text.bodyMedium, color: color.foregroundMuted}}>{detail}</p>
    </section>
  );
};

const CodeCard: React.FC<{state: TimelineState}> = ({state}) => (
  <section style={{height: 328, padding: space[4], border: `1px solid ${color.codeBorder}`, borderRadius: radius.medium, background: color.codeCanvas, boxShadow: shadow.resting}}>
    <SectionLabel inverse>Pseudocode · {state.isBuilding ? "build" : "query"}</SectionLabel>
    <div style={{marginTop: space[3]}}>
      {state.isBuilding ? (
        <>
          <CodeRow line={1} active={state.activeCodeLine === 1}>build(node, left, right)</CodeRow>
          <CodeRow line={2} active={state.activeCodeLine === 2}>  if leaf: save value</CodeRow>
          <CodeRow line={3} active={state.activeCodeLine === 3}>  build left and right</CodeRow>
          <CodeRow line={4} active={state.activeCodeLine === 4}>  node.sum = left + right</CodeRow>
        </>
      ) : (
        <>
          <CodeRow line={1} active={state.activeCodeLine === 1}>query(node, ql, qr)</CodeRow>
          <CodeRow line={2} active={state.activeCodeLine === 2}>  if outside: return 0</CodeRow>
          <CodeRow line={3} active={state.activeCodeLine === 3}>  if covered: return sum</CodeRow>
          <CodeRow line={4} active={state.activeCodeLine === 4}>  query left + right</CodeRow>
        </>
      )}
    </div>
  </section>
);

const CodeRow: React.FC<{line: number; active: boolean; children: ReactNode}> = ({line, active, children}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      height: 54,
      padding: "0 12px",
      borderLeft: `2px solid ${active ? color.accent : "transparent"}`,
      borderRadius: radius.small,
      background: active ? "rgba(56, 139, 253, 0.15)" : "transparent",
      color: active ? color.foregroundOnEmphasis : color.codeMuted,
      fontFamily: font.mono,
      fontSize: 13,
      whiteSpace: "pre",
    }}
  >
    <span style={{width: 30, color: active ? color.codeBlue : "#484f58"}}>{line}</span>
    {children}
  </div>
);

const PropertiesCard = () => (
  <section style={{...surfaceStyle, flex: 1, padding: space[4]}}>
    <SectionLabel>Properties</SectionLabel>
    <div style={{marginTop: space[2]}}>
      <Property label="构建复杂度" value="O(n)" />
      <Property label="区间查询" value="O(log n)" />
      <Property label="节点数量" value="2n − 1" />
      <Property label="查询区间" value="[2, 6]" />
    </div>
  </section>
);

const Property: React.FC<{label: string; value: string}> = ({label, value}) => (
  <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", height: 43, borderBottom: `1px solid ${color.borderMuted}`, ...text.bodyMedium}}>
    <span style={{color: color.foregroundMuted}}>{label}</span>
    <span style={{fontFamily: font.mono, fontWeight: font.weight.semibold}}>{value}</span>
  </div>
);

export const ProgressBar: React.FC<{progress: number; complete: boolean}> = ({progress, complete}) => (
  <div style={{position: "absolute", left: layout.pageInset, right: layout.pageInset, bottom: 38, height: 4, overflow: "hidden", borderRadius: radius.full, background: color.borderMuted}}>
    <div style={{width: `${progress * 100}%`, height: "100%", borderRadius: radius.full, background: complete ? color.success : color.accent}} />
  </div>
);
