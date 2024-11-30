import React, { useState, forwardRef } from 'react';
import Navbar from '../Home/Navbar';
import './NewPost.css';
import '../../constants/font.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';

const ReactQuillWithRef = forwardRef((props, ref) => (
    <ReactQuill {...props} forwardedRef={ref} />
));

function NewPost() {
    const API_URL = "http://localhost:5000";

    const navigation = useNavigate();
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

    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        image: null,
        content: ''
    });

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('summary', formData.summary);
        data.append('image', formData.image);
        data.append('content', formData.content);

        try {
            const response = await fetch(`${API_URL}/post`, {
                method: 'POST',
                body: data,
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            navigation('/');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <Navbar newPost={true} />
            <form onSubmit={handleSubmit} encType="multipart/form-data" className='NewPostDiv'>
            <p className='outfit-bold heading'>NewPost Creation Page:</p>
                <div className='postDiv'>
                    <label htmlFor="outfit-bold" className='outfit-bold'>Title:</label><br />
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
                        required
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
                    <button type='submit' className='outfit-bold btnDivBtn'>Add Post</button>
                </div>
            </form>

        </div>
    );
}

export default NewPost;
