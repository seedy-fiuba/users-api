'use strict';

const express = require('express');
const bodyParser = require('body-parser');

// Constants
 const PORT = process.env.PORT || 8080;
// App
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

function nameHandler(req, res) {
    console.log("incoming request...")
    console.log(req.params)
    console.log(req.body)
    console.log(req.query)

    let name = ""
    let lastname = ""
    let id = 0
    try {
        name = req.query["name"]
        lastname = req.body["last_name"]
        id = req.params["id"]
    } catch (e) {
        console.log(e);
        console.error(e.message)

        res.status(500).send('Name or lastname is misssing!');
        return
    }

    let respBody = {
        "full name": "Hello " + id.toString() + " " + name + " " + lastname
    }

    res.json(respBody);
}

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/full-name/:id', (req, res) => {
    console.log(req.params)
    console.log(req.body)
    console.log(req.query)

    let name = ""
    let lastname = ""
    let id = 0
    try {
        name = req.query["name"]
        lastname = req.body["last_name"]
        id = req.params["id"]
    } catch (e) {
        console.log(e);
        console.error(e.message)

        res.status(500).send('some field is misssing!');
        return
    }

    let respBody = {
        "full_name": "Hello " + id.toString() + " " + name + " " + lastname
    }

    res.status(200).json(respBody);
});

app.listen(PORT, () =>
    console.log(`server is up`)
);