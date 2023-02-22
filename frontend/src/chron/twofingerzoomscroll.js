import React, { Component, } from "react";


class TwoFingerScrollZoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      x: 0,
      y: 0,
      zoom: 1,
      width: 98,
      height: 90
    };

    
    this.handleWheel = this.handleWheel.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
  }
  

  handleWheel(event) {
    // Check if the event was triggered by a two-finger touch
    event.preventDefault()

    
    const deltaY = event.deltaY;
    const deltaX = event.deltaX

    const is_scroll = Number.isInteger(deltaY)

    if (is_scroll) {
       
        this.container.scrollBy(deltaX, deltaY)
        return
    }
    
    
    var scaleFactor = this.state.zoom < 1 ? 0.009 : 0.011;
    scaleFactor = scaleFactor * ( this.container.offsetWidth / 1400)



    const newZoom = this.state.zoom - deltaY * scaleFactor;
    if (newZoom < 0.1) {
        return
    }
    const newWidth = this.state.width + deltaY * 3;
    var newHeight = this.state.height + (deltaY * 3);
    
    

    var movementFactor = newWidth / 25;


    if (this.state.zoom > 3) {
        movementFactor = movementFactor * 0.05
    }


    if (this.state.zoom > 2) {
        movementFactor = movementFactor * 0.5
    }
   

    if (this.state.zoom > 1.5) {
        movementFactor = movementFactor * 1.1
    }


    if (this.state.zoom > 1) {
        movementFactor = movementFactor * 1.9
    }

    else if (this.state.zoom > 0.8) {
        movementFactor = movementFactor * 2.4
    }

    else if (this.state.zoom > 0.6) {
        console.log('yeah')
        movementFactor = movementFactor * 3.5
    }

    else if (this.state.zoom > 0.4) {
        movementFactor = movementFactor * 4.8
    }
    else if (this.state.zoom > 0.3) {
        movementFactor = movementFactor * 5.5
    }

    else if (this.state.zoom > 0.2) {
        movementFactor = movementFactor * 5.5
    }

    else { 
          movementFactor = movementFactor * 5.5
        }
    console.log(this.state.zoom, movementFactor)
   

    newHeight = Math.max(newHeight, 90)
    
    var newY = this.state.y - deltaY * movementFactor
   // console.log(newY)
    const newX = this.state.x - deltaY * movementFactor

    if ( Math.abs(1 - newZoom) < .2) {
        newY = 0;
    }
    
    


      if (newZoom > 0) {
        this.setState({
          zoom: newZoom,
         height: newHeight,
          y: newY,
        
        });
      }
    
   
  
  }

  componentDidMount () {
    this.container.addEventListener('wheel', this.handleWheel, { passive: false });
  }

  componentWillUnmount () {
    this.container.removeEventListener('wheel', this.handleWheel, { passive: false });

  }

  handleResetClick (e) {

    this.setState({
        zoom: 1,
       height: 90,
        y: 0,
      
      });


}

 


  render() {
    const containerStyle = {
      transform: `translate(${this.state.x}px, ${this.state.y}px) scale(${this.state.zoom})`,
      transition: "transform 0.2s",
      overflow: "hidden",
      height: `${this.state.height}vh`,
      width: `${this.state.width}%`,
      zIndex: "1",
      position: 'relative',
    
    };

    return (
        <div>
      <div
        style={containerStyle}
        ref={(el) => {this.container = el}}
       
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
                        onClick={this.handleResetClick}> Reset</div>
                
                </div>
      </div>
      
    );
  }
}

export default TwoFingerScrollZoom;