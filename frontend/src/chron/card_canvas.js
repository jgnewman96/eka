import React, { useEffect, createRef } from "react"

const CardType = {
    Solo: Symbol("Solo"),
    Collection: Symbol("Collection"),
}


const card_style = {
   
}


const text_style = {
    fontSize: "12px",
    textAlign: 'left'

}

function CardContainer(props) {
    const SizeRef = createRef()

    var color = '#A3E291'
    var opacity = 1
    if (props.status == 'In Progress')
    {
        color = '#E9F49D'

    }

    if (props.status == 'Abandoned')
    {
        opacity = 0.15
        color = '#F0C9F7'

    }

    
    const title_length = props.title.length

    useEffect(() => {
        if (SizeRef.current) {
            const { current } = SizeRef
            const boundingRect = current.getBoundingClientRect()
            const children = current.children
            const title = children[0]
            const text = children[1]

            //title.style.fontSize = (1 / boundingRect.width) * 2000 + "px"
            //text.style.fontSize = (1 / boundingRect.width) * 1500 + "px"

        }
    }, [SizeRef])

    if (props.blocks.length < 1) { 

    return (<div className='Card' style={{border: "3px solid black",
                                            height: "80%",
                                            width: "100%",
                                            boxShadow: "2px 2px", 
                                            backgroundColor: color,
                                            opacity: opacity}} ref={SizeRef}>

        <div className='CardTitle' style={{  fontSize: "0.7em",
                                            textAlign: "center",
                                             marginTop: "1em", 
                                             }}>
            {props.title}
        </div>
    </div>)
    }
    else {
        var total_character_length = 0

        for (let i=0; i<props.blocks.length; i++) {

            total_character_length = total_character_length + props.blocks[i].length
           
        }


        var block_size =  (90  / props.blocks.length)
        if (props.blocks.length === 1) {
            block_size = 40

        }


        
        return ( <div className='CardCollection' style={{
           
            height: "100%",
            width: "100%",
            marginBottom: "1.5em",
          
           
         
          //  overflow: "hidden"
        }} >
            <div style={{textAlign: "center", fontSize: "0.6em", marginBottom: "2%"}}>
                    {props.title}
                    </div>

                    {props.blocks.map((item, index) => (
                         <div key={index}style={{  fontSize: "0.8em",
                                                   textAlign: "center",
                                                   position: "relative",
                                                   top: (index > 0) ? "-1%": "0%",
                                                   zIndex: props.blocks.length + index,
                                                    width: "90%",
                                                    height: (props.blocks.length === 1) ? "3em" : item.length / total_character_length  * 100 + '%' ,
                                                    borderTop: "3px solid black",
                                                    borderLeft: "3px solid black",
                                                    borderRight: "3px solid black",
                                                    boxShadow: "0px -3px 3px rgba(50, 50, 50, 0.75)",
                                                    borderBottom: (index === props.blocks.length - 1) ? "3px solid black": "",
                                                    backgroundColor: color,
                                                    opacity: opacity
                                                
                                                  }}>
                {item}

            </div>
    
            ))}
    </div>)
    }

}




function Card (props) {    
    

        return (
            <CardContainer title={props.title} blocks={props.blocks} status={props.status} >
            </CardContainer>


        );
    
}
export default Card;