import React, { Component } from "react"
import Card from "./card_canvas"
import { useLocation } from 'react-router-dom';



const containerStyle = {
    height: "90vh",
    width: "47.5vw",
    borderStyle: "solid",
    borderColor: "black",
    position: "relative",
    overflow: "hidden",
    display: 'tableCell'
}

const MAX_ZOOM = 5
const MIN_ZOOM = 0.1

function CanvasCards () {
    let location = useLocation();

  React.useEffect(() => {
    // Google Analytics
    console.log(location)
  }, [location]);

    return (<Card />)
}




class Canvas extends Component {
    state = {
        zoom_factor: 1,
        animation_active: false,
        current_x_adjustments: [0, 0, 0, 0, 0],
        current_y_adjustments: [0, 0, 0, 0, 0]

    };
    myRef = React.createRef();


    componentDidMount() {
        // IMPORTANT: notice the `passive: false` option
        this.myRef.current.addEventListener('wheel', this.handleWheel, { passive: false });


        const cardCanvas = document.getElementById('cardCanvas');

        var children_locations = []

        for (const child of cardCanvas.children) {

            children_locations.push(child.getBoundingClientRect())


        }
        this.setState({
            children_locations: children_locations,
            box_location: cardCanvas.getBoundingClientRect()
        })
    }

    componentWillUnmount() {
        this.myRef.current.removeEventListener('wheel', this.handleWheel, { passive: false });
    }




