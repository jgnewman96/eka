import React, { Component } from "react"
import { json, useLoaderData } from "react-router-dom";
import Canvas from "./canvas"
import { useOutletContext } from "react-router-dom";



export async function piece_loader({ params }) {
    console.log(params)
    return json({ params });
  }


function SeriesViewer() {
    const data = useLoaderData();
    console.log(data)
    
  
    return (
        <div className="series_viewer" style={{
            width: "25vw", height: "90vh", borderStyle: "solid", borderColor: "black",
        }}
        >
            Series Viewer
            </div>
    );
  }

  function CardCollectionViewer() {
     {
        const data = useLoaderData();
        console.log(data)

        return (
            <div className="card_collection_viewer" style={{
                height: "90vh",
                width: "25vw",
                  borderStyle: "solid", 
                  borderColor: "black",
            }}>
                Card Collection Viewer
               

            </div>
        );
    }
}


function ActiveViewer() {
    const [metadata] = useOutletContext();
    console.log(metadata)


        return (
            <div style={{
                display: "flex",
                flexDirection: "row",
                width: "100%"
            }}> 
                <SeriesViewer />
                <Canvas />
                <CardCollectionViewer />

            </div>
        );
    }

export default ActiveViewer;