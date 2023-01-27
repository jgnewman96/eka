import React, { Component, useEffect, createRef } from "react"

const CardType = {
    Solo: Symbol("Solo"),
    Collection: Symbol("Collection"),
}

const placeholderTitle = "Distance on the path"
const placeholderText = "Does advancing further down the path make it harder to connect with others. Your experience of the day to day becomes quite different from others. Your framework of what live is like becomes different. This can make it harder to connect and understand. "


const card_style = {
    border: "3px solid black",
    height: "20%",
    width: "30%",
    boxShadow: "2px 2px",
    margin: "5px",
    overflow: "hidden"
}

const title_style = {
    fontSize: "20px",
    textAlign: "center",
    margin: "10px"

}

const text_style = {
    fontSize: "12px",
    textAlign: 'left'

}

function CardContainer(props) {
    const SizeRef = createRef()
    useEffect(() => {
        if (SizeRef.current) {
            const { current } = SizeRef
            const boundingRect = current.getBoundingClientRect()
            const children = current.children
            const title = children[0]
            const text = children[1]

            title.style.fontSize = (1 / boundingRect.width) * 2000 + "px"
            text.style.fontSize = (1 / boundingRect.width) * 1500 + "px"

        }
    }, [SizeRef])
    return (<div className='Card' style={card_style} ref={SizeRef}>

        <div className='CardTitle' style={title_style}>
            {props.title}
        </div>
        <div className='CardText' style={text_style}>
            {props.text}
        </div>
    </div>)

}




class Card extends Component {
    state = {
        title: placeholderTitle,
        text: placeholderText
    };












    render() {

        return (
            <CardContainer title={this.state.title} text={this.state.text}>


            </CardContainer>


        );
    }
}
export default Card;