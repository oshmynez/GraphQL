const express = require('express')
const {graphql, buildSchema} = require('graphql')
const {graphqlHTTP} = require('express-graphql')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title: String,
    message: String,
    status: String,
    date: String,
}, {versionKey: false})

const userSchema = new Schema({
    email: {type: String, unique: true, required: true},
    pass: {type: String, unique: true, required: true}
}, {versionKey: false})

const articles = mongoose.model("Article", articleSchema)

const users = mongoose.model("User", userSchema)

const schema = buildSchema(`
    type Article {
        title: String
        message: String
        status: String
        date: String
    }
    type Query{
        getAllArticles: [Article]
    }
    type Mutation {
        createArticle(title: String!, message: String!, status: String!, date: String!): Article
    }
`)

const rootValue = {
    getAllArticles: () => {
        return articles.find({})
    },
    createArticle: ({title, message, status, date}) => {
        const article = {title, message, status, date}
        articles.create(article).then(r => {
            console.log(r)
        })
        return article
    }
}

const app = express()
app.use(cors())


app.use(`/graphql`, graphqlHTTP({
    rootValue, schema, graphiql: true
}))


async function start() {
    try {
        await mongoose.connect('mongodb+srv://dima:<password>@cluster0.uwrbc.mongodb.net/websokets',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            }
        )
        app.listen(4000, () => {
            console.log('Server has been started...')
        })
    } catch (e) {
        console.log(e)
    }
}

start()
