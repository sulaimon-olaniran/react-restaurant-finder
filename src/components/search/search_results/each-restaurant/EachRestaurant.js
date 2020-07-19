import React from 'react'
import Rating from '@material-ui/lab/Rating'
import image_not_available from './assets/image_not_available.png'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'

const EachRestaurant = ({ details }) => {
    const restaurantImage = details.featured_image === "" ? image_not_available : details.featured_image //checking if restaurant has cover image or just display a dummy
    const ratingNumber = Math.round(parseFloat(details.user_rating.aggregate_rating)) //converting rate from string to number and rounding it up

    return (
        <div className="each-restaurant-container">

            <div className="restaurant-image">
                <img src={restaurantImage} alt="Restaurant-Thumb" />
            </div>

            <div className="restaurant-information">
                <p>{details.name}</p>

                <div className="voting-details">
                    <Rating name="read-only" value={ratingNumber} readOnly />
                    <p>({details.user_rating.votes}) votes</p>
                </div>
                    <p>{details.all_reviews_count} Reviews</p>
            </div>

            <Button variant="contained" color="primary" size="small">
                <Link to={`/search/restaurant/${details.id}`} >Details</Link>
            </Button>

        </div>
    )
}


export default EachRestaurant