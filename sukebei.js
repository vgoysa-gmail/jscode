function btnclick(event)
{
  if (this.href) {   // confirm("Click on magnet")
    var data = JSON.stringify({
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
ttags=[
    "game",
    "anime",
    "Manga",
    "H", "GER"
];
ports={"nyaa":7777,"sukebei":8888};
function go(){
    var d=document;
    var s=d.querySelectorAll("A.card-footer-item");
    var srv=d.location.href.replace("https://","").replace(/\..*$/,"");
    function add(b,h){return b.appendChild(h);}
    function app(b,h){return b.insertAdjacentElement("afterend", h);}
    function makeTag(t){return document.createElement(t);}
    function makeBtn(n,oncl,hr){
                var b=makeText("button",n); 
                b.addEventListener("click",oncl);
                b.href=hr;
                return b;
    }
    function makeText(tag,text){t=makeTag(tag);add(t,d.createTextNode(text));return t;}
    function cbBtn(tag)
    {
      app(this,makeBtn(tag,btnclick,this.href));
    }
    floodLogin();
    if(s.length>0){
        a="";             //i=0;i<s.length;i++){
        for(var tt of s) {
            if (!tt.hasAttribute(srv)) { 
    	        tt.setAttribute(srv, srv);
                if(tt.href.search("tracker.wf")>0){
                    tt.href=tt.href.replace(/&tr=.*/,"&tr=http://"+srv+".tracker.wf:"+ports[srv]+"/announce");
                }
                if(tt.href.search("magnet:")==0) {
                    ttags.forEach(cbBtn,tt);
                }
            }
        }
    }
}
window.addEventListener("load", go, false);
go();
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
