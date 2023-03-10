export default (req, res) => {
    const requestMethod = req.method;
    console.log(requestMethod)
    switch (requestMethod) {
    case 'POST':
        //const body = JSON.parse(req.body);
      //res.status(200).json({ message: `You submitted a post request: ${body}` })
      res.status(200).json({ message: 'You submitted a post request!'})
      break;
    // handle other HTTP methods
    default:
      res.status(200).json({ message: 'You submitted a get request!'})
  }
}