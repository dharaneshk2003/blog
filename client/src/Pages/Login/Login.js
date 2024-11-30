import React,{useState,useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import {UserContext} from '../../UserContext'
import './Login.css';
import '../../constants/font.css'
import Navbar from '../Home/Navbar'
function Login() {
    const API_URL = "http://localhost:5000";

    let navigate = useNavigate();
    const {userInfo,setUserInfo} = useContext(UserContext)
    const [formData, setFormData] = useState({
        userName: '',
        password: '',
    });

    // Function to handle input changes
    const handleInputChange = (e) => {
        const { className, value } = e.target;

        if (className.includes('username')) {
            setFormData((prevData) => ({ ...prevData, userName: value }));
        } else if (className.includes('password')) {
            setFormData((prevData) => ({ ...prevData, password: value }));
        }
    };

    const printInfo = async(event) =>{
        event.preventDefault();
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include',
            });
    
            // Check if the response is not OK (status code 400 or others)
            if (!response.ok) {
                const errorData = await response.json(); // Get the error response data
                alert(`Login failed: ${errorData.message}`);  // Display the error message in an alert
            } else {
               response.json().then(userInfo =>{
                setUserInfo(userInfo)
                navigate('/');
               })
            }
            console.log(userInfo)
        } catch (error) {
            alert(`An error occurred: ${error.message}`);
        }
    }
   
    return (
        <>
            {/* <p className='logo outfit-bold' >Blogs</p> */}
            <Navbar loginPage={false}/>
            <form className='auth'  onSubmit={printInfo}>

            <h1 className='h1Div outfit-bold'>Login Page:</h1>
                <div className='userDiv'>
                    <label htmlFor='userName' className='outfit-medium' >User Name : </label><br/>
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
                    <label htmlFor='password' className='outfit-medium'>Password : </label><br/>
                    <input 
                        type='text' 
                        id='password' 
                        name='password' 
                        placeholder='try to remember...' 
                        className='password outfit' 
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='btnDiv'>
                    <button type='submit' className='outfit'>Login</button>
                </div>
            </form>
        </>
    )
}

export default Login
