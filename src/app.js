const express = require('express');
const cors = require('cors');
require('./db/mongoose');
const userRouter = require('./routers/user');
const cartRouter = require('./routers/cart');
const courseRouter = require('./routers/course');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(cartRouter);
app.use(courseRouter);

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});