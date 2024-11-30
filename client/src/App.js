import React from 'react';
import Home from './Pages/Home/Home'
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import { Route,Routes } from 'react-router-dom';
import {UserContextProvider} from './UserContext'
import NewPost from './Pages/NewPost/NewPost';
import Profile from './Pages/Profile/Profile';
import PostPage from './Pages/PostPage/PostPage';
import EditPost from './Pages/EditPost/EditPost';
function App() {
  return (
    <UserContextProvider>
    <main>
    <Routes>
      <Route path="/" element={
         <Home/>
      }/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/new' element={<NewPost/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/post/:id' element={<PostPage/>}/>
      <Route path='/edit/:id' element={<EditPost/>}/>
    </Routes>
    </main>
    </UserContextProvider>
  );
}

export default App;
