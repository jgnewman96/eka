import React, { Component } from "react"
import { Outlet } from "react-router-dom";
import { json, useLoaderData } from "react-router-dom";


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

        return (
            <div className="chron" style={{
                display: "flex",
                flexDirection: "row",
                width: "100%"
            }}>
                 <div id="detail">
                    
        <Outlet context={[metadata]} />
      </div>
            </div>
        );
    }
export default Chron;