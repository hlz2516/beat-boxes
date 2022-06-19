import "./jquery-3.5.1.js"
import "./config.js"
import {boxInfo,PlayBox,checkUrl} from "./public.js"

// var firstGroup = document.querySelectorAll('#digraph-1 .group-1');
var firstGroup = $('#digraph-1 .group-1>div')
// console.log(firstGroup);
var boxStyle = {
    
}

var group1 = [
    new PlayBox(firstGroup[0],'q','./audios/piano/大字组/C.wav','C',boxStyle),
    new PlayBox(firstGroup[1],'w','./audios/piano/大字组/D.wav','D',boxStyle),
    new PlayBox(firstGroup[2],'e','./audios/piano/大字组/E.wav','E',boxStyle),
    new PlayBox(firstGroup[3],'r','./audios/piano/大字组/F.wav','F',boxStyle),
    new PlayBox(firstGroup[4],'t','./audios/piano/大字组/G.wav','G',boxStyle),
    new PlayBox(firstGroup[5],'y','./audios/piano/大字组/A.wav','A',boxStyle),
    new PlayBox(firstGroup[6],'u','./audios/piano/大字组/B.wav','B',boxStyle),

    new PlayBox(firstGroup[7],'a',checkUrl('./audios/piano/大字组/C#.wav'),'C#',boxStyle),
    new PlayBox(firstGroup[8],'s',checkUrl('./audios/piano/大字组/D#.wav'),'D#',boxStyle),
    new PlayBox(firstGroup[9],'d',checkUrl('./audios/piano/大字组/F#.wav'),'F#',boxStyle),
    new PlayBox(firstGroup[10],'f',checkUrl('./audios/piano/大字组/G#.wav'),'G#',boxStyle),
    new PlayBox(firstGroup[11],'g',checkUrl('./audios/piano/大字组/A#.wav'),'A#',boxStyle),
]

var secGroup = $('#digraph-2 .group-1>div')

var group2 = [
    new PlayBox(secGroup[0],'h',checkUrl('./audios/piano/小字组/c#.wav'),'c#',boxStyle),
    new PlayBox(secGroup[1],'j',checkUrl('./audios/piano/小字组/d#.wav'),'d#',boxStyle),
    new PlayBox(secGroup[2],'k',checkUrl('./audios/piano/小字组/f#.wav'),'f#',boxStyle),
    new PlayBox(secGroup[3],'l',checkUrl('./audios/piano/小字组/g#.wav'),'g#',boxStyle),
    new PlayBox(secGroup[4],';',checkUrl('./audios/piano/小字组/a#.wav'),'a#',boxStyle),
    new PlayBox(secGroup[5],'\'','./audios/piano/小字组/b.wav','b',boxStyle),

    new PlayBox(secGroup[6],'b',checkUrl('./audios/piano/小字组/c.wav'),'c',boxStyle),
    new PlayBox(secGroup[7],'n',checkUrl('./audios/piano/小字组/d.wav'),'d',boxStyle),
    new PlayBox(secGroup[8],'m',checkUrl('./audios/piano/小字组/e.wav'),'e',boxStyle),
    new PlayBox(secGroup[9],',',checkUrl('./audios/piano/小字组/f.wav'),'f',boxStyle),
    new PlayBox(secGroup[10],'.',checkUrl('./audios/piano/小字组/g.wav'),'g',boxStyle),
    new PlayBox(secGroup[11],'/',checkUrl('./audios/piano/小字组/a.wav'),'a',boxStyle)
]

var groups = {
    'digraph-1':group1,
    'digraph-2':group2
};

var extras = $('.instru-container .extra>div');
extras.each((index,elem)=>{
    new PlayBox(elem,null,null,null,boxStyle)
})

var groupSwapers = $('.group-swaper');
var groupSelector = $('#group-selector');
var groupId = '';
groupSwapers.each((index,elem)=>{
    elem.onclick = function (event) {  
        //计算groupSelector应当出现的位置
        let x = parseInt(boxInfo(this)['left'])  + this.clientWidth;
        let y = event.clientY - event.offsetY;
        groupSelector.css('left',x + 'px');
        groupSelector.css('top',y + 'px');
        groupSelector.css('display','block');
        //更新标志位，以标识当前点的是哪个组里的swaper
        groupId = elem.parentNode.parentNode.id

        event.stopPropagation();
    }
})

var thisPart = $('#instrus-part');
thisPart.on('click',function (e) {  
    if (groupSelector.css('display') === 'block') {
        groupSelector.css('display','none')
    }
})

groupSelector.on('click',function (event) {  
    // console.log(event.target.innerText);
    let targetGroup = event.target.innerText;
    let keys = [];
    groups[groupId].forEach(elem => {
        keys.push(elem.instru);
    });

    let body = {
        'group':targetGroup,
        'keys':keys
    }

    let xhr = new XMLHttpRequest();
    xhr.open('POST',`${address}/group`);
    xhr.setRequestHeader('Content-Type','application/json');
    
    xhr.send(JSON.stringify(body));
    xhr.onreadystatechange = function (e) {  
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                let obj = JSON.parse(xhr.response);
                let newKeys = obj['keys'];
                let path = obj['path'];
                groups[groupId].forEach((box,ind)=>{
                    let fileName = checkUrl(newKeys[ind])  + '.wav';
                    // box.setAudioSrc(`${address}/${path}/${fileName}`);
                    // box.setInstru(newKeys[ind]);
                    let fullName = `${address}/${path}/${fileName}`;
                    box.setAudioSrc(fullName);
                    box.setInstru(newKeys[ind]);
                })
            }
        }
    }

    event.stopPropagation();
})