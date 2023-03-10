const express = require('express');
const app = express();
const PORT = 5500;

app.use(express.static('public'));

app.use(() => {
    console.log("New request")
})

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.json({name:"me"});
    //res.sendFile("index.html", {root: path.join(__dirname, 'public')});
})

app.post("/task", (req, res) => {
    console.log("NEW POST", req.body)
    res.statusCode = 200;
    res.send("Worked !");
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

module.exports = app;
