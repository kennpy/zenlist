const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());

app.use((req, res) => {
    console.log("New request", req.body)
})

// app.use(express.static("public"))
app.get("/", (req, res) => {
    console.log("/");
    res.json({name:"get"});
    //res.sendFile("index.html", {root: path.join(__dirname, 'public')});
})

app.post("/", (req, res) => {
    console.log("/");

    res.json({name:"get"});
    //res.sendFile("index.html", {root: path.join(__dirname, 'public')});
})

app.get("/api", (req, res) => {
    console.log("/api");

    res.json({name:"get"});
    //res.sendFile("index.html", {root: path.join(__dirname, 'public')});
})

app.post("/api", (req, res) => {
    console.log("/api");
    res.json({name:"post"});
    //res.sendFile("index.html", {root: path.join(__dirname, 'public')});
})

app.post("/api/task", (req, res) => {
    console.log("NEW POST /api/task", req.body)
    res.statusCode = 200;
    res.end("Worked !");
})

app.get("/api/task", (req, res) => {
    console.log("NEW get /api/task", req.body)
    res.statusCode = 200;
    res.send("worked  !");
})

// app.listen(PORT, () => {
//     console.log(`listening on port ${PORT}`)
// })

module.exports = app;
