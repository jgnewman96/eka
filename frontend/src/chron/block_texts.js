import ReactMarkdown from 'react-markdown'
import {useRef, useEffect, useState} from 'react'



function Block (props) {

    var backgroundColor = "transparent"
    var opacity = 0.3
    if (props.active) {
        backgroundColor = "#cc9f9160"
        opacity = 1
        
    }

    return (
        <div style={{margin: "10px", 
                width: '94%', 
                fontSize: '0.9em',
                backgroundColor: backgroundColor,
                paddingRight: "2%",
                paddingLeft: "2%",
                opacity: opacity
               }}>
                    <h2> {props.title} </h2>
                    <ReactMarkdown children={props.text}/>
    
    

</div>

    )
}


function BlockTexts (props) { 
    
    const [childPositions, setChildPositions] = useState([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [activeBlock, setactiveBlock] = useState(0);
    
    const containerRef = useRef(null);

   
  

    useEffect(() => {
        if (!containerRef.current) return;
    
        const container = containerRef.current;
        const childElements = Array.from(container.children);
    
        const updateChildPositions = () => {
          setChildPositions(
            childElements.map((child) => (
                
                
                {
              middle: child.offsetTop + (child.offsetHeight / 2),
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
      console.log(distances)
      const newActiveBlock = distances.indexOf(Math.min(...distances))
      if (newActiveBlock !== activeBlock) {
          setactiveBlock(newActiveBlock)
      }


   

    
    

    return (
      
        <div style={{display: 'grid',
                 height: '88%',
                 width: '96%',
                 overflow: "scroll"}}
                 ref={containerRef}
    
    >
       
        {props.blocks_text.map((item, index) => (
            <Block key={index} title={props.blocks[index]} text={item} active={index === activeBlock}/>

        



))}

        

        



    </div>
           



    );

}
export default BlockTexts;