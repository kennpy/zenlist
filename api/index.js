const fs = require('fs');
var path = require('path')
var currentDir = path.resolve(process.cwd());

const taskStore = {};

export default (req, res) => {
    const requestMethod = req.method;
    console.log(requestMethod)
    console.log(req.body)
    //res.send('{"HARDCODED EXAMPLE":[false,"978a8058-6376-4c80-86a1-9697be3b4509",0]}{"test":[false,"1a1326f2-c60d-4df1-ba92-65352b49c64c",0]}');
    switch (requestMethod) {
    case 'POST':
      
      res.status(200).json({ message: 'You made a get (GET) request!'})
      break;
    // handle other HTTP methods
    default:

        //const body = JSON.parse(req.body);
        // console.log(currentDir);
        // //res.status(200).json({ message: `You submitted a post request: ${body}` })
        // let myLog = new File("./storage/tasks.txt");

        // See if the file exists
        // if(myLog.exists()){
        //     res.send('The file exists');
        // }
        // else{
        //     res.send("File does not exist")
        // }
        try{
            fs.readFile('../../storage/tasks.txt', 'utf8', (err, data) => {
            if (err) {
            console.error(err);
            res.send(currentDir)
            //res.send(err.message, err.code, err.stack);
            }
            res.send(data);
        });    
        }
        catch (error) {
            res.send(currentDir)
        }

    //   res.status(200).json({ message: 'You submitted a get (POST) request!'})

  }
}