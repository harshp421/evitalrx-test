import express from 'express';
import dotenv from 'dotenv';
const app = express();

dotenv.config();
const PORT=process.env.PORT || 3333;



//initial test route
app.get('/', (req, res) => {
    res.send('Hello World!');
});


// staring the server 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }
);