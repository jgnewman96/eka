import React, { Component } from "react"
import Canvas from "./canvas"
import SeriesViewer from "./series_viewer"
import CardCollectionViewer from "./card_collection_viewer"



class Chron extends Component {
    render() {

        return (
            <div className="chron" style={{
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
}
export default Chron;