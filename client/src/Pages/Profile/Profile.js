import React, { useEffect, useContext, useState } from 'react';
import { CgProfile } from "react-icons/cg";
import '../../constants/font.css';
import { UserContext } from '../../UserContext';
import Navbar from '../Home/Navbar';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
function Profile() {
  const API_URL = "http://localhost:5000";
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/profile`, {
      credentials: 'include',
    }).then((res) => {
      res.json().then((userInfo) => {
        console.log(`data ==>${userInfo}`);
        setUserInfo(userInfo);
      });
    });
  }, [API_URL,userInfo,setUserInfo]);

  const handleEditPicture = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('profilePicture', selectedFile);

    fetch(`${API_URL}/profile/picture`, {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    }).then((res) => {
      res.json().then((updatedUser) => {
        setUserInfo(updatedUser);
      });
    });
  };

  const handleDeleteAccount = () => {
    fetch(`${API_URL}/profile/account`, {
      method: 'DELETE',
      credentials: 'include',
    }).then((res) => {
      if (res.ok) {
        // Optionally handle successful deletion, e.g., log out the user and redirect
        // Example:
        // window.location.href = '/login'; // Redirect to login page
        setUserInfo(null);
        navigate('/login');
        // Clear user info
      } else {
        res.json().then((error) => {
          console.error('Failed to delete account:', error);
        });
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className='profDiv'>
        <p className='outfit-bold profTitle'>Profile</p>
        <div className='profile-container'>
          <div className='profileInfo'>
            {userInfo.profilePicture ? (
              <img
                src={`${API_URL}/uploads/profile/${userInfo.profilePicture}`}
                alt="Profile"
                className='profile-picture'
              />
            ) : (
              <CgProfile className='profile-picture' />
            )}
          <p className='outfit-medium greeting'>Hey There..!&nbsp; {userInfo.userName}</p>
          </div>
          <label htmlFor="file-input" class="file-upload-label">
              <span class="file-upload-button outfit-bold">Choose File</span>
              <input
                type="file"
                id="file-input"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="outfit-bold"
              />
            </label>
          <div className="profile-actions">
            <button onClick={handleEditPicture} className="edit-button outfit-bold">Edit Picture</button>
            <button onClick={handleDeleteAccount} className="delete-button outfit-bold">Delete Account</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
