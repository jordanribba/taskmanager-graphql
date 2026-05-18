require("dotenv").config();
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const cors = require("cors");
const connectDB = require("./config/db");
const User = require("./models/User");
const Task = require("./models/Task");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function startServer() {

    await connectDB();

     // Crear aplicación Express
    const app = express();

     // Habilitar CORS
    app.use(cors());
    
    // Schema GraphQL
    const typeDefs = gql`

    type User {
        id: ID!
        username: String!
        email: String!
    }

    type Task {
        id: ID!
        title: String!
        completed: Boolean!
        createdAt: String!
    }

    type Auth {
        token: String!
        user: User!
    }

    type Query {
        getTasks: [Task]
    }

    type Mutation {

        register(
            username: String!,
            email: String!,
            password: String!
        ): User

        login(
            email: String!,
            password: String!
        ): Auth

        createTask(
            title: String!
        ): Task

    }

`;
// Resolvers
    const resolvers = {

        Query: {

            getTasks: async () => {

                return await Task.find();

            }

        },

        Mutation: {

            register: async (_, { username, email, password }) => {

                const hashedPassword = await bcrypt.hash(password, 10);

                const user = new User({
                    username,
                    email,
                    password: hashedPassword
                });

                await user.save();

                return user;

            },

            login: async (_, { email, password }) => {

                const user = await User.findOne({ email });

                if (!user) {
                    throw new Error("Usuario no encontrado");
                }

                const validPassword = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!validPassword) {
                    throw new Error("Password incorrecto");
                }

                const token = jwt.sign(
                    {
                        userId: user.id
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1d"
                    }
                );

                return {
                    token,
                    user
                };

            },

            createTask: async (_, { title }) => {

                const task = new Task({
                    title
                });

                await task.save();

                return task;

            }

        }

    };
// Crear servidor Apollo
    const server = new ApolloServer({
        typeDefs,
        resolvers
    });
// Iniciar Apollo
    await server.start();
// Conectar Apollo con Express
    server.applyMiddleware({ app });
    // Puerto
    const PORT = 4000;
 // Levantar servidor
    app.listen(PORT, () => {
        console.log(`Servidor listo en http://localhost:${PORT}${server.graphqlPath}`);
    });

}

startServer();