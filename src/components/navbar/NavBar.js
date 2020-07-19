import React from 'react'
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom'


const NavBar = () => {
    return (
        <nav>
            <h1><Link to="/">OS-RES</Link></h1>
            <Button variant="outlined" color="secondary" >
                <Link to="/search">
                    Find Restaurant
                </Link>
            </Button>
        </nav>
    )
}


export default NavBar