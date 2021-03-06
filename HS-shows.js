var blacklist = [
  "RobiHachi - ",
  "Mix - Meisei Story - ",
  "Amazing Stranger - ",
  "Namu Amida Butsu! - Rendai Utena - ",
  "Bakumatsu Crisis - "
];
var probelist = [
  "Hachigatsu no Cinderella Nine - ",
  "Shoumetsu Toshi - ",
  "Nande Koko ni Sensei ga - ",
  "Strike Witches - 501-butai Hasshin Shimasu! - ",
  "Joshikausei - "
];
var goodlist = [
  "Dororo - ",
  "Yatogame-chan Kansatsu Nikki - ",
  "Isekai Quartet - ",
  "Fairy Gone - ",
  "Mayonaka no Occult Koumuin - ",
  "Kono Oto Tomare! - ",
  "Bokutachi wa Benkyou ga Dekinai - ",
  "Nobunaga-sensei no Osanazuma - ",
  "Fruits Basket (2019) - ",
  "Hitoribocchi no Marumaru Seikatsu - ",
  "Midara na Ao-chan wa Benkyou ga Dekinai - ",
  "Senryuu Shoujo - ",
  "Kono Yo no Hate de Koi wo Utau Shoujo YU-NO - ",
  "Fairy Tail Final Season - ",
  "Gegege no Kitarou (2018) - "
];
makeTag = t => document.createElement(t);
add = (b,h) => b.insertAdjacentElement("afterend", h);
function makeText(tag,text){
  let tt=makeTag(tag);
  tt.appendChild(document.createTextNode(text));
  return tt;
}
function makeBtn(n,oncl,hr){
  let b=makeText("button",n);
  b.addEventListener("click",oncl);
  b.href=hr;
  b.className="badge";
  return b;
}
function makeToolTip(parent,text) {
  let b=makeText("div",text);
  b.className="vgtooltiptext ontop";
  parent.classList.add("vgtooltip")
  parent.appendChild(b);
}
Cookie = {
  get: name => {
      let c = document.cookie.match(`(?:(?:^|.*; *)${name} *= *([^;]*).*$)|^.*$`)[1]
      if (c) return decodeURIComponent(c)
      }
  , set: (name, value, opts = {}) => {
      if (opts.days) {
          opts['max-age'] = opts.days * 60 * 60 * 24;
          delete opts.days
          }
      opts = Object.entries(opts).reduce((str, [k, v]) => `${str}; ${k}=${v}`, '')
      document.cookie = name + '=' + encodeURIComponent(value) + opts
      }
  , delete: function(name, opts){
      let opts1 = opts;
      opts1["max-age"] = -1;
      Cookie.set(name, '', opts1)
    }
  , getJSON: name => JSON.parse(Cookie.get(name)||"{}")
  , getList: name => JSON.parse(Cookie.get(name)||"[]")
  , setJSON: (name, value, opts) => Cookie.set(name, JSON.stringify(value), opts)
}
prep = name => name.replace(/[^a-zA-Z0-9]/g,"");
function record_click(evt) {
  if (this.hasAttribute("episodet")) {
    // alert(this.episodet+this.episoden);
    let done = Cookie.getList(prep(this.episodet));
    // alert(typeof(done));
    if (!done.includes(this.episoden)) {
      done.push(this.episoden);
      // alert(done);
      Cookie.setJSON(
        prep(this.episodet),
        done,
        {path:"/",days:30}
      );
    }
  }
  // evt.preventDefault();
}
function load_file_list(event){
  event.target.removeEventListener(event.type,load_file_list);
  let xhr = new XMLHttpRequest();
  let list_data;
  let anchor = event.currentTarget;
  let show = anchor.episodet;
  xhr.withCredentials = true;
  xhr.open("GET", encodeURI("https://dkvm/api/shows/search?query="+show));
  xhr.responseType = 'json';
  // alert("1");
  //xhr.setRequestHeader("Content-Type", "application/json");
  console.log(event,`adding tooltip for ${show}`);
  div=makeTag("div");
  div.className="vgtooltiptext ontop";
  div.innerHTML=`<p class='tipName'>${anchor.episodet}</p>\n`;
  anchor.classList.add("vgtooltip");
  anchor.appendChild(div);
  xhr.div = div;
  xhr.addEventListener("readystatechange", function() {
    if (this.readyState == 4) {
      console.log(this.response);
      if (this.response && this.response.episodes) { // "episodes" in
        for (name in this.response.episodes){
          console.log(`<strong>${name}</strong>${this.response.episodes[name].join()}<br>\n`);
          this.div.innerHTML+=`<p class="tipItem">${name} ${collapse(this.response.episodes[name])}</p>\n`;
        }
      }
    }
    //anchor.addEventListener(event.type,load_file_list);
  });
  try {
    xhr.send();
  }
  catch (e) {
    console.log(e);
  }

}
function load_list_async(listName) {
    let xhr = new XMLHttpRequest();
		let list_data;
    xhr.withCredentials = true;
    xhr.open("GET", "https://dkvm/api/list/"+listName);
    xhr.responseType = 'json';
    //xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("readystatechange", function() {
      if (this.readyState == 4) {
        //console.log(xhr.status, xhr.responseType);
        //console.log("received list", listName, this.response);
        this.response.forEach((name)=>{triage[name]=listName;});
        switch (listName) {
          case "black":
            blacklist = this.response;
            break;
          case "good":
            goodlist = this.response;
            break;
          case "trial":
            probelist = this.response;
            break;
        }
        fullset = blacklist.concat(goodlist, probelist);
        updates.push(listName);
        // console.log(listName+" done;");
        if (updates.includes("good")
          &&updates.includes("black")
          &&updates.includes("trial")) {
          updates=[];
          hs_load({
            src:"load_list_async",
            href:document.documentURI,
            dom:document.domain});
        }
      }
    });
    try {
      xhr.send();
    }
    catch (e) {
      console.log(e);
    }
}
var updates=[];
var triage = {};
blacklist.forEach((name)=>{triage[name]="black"});
goodlist.forEach ((name)=>{triage[name]="good"});
probelist.forEach((name)=>{triage[name]="trial"});
var fullset = blacklist.concat(goodlist, probelist);
function update_lists() {
  load_list_async("black");
  load_list_async("good");
  load_list_async("trial");
  console.log("updated",fullset);
}
function record(evt) {
  if (this.href && confirm(this.href+" "+this.textContent)) {
    switch (this.textContent) {
      case "+":
        goodlist.push(this.href);
        break;
      case "+":
        probelist.push(this.href);
        break;
      case "-":
        blacklist.push(this.href);
        break;
    }
		let data = JSON.stringify({
      "shows": [
        this.href
      ],
      "action": this.textContent
    });
    let cl = this.classList;
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        console.log(this.responseText);
        cl.add("done")
      }
    });

    xhr.open("POST", "https://dkvm/api/list/insert");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
  }
	evt.preventDefault();
}

