import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import menu_unavailable from './assets/menu_unavailable.png'

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

export const NoMenuAvailable = () =>{
    return(
        <div className="daily-menu-container">
            <h1>Daily Menu</h1>
            <img src={menu_unavailable} alt="Unavailable" />
        </div>
    )
}


export const DailyMenu = ({ dailyMenu }) => {
    const classes = useStyles();
    const dishes = dailyMenu && dailyMenu.daily_menus[0].daily_menu.dishes
    const duration = dailyMenu && dailyMenu.daily_menus[0].daily_menu
    console.log(duration)
    return (
        <div className="daily-menu-container">
            <h1>Daily Menu</h1>
            <h3>Starts : {duration && duration.start_date}</h3>
            <h3>&amp;</h3>
            <h3>Ends : {duration && duration.end_date}</h3>

            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell color="secondary">DISHES</TableCell>
                            <TableCell align="right" color="secondary">PRICES</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dishes && dishes.map((dish) =>{ 
                             const dishPrice = dish.dish.price === "" ? 'N/A' : dish.dish.price
                            return (
                                <TableRow key={dish.dish.dish_id}>
                                    <TableCell component="th" scope="row">
                                        {dish.dish.name}
                                    </TableCell>
                                    <TableCell align="right">{dishPrice}</TableCell>
                                </TableRow>)
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
