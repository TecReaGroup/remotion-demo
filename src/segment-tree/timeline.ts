import {
  INTERNAL_BUILD_START,
  INTERNAL_NODES,
  QUERY_START,
  QUERY_STEPS,
  SEGMENT_TREE_DURATION,
  timing,
} from "./model";

export const getTimelineState = (frame: number) => {
  const isBuilding = frame < QUERY_START;
  const isQuerying = frame >= QUERY_START && frame < SEGMENT_TREE_DURATION - timing.outro;
  const isComplete = frame >= SEGMENT_TREE_DURATION - timing.outro;
  const queryFrame = Math.max(0, frame - QUERY_START);
  const rawQueryIndex = Math.floor(queryFrame / timing.queryStep);
  const queryIndex = Math.min(QUERY_STEPS.length - 1, rawQueryIndex);
  const queryLocalFrame = queryFrame - queryIndex * timing.queryStep;
  const queryStep = QUERY_STEPS[queryIndex];
  const completedStepCount = isComplete
    ? QUERY_STEPS.length
    : queryIndex + (queryLocalFrame > timing.queryStep / 2 ? 1 : 0);
  const completedSteps = QUERY_STEPS.slice(0, completedStepCount);
  const currentBuildIndex = Math.min(
    INTERNAL_NODES.length - 1,
    Math.max(0, Math.floor((frame - INTERNAL_BUILD_START) / timing.buildStep)),
  );
  const currentBuildNode = INTERNAL_NODES[currentBuildIndex];
  const phaseLabel = isComplete ? "查询完成" : isQuerying ? "区间查询" : "构建线段树";
  const activeCodeLine = isBuilding
    ? frame < timing.intro
      ? 1
      : frame < INTERNAL_BUILD_START
        ? 2
        : frame % timing.buildStep < timing.buildStep / 2
          ? 3
          : 4
    : queryStep.decision === "skip"
      ? 2
      : queryStep.decision === "take"
        ? 3
        : 4;

  return {
    isBuilding,
    isQuerying,
    isComplete,
    queryStep,
    currentBuildNode,
    phaseLabel,
    activeCodeLine,
    visitedIds: new Set(
      QUERY_STEPS.slice(0, isComplete ? QUERY_STEPS.length : queryIndex).map(
        (step) => step.nodeId,
      ),
    ),
    takenIds: new Set(
      completedSteps
        .filter((step) => step.decision === "take")
        .map((step) => step.nodeId),
    ),
    skippedIds: new Set(
      completedSteps
        .filter((step) => step.decision === "skip")
        .map((step) => step.nodeId),
    ),
    accumulated: completedSteps.reduce((sum, step) => sum + (step.add ?? 0), 0),
    progress: Math.min(1, Math.max(0, frame / (SEGMENT_TREE_DURATION - 1))),
  };
};

export type TimelineState = ReturnType<typeof getTimelineState>;
