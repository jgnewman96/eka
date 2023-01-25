import React, { Component } from "react"
import DayOfWeek from './objects/day_of_week'
import './styles/periph.css';

const sidebar_left_style = {
    textAlign: "center",
    border: "3px solid black",
    height: "95%",
    width: "20%",
    backgroundColor: "khaki",
    boxShadow: "40px 40px",
}


class Periph extends Component {
    render() {

        return (
            <div className="periph">

                <div className="sidebar-left" style={sidebar_left_style} >
                    <div className="calendar"></div>
                    <div className="weekly-tasks"></div>
                    <div className="long-term-goals"></div>


                </div>
                <div className="App-Name">
                    Periph
                </div>
                <div className="day-information">
                    <DayOfWeek day_of_week='Monday'></DayOfWeek>
                    <DayOfWeek day_of_week='Tuesday'></DayOfWeek>
                    <DayOfWeek day_of_week='Wednesday'></DayOfWeek>
                    <DayOfWeek day_of_week='Thursday'></DayOfWeek>
                    <DayOfWeek day_of_week='Friday'></DayOfWeek>


                </div>
            </div>
        );
    }
}
export default Periph;