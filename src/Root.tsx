import "./index.css";
import { Composition } from "remotion";
import {SegmentTree, SEGMENT_TREE_DURATION} from "./SegmentTree";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="SegmentTree"
      component={SegmentTree}
      durationInFrames={SEGMENT_TREE_DURATION}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{}}
    />
  );
};
