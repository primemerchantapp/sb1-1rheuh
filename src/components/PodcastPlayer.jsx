import React, { useRef, useState } from 'react';
import styled from 'styled-components';

const PlayerContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin-top: 2rem;
`;

const AudioPlayer = styled.audio`
  width: 100%;
`;

const PodcastPlayer = ({ audioSrc }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <PlayerContainer>
      <AudioPlayer
        ref={audioRef}
        src={audioSrc}
        controls
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </PlayerContainer>
  );
};

export default PodcastPlayer;