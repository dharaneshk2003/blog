import React, { useState, forwardRef, useEffect } from 'react';
import Navbar from '../Home/Navbar';
import '../NewPost/NewPost.css';
import '../../constants/font.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';

const ReactQuillWithRef = forwardRef((props, ref) => (
    <ReactQuill {...props} ref={ref} />
));

function EditPost() {
    const API_URL = "http://localhost:5000";

    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        image: null,
        content: ''
    });
    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'header': [2, 3, false] }],
            ['link', 'image'],
            [{ 'align': [] }],
            ['clean']
        ]
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`${API_URL}/post/${id}`);
                const postInfo = await response.json();
                setFormData({
                    title: postInfo.title,
                    summary: postInfo.summary,
                    image: null, // Image is not set because it's a file input
                    content: postInfo.content,
                    id: postInfo.id
                });
                
            } catch (error) {
                console.error('Failed to fetch post data:', error);
            }
        };
        fetchPost();
    }, [API_URL,id]);

    const handleInputChange = (e) => {
        const { className, value, files } = e.target;
        if (className.includes('title')) {
            setFormData((prev) => ({ ...prev, title: value }));
        } else if (className.includes('summary')) {
            setFormData((prev) => ({ ...prev, summary: value }));
        } else if (className.includes('image')) {
            setFormData((prev) => ({ ...prev, image: files[0] }));
        }
    };

    const handleContentChange = (content) => {
        setFormData((prev) => ({ ...prev, content }));
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('summary', formData.summary);
        if (formData.image) {
            data.append('image', formData.image); // Only append the image if a new one was uploaded
        }
        data.append('content', formData.content);

        try {
            const response = await fetch(`${API_URL}/post/${id}`, {
                method: 'PUT',
                body: data,
                credentials : 'include'
            });
            if (response.ok) {
                navigate(`/post/${id}`);
            }
            else{
                const errorData = await response.json();
                console.error('Failed to update post:', errorData.message);
            }
        } catch (error) {
            console.error('Failed to update post:', error);
        }
    };

    return (
        <div>
            <Navbar newPost={true} />
            <form onSubmit={handleEditSubmit} encType="multipart/form-data" className='NewPostDiv'>
            <p className='outfit-bold heading'>Post Editing Page:</p>
                <div className='postDiv'>
                    <label htmlFor="title" className='outfit-bold'>Title:</label><br />
                    <input
                        type='text'
                        id="title"
                        name="title"
                        required
                        placeholder='title..'
                        className='outfit title'
                        value={formData.title}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='postDiv'>
                    <label htmlFor='summary' className='outfit-bold'>Summary:</label><br />
                    <textarea
                        id='summary'
                        name='summary'
                        required
                        rows={7}
                        cols={40}
                        placeholder='summary...'
                        className='outfit summary'
                        style={{ marginTop: '1.5%' }}
                        value={formData.summary}
                        onChange={handleInputChange}
                    ></textarea>
                </div>
                <div className='postDiv'>
                    <label htmlFor='image' className='outfit-bold'>Image:</label><br />
                    <input
                        type='file'
                        id='image'
                        name='image'
                        className='outfit image'
                        onChange={handleInputChange}
                    />
                   
                </div>
                <div className='postDiv'>
                    <label htmlFor='description' className='outfit-bold'>Description:</label><br />
                    <ReactQuillWithRef
                        value={formData.content}
                        onChange={handleContentChange}
                        modules={modules}
                        className='outfit textInp'
                    />
                </div>
                <div className='btnDiv'>
                    <button type='submit' className='outfit-bold btnDivBtn'>Edit Post</button>
                </div>
            </form>
        </div>
    );
}

export default EditPost;
