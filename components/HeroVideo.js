import styled from "styled-components";

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 60vh;
  overflow: hidden;
  background: #000;

  @media (max-width: 768px) {
    body.menu-open & {
      display: none;
    }
  }
`;

const Video = styled.video`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  object-fit: cover;
`;

export default function HeroVideo() {
  return (
    <VideoWrapper>
      <Video
        src="/pearls-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
    </VideoWrapper>
  );
}


