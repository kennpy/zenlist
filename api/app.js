const express = require('express');
const app = express();
const PORT = 3050;

app.use(express.static('public'));

app.use(() => {
    console.log("New request")
})

app.post("/", (req, res) => {
    console.log("NEW POST", req.body)
    res.statusCode = 404;
    res.send(`Error ${res.statusCode}`);
})

// app.listen(PORT, () => {
//     console.log(`listening on port ${PORT}`)
// })
