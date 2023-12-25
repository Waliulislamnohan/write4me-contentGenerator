import React, { useState } from 'react';
import axios from 'axios';
import styles from '../../styles/Home.module.css';
function SearchPage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [blogPost, setBlogPost] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBlogPost = async () => {
    setIsLoading(true); // Show loading indicator
    setError(null);

    try {
      const response = await axios.post('/api/fetch-transcript', { videoUrl });
      setBlogPost(response.data.blogPost);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to generate blog post');
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="Paste YouTube video URL here"
      />
      <button className={styles.blogBtn} onClick={fetchBlogPost} disabled={isLoading}>
        {isLoading ? 'Generating Blog...' : 'Get a Blog'}
      </button>


      {blogPost && (
        <div className={styles.blogBox}>
          <h3>Generated Blog Post:</h3>
          <div dangerouslySetInnerHTML={{ __html: blogPost }} />
        </div>
      )}
      {error && <p>Error: {error}</p>}


    </div>
  );
}

export default SearchPage;