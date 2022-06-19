const { json } = require('express')
const express = require('express')
const fs = require('fs') 
const bodyParser = require('body-parser')

const app = express()
const port = 9000

const NameMapper = {
  'big' : '大字组',
  'big-1' : '大字一组',
  'big-2' : '大字二组',
  'small' : '小字组',
  'small-1' : '小字一组',
  'small-2' : '小字二组',
  'small-3' : '小字三组',
  'small-4' : '小字四组',
  'small-5' : '小字五组'
}

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));


app.all('*', function (req, res, next) {
  //其中*表示允许所有域可跨
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  // res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

/**
 * 
 * @param {要转换的音组} group 
 * @param {*按一定顺序排列的原keys} originKeys 
 */
function keyTransfrom(group,originKeys) {  
  //统一还原成小字组(去掉数字，全部小写)
  originKeys = originKeys.map(key=>key.replace(/[0-9]/,'').toLowerCase())

  //根据group进行变化
  //如果group中含有一，则需要在每个原数字后面添加字符1；
  let mapper = {
    '一': '1',
    '二': '2',
    '三': '3',
    '四': '4',
    '五': '5'
  };

  for (const key in mapper) {
    //console.log(key,mapper[key]);
    //查找group字符串中是否存在这个key
    if (group.indexOf(key)!= -1) {
      //将originKeys再变换，在每个元素的数字后面添加'1'
      originKeys = originKeys.map((val)=>{
        let len = val.length;
        if (len == 1) {
          return val + mapper[key]
        }else if (len == 2) {
          return val.charAt(0) + mapper[key] + val.charAt(1)
        }
      })
      break;
    }
  }

  if (group.indexOf('大') != -1) {
    originKeys = originKeys.map( val=>val.toUpperCase() )
  }else if(group.indexOf('小') != -1){
    originKeys = originKeys.map( val=>val.toLowerCase() )
  }

  return originKeys;
}

function checkGroup(group){
  for (const key in NameMapper) {
    if (NameMapper[key] === group) {
      return true;
    }
  }
  return false;
}

app.get('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.send('Hello World!')
})

app.get('/sounds',(req,res)=>{
  res.header('Access-Control-Allow-Origin', '*');
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

// body: { 'group':'小字一组','keys':[c,d,e,f,g,a,b,c#,d#,f#,g#,a#] }
// return : {'path': '/piano/小字一组','keys':[...]}
app.all('/group',(req,res)=>{
  if (!checkGroup(req.body.group)) {
    res.send('this group is not found!')
    return
  }
  let newKeys = keyTransfrom(req.body.group,req.body.keys);
  let fileName = '';
  for (const key in NameMapper) {
      if (NameMapper[key] === req.body.group) {
        fileName = key;
        break;
      }
  }
  let path = `piano/${fileName}`;
  let obj = {
    'path':path,
    'keys': newKeys
  }

  res.send(JSON.stringify(obj))
})

app.use(express.static('public',{
    setHeaders:function (res) {  
        res.set('Access-Control-Allow-Origin','*')
        // res.set('Access-Control-Allow-Headers', 'Content-Type')
        // res.set('Content-Type', 'text/plain');
    }
}))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})