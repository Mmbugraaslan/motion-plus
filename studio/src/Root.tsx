import React from "react";
import { Composition } from "remotion";
import { PromoReel } from "./PromoReel";
import { TalkingReel, type TalkingEdit } from "./TalkingReel";
import type { Brief } from "./types";
import demoBrief from "../briefs/demo-15.json";

const FPS = 30;

const emptyEdit: TalkingEdit = { footage: "", fps: FPS, total: FPS, segments: [], captionGroups: [] };

export const Root: React.FC = () => (
  <>
    <Composition
      id="PromoReel"
      component={PromoReel}
      fps={FPS}
      width={1080}
      height={1920}
      durationInFrames={15 * FPS}
      defaultProps={demoBrief as Brief}
      calculateMetadata={({ props }) => ({ durationInFrames: Math.round((props.duration || 15) * FPS) })}
    />
    <Composition
      id="TalkingReel"
      component={TalkingReel}
      fps={FPS}
      width={1080}
      height={1920}
      durationInFrames={FPS}
      defaultProps={emptyEdit}
      calculateMetadata={({ props }) => ({ durationInFrames: Math.max(1, props.total) })}
    />
  </>
);
