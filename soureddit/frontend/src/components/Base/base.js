import React from 'react';
import './Base.css'; // Import the base.css file

const BaseTemplate = () => {
  return (
    <body className='base-template'>
    <div>
    <div className='header-template'>
      <a className='header-logo-template' href='#'>
        SouReddit
        <span className='header-logo-version-template' >  v.0.0</span>
      </a>
      <form action="">
        <input type='text' placeholder='Makalelerde ara'></input>
      </form>
      <a className="header-login-template" href='#'>Giriş Yap</a>
    </div>
    <div>
      {<h3 className='main-template'>main content</h3>}
    </div>
    <div>
      {<h4 className='footer-template'>footer content</h4>}
    </div>
  </div>
  </body>
    
  );
};

export default BaseTemplate;
