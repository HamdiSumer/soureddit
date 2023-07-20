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
      <form action="" >
        <input type='text' placeholder='Makalelerde ara' className='header-search-template'></input>
      </form>
      <a className="header-login-template" href='#'>Giriş Yap</a>
    </div>
    <main className='main-template'>
    <aside className='main-aside-template'>
      <h2 className='main-gundem'>gündem</h2>
      <ul className='main-gundem-topics-ul'>
        <li className='main-gundem-topics-li'><a className='better-links' href='#'>Gündemdekiler</a></li>
        <li className='main-gundem-topics-li'><a className='better-links' href='#'>Gündemdekiler</a></li>
        <li className='main-gundem-topics-li'><a className='better-links' href='#'>Gündemdekiler</a></li>
        <li className='main-gundem-topics-li'><a className='better-links' href='#'>Gündemdekiler</a></li>
        <li className='main-gundem-topics-li'><a className='better-links' href='#'>Gündemdekiler</a></li>
        <li className='main-gundem-topics-li'><a className='better-links' href='#'>Gündemdekiler</a></li>
        <li className='main-gundem-topics-li'><a className='better-links' href='#'>Gündemdekiler</a></li>
        <li className='main-gundem-topics-li'><a className='better-links' href='#'>Gündemdekiler</a></li>
        <li className='main-gundem-topics-li'><a className='better-links' href='#'>Gündemdekiler</a></li>
        <li className='main-gundem-topics-li'><a className='better-links' href='#'>Gündemdekiler</a></li>
        <li className='main-gundem-topics-li'><a className='better-links' href='#'>Gündemdekiler</a></li>
        <li className='main-gundem-topics-li'><a className='better-links' href='#'>Gündemdekiler</a></li>
      </ul>
    </aside>
    <div className='main-content-template'>
      <h2>yaran facebook durum güncellemeleri</h2>
      <p className=''>"türk kadınlarıyla yeteri kadar ilgilenmiyorsunuz beyler. yoksa bir insan durduk yere, patlıcandan reçel, kabaktan tatlı yapmaz."</p>
    </div>
    
    </main>
  </div>
  </body>
    
  );
};

export default BaseTemplate;
