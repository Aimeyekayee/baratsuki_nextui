import { Button } from "@nextui-org/button";
import Reac, { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { TiArrowSortedUp } from "react-icons/ti";
const VideoPlayer = () => {
  const playerRef = useRef<ReactPlayer>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const handleSeek = (seconds: number) => {
    if (isReady && playerRef.current) {
      playerRef.current.seekTo(seconds, "seconds");
    }
  };
  const handleReady = () => {
    setIsReady(true);
  };
  return (
    <div>
      <ReactPlayer
        ref={playerRef}
        url="/IMG_1056.MOV" // Assuming myvideo.mp4 is in the "public" folder
        controls
        width="100%"
        height="30rem"
        onReady={handleReady}
      />
      <div className="flex justify-center items-center pt-4">
        <Button onClick={() => handleSeek(5)} variant="flat" color="warning">
          <TiArrowSortedUp />
          Alarm Code 49
        </Button>
        <Button onClick={() => handleSeek(6)} variant="flat" color="warning" style={{marginLeft:"12rem"}}>
          <TiArrowSortedUp />
          Alarm Code 32
        </Button>
      </div>
    </div>
  );
};
export default VideoPlayer;
