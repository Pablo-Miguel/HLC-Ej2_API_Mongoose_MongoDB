const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const courseRouter = require('./routers/course');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(courseRouter);

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});