import mongoose from 'mongoose'
import dotenv from 'dotenv';

dotenv.config();


async function connectToDb() {

  const MONGODB_PASSWORD= process.env.MONGODB_PASSWORD

    try {
      mongoose.connect(`mongodb+srv://talmoshel444:${MONGODB_PASSWORD}@cluster0.snefe8v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
      .then((res)=>{
        console.log('connected to DB!')
        return res
      })
    } catch (error) {
      return Promise.reject(new Error(error))
    }
  }


export default connectToDb