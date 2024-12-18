import * as mongoose from 'mongoose'

const userschema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true }
})

export type User = mongoose.InferSchemaType<typeof userschema>
export const User = mongoose.model("User", userschema)