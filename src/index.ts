const express = require('express');
const cors = require('cors');
const http = require('http');

const app = express();
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

const port = process.env.PORT || '8080';
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

app.on("error", err => {
    console.log(err);
});

app.get('/test', (req, res) => {
    console.log("Rout Reached");
    res.send("received!");
});