import React, { useEffect, useState } from 'react'
import '../../styles/VideoGrid.css';

export default function Videopage() {
    const[videos,setVideos]=useState([])

    useEffect(()=>{
        fetch('http://localhost:3001/videos')
        .then(res => res.json())
        .then(data => setVideos(data))
        .catch(err =>console.error(err));
    },[]);
  return (
    <div className='video-grid'>
      {videos.map(video => (
        <div key={video.id} className="video-card">
          <h3>{video.name}</h3>
          <div className="video-wrapper">
            <iframe
              src={video.video_url.replace("watch?v=", "embed/")}
              
              allowFullScreen
              title={video.name}
            ></iframe>
          </div>
        </div>
      ))}
    </div>
  )
}