function btnclick(event) {
  if (this.href) {
    let data = JSON.stringify({
      "urls": [
        this.href
      ],
      "destination": "/home/vgoissa/rtorrent/download",
      "isBasePath": false,
      "start": true,
      "tags": [
        "HS"
      ]
    });
    let cl = this.classList;
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        console.log(this.responseText);
        cl.add("done")
      }
    });

    xhr.open("POST", "https://dkvm:3000/api/client/add");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);

  }
  event.preventDefault();
}
function hs_load(evt) {
  console.log(evt);
  loadCSS();
  let d = document;
  let s = d.querySelectorAll(".hs-magnet-link > a");
  if (s.length > 0) {
    // specific show page
    a = "";
    floodLogin();
    for (i = 0; i < s.length; i++) { // magnet links // single show page
      if (s[i].href.search("tracker.opentrackr.org") > 0) {
        s[i].href = s[i].href.replace(/&tr=.*/, "&tr=http://nyaa.tracker.wf:7777/announce&tr=udp://tracker.tiny-vps.com:6969/announce&tr=http://t.nyaatracker.com:80/announce");
      }
      if (s[i].href.search("magnet:") == 0) {
        s[i].addEventListener("click", btnclick);
        s[i].classList.add("good");
      }
    }
  } else {
    // show list page
    let btn = d.querySelector(".latest-show-more");
    if (btn && !btn.hasAttribute("parsed")) { // more button
      btn.setAttribute("parsed", true);
      btn.classList.add("good");
      // btn.addEventListener("change",hs_load);
      // btn.addEventListener("mouseup", hs_load);
    }
    let s = d.querySelectorAll(".latest-releases > ul > li > a");
    // console.log(s);
    for (let p of s) { // title page list
      lookup_show(p);
    }
    if (!showList) {
      showList = document.querySelector(".latest-releases");
      if (showList) {observer.observe(showList, config);}
    }
  }
}

