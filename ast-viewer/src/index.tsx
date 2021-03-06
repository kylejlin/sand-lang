import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import parseTreeSource from "./parseTreeSource";
import * as serviceWorker from "./serviceWorker";
import stateSaver from "./stateSaver";

window.addEventListener("error", () => {
  stateSaver.clear();
});

ReactDOM.render(
  <App treeSourceParser={parseTreeSource} stateSaver={stateSaver} />,
  document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
