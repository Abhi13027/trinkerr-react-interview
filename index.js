const express = require('express');
const data = require('./data');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
const token = process.env.userToken;

app.get('/api/user-access-token', (req, res) => {
    res.send({token});
})


app.get('/api/data', leanAuth, (req, res) => {
    let filteredData;
    const searchString = req.query.search_string;
    if(searchString) {
        filteredData = data.filter((item) => item[0].toLowerCase().includes(searchString.toLowerCase()));
    }else{
        filteredData = data;
    }
    res.send(filteredData);
})

app.post('/api/data', leanAuth, (req, res) => {
    const {name, ltp, lcp} = req.body;
    if(!name || !ltp || !lcp){
        return res.send('Please Provide Valid Data');
    }
    if(typeof name !== "string" || typeof ltp !== "number" || typeof lcp !== "number"){
        return res.send("Please provide the correct data type")
    }
    if(typeof name.split("::")[0] !== "string" || name.split("::")[1] !== "NSE"){
        return res.send("Please check the input format for stock");
    }

    const newStock = [];
    newStock.push(name, ltp, lcp);
    res.send("Added the Stock Successfully");
})


app.listen(5000, () => {
    console.log('The server is up and running')
})


function leanAuth (req, res, next) {
    const userAccessToken = req.headers['user-access-token'];
    if(userAccessToken == token){
        next();
    }else{
        return res.send('The user is unauthorized to have access to the data');
    }
}
