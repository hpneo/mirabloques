require("@rails/ujs").start();
import React from "react";
import ReactDOM from "react-dom";
import Application from "pages/main";
import "./index.css";

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(<Application />, document.getElementById("root"));
});
