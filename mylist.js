function btnclick(event)
{
  if (this.href) {   
    var data = this.href;

    var cl=this.classList;
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
        cl.add("done")
      }
    });
    
    xhr.open("POST", "https://dkvm/api/urls/add");
    xhr.setRequestHeader("Content-Type", "text/plain"); 
    
    xhr.send(data);    
    
  }
  event.preventDefault();
}
function parsePosts(){
    function add(b,h){return b.insertAdjacentElement("afterend", h);}
    function makeTag(t){return document.createElement(t);}
    function makeBtn(n,oncl,hr){var b=makeText("button",n); 
                b.addEventListener("click",oncl);
                b.href=hr;
                b.className="btn btn-default";
                return b;
    }
    function makeText(tag,text){t=makeTag(tag);t.appendChild(d.createTextNode(text));return t;}
    var d=document;
    var s=d.querySelectorAll("tr.regular");
    if(s.length>0){
        a=""; 
        for(var p of s){
            if (!p.hasAttribute("parsed")){
                h=p.querySelectorAll("td.subject");
                titles = [];
                if (h.length>0) {
                    for (var t of h) {
                        titles.push(t.textContent.trim());
                        console.log(t.textContent.trim());
                    }
                }
                h=p.querySelectorAll("tr.urls a");
                if (h.length>0) {
                    for (var t of h) titles.push(t.href);
                }
                p.insertBefore(makeBtn(titles[0],btnclick,titles.join("\n")), p.firstChild);
                p.setAttribute("parsed",true);
            }
        }
    }
}
window.addEventListener("load", parsePosts, false);
parsePosts();
