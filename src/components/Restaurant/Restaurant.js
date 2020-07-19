import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { trackPromise } from 'react-promise-tracker'
import { usePromiseTracker } from "react-promise-tracker"
import { PropagateLoader } from "react-spinners"
import { DailyMenu, NoMenuAvailable } from './menu/DailyMenu'
import RestaurantInformation from './information/RestaurantInformation'
import RestaurantReviews from './reviews/RestaurantReviews'
import Button from '@material-ui/core/Button'
import restaurant_image from './assets/restaurant_image.jpg'


const RestaurantDetails = ({ match }) => {
    const { promiseInProgress } = usePromiseTracker() //keeps track of api call
    const [restaurant, setRestaurant] = useState()
    const [reviews, setReviews] = useState([])
    const [dailyMenu, setDailyMenu] = useState()
    const [viewReviews, setViewReview] = useState(false)
    const [viewMenus, setViewMenus] = useState(true)
    const [menuAvailbale, setMenuAvailable ] = useState(false)
    const API_KEY = "01f7ef03fb111f0c6a709d256c8d35eb"
    const RES_ID = match.params.id

    const toggleViewReview = () => {
        setViewReview(true)
        setViewMenus(false)
    }

    const toggleViewMenu = () => {
        setViewMenus(true)
        setViewReview(false)
    }

    useEffect(() => {
        trackPromise(
            axios.get(`https://developers.zomato.com/api/v2.1/restaurant?res_id=${RES_ID}&apikey=${API_KEY}`)
                .then((restaurant) => {
                    setRestaurant(restaurant.data)
                    const reviewCount = restaurant.data.all_reviews_count

                    return axios.get(`https://developers.zomato.com/api/v2.1/reviews?res_id=${RES_ID}&start=0&count=${reviewCount}}&apikey=${API_KEY}`)
                        .then((reviews) => {
                            const data = reviews.data.user_reviews
                            setReviews(prev => prev.concat(data))

                            return axios.get(`https://developers.zomato.com/api/v2.1/dailymenu?res_id=${RES_ID}&apikey=${API_KEY}`)
                                .then((dailymenu) => {
                                    setMenuAvailable(true)
                                    setDailyMenu(dailymenu.data)
                                })
                                .catch( err => setMenuAvailable(false))
                        })
                })
        )
    }, [RES_ID])
    
    const res_image = restaurant  && restaurant.featured_image === "" ? restaurant_image : restaurant && restaurant.featured_image

    if (promiseInProgress) return <div className="pre-loader"><PropagateLoader color="salmon" /></div>
    return (
        <div className="restaurant-details-container">
            <div className="restaurant-details-image">
                <img src={res_image} alt="Not-Available" />
            </div>
            <RestaurantInformation restaurant={restaurant} />

            <div className="details-buttons-container">
               { menuAvailbale && <Button color="secondary" variant="contained" size="small" onClick={toggleViewMenu}>Daily Menu</Button>}
                <Button color="secondary" variant="contained" size="small" onClick={toggleViewReview}>Reviews</Button>
            </div>

            {
                viewMenus === true && menuAvailbale === true?
                 dailyMenu && dailyMenu.daily_menus.length < 1 ? <NoMenuAvailable />
                : <DailyMenu dailyMenu={dailyMenu} /> :null
            }
            {
                viewReviews && <RestaurantReviews reviews={reviews} id={RES_ID} setReviews={setReviews} />
            }
        </div>
    )
}

export default RestaurantDetails