import axios from 'axios';
import { YoutubeTranscript } from 'youtube-transcript';

export default async function handler(req, res) {
  try {
    const { videoUrl } = req.body;
    const videoId = videoUrl.split('=')[1];

    // Fetch the transcript using the YoutubeTranscript library
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    // Extract text from the transcript, potentially handling special characters or formatting
    const transcriptText = transcript.map(item => item.text.trim()).join('\n');

    // Prepare request data for RapidAPI, adjusting structure as needed
    const rapidAPIRequestData = {
      topic: transcriptText, // Assuming API takes "topic" as input
    };

    const encodedParams = new URLSearchParams(rapidAPIRequestData);

    const options = {
      method: 'POST',
      url: 'https://ai-content-writer.p.rapidapi.com/data',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY, // Access API key securely
        'X-RapidAPI-Host': 'ai-content-writer.p.rapidapi.com',
      },
      data: encodedParams,
    };

    const rapidAPIResponse = await axios.request(options);
    const generatedBlogPost = rapidAPIResponse.data;

    res.status(200).json({ blogPost: generatedBlogPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate blog post' });
  }
}