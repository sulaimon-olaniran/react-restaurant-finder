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
    const [avalablestates, setAvailableStates] = useState([]) //takes in state's area of selected country
    const [state, setState] = useState('') //handles value of the state input value
    const [city, setCity] = useState('') //handles value of the city input value
    const [cities, setCities] = useState([]) //stores available cities data gotten from the api
    const [fetchedCities, setFetchedCities ] = useState(false)

    const handleCountryChange = (event) => {
        setCountry(event.target.value);
    }

    const handleCityChange = (event) => {
        setCity(event.target.value);
    }

    const handleStatesChange = (event) => {
        setState(event.target.value)
    }

    useEffect(() => {
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
            axios.get(`https://developers.zomato.com/api/v2.1/cities?q=${state}&apikey=${API_KEY}`)
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


    }, [state, country])

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
                            avalablestates.length > 1 && avalablestates.map((state, i) => {
                                return (
                                    <MenuItem value={state.name} key={state.abbreviation}>{state.name}</MenuItem>
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