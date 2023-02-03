import Periph from "./periph/periph";
import Chron from "./chron/chron"
import TopBar from "./top_bar";
import { Outlet } from "react-router-dom";


function App() {
  
    return (
        //<Periph />
        <div >
            <TopBar />
            <div id="detail">
        <Outlet />
      </div>
        </div>
    );
}

export default App;
