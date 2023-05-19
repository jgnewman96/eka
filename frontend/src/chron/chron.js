import React, { Component, useState } from "react"
import { Outlet } from "react-router-dom";
import { json, useLoaderData } from "react-router-dom";
import Canvas from "./canvas";
import StatusSelector from "./status_selector";
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";


export async function chron_loader({ params }) {
    

    

    return fetch('/metadata.json')
    .then((r) => r.json())
    .then(json  => {

        const pieces_organized_by_tag = {}
        const pieces_organized_by_filename = {}

        for (let step = 0; step < json.length; step++) {

            const piece = json[step]
            const tags = piece["tags"]
            for (let i = 0; i < tags.length; i++) {
                const tag = tags[i] 
                if (tag in pieces_organized_by_tag) {
                    pieces_organized_by_tag[tag].push(piece)

                }
                else {
                pieces_organized_by_tag[tag] = [piece]
                }
                pieces_organized_by_filename[piece.filename] = piece
            }

            
          }

          return {"by_tag": pieces_organized_by_tag,
                  "by_piece": pieces_organized_by_filename}
    
    })  

  }

  function HiddenCanvas (props) {

    var location = useLocation().pathname.split('/')
    if (location.length < 3) {
    return (
        <div>
        <div style = {{ position: 'absolute', 
                        width: "40vw", 
                        height: "50vh",
                         backgroundColor: '#EBCBC1FB',
                         boxShadow: "1px 1px 20px 15px grey",
                         top: "10vh",
                         opacity: 1,
                         zIndex: 100,
                         left: '30vw', 
                         fontFamily: "Yantramanav" }}>
        <div style={{margin: "5px"}}>

        <h2 style={{textAlign: 'center', fontFamily: "Rockwell"}}>Welcome to Chron!</h2>
        Chron is an experimental writing tool built by Judah Newman. 
        Chron is an interface to help me regularly create written work that I am proud of. 
        Chron is an experiment in building software for a user base of 1! It is fully optimized for my creative process.

        <br></br>
        <br></br>

        Reach out to me at judah.newman@gmail.com with feedback or any other thoughts you have about Chron!
        </div>

        <h3 style={{textAlign: 'center', fontFamily: "Rockwell"}}>Some Places to Start!</h3>
        <ul>
        <li style={{margin: "10px"}}>
                <Link to={"/series/none/piece/chron_-_product_spec/card/0"} relative="path">
                    The original Chron product specification
                </Link>
                </li>
            <li style={{margin: "10px"}}>
                <Link to={"/series/whoami/piece/none/card/0"} relative="path">
                    Reflections about my identity
                </Link>
                </li> 
                <li style={{margin: "10px"}}>
                <Link to={"/series/highlights/piece/none/card/0"} relative="path">
                    Pieces that I am most proud of
                </Link>
                </li>  
            <li style={{margin: "10px"}}>
                <Link to={"/series/top_of_mind/piece/none/card/0"} relative="path">
                    Topics that I am actively thinking about
                </Link>
                </li> 
                <li style={{margin: "10px"}}>
                <Link to={"/series/sparks/piece/none/card/0"} relative="path">
                    Small ideas which feel compelling but have not been developed yet
                </Link>
                </li> 
                <li style={{margin: "10px"}}>
                <Link to={"/series/none/piece/none/card/0"} relative="path">
                    Explore the entire canvas of my writing
                </Link>
                </li> 


            </ul>
                             
                             
    </div> 

    <div style={{
        display: "grid",
       gridTemplateColumns: "100%",
       width: "99vw",
       opacity: 0.2
     
    }}
    id="allContainer"> 
      
        <Canvas metadata={props.metadata} showFinished={props.showFinished} showInProgress={props.showInProgress} showAbandoned={props.showAbandoned} />

    </div>
    </div>
    )
}
else {
    return 
}
  }





function Chron() {
    const metadata = useLoaderData()
    const [showFinished, updateShowFinished] = useState(true)
    const [showInProgress, updateShowInProgress] = useState(true)
    const [showAbandoned, updateShowAbandoned] = useState(false)


    function handleShowFinished(e) {
        updateShowFinished(e.target.checked)

    }

    function handleShowInProgress(e) {
        updateShowInProgress(e.target.checked)

    }
    function handleShowAbandoned(e) {
        updateShowAbandoned(e.target.checked)

    }

        return (
            <div className="chron" style={{position: 'relative'}} >

           <StatusSelector 
                showFinished={showFinished}
                handleShowFinished={handleShowFinished}
                showInProgress={showInProgress}
                handleShowInProgress={handleShowInProgress}
                showAbandoned={showAbandoned}
                handleShowAbandoned={handleShowAbandoned}
                
           
           ></StatusSelector>
                 <div id="detail">

        <HiddenCanvas  showFinished={showFinished}  showInProgress={showInProgress}  showAbandoned={showAbandoned}   />

        
                    
        <Outlet context={[metadata, showFinished, showInProgress, showAbandoned]} />
      </div>
            </div>
        );
    }
export default Chron;