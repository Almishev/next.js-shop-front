import styled from "styled-components";

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  @media (max-width: 768px) {
    body.menu-open & {
      display: none;
    }
  }
`;

const Video = styled.video`
  position: static;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  display: block;
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


