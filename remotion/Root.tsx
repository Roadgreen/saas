import { Composition } from "remotion";
import { FoodTracksVideo } from "./FoodTracksVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FoodTracksReel"
        component={FoodTracksVideo}
        durationInFrames={750}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FoodTracksSquare"
        component={FoodTracksVideo}
        durationInFrames={750}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{ square: true }}
      />
    </>
  );
};
