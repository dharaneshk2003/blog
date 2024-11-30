import React, { useEffect,useState } from 'react'
import './Home.css';
import Navbar from './Navbar'
import Post from './Posts/Post';
function Home() {
  const API_URL = "http://localhost:5000";
  let [dataList,setDataList] = useState([])
  useEffect(() => {
    const getResponse = async () => {
      try {
        let response = await fetch(`${API_URL}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        let data = await response.json();
        setDataList(data); // Directly set the fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getResponse();
  }, [API_URL]); // No need to include `dataList` in the dependency array

  console.log(dataList);


  return (
    <div>
      <Navbar/>
      <Post data={dataList}/>
    </div>
  )
}

export default Home
