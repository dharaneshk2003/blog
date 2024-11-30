import React, { useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext';
import './Home.css';
import '../../constants/font.css';
import { Link } from 'react-router-dom';


function Navbar({ loginPage = true, registerPage = true,newPost=false }) {
  const API_URL = "http://localhost:5000";

  const { userInfo, setUserInfo } = useContext(UserContext);
  useEffect(() => {
    fetch(`${API_URL}/profile`, {
      credentials: 'include',
    }).then((res) => {
      res.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, [API_URL,setUserInfo]); // Add setUserInfo to the dependency array

  const logout = () => {
    fetch(`${API_URL}/logout`, {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  };



  return (
    <header>
      <p className='logo outfit-bold'>
        <Link to='/'>Blogs</Link>
      </p>
      <nav>
        {userInfo.userName && (
          <>
            <p className='userOpt'>
              <Link to='/new'>
              {!newPost && (
                <img
                src='https://img.icons8.com/?size=50&id=1501&format=png'
                alt='#'
                style={{
                  width: '30px',
                  height: '27px',
                }}
                className='userOpt-icon'
              />
              )} 
              </Link>
            </p>
            <p className='userOpt-user outfit-bold'>
              <Link to='/profile'><img  src={`http://localhost:5000/uploads/profile/${userInfo.profilePicture}`}  alt='#' className='profilePic'/></Link>
            </p>
            <a
              href='/login'
              className='userOpt outfit-bold'
              onClick={logout}
            >
              logout
            </a>
          </>
        )}
        {!userInfo.userName && (
          <>
            {loginPage && (
              <p className='userOpt outfit-bold'>
                <Link to='/login'>Login</Link>
              </p>
            )}
            {registerPage && (
              <p className='userOpt outfit-bold'>
                <Link to='/register'>Register</Link>
              </p>
            )}
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
