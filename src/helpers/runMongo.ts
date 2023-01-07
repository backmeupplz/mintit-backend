import * as mongoose from 'mongoose'
import env from './env'

mongoose.set('strictQuery', true)

export default function (mongoUrl = env.MONGO) {
  return mongoose.connect(mongoUrl)
}
