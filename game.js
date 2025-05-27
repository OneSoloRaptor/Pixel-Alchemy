var elemData = {
  "Conditional":{emoji:"🔀",explanation:"A structure that allows code to make decisions based on conditions (if, else)."},
  "Method":{emoji:"🔧",explanation:"A block of code within a class that performs a specific task. Called using objects or class names."},
  "Variable":{emoji:"📦",explanation:"A container for storing data values, with a type and identifier."},
  "Object":{emoji:"🧱",explanation:"An instance of a class that holds state and can perform actions via methods."},
  "Loop":{emoji:"🔁",explanation:"A way to repeat code multiple times (for, while, do-while)."},
  "Class":{emoji:"🏛️",explanation:"A blueprint for creating objects, defining fields and methods."},
  "Constructor":{emoji:"🏗️",explanation:"A special method used to instantiate objects and initialize their state."},
  "Counter":{emoji:"🔢",explanation:"A variable used to keep track of iterations in loops."},
  "Parameter":{emoji:"🔣",explanation:"Data passed into methods to customize their operation."},
  "Override":{emoji:"🔄",explanation:"Redefining a superclass method in a subclass to change its behavior."},
  "Call":{emoji:"📞",explanation:"Invoking a method on an object or class."},
  "Subclass":{emoji:"🧬",explanation:"A class that inherits from another class (superclass), gaining its fields and methods."},
  "While Loop":{emoji:"🔂",explanation:"A loop that repeats as long as a condition is true."},
  "Instance Variable":{emoji:"📍",explanation:"A variable defined in a class and tied to object instances."},
  "Boolean":{emoji:"🔘",explanation:"A variable or expression that is either true or false."},
  "Accessing":{emoji:"📬",explanation:"Retrieving or modifying the value of an object's fields."},
  "Inheritance":{emoji:"🧬",explanation:"A mechanism where a class acquires the properties and behaviors of another class."},
  "Signature":{emoji:"✍️",explanation:"The combination of a method's name and its parameter types."},
  "Return":{emoji:"↩️",explanation:"Providing a value back from a method to its caller."},
  "Polymorphism":{emoji:"🌀",explanation:"The ability for different classes to be treated as the same type, usually via inheritance."},
  "For Loop":{emoji:"⏩",explanation:"A loop that runs a specific number of times, often using a counter."},
  "Instance":{emoji:"🪄",explanation:"A concrete occurrence of any object, created from a class."},
  "Overloading":{emoji:"➕",explanation:"Defining multiple methods with the same name but different parameter lists."},
  "If Statement":{emoji:"❓",explanation:"A conditional statement that executes code only if a condition is true."},
  "Interface":{emoji:"🔌",explanation:"A reference type in Java used to specify methods a class must implement."},
  "Abstract Class":{emoji:"🌫️",explanation:"A class that cannot be instantiated and may have abstract methods to be implemented by subclasses."},
  "Array":{emoji:"📚",explanation:"A collection of elements, all of the same type, stored in a contiguous block of memory."},
  "ArrayList":{emoji:"📋",explanation:"A resizable array implementation found in the Java Collections Framework."},
  "Null":{emoji:"0️⃣",explanation:"A special value indicating that a variable does not reference any object."},
  "Encapsulation":{emoji:"🔒",explanation:"The practice of keeping fields private and controlling access via methods."},
  "Static":{emoji:"📌",explanation:"A field or method that belongs to the class, not instances."},
  "Casting":{emoji:"🧪",explanation:"Converting a variable from one type to another."},
  "Recursion":{emoji:"🔁",explanation:"A method calling itself to solve a problem in smaller steps."},
  "Algorithm":{emoji:"🧮",explanation:"A step-by-step procedure for solving a problem."},
  "Scope":{emoji:"🔭",explanation:"Defines where a variable or method is accessible in the code."},
  "APIs":{emoji:"🔗",explanation:"Application Programming Interfaces: libraries and their documentation used to interact with code."},
  "Exception":{emoji:"⚠️",explanation:"An event that disrupts the normal flow of a program’s instructions."},
  "Try-Catch":{emoji:"🛑",explanation:"A block to handle exceptions and execute code safely."}
};

