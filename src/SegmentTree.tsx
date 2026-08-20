import {AbsoluteFill, useCurrentFrame} from "remotion";
import {primer} from "./design-system";
import {
  AppHeader,
  InsightSidebar,
  ProgressBar,
  TreeStage,
} from "./segment-tree/components";
import {SEGMENT_TREE_DURATION} from "./segment-tree/model";
import {getTimelineState} from "./segment-tree/timeline";

export const SegmentTree: React.FC = () => {
  const frame = useCurrentFrame();
  const state = getTimelineState(frame);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: primer.color.canvasDefault,
        color: primer.color.foregroundDefault,
        fontFamily: primer.font.sans,
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <AppHeader frame={frame} />
      <TreeStage frame={frame} state={state} />
      <InsightSidebar frame={frame} state={state} />
      <ProgressBar progress={state.progress} complete={state.isComplete} />
    </AbsoluteFill>
  );
};

export {SEGMENT_TREE_DURATION};
