import React, { Component } from "react"

import '../styles/day_of_week.css';
import ToDoItem from './todo-item';

class DayOfWeek extends Component {
    render() {
        return (
            <div className='DayOfWeek'>
                <div className='DayTitle'>
                    <h1>{this.props.day_of_week}</h1>
                    <hr></hr>
                </div>
                <ToDoItem item_text="learn CSS" />

            </div>
        );
    }
}
export default DayOfWeek;