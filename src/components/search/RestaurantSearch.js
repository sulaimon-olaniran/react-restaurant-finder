import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import { makeStyles } from '@material-ui/core/styles'
import { country_states } from './CountryStates'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { trackPromise } from 'react-promise-tracker'
import { usePromiseTracker } from "react-promise-tracker"
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 300,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}))

const RestaurantSearch = () => {
    //please note, state here actual means the states of a country and not react-states

    const { promiseInProgress } = usePromiseTracker() //keeps track of api call
    const [country, setCountry] = useState('') //handles value of the country input value
    const [availableStates, setAvailableStates] = useState([]) //takes in state's area of selected country
    const [state, setState] = useState('') //handles value of the state input value
    const [city, setCity] = useState('') //handles value of the city input value
    const [cities, setCities] = useState([]) //stores available cities data gotten from the api
    const [fetchedCities, setFetchedCities ] = useState(false) //to check if fetching of cities from api was sucessful

    const handleCountryChange = (event) => {
        setCountry(event.target.value)
        window.sessionStorage.setItem("country", JSON.stringify(event.target.value)) //storing of selected country to local storage
        window.sessionStorage.removeItem('state') //remove previously saved state from local storage when country is changed
        window.sessionStorage.removeItem('city')  //remove previously saved city from local storage when country is changed
    }

    const handleCityChange = (event) => {
        setCity(event.target.value)
        window.sessionStorage.setItem("city", JSON.stringify(event.target.value))
    }

    const handleStatesChange = (event) => {
        setState(event.target.value)
        window.sessionStorage.setItem("state", JSON.stringify(event.target.value))
        window.sessionStorage.removeItem('city') //remove previously saved city from local storage when state is changed
    }

    const stateArray = availableStates.length //keeps track of state array's length
    const cityArray = cities.length //keeps track of city array's length

    useEffect(() => {
        const storedCountry = JSON.parse(window.sessionStorage.getItem('country')) 
        const storedState = JSON.parse(window.sessionStorage.getItem('state'))
        const storedCity = JSON.parse(window.sessionStorage.getItem("city"))

        setCountry(storedCountry !== null ? storedCountry : "") //filling input with users previous selected country 
        stateArray > 0 && setState(storedState !== null ? storedState : "") //check if array is filled before placing data from local storage into state data to avoid warnings
        cityArray > 0 && setCity(storedCity !== null ? storedCity : "")

        //mapping through country objects with the country input value
        for (const [key, value] of Object.entries(country_states)) {
            if (country === key) {
                setAvailableStates(value) //storing the matched country input with the key in country_states object eg USA = USA
            }
        }

        if (state !== '') {
            const API_KEY = "01f7ef03fb111f0c6a709d256c8d35eb"
            setFetchedCities(false)
            trackPromise( //tracking the promise
            axios.get(`https://developers.zomato.com/api/v2.1/cities?q=${state}&apikey=${API_KEY}`) //gets the supported cities in zomato from selected state
                .then(response => {
                    const data = response.data.location_suggestions
                    setCities(data)
                    setFetchedCities(true)
                })
                .catch(error => {
                    console.log(error)
                })
            )
        }


    }, [state, country, stateArray, cityArray])

    //let disableCity 

    const classes = useStyles()
    const disableStates = country === '' ? true : false //disabling states if no country has been chosen
    const disableCity = state === ''  || cities.length < 1 ? true : false //disabling city if no state has been chosen or no city found
    const disableButton = city === ''  ? true : false //disabling submit button if no city chosesn
    return (
        <div className="restaurant-search-container" >

            <div className="restaurant-search-form">

                <FormControl variant="outlined" className={classes.formControl} color="primary" >
                    <InputLabel id="demo-simple-select-outlined-label">Country</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={country}
                        onChange={handleCountryChange}
                        label="Country"
                    >
                        <MenuItem value="">
                        </MenuItem>
                        
                        <MenuItem value="England">England</MenuItem>
                        <MenuItem value="USA">USA</MenuItem>
                        <MenuItem value="Canada">Canada</MenuItem>
                        <MenuItem value="Australia">Australia</MenuItem>
                    </Select>

                </FormControl>

                <FormControl variant="outlined" className={classes.formControl} color="primary">
                    <InputLabel id="demo-simple-select-outlined-label">State</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={state}
                        onChange={handleStatesChange}
                        label="State"
                        disabled={disableStates}
                    >
                        {
                            availableStates.length > 1 && availableStates.map((state, i) => {
                                return (
                                    <MenuItem value={state.name} key={i}>{state.name}</MenuItem>
                                )
                            })
                        }
                    </Select>

                </FormControl>
                {/* loading display while promise is in progress to get available cities related to state */}
                { promiseInProgress && <CircularProgress color="secondary" />}

                { fetchedCities && cities.length < 1 && <p style={{color : "red"}}>No supported city in this area</p> } 
                
                <FormControl variant="outlined" className={classes.formControl} color="primary">
                    <InputLabel id="demo-simple-select-outlined-label">City</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={city}
                        onChange={handleCityChange}
                        label="City"
                        disabled={disableCity}
                    >
                        {
                            cities && cities.map((state, i) => {
                                return (
                                    <MenuItem value={state.name} key={i}>{state.name}</MenuItem>
                                )
                            })
                        }
                    </Select>

                </FormControl>

                <Button variant="contained" color="secondary" disabled={disableButton}>
                    <Link to={`/search/${city}`}>Begin Search</Link>
                </Button>
            </div>


        </div>
    )
}


export default RestaurantSearch