import * as mongoose from 'mongoose'

const requestschema = new mongoose.Schema({
    product: { type: String, required: true },
    problem: { type: String, required: true },
    description: { type: String }
})

export type Request = mongoose.InferSchemaType<typeof requestschema>
export const Request = mongoose.model("Request", requestschema)