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
    const [lastScrollPosition, setLastScrollPosition] = useState(0);
    const [activeBlock, setactiveBlock] = useState(props.card_index);
    
    const containerRef = useRef(null);
    const navigate = useNavigate();
    var location = useLocation().pathname.split('/')

    

    useEffect(() => {

        if (props.card_index !== activeBlock) {

        if (childPositions.length > 0) {

        const newscrollPosition = childPositions[props.card_index]['top']
           

        setScrollPosition(newscrollPosition)
       
        containerRef.current.scroll({left: 0, top: newscrollPosition - 20, behavior: 'smooth'})

        setTimeout( function() { containerRef.current.scroll({left: 0, top: newscrollPosition}); }, 800);

        
        }}
        
      }, [props.card_index]);

      useEffect(() => {
        setLastScrollPosition(scrollPosition);
      }, [scrollPosition]);


    
    

   
  

    useEffect(() => {
        if (!containerRef.current) return;
    
        const container = containerRef.current;
        const childElements = Array.from(container.children);
    
        const updateChildPositions = () => {
          setChildPositions(
            childElements.map((child) => (
                
                
                {
              top: child.offsetTop - 130,
              bottom: child.offsetTop + child.offsetHeight - 400,
            }))
          );
         
          setScrollPosition(container.scrollTop);
         
          
        };

        
    
        updateChildPositions();
        container.addEventListener("scroll", updateChildPositions);

        console.log(activeBlock)


        const newscrollPosition = childElements[activeBlock].offsetTop

        container.scroll({left: 0, top: newscrollPosition - 130, behavior: 'smooth'})
        setScrollPosition(newscrollPosition)
    
        return () => {
          container.removeEventListener("scroll", updateChildPositions);
        };
      }, []);

      if (scrollPosition !== lastScrollPosition) {
          const direction = scrollPosition -  lastScrollPosition
         



      var distances = []
     
      for (let i = 0; i < childPositions.length; i++ ) {
          var position = 0
          if (direction > 0) {
          position = childPositions[i]['top']
          }
          else {
              position = childPositions[i]['bottom']
          }
          distances.push(Math.abs(scrollPosition - position))
          
      }
      console.log(distances)
      const newActiveBlock = distances.findIndex(x => x < 100);
     // console.log(index)

      if (newActiveBlock > -1) {
      if (newActiveBlock != activeBlock) {
            location.pop()
            location.push(newActiveBlock)
            setactiveBlock(newActiveBlock)
            navigate(location.join('/'));
      }
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