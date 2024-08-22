
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();



 const dbConfig =async ()=>{
    //console.log(process.env.MONGO_URI);
   try{
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    
   }catch(err){
         console.log(err);
         setTimeout(dbConfig, 5000);
    }
}

export default dbConfig;