import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import '../Home.css';
import '../../../constants/font.css';
import { Link } from 'react-router-dom';

function Post({ data = [] }) {
  const API_URL = "http://localhost:5000";
  const wordLimit = 45;

  const [imagePaths, setImagePaths] = useState([]);

  useEffect(() => {
    const paths = data.map((post) => {
      // Check if the post's image path starts with '/uploads/' or not
      if (post.image && post.image.startsWith('/uploads/')) {
        return `${API_URL}${post.image}`;
      } else {
        return `${API_URL}/uploads/${post.image}`;
      }
    });
    setImagePaths(paths);
  }, [data, API_URL]);

  const truncateSummary = (text, wordLimit) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) {
      return text;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  return (
    <>
      {data.map((post, index) => (
        <div className="postDiv" key={index}>
          <Link to={`/post/${post._id}`}>
            <div className='imageDiv'>
              <img src={imagePaths[index]} alt='Post' className='PostPageImg' />
            </div>
          </Link>
          <div className="textDiv">
            <Link to={`/post/${post._id}`} style={{
              textDecoration: 'none',
              color: 'black',
            }}>
              <p className='titleDiv outfit-bold'>{post.title}</p>
            </Link>
            <p className='infoDiv outfit'>
              <a className='authorDiv' href='/'>{post.userName}</a>
              <time className='timeDiv'>
                {format(new Date(post.createdAt), 'MMM d, yyyy HH:mm')}
              </time>
            </p>
            <p className='summaryDiv outfit'>
              {truncateSummary(post.summary, wordLimit)}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}

export default Post;
