import { json } from 'body-parser';

const fs = require('fs');


const taskStore = {};

export default (req, res) => {
    const requestMethod = req.method;
    console.log("method :", requestMethod)
    console.log("body ",req.body.id)
    const id = req.body.id;
    console.log("body type ",typeof req.body)
    switch (requestMethod) {
    case 'POST':
        // const body = JSON.parse(req.body);
        fs.appendFile('./storage/tasks.txt', req.body, err => {
          if (err) {
            console.error(err);
          }
          console.log("added new task")
  // file written successfully
        });
        break
      case 'DELETE':
        console.log("deleting?")
        for(const [key, value] of Object.entries(req.body)){
          // read from the file and delete the key value pair to get rid of the word
          console.log("reading file . . .")
          let dataToWrite;
          let willDeleteData = false;
          fs.readFile('./storage/tasks.txt', 'utf8', async (err, data) => {
            if (err) {
            console.error(err);
            return;
            }
            //console.log("printing data . . . ", (data.split("}")))
            console.log("overall data before split :", data)
            //data = data.split(/(?!=}{)/g)
            data = data.match(/[^}/]+\/?|\}/g)
            let indicesToRemove = [];
            for(let i = 0; i < data.length; i++){
              if(data[i] == "}"){
                indicesToRemove.push(i)
              }
            }
            console.log(data, indicesToRemove)
            const indiceLength = indicesToRemove.length;

            for (let i = indiceLength -1; i >= 0; i--){
              data.splice(indicesToRemove[i],1);
            }

            console.log("overall data after split :", data)
            //console.log("transformed data ", JSON.parse(data))
            console.log(data.length)
            const ORIGINAL_LENGTH = data.length
            let indexCounter = 0;
            let deletedItem = false;
            while(indexCounter < ORIGINAL_LENGTH && !deletedItem){
              console.log(indexCounter)
              let elem = data[indexCounter];
              //elem = elem += "}";
              //elem = JSON.parse(elem);
              //console.log(Object.values(elem)[0])
              //console.log(typeof id)
              //console.log((Object.values(elem)[0][1]))
              //console.log(typeof Object.values(elem)[0][1])
              console.log("element we are checking ",elem)
              if(elem.includes(id)){
                console.log("MATCH")
                console.log(indexCounter)
                deletedItem = true;
                // if(i != data.length) 
                data.splice(indexCounter, 1)
                for(let i = 0; i < data.length; i++){
                  data[i] = data[i] + "}"
                }
                console.log("before :", data)
                //data.splice(0,ORIGINAL_LENGTH - 1)
                //data.splice(i) 
                //data = data + "}"
                  willDeleteData = true;
                  console.log("after ", data.join(""))

                  const filepath = path.join(process.cwd(), 'storage'); 
                  console.log(filepath)
                  fs.writeFile(filepath + "/tasks.txt", data.join(""), (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                    res.send("added ", data);
               });
              }

              indexCounter++;

            }
        });
      }
        break
    // handle other HTTP methods
    case 'PUT':
        console.log("putting?")
        console.log(req.body)
        break
    default:
      res.status(200).json({ message: 'You submitted a get request!'})
  }
}