import './fittext.js'

export function boxInfo(box) {
    var style = window.getComputedStyle
      ? window.getComputedStyle(box, null)
      : null || box.currentStyle;
    // let w = style.width;
    // let h = style.height;
    // console.log(w,h)
    return style;
  }

//对弹奏盒子的js封装
/**
 * 
 * @param {*要变成弹奏盒子的dom元素} obj 
 * @param {*要指定的按键} key 
 * @param {*音频源,可以是本地链接也可以是网络url} audioSrc 
 * @param {*乐器名或音高名} instru 
 * @param {*obj的样式,以对象形式传入} style 
 */
export function PlayBox(obj,key,audioSrc,instru,style) {  
    //当需要通过dom元素obj获取其playbox上的一些属性时，可以通过_playbox查找
    obj._playbox = this;  
    this.box = obj;
    this.key = key;
    this.audioSrc = audioSrc;
    //创建一个内层div，用于适应外层的布局，如float:left，display:inline等
    this.inner = document.createElement('div');
    

    //显示在左上角的按键缩写
    this.keyName = key.length > 2 ? key.substring(0,2):key;
    this.instru = (instru == null || instru == undefined) ? '' :instru;
    //给box添加自定义属性data-key，说不定以后还有用
    this.box.dataset.key = this.key;
    //给box添加样式
    this.box.classList.add('play-box');
    for (const k in style) {
        if (Object.hasOwnProperty.call(obj.style, k)) {
            obj.style[k] = style[k];
        }
    }
    //box中心为一个圆形label,标明这是哪种乐器或者音高
    this.showInstru = document.createElement('div');
    this.showInstru.classList.add('beat-source');
    this.showInstru.innerHTML = `<strong>${this.instru}</strong>`;
    this.box.append(this.showInstru);
    window.fitText(this.showInstru,0.5);
    //box内部左上角需标明是哪个按键
    this.showKey = document.createElement('p');
    this.showKey.classList.add('number');
    this.showKey.innerText = this.keyName;
    this.box.append(this.showKey);
    //给box添加功能
    this.audio = document.createElement('audio');
    this.audio.src = this.audioSrc;

    this.isPlaying = false;
    document.addEventListener('keydown',(event)=> {  
        if (event.key == this.key) {
            if (this.isPlaying) {
                return
            }
            this.audio.currentTime = 0;
            this.audio.play();
            this.box.classList.add('playing');
            this.isPlaying = true;
        }
    })
    document.addEventListener('keyup',(event)=>{
        if (event.key == this.box.dataset.key) {
            this.audio.pause();
            this.box.classList.remove('playing');
            this.isPlaying = false;
        }
    })
    //给圆形label添加一个点击播放事件
    this.showInstru.addEventListener('click',(e) => {  
        this.audio.currentTime = 0;
        this.audio.play();
    })
}

PlayBox.prototype.setAudioSrc = function (audioSrc) {  
    this.audioSrc = audioSrc;
    this.audio.src = audioSrc;
}

PlayBox.prototype.setKey = function (key) {  
    this.key = key;
    this.box.dataset.key = this.key;
}

PlayBox.prototype.setInstru = function (instru) {  
    this.instru = instru;
    this.showInstru.innerHTML = `<strong>${this.instru}</strong>`;
}