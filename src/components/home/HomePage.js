import React from 'react'
import welcome_image_one from './assets/welcome_image_one.jpg'



const HomePage = () => {
    return(
        <div className="home-page-container">
              <div className="home-page-welcome-note">
                  <h1>YOU'RE WELCOME</h1>
                  <h2>OS-RESTAURANT-FINDER</h2>
                  <p>New to the city? getting food shouldn't be a problem</p>
                  <p>We're here to help you locate the best restaurants nearby you easily</p>
              </div>
              
              <div className="home-page-welcome-image">
                    <img src={welcome_image_one} alt="OS-RESTAURANT-FINDER" />
              </div>
        </div>
    )
}


export default HomePage