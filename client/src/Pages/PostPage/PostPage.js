import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import '../../constants/font.css';
import Navbar from '../Home/Navbar';
import './PostPage.css';
import { UserContext } from '../../UserContext';

function PostPage() {
    const API_URL = "http://localhost:5000";
    const { id } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useContext(UserContext);
    const [post, setPost] = useState(null);
    const [imagePath, setImagePath] = useState('');

    useEffect(() => {
        const getPost = async () => {
            try {
                const response = await fetch(`${API_URL}/post/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                setPost(data);

                // Determine the correct image path
                if (data.image && data.image.startsWith('/uploads/')) {
                    setImagePath(`${API_URL}${data.image}`);
                } else {
                    setImagePath(`${API_URL}/uploads/${data.image}`);
                }
            } catch (error) {
                console.error("Failed to fetch post:", error);
            }
        };
        getPost();
    }, [API_URL, id]);

    if (!post) {
        return <div>Loading...</div>;
    }

    const { title, author, updatedAt, summary, content, _id } = post;

    const handleDelete = async (e) => {
        e.preventDefault();
        const confirmed = window.confirm("Are you sure you want to delete this post?");
        if (confirmed) {
            try {
                const response = await fetch(`${API_URL}/post/${_id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });

                if (!response.ok) {
                    console.error("Failed to delete post.");
                }
                navigate('/');
            } catch (error) {
                console.error("Error deleting post:", error);
            }
        }
    };

    return (
        <>
            <Navbar />
            <div className='postPageDiv'>
                <p className='PostPageTitle outfit-bold'>{title}</p>

                <div className='PostPageCredentials'>
                    {author && updatedAt && (
                        <p className='PostPageCredentialsText outfit'>
                            Published by {author.userName} on {format(new Date(updatedAt), 'MMM d, yyyy HH:mm')}
                        </p>
                    )}
                </div>

                <div className='imageDiv'>
                    <img src={imagePath} alt='Post' className='PostPageImg' />
                </div>

                {userInfo.userName === author.userName && (
                    <div className='PostPageEdit'>
                        <div className='outfit editBtn'>
                            <Link to={`/edit/${_id}`} className='outfit edit'>Edit Post</Link>
                        </div>
                        <form onSubmit={handleDelete} className='deleteBtn'>
                            <button type='submit' className='delete outfit'>Delete Post</button>
                        </form>
                    </div>
                )}

                <div>
                    <p className='PostPageOverView outfit-bold'>Overview :</p>
                    <p className='outfit summaryContent'>{summary}</p>
                </div>

                <div className='outfit fullContent' dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </>
    );
}

export default PostPage;
