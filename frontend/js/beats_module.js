import {PlayBox,boxInfo} from "./public.js";

var kickContainer = document.querySelector(".kick-container");
var allBoxs = document.querySelectorAll('.kick-container > div');
var swapContainer = document.querySelector(".swap-container");
var soundsContainer = document.querySelector(".sounds-container");
var swapUl = document.querySelector(".swap-container ul");
var soundUl = document.querySelector(".sounds-container ul");
var tempListen = document.getElementById("temp-listen");

var beatBoxs = [
  new PlayBox(allBoxs[0],7, './audios/707_Kick_2.wav','Kick1'),
  new PlayBox(allBoxs[1],8,'./audios/808_CH_2.wav','CH'),
  new PlayBox(allBoxs[2],9,'./audios/14in_Rim_2.wav','Rim'),
  new PlayBox(allBoxs[3],4,'./audios/special/MA_Croak_Kick.wav','Spec1'),
  new PlayBox(allBoxs[4],5,'./audios/special/MA_CrowdedSky_Kick.wav','Spec2'),
  new PlayBox(allBoxs[5],6,'./audios/special/MA_MachineCity_CHat.wav','Spec3'),
  new PlayBox(allBoxs[6],1,'./audios/kick.wav','Kick2'),
  new PlayBox(allBoxs[7],2,'./audios/808_OH_2.wav','OH'),
  new PlayBox(allBoxs[8],3,'./audios/707_Snare_2.wav','Snare'),
];
//给每个playbox左下角和右下角的按钮设置样式
allBoxs.forEach(function (box) {  
  box.children[0].className = 'iconfont arrow-swap'
  box.children[1].className = 'iconfont sound-swap'
})

var arroSwaps = document.querySelectorAll(".arrow-swap");
var soundSwaps = document.querySelectorAll(".sound-swap");

arroSwaps.forEach(function (elem) {
  elem.addEventListener("click", function (event) {
    let e = event || window.event;
    //第一步，计算框框要出现的位置
    let x = e.pageX - e.offsetX - parseInt(boxInfo(swapContainer).width);
    let y = e.pageY - e.offsetY;
    //第二步，清除ul里所有的内容，然后获取除自身外其他所有乐器的名字
    let arr = getAllBeatNames();
    swapUl.innerHTML = "";
    // let _this = this;
    let thisInstru = this.parentNode.querySelector('.beat-source').innerText;
    let filArr = arr.filter(function (elem) {
      return elem != thisInstru;
    });
    //第三步，把每个乐器种类名放进li里，把li放入ul里
    filArr.forEach(function (elem) {
      let li = document.createElement("li");
      li.innerText = elem;
      swapUl.appendChild(li);

      //给每个li绑定事件，进行乐器交换
      li.addEventListener("click", function (event) {
        let e = event || window.event;
        //获取要交换的playbox及源box
        let target = findPlayBox(e.target.innerText)[0]
        let source = findPlayBox(thisInstru)[0]
        //交换两者的instru,audiosrc即可
        let tmpInstru = target.instru;
        let tmpSrc = target.audioSrc;
        target.setInstru(source.instru);
        target.setAudioSrc(source.audioSrc);
        source.setInstru(tmpInstru);
        source.setAudioSrc(tmpSrc);
        swapContainer.style.display = "none";
      });
    });
    swapContainer.style.display = "block";
    swapContainer.style.left = x + "px";
    swapContainer.style.top = y + "px";

    e.cancelBubble = true;
  });
});

soundSwaps.forEach(function (elem) {
  elem.addEventListener("click", function (event) {
    //计算sounds-swap的位置
    let e = event || window.event;
    //计算框框要出现的位置
    let x = this.parentNode.offsetLeft + this.parentNode.clientWidth;
    let y = e.pageY - e.offsetY;
    soundsContainer.style.left = x + "px";
    soundsContainer.style.top = y + "px";
    //获取乐器种类
    /* 当未来涉及到keybox附近的dom结构发生变化时，这里的代码也要进行改动
                instru和keyCode两个变量在后面代码中将作为li的参数 */
    let keyBox = this.parentNode;
    let instru = keyBox.querySelector('.beat-source').innerText;
    let playBox = findPlayBox(instru)[0];
    // console.log(instru);
    //向服务器请求该目录下所有的音频文件名(不加后缀)
    //创建对象
    fetch(`${address}/sounds?instru=${instru}`)
      .then((resp) => {
        if (resp.status === 200) {
          return resp.json();
        }
        return resp;
      })
      .then((data) => {
        soundUl.innerHTML = "";
        data.forEach((sound) => {
          let li = document.createElement("li");
          li.innerText = sound;
          li.timer = null;
          //给li设置自定义的instru属性，外层只需定义好instru即可,key同理
          li.dataset.instru = instru.toLowerCase().trim();

          li.addEventListener("mouseenter", function (event) {
            //拼接音频的src链接，设定为指定audio元素的src，然后令其播放，停1秒，再播放
            let src = `${address}/${this.dataset.instru}/${sound}.wav`;
            tempListen.src = src;
            this.timer = setInterval(() => {
              tempListen.play();
            }, 1000);
          });

          li.addEventListener("mouseout", function (event) {
            tempListen.pause();
            clearInterval(this.timer);
          });

          li.addEventListener("click", function (event) {
            //给audio设置src
            // aud.src = tempListen.src;
            playBox.setAudioSrc(tempListen.src);
            //console.log(aud);
            soundsContainer.style.display = "none";
          });

          soundUl.appendChild(li);
        });
      })
      .catch((reason) => {
        console.log(reason);
      });

    soundsContainer.style.display = "block";

    e.cancelBubble = true;
  });
});

kickContainer.addEventListener("click", function (event) {
  if (boxInfo(swapContainer).display == "block") {
    swapContainer.style.display = "none";
  }
  if (boxInfo(soundsContainer).display == "block") {
    soundsContainer.style.display = "none";
  }
});

document.addEventListener("click", function (event) {
  if (boxInfo(swapContainer).display == "block") {
    swapContainer.style.display = "none";
  }
  if (boxInfo(soundsContainer).display == "block") {
    soundsContainer.style.display = "none";
  }
});

swapContainer.addEventListener("click", function (event) {
  event.cancelBubble = true;
});

soundsContainer.addEventListener("click", function (event) {
  event.cancelBubble = true;
});

function getAllBeatNames() {
  return beatBoxs.map((box)=>{
    return box.instru;
  });
}

function findPlayBox(instru) {  
  return beatBoxs.filter((box)=>{
    return box.instru === instru;
  })
}
