import React from 'react'
import Rating from '@material-ui/lab/Rating'
import PhoneIcon from '@material-ui/icons/Phone'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import ScheduleIcon from '@material-ui/icons/Schedule'
import LocalDiningIcon from '@material-ui/icons/LocalDining'



const RestaurantInformation = ({ restaurant }) => {
    const ratingNumber = Math.round(parseFloat(restaurant && restaurant.user_rating.aggregate_rating))
    return (
        <div className="restaurant-details-information">
            <h1>DETAILS</h1>

            <div className="rating-details">
                <h3>Ratings</h3>
                <Rating name="read-only" value={ratingNumber} readOnly />
                <p>({restaurant && restaurant.user_rating.votes} votes)</p>
            </div>

            <div className="restaurant-address">
                <h3>Address &nbsp; <LocationOnIcon fontSize="small" /></h3>
                <p>{restaurant && restaurant.location.address}.</p>
            </div>

            <div className="phone-number">
                   <h3>Telephone &nbsp; <PhoneIcon fontSize="small" /></h3>
                   <p> {restaurant && restaurant.phone_numbers}</p>
            </div>


            <div className="working-hours">
                <h3>Working Hours &nbsp; <ScheduleIcon fontSize="small" /></h3>
                <p>{restaurant && restaurant.timings}</p>
            </div>

            <div className="cuisines">
                <h3>Cuisines &nbsp; <LocalDiningIcon fontSize="small" /></h3>
                <p>{restaurant && restaurant.cuisines}.</p>
            </div>

            
            <div className="restaurant-highlights">
                <h3>Highlights</h3>
                {
                    restaurant && restaurant.highlights.map((highlihgt, i) => {
                        return (
                            <p key={i}>{highlihgt}</p>
                        )
                    })
                }
            </div>

            <div className="pricing">

            </div>

        </div>
    )
}

export default RestaurantInformation