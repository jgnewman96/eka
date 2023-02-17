import React from "react"
import { Link } from "react-router-dom";


function TopBar() {
        return (
            <div className="top_bar" style={{
                width: "98.2vw",
                height: "40px",
                fontSize: "35px",
                fontFamily: "Rockwell",
                color: "black",
                borderColor: "gray",
                paddingBottom: "10px",
                textAlign: "center",
               
            }}>
                 <Link to="/" style={{ textDecoration: "none", color: "black"}}>
                    Chron
                                        
                          
                </Link>
                

            </div>
        );
    
}
export default TopBar;