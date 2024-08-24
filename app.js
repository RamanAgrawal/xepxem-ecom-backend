import express from 'express'
import {router} from './routers/index.js'
import cors from 'cors'
import path from 'path'



const app = express();

// let corsOption = {
//     origin: 'http://localhost:5173',
//     credentials: true,
//     methods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'DELETE']
// }

app.use(express.json())
app.use(cors())
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));

app.use(express.static("public"));

app.get('/', (req, res) =>{
    send('fine :::')
    
})
app.use("/api/v1", router)




export {app}