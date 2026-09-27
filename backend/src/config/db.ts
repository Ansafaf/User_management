import mongoose from "mongoose";
const connectDb = async():Promise<void> =>{
    try{
        await mongoose.connect(process.env.MONGO_URI!);
    }
    catch(err){
        console.log('Mongodb connection failed',err);
    }
}

export default connectDb;