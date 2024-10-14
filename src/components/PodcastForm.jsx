import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getElevenLabsVoices } from '../api/podcastApi';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  border: 1px solid var(--accent-color-1);
  background-color: rgba(0, 255, 0, 0.1);
  color: var(--text-color);
`;

const Select = styled.select`
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  border: 1px solid var(--accent-color-2);
  background-color: rgba(0, 255, 255, 0.1);
  color: var(--text-color);
`;

const Button = styled.button`
  padding: 0.5rem;
  border-radius: 4px;
  border: none;
  background-color: var(--accent-color-1);
  color: var(--background-color);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--accent-color-2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PodcastForm = ({ onSubmit, loading }) => {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('english');
  const [jennyVoice, setJennyVoice] = useState('');
  const [bradVoice, setBradVoice] = useState('');
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const fetchedVoices = await getElevenLabsVoices();
        setVoices(fetchedVoices);
        // Set default voices
        const defaultFemaleVoice = fetchedVoices.find(v => v.labels.gender === 'female');
        const defaultMaleVoice = fetchedVoices.find(v => v.labels.gender === 'male');
        if (defaultFemaleVoice) setJennyVoice(defaultFemaleVoice.voice_id);
        if (defaultMaleVoice) setBradVoice(defaultMaleVoice.voice_id);
      } catch (error) {
        console.error('Error fetching voices:', error);
      }
    };
    fetchVoices();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(topic, language, jennyVoice, bradVoice);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter podcast topic"
        required
      />
      <Select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        required
      >
        <option value="english">English</option>
        <option value="tagalog">Tagalog</option>
        <option value="french">French</option>
      </Select>
      <Select
        value={jennyVoice}
        onChange={(e) => setJennyVoice(e.target.value)}
        required
      >
        <option value="">Select Jenny's Voice</option>
        {voices
          .filter(voice => voice.labels.gender === 'female')
          .map(voice => (
            <option key={voice.voice_id} value={voice.voice_id}>
              {voice.name}
            </option>
          ))
        }
      </Select>
      <Select
        value={bradVoice}
        onChange={(e) => setBradVoice(e.target.value)}
        required
      >
        <option value="">Select Brad's Voice</option>
        {voices
          .filter(voice => voice.labels.gender === 'male')
          .map(voice => (
            <option key={voice.voice_id} value={voice.voice_id}>
              {voice.name}
            </option>
          ))
        }
      </Select>
      <Button type="submit" disabled={loading}>
        {loading ? 'Generating...' : 'Generate Podcast'}
      </Button>
    </Form>
  );
};

export default PodcastForm;