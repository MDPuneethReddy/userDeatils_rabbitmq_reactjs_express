/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
const dbase = require("./database")
import * as cors from 'cors'
const app = express();
var amqp = require('amqplib/callback_api');
app.use(cors())
app.use(express.json())
app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to usersapi!' });
});
app.get("/api/getUser/",(req,res)=>{
  const data={
    Id:req.body.id
  }
  var sql = "select * from users where id=?"
  var params = [data.Id]
  dbase.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
          "message":"success",
          "data":rows
      })
    });
})
app.post("/api/setUser",(req,res)=>{
  const data = {
    name: req.body.username,
    email: req.body.email,
  }
  console.log(data)
const sql ='INSERT INTO users (name, email) VALUES (?,?)';
const params =[data.name, data.email]
dbase.run(sql, params, function (err, result){
  
    if (err){
        res.status(400).json({"error": err.message})
        return;
    }
    res.json({
        "message": "success",
        "data": data,
        
    })
    const id=(this.lastID)
    // send Id after posting to queue
    amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    const queue = 'users';
    channel.assertQueue(queue, {
      durable: false
    });

    channel.sendToQueue(queue, Buffer.from(id.toString()));
    console.log(" user id sent is", id);
    
  });
  setTimeout(function() { 
    connection.close(); 
    process.exit(0) 
    }, 500);
});
    
});
})
const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
