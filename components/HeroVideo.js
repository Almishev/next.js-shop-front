import styled from "styled-components";
import Link from "next/link";

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

const Overlay = styled.div`
  position: absolute;
  left: 50%;
  bottom: 12%;
  transform: translateX(-50%);
  color: #fff;
  text-shadow: 0 2px 6px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  max-width: 90%;

  h1 {
    font-size: 40px;
    line-height: 1.1;
    margin: 0;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 18px;
    opacity: 0.95;
  }

  @media (max-width: 768px) {
    bottom: 10%;
    h1 { font-size: 24px; }
    p { font-size: 14px; }
  }
`;

const ButtonCTA = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  background: transparent;
  color: #fff;
  border: 1px solid #fff;
  border-radius: 5px;
  font-size: 1rem;
  padding: 10px 22px;
  transition: opacity .2s ease;
  &:hover { opacity: .9; }
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 8px 16px;
  }
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
      <Overlay>
        <div>
          <h1>Natrufenka</h1>
          <p>ръчно изработени бижута</p>
        </div>
        <Link href="/products" passHref legacyBehavior>
          <ButtonCTA>
            Пазарувай сега
          </ButtonCTA>
        </Link>
      </Overlay>
    </VideoWrapper>
  );
}


