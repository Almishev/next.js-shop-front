import styled from "styled-components";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

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
  const [settings, setSettings] = useState({
    heroVideoDesktop: '',
    heroVideoMobile: '',
    heroTitle: 'Natrufenka',
    heroSubtitle: 'ръчно изработени бижута'
  });
  const [currentVideo, setCurrentVideo] = useState('');
  const videoRef = useRef(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    // Set initial video based on screen size
    updateVideoSource();
    
    // Listen for window resize
    const handleResize = () => {
      updateVideoSource();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [settings.heroVideoDesktop, settings.heroVideoMobile]);

  useEffect(() => {
    // Update video source when currentVideo changes
    if (videoRef.current && currentVideo) {
      videoRef.current.load(); // Reload video with new source
    }
  }, [currentVideo]);

  function updateVideoSource() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile && settings.heroVideoMobile) {
      setCurrentVideo(settings.heroVideoMobile);
    } else if (settings.heroVideoDesktop) {
      setCurrentVideo(settings.heroVideoDesktop);
    } else if (settings.heroVideoMobile) {
      // Fallback to mobile video if desktop is not available
      setCurrentVideo(settings.heroVideoMobile);
    }
  }

  function fetchSettings() {
    axios.get('/api/settings').then(result => {
      setSettings(prev => ({
        ...prev,
        heroVideoDesktop: result.data.heroVideoDesktop || '',
        heroVideoMobile: result.data.heroVideoMobile || '',
        heroTitle: result.data.heroTitle || 'Natrufenka',
        heroSubtitle: result.data.heroSubtitle || 'ръчно изработени бижута'
      }));
    }).catch(error => {
      console.log('Error fetching settings:', error);
      // Keep default values if API fails
    });
  }

  // Don't render if no videos are set
  if (!currentVideo) {
    return null;
  }

  return (
    <VideoWrapper>
      <Video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        key={currentVideo} // Force re-render when video changes
      >
        <source src={currentVideo} type="video/mp4" />
      </Video>
      <Overlay>
        <div>
          <h1>{settings.heroTitle}</h1>
          <p>{settings.heroSubtitle}</p>
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


