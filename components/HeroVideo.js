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
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/videos/hero-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
        <source src="/videos/hero-descctop.mp4" type="video/mp4" media="(min-width: 769px)" />
      </Video>
    </VideoWrapper>
  );
}


