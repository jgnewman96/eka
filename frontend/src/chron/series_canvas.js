import Card from "./card_canvas"
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';

// I need to order the grid blocks so that once of similar size are in the same row


function Series (props) {
    var pieces = props.series_info
    var location = useLocation().pathname.split('/')
    const piece = location[location.length - 1]

    pieces.sort((a, b) => (a.blocks.length > b.blocks.length) ? 1 : -1)

    var pieces_to_display = []

    for (let i = 0; i < pieces.length; i++) {
        const piece = pieces[i]
        if (piece.status === 'Finished') {
            if (props.showFinished === true) {
                pieces_to_display.push(piece)
            }
        }
        if (piece.status === 'In Progress') {
            if (props.showInProgress) {
                pieces_to_display.push(piece)
            }
        }

        if (piece.status === 'Abandoned') {
            if (props.showAbandoned) {
                pieces_to_display.push(piece)
            }
        }

    }


    return (
        <div style={{width: "100%",
                     margin: "1em",
                     borderWidth: "1em",
                     display: 'grid', 
                     gridTemplateColumns: "1fr 1fr 1fr",
                     gridAutoRows: "max-content",
                     columnGap: "3em",
                     rowGap: "4em",
                     height: 'auto',
                     paddingBottom: '3em',
                     paddingRight: '2em',
                     paddingLeft: '2em',
                     borderColor: "rgba(54, 255, 145, 0.25)",
                      borderStyle: "solid",
                      
                      }}>
            <div style={{position: "relative", 
                                    'top': "-1.25em",
                                    'left': "-3em",
                                    'fontSize': "0.9em",
                                    "fontWeight": "bold",
                                    fontFamily: "Rockwell"
                                    }}>
                                        <Link to={"../../../" + props.series_name + "/piece/" + piece}  relative="path">
                                        {props.series_name}
                          
                                            </Link>
           
            </div>


            {pieces_to_display.map((item, index) => (
        <div key={index}>
           
            <Card title = {item.title} blocks = {item.blocks} status = {item.status} />
                                        
            

        </div>
      ))}
            
        </div>

    )
}

export default Series;