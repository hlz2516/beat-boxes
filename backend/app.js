const { json } = require('express')
const express = require('express')
const fs = require('fs') 

const app = express()
const port = 9000

app.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.send('Hello World!')
})

app.get('/sounds',(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  let instru = req.query['instru'].toString().toLowerCase();
  let arr = [];
  try {
      let files = fs.readdirSync(`./public/${instru}`);
      files.forEach((f)=>{
        arr.push(f.replace(/\.wav$/,''))
      })
  } catch (error) {
    console.log(error);
  }
  // console.log(arr);
  res.send(JSON.stringify(arr))
})

app.use(express.static('public',{
    setHeaders:function (res) {  
        res.set('Access-Control-Allow-Origin','*')
    }
}))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})