    handleWheel = (e) => {
        e.preventDefault();
        e.stopPropagation();


        const cardCanvas = document.getElementById('cardCanvas');
        const x = e.deltaX
        const y = e.deltaY

        const is_scroll = Number.isInteger(y)

        if (is_scroll) {
            cardCanvas.scrollBy(x, y)
        }
        else {



            if (this.state.animation_active) {
                return
            }
            else {
                this.setState({ animation_active: true })

                var size = 1

                if (y < 0) {
                    size = (y * -1) + 1

                }
                else {
                    if (y < 1) {
                        size = 1 - y
                    }

                    else {

                        size = 1 / (y * 10000 + 1)
                    }
                }



                var movement = ((this.state.zoom_factor * size) - this.state.zoom_factor) / 30

                const zoom_factor = this.state.zoom_factor + movement


                if (zoom_factor > MAX_ZOOM) {
                    this.setState({ animation_active: false })
                    return
                }

                if (zoom_factor < MIN_ZOOM) {
                    this.setState({ animation_active: false })
                    return
                }

                this.setState({ zoom_factor: zoom_factor })
                const transform_str = 'scale(' + zoom_factor + ')'


                const cursorX = e.clientX
                const cursorY = e.clientY
                var vertical_movements = []
                var horizontal_movements = []

                for (let i = 0; i < cardCanvas.children.length; i++) {

                    const child = cardCanvas.children[i]



                    const location = child.getBoundingClientRect()

                    const movement_factor_x = (-1 * movement * this.state.children_locations[i].width) / 2
                    const movement_factor_y = (-1 * movement * this.state.children_locations[i].height) / 2



                    var horizontal_movement = movement_factor_x * -1
                    var vertical_movement = movement_factor_y * -1

                    const cursor_adjustment = Math.abs(movement) * 1

                    const x_distance_from_cursor = Math.abs(location.x - cursorX)
                    const y_distance_from_cursor = Math.abs(location.y - cursorY)






                    if (location.x < cursorX) {
                        if (movement > 0) {
                            horizontal_movement = (-1 * cursor_adjustment * x_distance_from_cursor) + horizontal_movement
                        }
                        else {
                            horizontal_movement = cursor_adjustment * x_distance_from_cursor + horizontal_movement
                        }
                    }
                    else {
                        if (movement > 0) {
                            horizontal_movement = cursor_adjustment * x_distance_from_cursor + horizontal_movement
                        }
                        else {
                            horizontal_movement = (-1 * cursor_adjustment * x_distance_from_cursor) + horizontal_movement

                        }
                    }



                    if (location.y < cursorY) {
                        if (movement > 0) {

                            vertical_movement = (-1 * cursor_adjustment * y_distance_from_cursor) + vertical_movement
                        }
                        else {
                            vertical_movement = cursor_adjustment * y_distance_from_cursor + vertical_movement
                        }
                    }
                    else {
                        if (movement > 0) {
                            vertical_movement = cursor_adjustment * y_distance_from_cursor + vertical_movement
                        }
                        else {
                            vertical_movement = (-1 * cursor_adjustment * y_distance_from_cursor) + vertical_movement
                        }
                    }


                    vertical_movements.push({
                        projected_y: location.y + movement_factor_y,
                        vertical_movement: vertical_movement,
                        adjusted_y: location.y + movement_factor_y + vertical_movement,
                        relative_y: (location.y + movement_factor_y + vertical_movement) - this.state.box_location.y,
                    })


                    horizontal_movements.push({
                        projected_x: location.x + movement_factor_x,
                        horizontal_movement: horizontal_movement,
                        adjusted_x: location.x + movement_factor_x + horizontal_movement,
                        relative_x: (location.x + movement_factor_x + horizontal_movement) - this.state.box_location.x,
                        color: child.style.backgroundColor,
                        current_location: location
                    })

                }





                var min_y = Object.keys(vertical_movements).map(function (key) {
                    return {
                        value: vertical_movements[key]["relative_y"],
                        key: Number(key)
                    }
                }).sort(function (a, b) {
                    return a.value - b.value
                })[0];

                var min_x = Object.keys(horizontal_movements).map(function (key) {
                    return {
                        value: horizontal_movements[key]["relative_x"],
                        key: Number(key)
                    }
                }).sort(function (a, b) {
                    return a.value - b.value
                })[0];




                var horizontal_adjustment = 0
                var vertical_adjustment = 0

                if (min_x["value"] < 0) {

                    const adj_part_1 = Math.abs(horizontal_movements[min_x["key"]]['horizontal_movement'])
                    const adj_part_2 = Math.abs((movement * this.state.children_locations[min_x["key"]].width) / 2)


                    horizontal_adjustment = adj_part_1 + adj_part_2

                }

                if (min_y["value"] < 0) {

                    const adj_part_1 = Math.abs(vertical_movements[min_y["key"]]['vertical_movement'])
                    const adj_part_2 = Math.abs((movement * this.state.children_locations[min_y["key"]].height) / 2)

                    vertical_adjustment = adj_part_1 + adj_part_2

                }


                cardCanvas.scrollBy({
                    'left': horizontal_adjustment,
                    'top': vertical_adjustment,
                    'behavior': 'smooth'
                })



                var updated_x_adjustments = []
                var updated_y_adjustments = []

                for (let i = 0; i < cardCanvas.children.length; i++) {
                    const child = cardCanvas.children[i]


                    const new_x_adjustment = this.state.current_x_adjustments[i] + horizontal_movements[i]['horizontal_movement'] + horizontal_adjustment
                    updated_x_adjustments.push(new_x_adjustment)

                    const new_y_adjustment = this.state.current_y_adjustments[i] + vertical_movements[i]['vertical_movement'] + vertical_adjustment
                    updated_y_adjustments.push(new_y_adjustment)


                    const translate_str = " translate(" + new_x_adjustment + "px, " + new_y_adjustment + "px)"


                    child.animate(
                        [
                            { transform: translate_str + transform_str },

                        ], {
                        duration: 1,
                        iterations: 1,
                        fill: 'forwards',
                    }).onfinish = () => {

                        this.setState({ animation_active: false })


                    };
                }
                this.setState({
                    current_x_adjustments: updated_x_adjustments,
                    current_y_adjustments: updated_y_adjustments
                })







            }

        }



    }


    render() {
        return (

            <div style={containerStyle} ref={this.myRef}
                onWheel={this.handleWheel}

                id="cardCanvas">
                Size Factor: { this.state.zoom_factor}
                <CanvasCards />

                


                <div style={{
                    height: "50px",
                    width: "50px",
                    backgroundColor: "orange",
                    position: "relative",
                    left: "20px",
                    top: "100px"
                }}> </div>


                <div style={{
                    height: "200px",
                    width: "50px",
                    backgroundColor: "blue",
                    position: "relative",
                    top: "350px",
                    left: "100px"
                }}>
                </div>

                <div style={{
                    height: "200px",
                    width: "50px",
                    backgroundColor: "purple",
                    position: "relative",
                    top: "50px",
                    left: "300px"

                }}> </div>

                <div style={{
                    height: "50px",
                    width: "900px",
                    backgroundColor: "green",
                    position: "relative",
                    top: "-300px",
                    left: "300px"

                }}> </div>





            </div >

        )
    }
}

export default Canvas;
