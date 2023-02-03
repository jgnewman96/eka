import React, { Component } from "react"
import { json, useLoaderData } from "react-router-dom";
import Canvas from "./canvas"
import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";



function convert_unix_to_year_month(unix) {
    var date = new Date(unix);
    var year = date.getFullYear();
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var month = months[date.getMonth()];
    return {'year': year, 'month': month }

}

const popOutColor= "#EBCBC190"

export async function piece_loader({ params }) {
    return json({ params });
  }

  function PieceDisplay(props) {

    const created = convert_unix_to_year_month(props.created)
    const modified = convert_unix_to_year_month(props.modified)


    return <li style={{position: "relative",
                       marginBottom: "0.5vh",
                       left: "-1vw"}}>
                           <Link to={"../" + props.filename}  relative="path">
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
    const pieces_in_series = props['metadata']['by_tag'][series_name]

    pieces_in_series.sort(function(a, b) {
        return a.created - b.created;
      });


    
  
    return (
        <div className="series_viewer" style={{
            width: "25vw",
             height: "90vh", 
             boxShadow: "1px 1px 5px 5px grey",
            
             backgroundColor: popOutColor,
             zIndex: "1"
        }}
        >
           <h2 style={{textAlign: 'center'}}>{series_name} </h2> 
           <hr></hr>
           <h3> List of Pieces </h3>
           <ul>
        {pieces_in_series.map(object => (
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

        if (piece_file_name === "none") {
            return 
        }


        const piece = props['metadata']['by_piece'][piece_file_name]


        return (
            <div className="card_collection_viewer" style={{
                height: "90vh",
                width: "25vw",
                  boxShadow: "1px 1px 5px 5px grey",
                  backgroundColor: popOutColor,
                  zIndex: "1"
            }}>
                <h2 style={{textAlign: 'center'}}>{piece.title} </h2> 
                <div style={{display: 'flex', flexDirection: 'row'}}>
           {piece.tags.map((item, index) => (
                 <div key={index} style={{margin: "5px", 
                                         backgroundColor: "rgba(11, 57, 84, 0.1)",
                                         padding: "3px",
                                         borderRadius: "30%"}}> 

<Link to={"../../../../series/" + item + "/piece/" + piece.filename}  relative="path">
                          {item}
                          
    </Link>
                                         
                                         
                                          </div>
      ))}
      
    </div>
    <hr></hr>
               

            </div>
        );
    }
}


function ActiveViewer() {
    const [metadata] = useOutletContext();


        return (
            <div style={{
                display: "flex",
                flexDirection: "row",
                width: "100%"
            }}> 
                <SeriesViewer metadata={metadata} />
                <Canvas metadata={metadata} />
                <CardCollectionViewer metadata={metadata} />

            </div>
        );
    }

export default ActiveViewer;