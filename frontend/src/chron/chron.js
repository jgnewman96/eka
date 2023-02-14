import React, { Component, useState } from "react"
import { Outlet } from "react-router-dom";
import { json, useLoaderData } from "react-router-dom";
import Canvas from "./canvas";
import StatusSelector from "./status_selector";
import { useLocation } from 'react-router-dom';


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
    console.log(location)
    if (location.length < 3) {
    return (
        <div>
        <div style = {{ position: 'absolute', 
                        width: "40vw", 
                        height: "70vh",
                         backgroundColor: 'black',
                         top: "10vh",
                         opacity: 1,
                         zIndex: 100,
                         left: '30vw' }}></div> 

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


    console.log(showFinished)

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