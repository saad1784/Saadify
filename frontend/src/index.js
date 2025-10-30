import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {Provider} from "react-redux";
import store from "./component/redux/store.js";

console.log("API URL:", process.env.REACT_APP_API_URL);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
    </React.StrictMode>
);

