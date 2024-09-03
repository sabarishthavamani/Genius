import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="home">
    <div className="home-head">
      <img src="images/home-logo.png" />
        </div>
    <div className="home-content">
      <div className="left-home">
        <div className="high-school">
          <img src="images/High School.png" />
        </div>
      </div>
      <div className="right-home">
        <div className="home-menu">
          <ul>
            <li>
              <Link to={'/login'} >Admin</Link>
            </li>
            <li>
              <Link to={'/teacher-login'}>Teacher</Link>
            </li>
            <li>
              <Link to={'/student-login'}>Student</Link>
            </li>
            <li>
              <Link to={'/parent-login'}>Parent</Link>
            </li>
            <li>
              <Link to={'/driver-login'}>Driver</Link>
            </li>
          </ul>
        </div>
        <div className="welcome">
          <p>Welcome !</p>
        </div>
        <div className="grass">
            <img src="images/grass.png" />
        </div>
        <div className="rain">
            <img src="images/rain.png" />
        </div>
      </div>
    </div>
  </div>  
  )
}

export default Home