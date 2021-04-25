'use strict';

const express = require('express');

// Constants
// const PORT = process.env.PORT || 8080;
const PORT = 8080;

// App
const app = express();

app.use(express.json()) // for parsing application/json
app.use(               // for parsing application/x-www-form-urlencoded
  express.urlencoded({
    extended: true
  })
)

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

app.get('/full-name/:id', nameHandler);
app.post('/full-name/:id', nameHandler);

app.listen(PORT, () =>
    console.log(`server is up`)
);