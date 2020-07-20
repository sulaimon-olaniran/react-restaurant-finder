import React, { useState, useEffect } from 'react'
import EachRestaurant from './each-restaurant/EachRestaurant'
import axios from 'axios'
import { trackPromise } from 'react-promise-tracker'
import { usePromiseTracker } from "react-promise-tracker"
import { PropagateLoader } from "react-spinners"
import InfiniteScroll from "react-infinite-scroll-component"


const SearchResults = ({ match }) => {
    const { promiseInProgress } = usePromiseTracker()
    const [restaurants, setRestaurants] = useState([])
    const [hasMoreData, setHasMoreData] = useState(true)
    const [start, setStart] = useState(20) //for fetching morre data from api, start point of data to be received
    const [cityId, setCityId] = useState('')
    const API_KEY = "01f7ef03fb111f0c6a709d256c8d35eb"
    const city = match.params.city

    useEffect(() => {
        trackPromise(
            //get's the city id in order to use the id to search for restaurants
            axios.get(`https://developers.zomato.com/api/v2.1/cities?q=${city}&apikey=${API_KEY}`)
                .then(response => {
                    setCityId(response.data.location_suggestions[0].id)
                    const id = response.data.location_suggestions[0].id
                    console.log(response.data.location_suggestions[0].id)

                    //getting the restaurants with the city id gotten from previous api call from and returning results of 20
                    return axios.get(`https://developers.zomato.com/api/v2.1/search?entity_id=${id}&entity_type=city&start=${0}&count=20&sort=rating&order=desc&apikey=${API_KEY}`)
                        .then(res => {
                            const newData = res.data
                            console.log(newData)
                            setRestaurants(prev => prev.concat(newData.restaurants))
                        })
                })
        )

    }, [city, API_KEY])

    //fetchs more data from {start} point
    const fetchMoreData = () => { 
        
        axios.get(`https://developers.zomato.com/api/v2.1/search?entity_id=${cityId}&entity_type=city&start=${start}&count=20&sort=rating&order=desc&apikey=${API_KEY}`)
            .then(res => {
                console.log("fetched extra data")
                console.log(cityId)
                setStart(prev => prev + 20) // increases start point by 20 to fetch more data
                const newData = res.data.restaurants
                if (newData.length < 1) {
                    setHasMoreData(false)
                } else {
                    setRestaurants(prev => prev.concat(newData))
                }
            })
      
    }

    if (promiseInProgress) return <div className="pre-loader"><PropagateLoader color="salmon" /></div> //pre loading while data fetching is in progress
    return (
        <div className="search-results-container">
            <h2>Restaurants in {city}</h2>

            <InfiniteScroll
                dataLength={restaurants.length}
                next={fetchMoreData}
                hasMore={hasMoreData}
                loader={<div className="fetch-more-pre-loader"><PropagateLoader color="salmon" /></div>}
            >
                {
                    restaurants && restaurants.map((restaurant, i) => {
                        return (
                            <EachRestaurant details={restaurant.restaurant} key={restaurant.restaurant.id} />
                        )
                    })
                }
            </InfiniteScroll>
        </div>
    )
}


export default SearchResults