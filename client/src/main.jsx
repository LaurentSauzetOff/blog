import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store } from "./redux/store.js";
import { Provider } from "react-redux";

//import ThemeProvider from "./components/ThemeProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/*  <ThemeProvider> */}
    <Provider store={store}>
      <App />
    </Provider>
    {/*   </ThemeProvider> */}
  </React.StrictMode>
);
