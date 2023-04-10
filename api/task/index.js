const fs = require('fs');

const taskStore = {};

export default (req, res) => {
    const requestMethod = req.method;
    console.log(requestMethod)
    console.log(req.body)
    switch (requestMethod) {
    case 'POST':
        // const body = JSON.parse(req.body);
        fs.appendFile('./storage/tasks.txt', req.body, err => {
          if (err) {
            console.error(err);
          }
  // file written successfully
});
        
      //res.status(200).json({ message: `You submitted a post request: ${body}` })
      res.status(200).json({ message: 'You submitted a post request!'})
      break;
    // handle other HTTP methods
    default:
      res.status(200).json({ message: 'You submitted a get request!'})
  }
}