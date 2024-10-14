import axios from 'axios';

const TOGETHER_AI_API_KEY = 'ef59ffaa887ba258b4945004a613beb671bf6bf4a3e3a18e2966e3064694581a';
const ELEVEN_LABS_API_KEY = 'sk_3b1cb33bc9cf70327e56f917d8f8adc13d1dba0184c04aa6';

export const getElevenLabsVoices = async () => {
  try {
    const response = await axios.get('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': ELEVEN_LABS_API_KEY,
      },
    });
    return response.data.voices;
  } catch (error) {
    console.error('Error fetching Eleven Labs voices:', error);
    throw new Error('Failed to fetch voice options. Please check your internet connection and try again.');
  }
};

export const generatePodcast = async (topic, language, jennyVoiceId, bradVoiceId) => {
  try {
    const scriptResponse = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: 'meta-llama/Llama-3.2-3B-Instruct-Turbo',
        messages: [
          {
            role: 'user',
            content: `Create a lively script for a podcast topic about ${topic} with 2 hosts named Jenny and Brad in ${language}! Make it lively and human natural way of delivering a podcast`,
          },
        ],
        max_tokens: 8192,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
        stop: ['<|eot_id|>', '<|eom_id|>'],
      },
      {
        headers: {
          'Authorization': `Bearer ${TOGETHER_AI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const script = scriptResponse.data.choices[0].message.content;

    // Split the script into Jenny and Brad parts
    const parts = script.split(/Jenny:|Brad:/);
    const jennyScript = parts.filter((_, i) => i % 2 === 1).join(' ');
    const bradScript = parts.filter((_, i) => i % 2 === 0).join(' ');

    // Generate audio for Jenny
    const jennyAudio = await generateAudio(jennyScript, jennyVoiceId);

    // Generate audio for Brad
    const bradAudio = await generateAudio(bradScript, bradVoiceId);

    // Combine the audio files
    const combinedAudio = await combineAudioFiles(jennyAudio, bradAudio);

    return URL.createObjectURL(combinedAudio);
  } catch (error) {
    console.error('Error generating podcast:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    if (error.message === 'Network Error') {
      throw new Error('Network error occurred. Please check your internet connection and try again.');
    }
    throw new Error('Failed to generate podcast. Please try again later.');
  }
};

const generateAudio = async (text, voiceId) => {
  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      },
      {
        headers: {
          'xi-api-key': ELEVEN_LABS_API_KEY,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    return new Blob([response.data], { type: 'audio/mpeg' });
  } catch (error) {
    console.error('Error generating audio:', error);
    throw new Error('Failed to generate audio. Please try again.');
  }
};

const combineAudioFiles = async (audio1, audio2) => {
  // This is a placeholder function. In a real-world scenario, you'd need to use
  // a library like Web Audio API to combine the audio files on the client-side.
  // For simplicity, we're just returning the first audio file.
  return audio1;
};