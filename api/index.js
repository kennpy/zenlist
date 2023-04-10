const fs = require('fs');
var path = require('path')
var currentDir = path.resolve(process.cwd());

const taskStore = {};

export default (req, res) => {
    const requestMethod = req.method;
    console.log(requestMethod)
    console.log(req.body)
    switch (requestMethod) {
    case 'POST':
      
      res.status(200).json({ message: 'You made a get (GET) request!'})
      break;
    // handle other HTTP methods
    default:

        //const body = JSON.parse(req.body);
        console.log(currentDir);
        //res.status(200).json({ message: `You submitted a post request: ${body}` })
        fs.readFile('./storage/tasks.txt', 'utf8', (err, data) => {
            if (err) {
            console.error(err);
            return;
            }
            res.send(data);
        });      
      //res.status(200).json({ message: 'You submitted a get (POST) request!'})

  }
}