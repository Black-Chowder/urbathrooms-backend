const express = require('express');
const cors = require('cors');
const http = require('http');

const app = express();
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(express.json());

const port = process.env.PORT || '5000';
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

app.on("error", err => {
    console.log(err);
});

type InfoResp = {
    description: string,
    name: string,
    rating: number
};
app.get('/info', (req, res) => {
    console.log(`Requesting info for ${req.query.locId}`);

    let toReturn: InfoResp = {
        description: "test description",
        name: "test name",
        rating: 4.5
    }
    
    res.status(200).send(toReturn);
});