function wait_shows (mutationsList, observer) {
  for(let mutation of mutationsList) {
      // console.log(mutation);
      if (mutation.type == 'childList' && mutation.addedNodes) {
        for (let node of mutation.addedNodes) {
          if (node.nodeName=="UL") {
            for (let a of node.getElementsByTagName("A")){
              lookup_show(a);
            }
          }
          // console.log(node, node.childNodes);
        }
      }
  }
};
function lookup_show(p) {
  if (!p.hasAttribute("parsed")) {
    p.addEventListener("click",record_click,false);
    let episode = {};
    for (let t of p.childNodes) {
      // console.log(t.nodeName,t.nodeType,t.nodeValue);
      if (t.nodeName == "STRONG") {
        episode.number = t.childNodes[0].nodeValue;
      }
      if (t.nodeType == 3) {
        episode.name = t.nodeValue;
        console.log(t.textContent);
      }
    }
    // console.log(episode);
    // p.addEventListener("mousedown",load_file_list,false);
    // p.addEventListener("focus",load_file_list,false);
    // p.addEventListener("mouseover",load_file_list,false);
    p.addEventListener("mouseenter",load_file_list);

    done = Cookie.getList(prep(episode.name));
    if (done && done.length) {
      //makeToolTip(p,done.join());
      if (done.includes(episode.number)) {
        p.classList.add("done");
      }
    }
    // console.log(done);
    p.setAttribute("episodet",episode.name);
    p.setAttribute("episoden",episode.number);
    p.episodet=episode.name;
    p.episoden=episode.number;
    if (fullset.includes(episode.name)) {
      p.setAttribute("parsed", true);
      p.parsed = true;
      p.classList.add(triage[episode.name]);
    } else if (!p.hasAttribute("undecided")) {
      p.setAttribute("undecided",true);
      p.classList.add("other");
      p.undecided = true;
      ["-","?","+"].forEach(
        (x)=>p.appendChild(makeBtn(x,record,episode.name))
      );
    }
  }

}
function loadCSS() {
  if (!document.querySelector("link[href='https://dkvm/js/lstyle.css']")) {
    //getElementById("csslstyle")) {
    link=makeTag("LINK");
    link.rel  = "stylesheet";
    link.href = "https://dkvm/js/lstyle.css";
    link.id   = "csslstyle";
    document.head.appendChild(link);
  }
}
function floodLogin() {
  let data = {
    "username": "vgoissa",
    "password": "Cisco123"
  };

  let xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function() {
    if (this.readyState === 4) {
      console.log("Flood login", this.responseText);
    }
  });

  xhr.open("POST", "https://dkvm:3000/auth/authenticate");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("cache-control", "no-cache");
  //xhr.responseType = 'json';

  xhr.send(JSON.stringify(data));
}

update_lists();
var config = { attributes: false, childList: true, subtree: true };
var observer = new MutationObserver(wait_shows);
var showList = document.querySelector(".latest-releases");
if (showList) {observer.observe(showList, config);}
window.addEventListener("DOMContentLoaded", hs_load, false);
window.addEventListener("load", hs_load, false);

if (document.documentURI.search("horriblesubs.info")) {
  hs_load({
  src:"init",
  href:document.documentURI,
  dom:document.domain});
}

function collapse(l) {
  let minep = 0;
  let maxep = 0;
  let smin = "";
  let smax = "";
  let ix = 0;
  let lst = [];
  let numre = /^[0-9v\.]+$/
  console.log(l);
  for (let x of l) {
    console.log(x);
    ix = parseFloat(x);
    if (x.match(numre)&&ix) {
      if (smin) { //not a first item
        if (maxep+1>=ix&&ix>=maxep) {
          smax = x;
          maxep = ix;
        } else if (minep-1<=ix&&ix<=minep) {
          smin = x;
          minep = ix;
        } else {
          lst.push(`${smin}${(minep==maxep)?"":"-"+smax}`);
          smin = x;
          minep = ix;
          smax = x;
          maxep = ix;
        }
      } else { // first in list
        smin = x;
        minep = ix;
        smax = x;
        maxep = ix;
      }
    } else { // not a number
      if (smin) {
        lst.push(`${smin}${(minep==maxep)?"":"-"+smax}`);
      }
      lst.push(x);
      smin = "";
      minep = 0;
      smax = "";
      maxep = 0;
    }
  }
  if (smin) {
    lst.push(`${smin}${(minep==maxep)?"":"-"+smax}`);
  }
  return lst.join();
}
/*
var targetNode = document.getElementById('some-id');

// Options for the observer (which mutations to observe)
var config = { attributes: false, childList: true, subtree: true };

// Callback function to execute when mutations are observed
var callback = function(mutationsList, observer) {
    for(var mutation of mutationsList) {
        console.log(mutation);
        // if (mutation.type == 'childList') {
        //     console.log('A child node has been added or removed.');
        // }
        // else if (mutation.type == 'attributes') {
        //     console.log('The ' + mutation.attributeName + ' attribute was modified.');
        // }
    }
};

// Create an observer instance linked to the callback function
var observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

// Later, you can stop observing
observer.disconnect();

*/
