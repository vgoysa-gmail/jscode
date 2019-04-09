var blacklist=[
	"RobiHachi - ",
	"Mix - Meisei Story - ",
	"Amazing Stranger - ",
	"Namu Amida Butsu! - Rendai Utena - ",
	"Bakumatsu Crisis - "
];
var probelist=[
	"Hachigatsu no Cinderella Nine - ",
	"Shoumetsu Toshi - ",
	"Nande Koko ni Sensei ga - ",
	"Joshikausei - "
];
var goodlist=[
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
function btnclick(event)
{
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
    var cl=this.classList;
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    
    xhr.addEventListener("readystatechange", function () {
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
function hs_load(){
 var d=document;
 var s=d.querySelectorAll(".hs-magnet-link > a");
 if(s.length>0){
  a=""; 
  floodLogin();
  for(i=0;i<s.length;i++){
    if (s[i].href.search("tracker.opentrackr.org")>0) {
        s[i].href=s[i].href.replace(/&tr=.*/,"&tr=http://nyaa.tracker.wf:7777/announce&tr=udp://tracker.tiny-vps.com:6969/announce&tr=http://t.nyaatracker.com:80/announce");
    }
    if(s[i].href.search("magnet:")==0){
    s[i].addEventListener("click",btnclick);
    }
  }
 } else {
  var btn=d.querySelector(".latest-show-more");
  if (btn && !btn.hasAttribute("parsed")){btn.setAttribute("parsed",true);btn.classList.add("good");btn.addEventListener("mouseup",hs_load);}
  var s=d.querySelectorAll(".latest-releases > ul > li > a");
  for(var p of s){
     if (!p.hasAttribute("parsed")){
	for (var t of p.childNodes) {
            if (t.nodeType==3) {
            	console.log(t.textContent);
		if (blacklist.includes(t.nodeValue)) {
		   p.classList.add("black");
		}
		if (goodlist.includes(t.nodeValue)) {
		   p.classList.add("good");
		}
		if (probelist.includes(t.nodeValue)) {
		   p.classList.add("trial");
		}
	    }
        }
        p.setAttribute("parsed",true);
     }
  }
 }
}
window.addEventListener("load",hs_load, false);
function floodLogin()
{
    var data = JSON.stringify({
      "username": "vgoissa",
      "password": "Cisco123"
    });
    
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });
    
    xhr.open("POST", "https://dkvm:3000/auth/authenticate");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("cache-control", "no-cache");
    
    xhr.send(data);
}

