import mongoose from "mongoose";

const connectMongodb = async() => {
  try{
        const conn = await mongoose.connect(process.env.MONGO_URI) ;
        console.log(`MongodB connected: ${conn.connection.host}`) ;
  }catch(error){
    console.log(`Error connection to mongoDB: ${error.message}`) ;
    process.exit(1) ;
  }
}

export default connectMongodb;