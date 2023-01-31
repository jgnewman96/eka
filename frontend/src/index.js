import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
  import Periph from "./periph/periph";
import Chron, {chron_loader} from "./chron/chron"
import ActiveViewer, {piece_loader} from "./chron/active_viewer"

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/chron",
          element: <Chron/>,
          loader: chron_loader,
          children: [
              {
                  path: "series/:Series/piece/:Piece",
                  element: <ActiveViewer />,
                  loader: piece_loader
              },
          ]
        },
        {path: "periph",
         element: <Periph/>
        }
      ],
    },
  ]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
