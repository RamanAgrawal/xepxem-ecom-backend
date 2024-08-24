import MongoDB from "./db/index.js";
import dotenv from 'dotenv'
import { app } from "./app.js";

dotenv.config()

const PORT = process.env.PORT || 1000

// MongoDB().then(()=> {
    app.listen(PORT, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
// })

// .catch((error) => {
//     console.log("MongoDB connextion failed !!!", error);
// })

