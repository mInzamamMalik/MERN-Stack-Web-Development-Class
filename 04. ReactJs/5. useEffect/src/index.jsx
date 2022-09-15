import React from 'react';
import ReactDOM from 'react-dom';
import { useState, useEffect } from "react";
import "./index.css";
import axios from 'axios';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faComment, faShare } from '@fortawesome/free-solid-svg-icons'


let App = () => {

  const [posts, setPosts] = useState([]);

  useEffect(() => {

    axios.get(`https://www.reddit.com/r/reactjs.json`)
      .then(res => {
        let responseData = res.data;

        let newPosts = responseData.data.children;

        newPosts = newPosts.map((eachPost) => {
          return eachPost.data
        });

        console.log("newPosts: ", newPosts);

        setPosts(newPosts);
      });

  }, []);

  return (
    <div>
      {
        posts.map(eachPost => (

          <Post
            name={eachPost?.title}
            postText={eachPost?.selftext}
          />

        ))
      }
    </div>
  );
}


let Post = ({ profilePhoto, name, postDate, postText, postImage }) => (
  <div className='post'>
    <div className='postHeader'>
      {
        (profilePhoto) ?
          <img className='profilePhoto' src={profilePhoto} alt="profile" />
          :
          null
      }

      <div>
        <b>{name} </b> <br />
        {moment(postDate).fromNow()}
      </div>
    </div>

    <div className='postText'>
      {postText}
    </div>

    {
      (postImage) ?
        <img className='postImage' src={postImage} alt="post" />
        :
        null
    }

    <hr />
    <div className='postFooter'>
      <div> <FontAwesomeIcon icon={faThumbsUp} /> like </div>
      <div> <FontAwesomeIcon icon={faComment} /> comment</div>
      <div> <FontAwesomeIcon icon={faShare} /> share</div>
    </div>
    <hr />

  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));
