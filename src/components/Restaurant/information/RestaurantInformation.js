import React from 'react'
import Rating from '@material-ui/lab/Rating'
import PhoneIcon from '@material-ui/icons/Phone'
import LocationOnIcon from '@material-ui/icons/LocationOn'



const RestaurantInformation = ({ restaurant }) => {
    const ratingNumber = Math.round(parseFloat(restaurant && restaurant.user_rating.aggregate_rating))
    return (
        <div className="restaurant-details-information">
            <h1> {restaurant && restaurant.name}</h1>

            <div className="rating-details">
                <Rating name="read-only" value={ratingNumber} readOnly />
                <p>({restaurant && restaurant.user_rating.votes} votes)</p>
            </div>

            <p id="address" ><LocationOnIcon /> {restaurant && restaurant.location.address}.</p>

            <div className="working-hours">
                <span>Working Hours</span>
                <p>{restaurant && restaurant.timings}</p>
            </div>

            <div className="cuisines">
                <span>Cuisines</span>
                <p>{restaurant && restaurant.cuisines}.</p>
            </div>

            <p><PhoneIcon /> {restaurant && restaurant.phone_numbers}</p>
            <div className="restaurant-highlights">
                <span>Highlights</span>
                {
                    restaurant && restaurant.highlights.map((highlihgt, i) => {
                        return (
                            <p key={i}>{highlihgt}</p>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default RestaurantInformation