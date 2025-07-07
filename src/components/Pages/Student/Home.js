import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
// import learningImage from '../../assets/english-learning.png'; 

const Home = () => {
  return (
    <div className="student-landing">
      <div className="landing-content">
        <div className="text-section">
          <h1>Master English with Confidence</h1>
          <p>
            Join interactive lessons with real-time speech feedback, progress tracking,
            and exercises designed to help you speak fluently.
          </p>
          <div className="landing-buttons">
            <Link to="/login" className="btn primary">Login</Link>
            <Link to="/register" className="btn secondary">Get Started</Link>
          </div>
        </div>
        <div className="image-section">
          {/* <img src={learningImage} alt="Learn English" /> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
