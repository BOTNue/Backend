import * as mongoose from 'mongoose'
import Elysia from 'elysia'
import { cors } from '@elysiajs/cors'
import { User } from './models/user'
import { Request } from './models/request'
import { Helper } from './models/helper'

const db = await mongoose.connect("Enter MongoDB connection here");

interface LoginRequestBody {
    name: "string",
    password: "string"
}

new Elysia()
    .use(cors())
    .post("/user", async ({ body, set }) => {
        const newUser = new User({
            name: body.name,
            password: body.password
        });
        try {
            await newUser.save()
        } catch (error) {
            set.status = 400
            return error
        }
        return newUser
    })

    .post("/helper", async ({ body, set }) => {
        const newHelper = new Helper({
            name: body.name,
            password: body.password,
            skills: body.skills,
            rating: body.rating
        })
        try {
            await newHelper.save()
        } catch (error) {
            set.status = 400
            return error
        }
        return newHelper
    })

    .get("/helper", async ({ query, set }) => {
        const { name, password, skills, rating } = query

        const filter: Record<string, any> = {}
        if (name) filter.name = name
        if (password) filter.password = password
        if (skills) filter.skills = skills
        if (rating) filter.rating = rating

        try {
            const helper = await Helper.find(filter)
            if (helper.length === 0) {
                set.status = 404
                return { message: "No helpers found matching search" }
            }
            return helper
        } catch (error) {
            set.status = 500
            return { message: "Error fetching helpers" }
        }
    })

    .post("/request", async ({ body, set }) => {
        const newRequest = new Request({
            product: body.product,
            problem: body.problem,
            description: body.description
        })
        try {
            await newRequest.save()
        } catch (error) {
            set.status = 400
            return error
        }
        return newRequest
    })

    .get("/request", async ({ query, set }) => {
        const { product, problem, description } = query

        const filter: Record<string, any> = {};
        if (product) filter.product = product
        if (problem) filter.problem = problem
        if (description) filter.description = description

        try {
            const request = await Request.find(filter)
            if (request.length === 0) {
                set.status = 404
                return { message: "No requests found mathing search" }
            }
            return request
        } catch (error) {
            set.status = 500
            return { message: "Error fetching requests" }
        }
    })

    .post("/login", async ({ body, set }) => {
        const { name, password } = body as LoginRequestBody;

        const user = await User.findOne({ name });

        if (!user) {
            set.status = 404;
            return { message: "User not found" };
        }

        if (user.password !== password) {
            set.status = 401;
            return { message: "Invalid pasword" };
        }

        return { message: "Login successful", user }
    })

    .listen(3030);
console.log("Listening at 3030")