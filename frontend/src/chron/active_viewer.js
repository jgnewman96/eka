import React from "react"
import { json, useLoaderData } from "react-router-dom";
import Canvas from "./canvas"
import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import { RiCloseCircleFill } from "react-icons/ri";
import BlockTexts from "./block_texts";



function convert_unix_to_year_month(unix) {
    var date = new Date(unix);
    var year = date.getFullYear();
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var month = months[date.getMonth()];
    return {'year': year, 'month': month }

}

const popOutColor= "#EBCBC1FF"

export async function piece_loader({ params }) {
    return json({ params });
  }

  function PieceDisplay(props) {

    const created = convert_unix_to_year_month(props.created)
    const modified = convert_unix_to_year_month(props.modified)


    return <li style={{position: "relative",
                       marginBottom: "0.5vh",
                       fontFamily: 'Oswald',
                       left: "-1vw"}}>
                           <Link to={"../../../" + props.filename + "/card/0"}  relative="path">
                           <span style={{fontSize: "22px"}}>{props.title}</span>
                          
    </Link>
                        <br style={{height: "40em"}}></br>
                        
                       
                       Created: {created.year} {created.month}
                       <br></br>
                       Last Touched: {modified.year} {modified.month}
                       </li>;
  }
  



function SeriesViewer(props) {
    const data = useLoaderData();

    const series_name = data["params"]['Series']
    const piece_file_name = data["params"]['Piece']
    if (series_name === "none") {
        return 
    }

    const pieces = props['metadata']['by_tag'][series_name]

    pieces.sort(function(a, b) {
        return a.created - b.created;
      });

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
        <div className="series_viewer" style={{
            width: "100%",
             height: "90vh", 
             boxShadow: "1px 1px 5px 5px grey",
             position: 'relative',      
             backgroundColor: popOutColor,
             zIndex: "200"
        }}
        
        >
            <Link to={"../../../../../../series/none/piece/" + piece_file_name + "/card/0"}  relative="path">
    <RiCloseCircleFill color="#802080" style={{fontSize: "3em", 
                               position: 'absolute',
                               right: "-20",
                               top: "-20", 
            }} > </RiCloseCircleFill> </Link>
           <h2 style={{textAlign: 'center', fontFamily: 'Rockwell'}}>{series_name.split('_').join(" ")} </h2> 
           <hr></hr>
           <h3 style={{fontFamily: 'Rockwell'}}> List of Pieces </h3>
           <ul>
        {pieces_to_display.map(object => (
          <PieceDisplay key={object.filename}
                        filename={object.filename}
                        title={object.title} 
                        created = {object.created} 
                        modified = {object.modified} />
        ))}
      </ul>
      
            </div>
    );
  }

  function CardCollectionViewer(props) {
     {
        const data = useLoaderData();
        const piece_file_name = data["params"]['Piece']
        const card_index = parseInt(data["params"]["Card"])


        if (piece_file_name === "none") {
            return 
        }


        const piece = props['metadata']['by_piece'][piece_file_name]
        


        return (
            <div className="card_collection_viewer" style={{
                height: "90vh",
                width: "100%",
                  boxShadow: "1px 1px 5px 5px grey",
                  backgroundColor: popOutColor,
                  zIndex: "200",
                  position: "relative",
                  opacity: 20,
            }}>
                <h2 style={{textAlign: 'center', fontFamily: 'Rockwell'}}>{piece.title} </h2> 
                <div style={{display: 'grid',
                             position: 'absolute',
                             top: 20,
                             right: -110}}>
                    <span style={{textAlign: 'center', 
                                  width: '7.5em',
                                fontFamily: 'Rockwell'}}>Contents</span>
                    {piece.blocks.map((item, index) => (

                        <Link to={"../" + index}  relative="path" style={{textDecoration: 'none'}}>
                        <div key={index} style={{margin: "2px", 
                                        padding: "2px",
                                        width: '10em', 
                                        
                                        color: 'black',
                                        backgroundColor: (index ===
                                             card_index) ? 'white' : "lightgray",
                                        fontSize: '0.7em',
                                        textAlign: 'center',
                                        fontFamily: 'Rockwell',
                                        boxShadow: "5px 5px black"}}>
                            {item}

                        </div>
                        </Link>

                    ))}


                </div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
           {piece.tags.map((item, index) => (
                 <div key={index} style={{margin: "5px", 
                                         backgroundColor: "#802080D0",
                                         fontFamily: 'Oswald',
                                         padding: "5px",
                                         borderRadius: "10px"}}> 

                    <Link to={"../../../../../../series/" + item + "/piece/" + piece.filename + "/card/" + card_index} 
                          relative="path"
                          style={{'textDecoration': 'none', 
                                  'color': 'white'}}>
                          {item.split('_').join(" ")}
                          
    </Link>
                                         
                                         
                                          </div>
      ))}
      
    </div>
    <hr></hr>
    <Link to={"../../../none/card/0"}  relative="path">
                          
                          
   
    <RiCloseCircleFill color="#802080" style={{fontSize: "3em", 
                               position: 'absolute',
                               right: "-20",
                               top: "-20", 
            }} > </RiCloseCircleFill> </Link>


            <BlockTexts 
                        blocks_text={piece.blocks_text} 
                        blocks = {piece.blocks}
                        card_index = {card_index} />
               

            </div>
        );
    }
}


function ActiveViewer() {
    const [metadata, showFinished, showInProgress, showAbandoned] = useOutletContext();
    const data = useLoaderData();
    var column_template = "20% 45% 30%"

    const series_name = data["params"]['Series']
    const piece_file_name = data["params"]['Piece']

        if (piece_file_name === "none" ) {
            column_template = "40% 1fr"
        }

        if (series_name === "none") {
            column_template = "45% 50%"

        }

        if (piece_file_name === "none" && series_name === "none") {
            column_template = "1fr"


            return (
                <div style={{
                    display: "grid",
                   gridTemplateColumns: "100%",
                   width: "99vw"
                 
                }}
                id="allContainer"> 
                    <Canvas metadata={metadata} showFinished={showFinished} showInProgress={showInProgress} showAbandoned={showAbandoned} />
    
                </div>
            );
        }



        return (
            <div style={{
                display: "grid",
                gridTemplateColumns: column_template,
                width: "98vw",
                
            }} id="allContainer"> 
                <SeriesViewer metadata={metadata} showFinished={showFinished} showInProgress={showInProgress} showAbandoned={showAbandoned} />
                <Canvas metadata={metadata} showFinished={showFinished} showInProgress={showInProgress} showAbandoned={showAbandoned} />
                <CardCollectionViewer metadata={metadata} />

            </div>
        );
    }

export default ActiveViewer;