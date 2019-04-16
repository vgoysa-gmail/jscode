function btnclick(event)
{
  if (this.href) {
    let data = this.href;

    let cl=this.classList;
    let xhr = new XMLHttpRequest();
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
    let s=document.querySelectorAll("div.post");
    if(s.length>0){
        a="";
        for(let p of s){
            if (!p.hasAttribute("parsed")){
                h=p.querySelectorAll("h3.post-title");
                titles = [];
                if (h.length>0) {
                    for (let t of h) {
                        titles.push(t.textContent.trim());
                        console.log(t.textContent.trim());
                    }
                }
                h=p.querySelectorAll("div.post-body a:not([target])[href]");
                if (h.length>0) {
                    for (let t of h) titles.push(t.href);
                }
                p.insertBefore(makeBtn(titles[0],btnclick,titles.join("\n")), p.firstChild);
                p.setAttribute("parsed",true);
            }
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
        let c = document.cookie.match(`(?:(?:^|.*; *)${name} *= *([^;]*).*$)|^.*$`)[1];
        if (c) return decodeURIComponent(c);
      }
  , set: (name, value, opts = {}) => {
        if (opts.days) {
            opts['max-age'] = opts.days * 60 * 60 * 24;
            delete opts.days
            }
        opts = Object.entries(opts).reduce((str, [k, v]) => `${str}; ${k}=${v}`, '');
        document.cookie = name + '=' + encodeURIComponent(value) + opts;
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
// window.addEventListener("load", parsePosts, false);
parsePosts();
loadCSS();
