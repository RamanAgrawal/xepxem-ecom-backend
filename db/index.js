import mongoose from 'mongoose'

async function MongoDB(){
    try {

        await mongoose.connect(process.env.MONGO_DB,{
 useNewUrlParser: true,
      useUnifiedTopology: true,})
        console.log("MongoDB connected Succeefully !!");

        
    } catch (error) {
        console.log('MongoDB connection error', error);
        
    }
}

export default MongoDB;
