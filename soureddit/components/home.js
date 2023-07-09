import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function App() {
  return (
    <div className="homepage">
      <header className="header">
        <h1>Welcome to My Fancy Homepage</h1>
      </header>
      <section className="hero-section">
        <div className="hero-content">
          <h2>Discover the Magic</h2>
          <p>Experience the wonders of our world.</p>
          <button className="cta-button">Learn More</button>
        </div>
      </section>
      <section className="feature-section">
        <div className="feature-item">
          <h3>Explore</h3>
          <p>Uncover hidden gems and breathtaking landscapes.</p>
        </div>
        <div className="feature-item">
          <h3>Adventure</h3>
          <p>Embark on thrilling expeditions and unforgettable journeys.</p>
        </div>
        <div className="feature-item">
          <h3>Relax</h3>
          <p>Escape to tranquil retreats and find your inner peace.</p>
        </div>
      </section>
      <footer className="footer">
        <p>&copy; 2023 My Fancy Homepage. All rights reserved.</p>
      </footer>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));