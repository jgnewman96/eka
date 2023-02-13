import React, { useState, useEffect } from "react"
import { useLoaderData } from "react-router-dom";
import Series from './series_canvas'




const MAX_ZOOM = 5
const MIN_ZOOM = 0.1






function Canvas (props) {

   const data = useLoaderData();
   const series = data['params']['Series']
   const piece = data['params']['Piece']

   var tags_to_include = []
   var columnTemplate = "60% 60%"

  if (series !== "none") {

    tags_to_include.push(series)

    
   

    if (piece !== "none") {


        const piece_tags = props.metadata["by_piece"][piece].tags

        for (let step = 0; step < piece_tags.length; step++) {
            
            const tag = piece_tags[step]
            if (tag !== series) {
                tags_to_include.push(tag)
            }

          }
    
    

}
  }

  else {

    if (piece === "none") {

    columnTemplate = "30% 30% 30% 30%"

    tags_to_include = Object.keys(props.metadata["by_tag"])

  }
  else {
      tags_to_include = props.metadata["by_piece"][piece].tags
  }}

    const number_of_tags = tags_to_include.length

    
    const [animationActive, setAnimationActive] = useState(false);
    const [zoomStatus, setZoomStatus] = useState({'factor': 1, 
                                                  'current_adjustments': Array(tags_to_include.length).fill({'x':0, 
                                                                                                            'y': 0})
                                                  });

    const [startingLocations, setStartingLocations] = useState("foo")
  
    const myRef = React.createRef(null);
   

    function setUp() {
       
       
       
        const cardCanvas = myRef.current
        const children = cardCanvas.children

        var children_locations = []

        for (const child of children) {

            children_locations.push(child.getBoundingClientRect())


        }

        setStartingLocations({'children_locations': children_locations,
                              'container_location': cardCanvas.getBoundingClientRect() })

        myRef.current.addEventListener('wheel', handleWheel, { passive: false });


        return () => {
           // myRef.current.removeEventListener('wheel', handleWheel, { passive: false });
        }
    }

    

    useEffect(setUp , []);

    function handleResetClick (e) {

        const cardCanvas = myRef.current
        const zoom_factor = 1
        const transform_str = 'scale(' + zoom_factor + ')'
        var updated_adjustments = []

        for (let i = 0; i < cardCanvas.children.length; i++) {
            const child = cardCanvas.children[i]


            const new_x_adjustment = 0
            const new_y_adjustment = 0
           
            updated_adjustments.push({'x': new_x_adjustment, "y": new_y_adjustment})


            const translate_str = " translate(" + new_x_adjustment + "px, " + new_y_adjustment + "px)"


            child.animate(
                [
                    { transform: translate_str + transform_str },

                ], {
                duration: 1000,
                iterations: 1,
                fill: 'forwards',
            }).onfinish = () => {
                cardCanvas.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                  })

                



            }
        }

        setAnimationActive(false)
       

        setZoomStatus({'factor': zoom_factor,
                        'current_adjustments': updated_adjustments})





    }



   
   



    function handleWheel(e) {

       
        
       e.preventDefault();
        if (startingLocations == "foo") {
            return
        }

        const cardCanvas = myRef.current
        const children = cardCanvas.children
        
         

        const x = e.deltaX
        const y = e.deltaY

        const is_scroll = Number.isInteger(y)

        if (is_scroll) {
            cardCanvas.scrollBy(x, y)
        }
        else {



            if (animationActive) {
                return
            }
            else {
                setAnimationActive(true)
                

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



                var movement = ((zoomStatus['factor'] * size) - zoomStatus['factor']) / 100

                const zoom_factor = zoomStatus['factor'] + movement


                if (zoom_factor > MAX_ZOOM) {
                    setAnimationActive(false)
                    return
                }

                if (zoom_factor < MIN_ZOOM) {
                    setAnimationActive(false)
                    return
                }
                const transform_str = 'scale(' + zoom_factor + ')'


                const cursorX = e.clientX
                const cursorY = e.clientY
                var vertical_movements = []
                var horizontal_movements = []

                for (let i = 0; i < cardCanvas.children.length; i++) {

                    const child = cardCanvas.children[i]



                    const location = child.getBoundingClientRect()
                    

                    const movement_factor_x = (-1 * movement *  startingLocations.children_locations[i].width) / 2
                    const movement_factor_y = (-1 * movement * startingLocations.children_locations[i].height) / 2



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
                        relative_y: (location.y + movement_factor_y + vertical_movement) - startingLocations.container_location.y,
                    })


                    horizontal_movements.push({
                        projected_x: location.x + movement_factor_x,
                        horizontal_movement: horizontal_movement,
                        adjusted_x: location.x + movement_factor_x + horizontal_movement,
                        relative_x: (location.x + movement_factor_x + horizontal_movement) - startingLocations.container_location.x,
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
                    const adj_part_2 = Math.abs((movement * startingLocations.children_locations[min_x["key"]].width) / 2)


                    horizontal_adjustment = adj_part_1 + adj_part_2

                }

                if (min_y["value"] < 0) {

                    const adj_part_1 = Math.abs(vertical_movements[min_y["key"]]['vertical_movement'])
                    const adj_part_2 = Math.abs((movement * startingLocations.children_locations[min_y["key"]].height) / 2)

                    vertical_adjustment = adj_part_1 + adj_part_2

                }


                cardCanvas.scrollBy({
                    'left': horizontal_adjustment,
                    'top': vertical_adjustment,
                    'behavior': 'smooth'
                })



                var updated_adjustments = []
                

                for (let i = 0; i < cardCanvas.children.length; i++) {
                    const child = cardCanvas.children[i]


                    const new_x_adjustment = zoomStatus.current_adjustments[i].x + horizontal_movements[i]['horizontal_movement'] + horizontal_adjustment
                    const new_y_adjustment = zoomStatus.current_adjustments[i].y + vertical_movements[i]['vertical_movement'] + vertical_adjustment
                   
                    updated_adjustments.push({'x': new_x_adjustment, "y": new_y_adjustment})


                    const translate_str = " translate(" + new_x_adjustment + "px, " + new_y_adjustment + "px)"


                    child.animate(
                        [
                            { transform: translate_str + transform_str },

                        ], {
                        duration: 1,
                        iterations: 1,
                        fill: 'forwards',
                    }).onfinish = () => {

                        



                    };
                }

                setAnimationActive(false)

                setZoomStatus({'factor': zoom_factor,
                                'current_adjustments': updated_adjustments})





            }

        }



    }

        return (
            <div>

            <div style={{
                            height: "90vh",
                            width: "100%",
                            position: "relative",
                            overflow: "hidden",
                            display: 'grid', 
                            gridTemplateColumns: columnTemplate,
                            columnGap: "8em",
                            rowGap: "1em",
                            alignItems: "center",
                       
                            
                        }} 
                ref={myRef}
                onWheel={handleWheel}

                id="cardCanvas">
               
                

              

              
      {tags_to_include.map((item, index) => (
        <div key={index}>
            <Series series_name={item} 
                    series_info={props.metadata['by_tag'][item]}
                    showFinished={props.showFinished}
                    showInProgress={props.showInProgress}
                    showAbandoned={props.showAbandoned}/>

        </div>
      ))}

      
    

                </div>

                <div style={{backgroundColor: 'lightgray',
                            top: "-10em",
                            left: "40%",
                             height: "2.8em",
                             width: "5em",
                             position: "relative",
                             textAlign: "center",
                             borderRadius: "8px",
                             boxShadow: "5px 5px 5px black",
                             zIndex: "2000"
                             
                             
                             
                }}> 
                {Math.round(zoomStatus.factor * 100) + "%"}
                <div  style={{backgroundColor: "rgba(39, 54, 245, 0.41)", 
                             boxShadow: "1px 1px 5px black",
                              borderRadius: "10px ",
                              }} 
                        onClick={handleResetClick}> Reset</div>
                
                </div>
                </div>





        )
    }

export default Canvas;
