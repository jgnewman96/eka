import React, { Component, } from "react";


class TwoFingerScrollZoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      height_unit: 0,
      width_unit: 0,
      x: 0,
      y: 0,
      zoom: 1,
      width: 98,
      height: 90,
      animating: false
    };

    
    this.handleWheel = this.handleWheel.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  

  handleWheel(event) {
    // Check if the event was triggered by a two-finger touch
    event.preventDefault()
    if (this.state.animating) {
        return
    }


    const child = this.container.children[0]
    const gridCoords = child.getBoundingClientRect()
    const gridWidth = gridCoords.width
    const gridHeight = gridCoords.height

    

    
    var deltaY = event.deltaY;
    const deltaX = event.deltaX

    const is_scroll = Number.isInteger(deltaY)

    if (is_scroll) {
       
        child.scrollBy(deltaX, deltaY)
        return
    }
   
    
    
    var scaleFactor = this.state.zoom < 1 ? .02 : 0.01;

    deltaY = deltaY * scaleFactor
  



    const newZoom = this.state.zoom - deltaY ;
    if (newZoom < 0.2) {
        return
    }

    const zoomDifference = newZoom - 1 
    var newWidth = 98 - zoomDifference * 100;
    var newHeight = 90 - zoomDifference * 400;

   


    
    

    newHeight = Math.max(newHeight, 90)
    newWidth = Math.max(newWidth, 98)


    const Xmovement = newWidth * this.state.width_unit  *  zoomDifference  / 2
    const Ymovement = newHeight * this.state.height_unit   *  zoomDifference / 2
   // console.log(Xmovement, Ymovement)

    

    
    var newY =  Ymovement
    var newX =   Xmovement
    
    
    if (newZoom > 2.0) {
        return
     }


      if (newZoom > 0) {
        this.setState({
         zoom: newZoom,
         animating: true,
        height: newHeight,
        width: newWidth,
          y: newY,
         x: newX
        
        });
      }

      child.animate(
        [
            { transform: `translate(${newX}px, ${newY}px) scale(${newZoom})` },

        ], {
        duration: 1,
        iterations: 1,
        fill: 'forwards',
    }).onfinish = () => {
        this.setState({
            animating: false,
         
           
           });

        



    };
   
  
  }

  componentDidMount () {
    this.container.addEventListener('wheel', this.handleWheel, { passive: false });
    document.addEventListener('keydown', this.handleKeyDown);
    const child = this.container.children[0]
    const gridCoords = child.getBoundingClientRect()
    const height_unit = gridCoords.height / this.state.height
    const width_unit = gridCoords.width / this.state.width


    this.setState({
        height_unit: height_unit,
        width_unit: width_unit,
       
       });
     
   
  }

  componentWillUnmount () {
    this.container.removeEventListener('wheel', this.handleWheel, { passive: false });

  }

  handleResetClick (e) {
      
    const child = this.container.children[0]

    this.setState({
        zoom: 1,
       height: 90,
        y: 0,
        x:0,
        width: 98
      
      });

      child.animate(
        [
            { transform: `translate(${0}px, ${0}px) scale(${1})` },

        ], {
        duration: 1000,
        iterations: 1,
        fill: 'forwards',
    })

    child.scrollTo(0, 0)


}

handleKeyDown =  (e) => {
    if (e.key == "r") {
        this.handleResetClick(e)
    }
}

 


  render() {
    const containerStyle = {
      overflow: "hidden",
      height: `${this.state.height}vh`,
      width: `${this.state.width}%`,
      zIndex: "1",
      position: 'relative',
    
    };

    return (
        <div style={{height: '90vh',
                     width: '98%'}}
                     ref={(el) => {this.container = el}}
                     >
      <div
        style={containerStyle}
       
       
      >
        {this.props.children}
      </div>
      <div style={{backgroundColor: 'lightgray',
                            top: "80vh",
                            left: "50vw",
                             height: "2.8em",
                             width: "5em",
                             position: "absolute",
                             textAlign: "center",
                             borderRadius: "8px",
                             boxShadow: "5px 5px 5px black",
                             zIndex: "2000"
                             
                             
                             
                }}> 
                {Math.round(this.state.zoom * 100) + "%"}
                <div  style={{backgroundColor: "rgba(39, 54, 245, 0.41)", 
                             boxShadow: "1px 1px 5px black",
                              borderRadius: "10px ",
                              zIndex: "2100"
                              }} 
                        onClick={this.handleResetClick}> Reset <span style={{backgroundColor: "white",
                                                                             fontWeight: "bold",
                                                                             borderRadius: "8px"}}>  R</span></div>
                
                </div>
      </div>
      
    );
  }
}

export default TwoFingerScrollZoom;