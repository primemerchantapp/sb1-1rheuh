import React, { useState } from 'react';
import styled from 'styled-components';
import PodcastForm from './components/PodcastForm';
import PodcastPlayer from './components/PodcastPlayer';
import { generatePodcast } from './api/podcastApi';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-around;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  margin-top: 1rem;
  text-align: center;
`;

const App = () => {
  const [podcastAudio, setPodcastAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGeneratePodcast = async (topic, language, jennyVoiceId, bradVoiceId) => {
    setLoading(true);
    setError(null);
    try {
      const audio = await generatePodcast(topic, language, jennyVoiceId, bradVoiceId);
      setPodcastAudio(audio);
    } catch (error) {
      console.error('Error generating podcast:', error);
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <AppContainer>
      <PodcastForm onSubmit={handleGeneratePodcast} loading={loading} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {podcastAudio && <PodcastPlayer audioSrc={podcastAudio} />}
    </AppContainer>
  );
};

export default App;