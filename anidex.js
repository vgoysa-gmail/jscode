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

window.addEventListener("load",function(){
    var d=document;
    var s=d.querySelectorAll("A.btn");
    function add(b,h){return b.insertAdjacentElement("afterend", h);}
    function makeTag(t){return document.createElement(t);}
    function makeBtn(n,oncl,hr){var b=makeText("button",n); 
                b.addEventListener("click",oncl);
                b.href=hr;
                b.className="btn btn-default";
                return b;
    }
    function makeText(tag,text){t=makeTag(tag);t.appendChild(d.createTextNode(text));return t;}
    floodLogin();
    if(s.length>0){
        a=""; 
        for(i=0;i<s.length;i++){
            if(s[i].href.search("magnet:")==0) {
                add(s[i],makeBtn("game",btnclick,s[i].href));
                add(s[i],makeBtn("anime",btnclick,s[i].href));
                add(s[i],makeBtn("Manga",btnclick,s[i].href));
                //s[i].addEventListener("click",magnetclick,true); // function(e){magnetclick(e,this)}
            }
        }
    }
}, false);
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
