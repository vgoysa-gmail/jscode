function btnclick(event)
{
  if (this.href) {   // confirm("Click on magnet")
    let data = JSON.stringify({
      "urls": [
        this.href
      ],
      "destination": "/home/vgoissa/rtorrent/download",
      "isBasePath": false,
      "start": true,
      "tags": [
        this.innerText
      ]
    });

    let cl=this.classList;
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
        cl.add("done");
      }
    });

    xhr.open("POST", "https://dkvm:3000/api/client/add");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);

  }
  event.preventDefault();
}
makeTag = t => document.createElement(t);
function makeBtn(n,oncl,hr){
  let b=makeText("button",n);
  b.addEventListener("click",oncl);
  b.href=hr;
  b.className="btn btn-default";
  return b;
}
function makeText(tag,text){
  let tt=makeTag(tag);
  tt.appendChild(document.createTextNode(text));
  return tt;
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
function ani_load(evt){
    let s=document.querySelectorAll("A.btn");
    loadCSS();
    floodLogin();
    if(s.length>0){
        // let a="";
        for(let i=0;i<s.length;i++){
            if(s[i].href.search("magnet:")==0) {
                s[i].insertAdjacentElement("afterend",
                  makeBtn("game",btnclick,s[i].href));
                s[i].insertAdjacentElement("afterend",
                  makeBtn("anime",btnclick,s[i].href));
                s[i].insertAdjacentElement("afterend",
                  makeBtn("Manga",btnclick,s[i].href));
                s[i].classList.add("good");
            }
        }
    }
}
window.addEventListener("load", ani_load, false);
if (document.documentURI.search("anidex.info")) {
  ani_load({
    src:"init",
    href:document.documentURI,
    dom:document.domain});
}
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
