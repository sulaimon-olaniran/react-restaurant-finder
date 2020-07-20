import React, { useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Rating from '@material-ui/lab/Rating'
import Typography from '@material-ui/core/Typography'
import { PropagateLoader } from "react-spinners"
import InfiniteScroll from "react-infinite-scroll-component"
import axios from 'axios'
const API_KEY = "01f7ef03fb111f0c6a709d256c8d35eb"

const RestaurantReviews = ({ reviews, id, setReviews }) => {
    const [start, setStart] = useState(5)
    const fetchMoreReviews = () =>{
        setStart(prev => prev + 5)
        axios.get(`https://developers.zomato.com/api/v2.1/reviews?res_id=${id}&start=${start}&count=100&apikey=${API_KEY}`)
        .then((reviews) => {
          setReviews(prev => prev.concat(reviews.data.user_reviews))
        })
    }

    return (
        <div className="reviews-container">  
            <h1>REVIEWS</h1>
            <InfiniteScroll
                dataLength={reviews.length}
                next={fetchMoreReviews}
                hasMore={start < 10}
                loader={<div className="fetch-more-pre-loader"><PropagateLoader color="salmon" /></div>}
                endMessage={start >= 10 && <p style={{color:"orange"}}>No more Reviews</p>}
            >
            {
                reviews && reviews.map((review, i) => {
                    return (
                        <div className="each-review-container" key={review.review.id}>
                            <div className="user-details">

                                <div className="user-image">
                                    <Avatar src={review && review.review.user.profile_image} alt={review && review.review.user.name} />
                                </div>

                                <div className="user-information">
                                   <span id="name-and-rating"><p>{review.review.user.name}</p><Rating name="read-only" value={review.review.rating} readOnly /></span> 
                                    <p>{review.review.rating_text}</p>
                                    <p>{review.review.review_time_friendly}</p>
                                </div>

                            </div>
                            <div className="user-comment">
                                <Typography component="p" >{review.review.review_text}</Typography>
                            </div>
                        </div>
                    )
                })
            }
            </InfiniteScroll>

        </div>
    )
}


export default RestaurantReviews