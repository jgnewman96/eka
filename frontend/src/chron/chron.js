import React, { Component, useState } from "react"
import { Outlet } from "react-router-dom";
import { json, useLoaderData } from "react-router-dom";
import StatusSelector from "./status_selector";


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

        
                    
        <Outlet context={[metadata, showFinished, showInProgress, showAbandoned]} />
      </div>
            </div>
        );
    }
export default Chron;