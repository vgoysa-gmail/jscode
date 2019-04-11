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
function load_list_async(listName) {
    var xhr = new XMLHttpRequest();
		var list_data;
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
        console.log(listName+" done;");
        if (updates.length==3) {
          updates=[];
          hs_load({});
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
update_lists();
function record(evt) {
  if (this.href && confirm(this.href+" "+this.textContent)) {
		var data = JSON.stringify({
      "shows": [
        this.href
      ],
      "action": this.textContent
    });
    var cl = this.classList;
    var xhr = new XMLHttpRequest();
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
    var data = JSON.stringify({
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
    var cl = this.classList;
    var xhr = new XMLHttpRequest();
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
update_lists();
function hs_load(evt) {
  //console.log(evt.explicitOriginalTarget.baseURI,evt.originalTarget.baseURI,evt);
  //if (!evt.originalTarget.baseURI.includes("https://horriblesubs.info/")) {
  //  return false;
  //}
  var d = document;
  var s = d.querySelectorAll(".hs-magnet-link > a");
  function add(b,h){return b.insertAdjacentElement("afterend", h);}
  function makeTag(t){return d.createElement(t);}
  function makeBtn(n,oncl,hr){var b=makeText("button",n);
    b.addEventListener("click",oncl);
    b.href=hr;
    b.className="badge";
    return b;
  }
  function makeText(tag,text){
    tt=makeTag(tag);
    tt.appendChild(d.createTextNode(text));
    return tt;
  }
  if (s.length > 0) {
    a = "";
    floodLogin();
    for (i = 0; i < s.length; i++) {
      if (s[i].href.search("tracker.opentrackr.org") > 0) {
        s[i].href = s[i].href.replace(/&tr=.*/, "&tr=http://nyaa.tracker.wf:7777/announce&tr=udp://tracker.tiny-vps.com:6969/announce&tr=http://t.nyaatracker.com:80/announce");
      }
      if (s[i].href.search("magnet:") == 0) {
        s[i].addEventListener("click", btnclick);
      }
    }
  } else {
    var btn = d.querySelector(".latest-show-more");
    if (btn && !btn.hasAttribute("parsed")) {
      btn.setAttribute("parsed", true);
      btn.classList.add("good");
      btn.addEventListener("mouseup", hs_load);
    }
    var s = d.querySelectorAll(".latest-releases > ul > li > a");
    for (var p of s) {
      if (!p.hasAttribute("parsed")) {
        for (var t of p.childNodes) {
          if (t.nodeType == 3) {
            console.log(t.textContent);
            if (fullset.includes(t.nodeValue)) {
              p.setAttribute("parsed", true);
              p.classList.add(triage[t.nodeValue]);
            } else if (!p.hasAttribute("undecided")) {
              p.setAttribute("undecided",true)
              p.appendChild(makeBtn("-",record,t.nodeValue));
              p.appendChild(makeBtn("?",record,t.nodeValue));
              p.appendChild(makeBtn("+",record,t.nodeValue));
            }
          }
        }
      }
    }
  }
}
window.addEventListener("loadend", hs_load, false);
function floodLogin() {
  var data = {
    "username": "vgoissa",
    "password": "Cisco123"
  };

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function() {
    if (this.readyState === 4) {
      console.log("Flood login", this.responseText);
    }
  });

  xhr.open("POST", "https://dkvm:3000/auth/authenticate");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("cache-control", "no-cache");

  xhr.send(data);
}
