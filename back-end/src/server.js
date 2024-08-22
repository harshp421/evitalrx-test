import express from 'express';
import dotenv from 'dotenv';
import dbConfig from './config/DB.Config.js';
import { ErrorMiddleware } from './middleware/error.middleware.js';
import userRouter from './routes/user.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();

dotenv.config();
const PORT=process.env.PORT || 3333;



//body parser
app.use(express.json({limit: '50mb'}));

//cookie parser
app.use(cookieParser());

app.use(cors());


//initial test route
app.get('/', (req, res) => {
    res.send('Hello World!');
});


//routes

//user routes
app.use('/api/v1/user', userRouter);

//unhandled routes  just like 404 page
app.all('*',(req,res,next)=>{
    const error = new Error(`Can't find ${req.originalUrl} on this server`);
    error.statusCode = 404;
    next(error);
})


app.use(ErrorMiddleware);
// staring the server 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    //database connection
     dbConfig();
    }
);