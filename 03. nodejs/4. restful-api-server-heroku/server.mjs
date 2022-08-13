// const express = require('express') // doesnt work in modulejs
import express from "express"
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

// let port = null;
// if (process.env.PORT) {
//     port = process.env.PORT;
// } else {
//     port = 3000
// }

let users = []; // TODO: replace this with mongoDB

function randomNumber() {
    return Math.floor(Math.random() * 100000000000);
}


app.post("/user", (req, res) => {

    console.log(req.body); // https://expressjs.com/en/4x/api.html#req.body

    let newUser = {
        id: randomNumber(),
        fullname: req.body.fullname,
        username: req.body.username,
        password: req.body.password
    }

    users.push(newUser);
    res.status(201).send("user is created"); // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses
})

app.get("/user/:userId", (req, res) => { // get single user

    let userId = req.params.userId;
    let isFound = false;

    for (let i = 0; i < users.length; i++) {
        if (users[i].id == userId) {
            res.send(users[i]);
            isFound = true;
            break;
        }
    }
    if (!isFound) {
        res.status(204).send("user not found");
    }
})

app.get("/users", (req, res) => { // get all users
    res.send(users);
})

app.put("/user/:userId", (req, res) => { // to modify single user
    res.send("your user is modified");

    let userId = req.params.userId;
    let userIndex = -1

    for (let i = 0; i < users.length; i++) {
        if (users[i].id == userId) {
            userIndex = i;
            break;
        }
    }

    if (userIndex === -1) {
        res.status(204).send("user not found");
    } else {

        if (req.body.fullname) {
            users[userIndex].fullname = req.body.fullname
        };
        if (req.body.username) {
            users[userIndex].username = req.body.username
        };
        if (req.body.password) {
            users[userIndex].password = req.body.password
        };

        res.send(users[userIndex]);
    }
})

app.delete("/user/:userId", (req, res) => { // delete single user

    let userId = req.params.userId;
    let userIndex = -1

    for (let i = 0; i < users.length; i++) {
        if (users[i].id == userId) {
            userIndex = i;
            break;
        }
    }

    if (userIndex === -1) {

        res.status(204)
        res.send("user not found");

    } else {

        users.splice(userIndex, 1);
        res.send("user is deleted");
    }
})

app.delete("/users", (req, res) => { // delete all users
    
    users = [];
    
    res.send("all users deleted");
})


app.get('/', (req, res) => {
    console.log("aik request server per i");
    res.send('Hello World!')
})

app.get('/profile', (req, res) => {
    console.log("aik request server per i");
    res.send('this is a profile!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})