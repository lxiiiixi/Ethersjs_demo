import React from 'react';
import { createRoot } from "react-dom/client"
import App from './App';
let app = createRoot(document.getElementById("root"));
app.render(<App></App>)