import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTranscript('');

    try {
      const videoId = extractVideoId(videoUrl);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      const response = await axios.post('http://localhost:5000/api/transcript', { videoId });
      setTranscript(response.data.transcript.join('\n'));
    } catch (error) {
      setError(error.message);
    }
  };

  const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <div className="App">
      <h1>YouTube Transcript Downloader</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter YouTube video URL"
        />
        <button type="submit">Get Transcript</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {transcript && (
        <div>
          <h2>Transcript:</h2>
          <pre>{transcript}</pre>
        </div>
      )}
    </div>
  );
}

export default App;