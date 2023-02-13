function StatusSelector (props) {    
    

    return (
       <div style={{position: "absolute", 
                    display: "grid", 
                    gridTemplateColumns: "auto auto auto",
                    top: -60,
                    right: 40}}>

           <div style={{margin: "0.5em",
                        padding: "0.5em",
                        paddingLeft: "0.5em",
                        borderRadius: 20,
                        backgroundColor: '#A3E291'}}> 


            <input type="checkbox" 
                 checked={props.showFinished}
                 onChange={props.handleShowFinished}
            />
                       Finished  </div>


           <div style={{margin: "0.5em",
                         padding: "0.5em",
                         paddingLeft: "0.5em",
                         borderRadius: 20, 
                         backgroundColor: '#E9F49D'}}>
            <input type="checkbox" 
                 checked={props.showInProgress}
                 onChange={props.handleShowInProgress}
            /> In Progress</div>
           <div style={{margin: "0.5em",
                         padding: "0.5em",
                         paddingLeft: "0.5em",
                         borderRadius: 20, 
                         backgroundColor: '#F0C9F780',
                         opacity: 0.6
                         }}>
             <input type="checkbox" 
                 checked={props.showAbandoned}
                 onChange={props.handleShowAbandoned}
            /> Abandoned </div>
           


       </div>


    );

}
export default StatusSelector;