var comboTable = {
  "class+method":"Constructor",
  "loop+variable":"Counter",
  "method+variable":"Parameter",
  "method+method":"Override",
  "object+method":"Call",
  "class+class":"Subclass",
  "conditional+loop":"While Loop",
  "class+variable":"Instance Variable",
  "conditional+variable":"Boolean",
  "object+variable":"Accessing",
  "class+object":"Inheritance",
  "counter+while loop":"For Loop",
  "class+subclass":"Polymorphism",
  "constructor+object":"Instance",
  "call+variable":"Return",
  "method+parameter":"Signature",
  "constructor+signature":"Overloading",
  "call+boolean":"If Statement",
  "class+interface":"Abstract Class",
  "class+abstract class":"Interface",
  "variable+object":"Null",
  "instance variable+encapsulation":"Static",
  "object+array":"ArrayList",
  "loop+array":"Array",
  "object+null":"Exception",
  "class+signature":"APIs",
  "instance+object":"Casting",
  "recursion+method":"Algorithm",
  "parameter+scope":"Encapsulation",
  "exception+try-catch":"Try-Catch",
  "while loop+object":"Recursion",
  "loop+recursion":"Algorithm",
  "boolean+method":"Return",
  "for loop+counter":"Algorithm"
};

var baseElems = ["Conditional","Method","Variable","Object","Loop","Class"];
var board = [];
var founds = JSON.parse(localStorage.getItem("discovered")||"[]");
var draggingBlock = null;
var dragDelta = {x:0, y:0};
var dragFrom = {x:0, y:0};
var tabNow = "elements";
var popTimer = null;

function rid() { return Math.random().toString(36).slice(2,10); }
function ckey(a,b) { return [a.toLowerCase(),b.toLowerCase()].sort().join("+"); }
function getBlock(id) { for(var i=0;i<board.length;i++)if(board[i].id===id)return board[i]; }
function elemInfo(name) { return elemData[name]||{emoji:"❓",explanation:"Explanation not available."}; }

