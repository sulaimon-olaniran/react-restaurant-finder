import React, { useEffect } from 'react'
import './styles/AppStyles.scss'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import HomePage from './components/home/HomePage'
import RestaurantSearch from './components/search/RestaurantSearch'
import SearchResults from './components/search/search_results/SearchResults'
import RestaurantDetails from './components/Restaurant/Restaurant'
import NavBar from './components/navbar/NavBar'

function App() {
  useEffect(() => {


  }, [])


  return (
    <Router>
      <div className="App">
        <NavBar />
        <main>
          <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path="/search" exact component={RestaurantSearch} />
            <Route path="/search/:city" exact component={SearchResults} />
            <Route path="/search/restaurant/:id" exact component={RestaurantDetails} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
