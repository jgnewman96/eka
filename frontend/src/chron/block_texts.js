import ReactMarkdown from 'react-markdown'
import {useRef, useEffect, useState} from 'react'
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';



function Block (props) {

    var backgroundColor = "transparent"
    var opacity = 0.3
    if (props.active) {
        backgroundColor = "#cc9f9160"
        opacity = 1
        
    }

    return (
        <div style={{margin: "10px", 
                width: '90%', 
                fontSize: '0.9em',
                backgroundColor: backgroundColor,
                paddingRight: "2%",
                paddingLeft: "2%",
                opacity: opacity,
               
               }}>
                    <h2 style={{fontFamily: 'Rockwell'}}> {props.title} </h2>
                    <span style={{fontFamily: "Yantramanav"}}>
                    <ReactMarkdown children={props.text}/>
                    </span>
    
    

</div>

    )
}


function BlockTexts (props) { 
    
    const [childPositions, setChildPositions] = useState([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [activeBlock, setactiveBlock] = useState(props.card_index);
    
    const containerRef = useRef(null);
    const navigate = useNavigate();
    var location = useLocation().pathname.split('/')

    

    useEffect(() => {
        console.log("SCROLL")
        console.log(props.card_index)
        console.log(activeBlock)

        if (props.card_index !== activeBlock) {

        if (childPositions.length > 0) {

        const newscrollPosition = childPositions[props.card_index]['top'] - 200
           

        setScrollPosition(newscrollPosition)
       
        containerRef.current.scroll({left: 0, top: newscrollPosition, behavior: 'smooth'})
        }}
      }, [props.card_index]);


    
    

   
  

    useEffect(() => {
        if (!containerRef.current) return;
    
        const container = containerRef.current;
        const childElements = Array.from(container.children);
        const scroll_to = childPositions[activeBlock]
        setScrollPosition(scroll_to)
        container.scrollTo(scroll_to)
       // console.log(scrollPosition)
    
        const updateChildPositions = () => {
          setChildPositions(
            childElements.map((child) => (
                
                
                {
              top: child.offsetTop,
              middle: child.offsetTop + (child.offsetHeight / 2),
              height: child.offsetHeight,
            }))
          );
          setScrollPosition(container.scrollTop + (container.offsetHeight / 2));
        };
    
        updateChildPositions();
        container.addEventListener("scroll", updateChildPositions);
    
        return () => {
          container.removeEventListener("scroll", updateChildPositions);
        };
      }, []);




      var distances = []
     
      for (let i = 0; i < childPositions.length; i++ ) {
          const position = childPositions[i]['middle']
          distances.push(Math.abs(scrollPosition - position))
      }
      const newActiveBlock = distances.indexOf(Math.min(...distances))
      if (newActiveBlock > -1) {
      if (newActiveBlock != activeBlock) {
            location.pop()
            location.push(newActiveBlock)
            setactiveBlock(newActiveBlock)
            navigate(location.join('/'));
      }
    }


   

    
    

    return (
      
        <div style={{display: 'grid',
                 height: '87%',
                 width: '100%',
                 overflowY: "scroll",
                 overflowX: "visible"}}
                 ref={containerRef}
    
    >
       
        {props.blocks_text.map((item, index) => (
            <Block key={index} title={props.blocks[index]} text={item} active={index == activeBlock}/>

        



))}

        

        



    </div>
           



    );

}
export default BlockTexts;