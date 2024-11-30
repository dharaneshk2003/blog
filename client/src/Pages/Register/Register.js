import React, { useState } from 'react';
import '../Login/Login.css';
import '../../constants/font.css';
import Navbar from '../Home/Navbar';
import { useNavigate } from 'react-router-dom';

function Register() {
    const API_URL = "http://localhost:5000";
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userName: '',
        password: '',
        profilePicture: null,
    });

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'profilePicture') {
            setFormData((prevData) => ({
                ...prevData,
                profilePicture: files[0],
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const printInfo = async (event) => {
        event.preventDefault();
        const data = new FormData();
        data.append('userName', formData.userName);
        data.append('password', formData.password);
        if (formData.profilePicture) {
            data.append('profilePicture', formData.profilePicture);
        }

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                body: data,
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Registration failed: ${errorData.message}`);
            } else {
                alert("Registration successful!");
                navigate('/login')
            }
        } catch (error) {
            alert(`An error occurred: ${error.message}`);
        }
    };

    return (
        <>
            <Navbar registerPage={false} />
            <form className='auth' onSubmit={printInfo}>
                <h1 className='h1Div outfit-bold'>Registration Form : </h1>

                <div className='userDiv'>
                    <label htmlFor='userName' className='outfit-medium'>Your desired User Name : </label>
                    <input 
                        type='text' 
                        id='userName' 
                        name='userName' 
                        placeholder='your name...' 
                        className='outfit username' 
                        value={formData.userName}
                        onChange={handleInputChange}
                    />
                </div>

                <div className='passDiv'>
                    <label htmlFor='password' className='outfit-medium'>User Password : </label>
                    <input 
                        type='text' 
                        id='password' 
                        name='password' 
                        placeholder='try to remember...' 
                        className='password outfit-medium' 
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </div>

                <div className='profilePicDiv'>
                    <label htmlFor='profilePicture' className='outfit-medium'>Profile Picture: </label>
                    <input 
                        type='file' 
                        id='profilePicture' 
                        name='profilePicture'
                        onChange={handleInputChange}
                    />
                </div>

                <div className='btnDiv'>
                    <button type='submit' className='outfit'>Register</button>
                </div>
            </form>
        </>
    );
}

export default Register;
