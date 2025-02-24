import express from 'express';
import morgan from 'morgan';
import 'dotenv/config'
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from "./router/authentication/auth.js";

const app = express();
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);
app.use(morgan('tiny'));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('mongodb Connected'))
.catch(err => console.log('mongodb Connection Error: ', err));


app.use("/auth", authRoutes);

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

app.listen(process.env.PORT , () => console.log('SERVER IS RUNNING'))