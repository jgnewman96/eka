import React, { useState, useEffect } from "react"
import { useLoaderData } from "react-router-dom";
import Series from './series_canvas'
import TwoFingerScrollZoom from './twofingerzoomscroll'




const MAX_ZOOM = 5
const MIN_ZOOM = 0.1






function Canvas (props) {

   const data = useLoaderData();

   var series = ''
   var piece = ''
   var metadata = {}
   
   if (!('params' in data)) {
       series = 'none'
       piece = 'none'
       metadata = data
   }
   else {
   series = data['params']['Series']
   piece = data['params']['Piece']
   metadata = props.metadata
   
   }
   

   var tags_to_include = []
   var columnTemplate = "25vw 25vw"

  if (series !== "none") {

    tags_to_include.push(series)

    
   

    if (piece !== "none") {


        const piece_tags = metadata["by_piece"][piece].tags

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

    columnTemplate = "30vw 30vw 30vw 30vw"

    tags_to_include = Object.keys(metadata["by_tag"])

  }
  else {
      tags_to_include = metadata["by_piece"][piece].tags
  }}

    const number_of_tags = tags_to_include.length





    


    

        return (
            <div >

                <TwoFingerScrollZoom >
    

      <div style={{ display: 'grid', 
                            gridTemplateColumns: columnTemplate,
                            columnGap: "8em",
                            rowGap: "1em",
                          //  padding: "10em"
                        }}>
              
      {tags_to_include.map((item, index) => (
        <div key={index}>
            <Series series_name={item} 
                    series_info={metadata['by_tag'][item]}
                    showFinished={props.showFinished}
                    showInProgress={props.showInProgress}
                    showAbandoned={props.showAbandoned}/>

        </div>
      ))}
      </div>
      
      

      
    

                
                </TwoFingerScrollZoom>

               
                
               
                </div>





        )
    }

export default Canvas;
