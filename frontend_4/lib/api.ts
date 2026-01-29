const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const api = {
  // Upload YouTube song
  async uploadYouTube(url: string) {
    try {
      console.log('Sending request to:', `${API_BASE_URL}/add-youtube`);
      console.log('Payload:', { youtube_url: url });
      
      const controller = new AbortController();
      
      const response = await fetch(`${API_BASE_URL}/add-youtube`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ youtube_url: url }),
        signal: controller.signal,
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        let errorData: any;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { detail: `HTTP ${response.status}: ${response.statusText}` };
        }
        console.error('Error response:', errorData);
        throw new Error(errorData.detail || errorData.message || 'Failed to upload song');
      }
      
      const data = await response.json();
      console.log('Success response:', data);
      return data;
    } catch (error: any) {
      console.error('Upload error:', error);
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please check if the backend server is running.');
      }
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:8000');
      }
      throw error;
    }
  },

  // Recognize song from audio file
  async recognizeSong(audioFile: File) {
    const formData = new FormData();
    formData.append(
      'audio_file',
      audioFile,
      audioFile.name?.endsWith('.wav') ? audioFile.name : 'recording.wav'
    );

    const response = await fetch(`${API_BASE_URL}/recognize-song`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to recognize song');
    }
    
    return await response.json();
  },
};