function tabswap() {
  document.getElementById("elementsTabBtn").className = tabNow==="elements"?"tab-btn active":"tab-btn";
  document.getElementById("explanationsTabBtn").className = tabNow==="explanations"?"tab-btn active":"tab-btn";
  document.getElementById("elements").style.display = tabNow==="elements"?"block":"none";
  document.getElementById("explanations").style.display = tabNow==="explanations"?"block":"none";
}
function fillSide() {
  var e = document.getElementById("elements");
  e.innerHTML = "";
  for(var i=0; i<baseElems.length; i++) {
    var nm = baseElems[i];
    var d = document.createElement("div");
    d.className = "element";
    d.draggable = false;
    d.dataset.element = nm;
    d.innerHTML = "<span class='emoji'>" + elemInfo(nm).emoji + "</span><span class='label'>" + nm + "</span>";
    d.addEventListener("mousedown", dragFromSide);
    e.appendChild(d);
  }
  for(var i=0; i<founds.length; i++) {
    var obj = founds[i];
    if(baseElems.indexOf(obj.name)!==-1)continue;
    var d2 = document.createElement("div");
    d2.className = "element discovered";
    d2.draggable = false;
    d2.dataset.element = obj.name;
    d2.innerHTML = "<span class='emoji'>" + elemInfo(obj.name).emoji + "</span><span class='label'>" + obj.name + "</span>";
    d2.addEventListener("mousedown", dragFromSide);
    e.appendChild(d2);
  }
}
function fillExplain() {
  var x = document.getElementById("explanations");
  x.innerHTML = "";
  for(var i=0; i<baseElems.length; i++) {
    var nm = baseElems[i], e=elemInfo(nm);
    var d = document.createElement("div");
    d.className = "element explanation base";
    d.innerHTML = "<span class='emoji'>" + e.emoji + "</span><span class='label'>" + nm + "</span><div class='explanation-text'>" + e.explanation + "</div>";
    x.appendChild(d);
  }
  for(var i=0;i<founds.length;i++) {
    var obj=founds[i];
    if(baseElems.indexOf(obj.name)!==-1)continue;
    var e2 = elemInfo(obj.name);
    var d2 = document.createElement("div");
    d2.className = "element explanation";
    d2.innerHTML = "<span class='emoji'>" + e2.emoji + "</span><span class='label'>" + obj.name + "</span><div class='explanation-text'>" + e2.explanation + "</div>";
    x.appendChild(d2);
  }
}
function drawBoard() {
  var ws = document.getElementById("workspace");
  ws.querySelectorAll(".workspace-block").forEach(function(b){b.remove();});
  for(var i=0;i<board.length;i++) {
    var bb=board[i];
    var d=document.createElement("div");
    d.className="workspace-block";
    d.style.left=(bb.x||30)+"px";
    d.style.top=(bb.y||40)+"px";
    d.innerHTML="<span class='emoji'>"+bb.emoji+"</span><span class='label'>"+bb.name+"</span>";
    d.dataset.id=bb.id;
    d.addEventListener("mousedown", dragBlock);
    ws.appendChild(d);
  }
  var hint=document.getElementById("workspaceHint");
  hint.style.display=board.length?"none":"block";
}
function dragFromSide(e) {
  var nm = e.currentTarget.dataset.element, emoji = elemInfo(nm).emoji;
  if(!nm)return;
  var ws=document.getElementById("workspace");
  var wsBox=ws.getBoundingClientRect();
  var ghost=document.createElement("div");
  ghost.className="workspace-block dragging";
  ghost.style.position="absolute";
  ghost.innerHTML="<span class='emoji'>"+emoji+"</span><span class='label'>"+nm+"</span>";
  ghost.style.pointerEvents="none";
  ws.appendChild(ghost);
  function mm(ev) {
    var x=ev.clientX-wsBox.left-40, y=ev.clientY-wsBox.top-40;
    ghost.style.left=x+"px";
    ghost.style.top=y+"px";
  }
  function mu(ev) {
    document.removeEventListener("mousemove",mm);
    document.removeEventListener("mouseup",mu);
    ghost.remove();
    var x=ev.clientX-wsBox.left-40, y=ev.clientY-wsBox.top-40;
    if(x>=0&&y>=0&&x<=wsBox.width-80&&y<=wsBox.height-80) {
      board.push({name:nm,emoji:emoji,x:x,y:y,id:rid()});
      drawBoard();
      setTimeout(runCombos,90);
    }
  }
  document.addEventListener("mousemove",mm);
  document.addEventListener("mouseup",mu);
}
function setupTrash() {
  var trash = document.getElementById("trashCan");
  document.addEventListener("mousemove",function(e){
    if(!draggingBlock)return;
    var tr=trash.getBoundingClientRect();
    if(e.clientX>=tr.left&&e.clientX<=tr.right&&e.clientY>=tr.top&&e.clientY<=tr.bottom){
      trash.classList.add("drag-over");
    } else {
      trash.classList.remove("drag-over");
    }
  });
  document.addEventListener("mouseup",function(e){
    if(!draggingBlock)return;
    var tr=trash.getBoundingClientRect();
    if(e.clientX>=tr.left&&e.clientX<=tr.right&&e.clientY>=tr.top&&e.clientY<=tr.bottom){
      var id=draggingBlock.dataset.id;
      board=board.filter(function(z){return z.id!==id;});
      drawBoard();
      draggingBlock=null;
    }
    trash.classList.remove("drag-over");
  });
}
function dragBlock(e){
  var box=e.currentTarget;
  var ws=document.getElementById("workspace");
  var wsBox=ws.getBoundingClientRect();
  var id=box.dataset.id;
  var obj=getBlock(id);
  draggingBlock=box;
  draggingBlock.classList.add("dragging");
  dragFrom={x:obj.x,y:obj.y};
  dragDelta={
    x:e.clientX-wsBox.left-obj.x,
    y:e.clientY-wsBox.top-obj.y
  };
  function mm(ev){
    var x=ev.clientX-wsBox.left-dragDelta.x, y=ev.clientY-wsBox.top-dragDelta.y;
    x=Math.max(0,Math.min(x,wsBox.width-80));
    y=Math.max(0,Math.min(y,wsBox.height-80));
    draggingBlock.style.left=x+"px";
    draggingBlock.style.top=y+"px";
  }
  function mu(ev){
    document.removeEventListener("mousemove",mm);
    document.removeEventListener("mouseup",mu);
    draggingBlock.classList.remove("dragging");
    var x=ev.clientX-wsBox.left-dragDelta.x, y=ev.clientY-wsBox.top-dragDelta.y;
    x=Math.max(0,Math.min(x,wsBox.width-80));
    y=Math.max(0,Math.min(y,wsBox.height-80));
    obj.x=x; obj.y=y;
    draggingBlock.style.left=x+"px";
    draggingBlock.style.top=y+"px";
    draggingBlock=null;
    setTimeout(runCombos,100);
  }
  document.addEventListener("mousemove",mm);
  document.addEventListener("mouseup",mu);
}
function runCombos(){
  if(board.length<2)return;
  for(var i=0;i<board.length;i++){
    var a=board[i];
    var aDiv=document.querySelector(".workspace-block[data-id='"+a.id+"']");
    if(!aDiv)continue;
    var aRect=aDiv.getBoundingClientRect();
    for(var j=i+1;j<board.length;j++){
      var b=board[j];
      var bDiv=document.querySelector(".workspace-block[data-id='"+b.id+"']");
      if(!bDiv)continue;
      var bRect=bDiv.getBoundingClientRect();
      if(!(bRect.left>aRect.right||bRect.right<aRect.left||bRect.top>aRect.bottom||bRect.bottom<aRect.top)){
        var cname=comboTable[ckey(a.name,b.name)];
        if(cname){
          var cinfo=elemInfo(cname);
          board=board.filter(function(e){return e.id!==a.id&&e.id!==b.id;});
          var nx=(a.x+b.x)/2, ny=(a.y+b.y)/2;
          board.push({name:cname,emoji:cinfo.emoji,x:nx,y:ny,id:rid()});
          var isNew=addFound(cname);
          drawBoard();
          if(isNew) showExplainer(cname);
          setTimeout(runCombos,240);
          return;
        }
      }
    }
  }
}
function addFound(n){
  for(var i=0;i<founds.length;i++)if(founds[i].name===n)return false;
  var em=elemInfo(n).emoji;
  founds.push({name:n,emoji:em});
  localStorage.setItem("discovered",JSON.stringify(founds));
  fillSide();
  fillExplain();
  return true;
}
function showExplainer(n){
  var e=elemInfo(n);
  var p=document.getElementById("explanation-popup");
  p.innerHTML = "<div class='popup-title'>New Element Discovered!</div><div class='popup-emoji'>"+e.emoji+"</div><div class='popup-label'>"+n+"</div><div class='popup-explanation'>"+e.explanation+"</div>";
  p.classList.add("show");
  if(popTimer)clearTimeout(popTimer);
  popTimer=setTimeout(function(){p.classList.remove("show");},7000);
}
function msgPop(msg){
  var p=document.getElementById("popup");
  p.textContent=msg;
  p.classList.add("show");
  setTimeout(function(){p.classList.remove("show");},1400);
}
function resetGame(){
  board=[];
  founds=[];
  localStorage.removeItem("discovered");
  drawBoard();
  fillSide();
  fillExplain();
  msgPop("Game Reset!");
}
function emptyBoard(){
  board=[];
  drawBoard();
  msgPop("Workspace cleaned!");
}
window.addEventListener("DOMContentLoaded",function(){
  document.getElementById("elementsTabBtn").onclick=function(){tabNow="elements";tabswap();}
  document.getElementById("explanationsTabBtn").onclick=function(){tabNow="explanations";tabswap();}
  fillSide();
  fillExplain();
  drawBoard();
  tabswap();
  document.getElementById("resetBtn").onclick=resetGame;
  document.getElementById("cleanBoardBtn").onclick=emptyBoard;
  setupTrash();
});
