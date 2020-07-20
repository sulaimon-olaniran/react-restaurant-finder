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
    const [viewReviews, setViewReview] = useState(false) //false indicates review won't be rendered to page
    const [viewAbout, setViewAbout] = useState(true)  //true would be rendered to page 
    const [viewMenus, setViewMenus] = useState(false) //false indicates daily menus won't be rendered to page
    const [menuAvailbale, setMenuAvailable] = useState(false) //keep tracks of availabilty of restaurant's daily menu
    const API_KEY = "01f7ef03fb111f0c6a709d256c8d35eb"
    const RES_ID = match.params.id

    // render review to page and unrender daily menu and about
    const toggleViewReview = () => {
        setViewReview(true)
        setViewMenus(false)
        setViewAbout(false)
    }

    const toggleViewMenu = () => {
        setViewMenus(true)
        setViewReview(false)
        setViewAbout(false)
    }

    const toggleViewAbout = () => {
        setViewAbout(true)
        setViewReview(false)
        setViewMenus(false)
    }

    useEffect(() => {
        trackPromise(
            //first api call to get the selected restaurant
            axios.get(`https://developers.zomato.com/api/v2.1/restaurant?res_id=${RES_ID}&apikey=${API_KEY}`)
                .then((restaurant) => {
                    setRestaurant(restaurant.data)
                    const reviewCount = restaurant.data.all_reviews_count
                    //this api call gets reviews of selected restaurant
                    return axios.get(`https://developers.zomato.com/api/v2.1/reviews?res_id=${RES_ID}&start=0&count=${reviewCount}}&apikey=${API_KEY}`)
                        .then((reviews) => {
                            const data = reviews.data.user_reviews
                            setReviews(prev => prev.concat(data))
                            //this api call gets the daily menu of restaurant if available
                            return axios.get(`https://developers.zomato.com/api/v2.1/dailymenu?res_id=${RES_ID}&apikey=${API_KEY}`)
                                .then((dailymenu) => {
                                    setMenuAvailable(true)
                                    setDailyMenu(dailymenu.data)
                                })
                                .catch(err => setMenuAvailable(false)) 
                        })
                })
        )
    }, [RES_ID])

    const res_image = restaurant && restaurant.featured_image === "" ? restaurant_image : restaurant && restaurant.featured_image

    if (promiseInProgress) return <div className="pre-loader"><PropagateLoader color="salmon" /></div>

    return (
        <div className="restaurant-details-container">
            <h1> {restaurant && restaurant.name}</h1>
            <div className="restaurant-details-image">
                <img src={res_image} alt="Restaurant" />
            </div>

            <div className="restaurant-information-container">
                <div className="details-buttons-container">
                    <Button color="secondary" variant="contained" size="small" onClick={toggleViewAbout}>Details</Button>
                    {/* checking if menu is available to avoid error when trying to display menu component */}
                    {menuAvailbale && <Button color="secondary" variant="contained" size="small" onClick={toggleViewMenu}>Daily Menu</Button>}
                    <Button color="secondary" variant="contained" size="small" onClick={toggleViewReview}>Reviews</Button>
                </div>
                {
                    viewAbout && <RestaurantInformation restaurant={restaurant} />
                }

                {
                    //if menu is avialable to restaurant and no current daily menu to display, renders a dummy component
                    viewMenus === true && menuAvailbale === true ?
                        dailyMenu && dailyMenu.daily_menus.length < 1 ? <NoMenuAvailable />
                            : <DailyMenu dailyMenu={dailyMenu} /> : null
                }
                {
                    viewReviews && <RestaurantReviews reviews={reviews} id={RES_ID} setReviews={setReviews} />
                }
            </div>

        </div>
    )
}

export default RestaurantDetails