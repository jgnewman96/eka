import React, { Component } from "react"
import '../styles/todo_item.css';

const ItemStatus = {
    Finished: Symbol("Finished"),
    Editing: Symbol("Editing"),
    Incomplete: Symbol("Incomplete"),
}

function NewTodo(props) {
    return <input type="text"></input>

}

class ToDoItem extends Component {
    state = {
        status: ""


    };

    doThis = () => {
        console.log("clicked")

    }

    render() {

        return (
            <div className='ToDoItemContainer' onClick={this.doThis}>
                {this.props.item_text}
            </div>


        );
    }
}
export default ToDoItem;