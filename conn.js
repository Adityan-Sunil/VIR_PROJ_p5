var url = "wss://fgz1acx06f.execute-api.us-east-1.amazonaws.com/Development/";
//var url = "ws://localhost:4000/socket";
var myColor;
var serverDiv = document.getElementById("players");
webSocket = new WebSocket(url);
var res;
var currentroomID;
var nextPlayer = "red";
webSocket.onmessage = function (event) {
  try {
    res = JSON.parse(event.data);
    console.log(res);
  } catch (error) {
    res = event.data;
  }
  console.log(typeof(res));
  console.log(res.roomID);
  console.log(JSON.parse(event.data));
  var data = JSON.parse(event.data);
  var data = JSON.parse(event.data);
  switch (data.action) {
    case "joinRoom":
      var playerarr = data.userID;
      var colorarr = data.color;
      currentroomID = data.roomID;
      document.getElementById("roomID").innerText = currentroomID;
      createPlayerDiv(playerarr,colorarr);
      document.getElementById("red").getElementsByTagName("span")[0].innerText = "Now Playing";
      document.getElementById("red").getElementsByTagName("span")[0].classList.add("active");
      if(playerarr[playerarr.length - 1]== username.value){
        myColor = colorarr[colorarr.length-1];
        console.log(myColor);
      }else{
        console.log(playerarr[playerarr.length - 1]+" "+ username.value);
      }
      setup();
      setOwner(myColor);
      break;
    case "makeMove":
      expandReaction(data.col,data.row,getMyCol(data.cur));
      var sp = serverDiv.getElementsByTagName("span");
      console.log(sp);
      for (let i = 0; i < sp.length; i++) {
        sp[i].classList.remove("active");
        sp[i].innerText="";
      }
      var next = document.getElementById(data.next);
      nextPlayer = data.next;
      next.getElementsByTagName("span")[0].classList.add("active");
      next.getElementsByTagName("span")[0].innerText = "Now Playing";
      break;
    case "assignCol":
      console.log("Assigning "+data.color);
      myColor = data.color;
      setup();
      setOwner(data.color);
      break;
    case "gameOver":
      if(data.userID === username.value)
        document.getElementById("winner").innerText = "You are the winner";
      else
        document.getElementById("winner").innerText = "Game Over. The winner is "+data.userID;
      document.getElementById("game").classList.add("hidden");
      document.getElementById("gameOver").classList.remove("hidden");
      console.log("Game Over. The winner is "+data.winner);
      break;
    case "playerlost":
      document.getElementById(data.color).classList.remove("active");
      document.getElementById(data.color).getElementsByTagName("span")[0].innerText = "";
      document.getElementById(data.color).classList.add("lost");
      if(data.color === myColor){
        console.log("You have lost");
      }else{
        console.log(data.color+" has lost");
      }
      break;
    case "disconnect":
      var playerarr = data.userID;
      var colorarr = data.color;
      createPlayerDiv(playerarr,colorarr);
    break;
    default:
      break;
  }
}
var username = document.getElementById("username");
var roomId = document.getElementById("room");
function connect(){
  document.getElementById("login").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  webSocket.send(JSON.stringify({"action":"joinRoom","roomID":roomId.value,"username":username.value}));
}
function restart(){
  window.location.reload();
}
webSocket.onopen = function (event) {``
  console.log("Connected");
};
webSocket.onclose = function(event){
  webSocket.send(JSON.stringify({"roomID":currentroomID}));
}
function gameOver(){
    webSocket.send(JSON.stringify({"roomID":currentroomID,action:"gameOver",color:myColor}));
}
function gameMove(x,y){
  if(nextPlayer == myColor)
    webSocket.send(JSON.stringify({"roomID":currentroomID,"action":"makeMove","col":x,"row":y,"color":myColor}));
}
function getMyCol(myCol){
  if(myCol == "mine"){
    if(myColor == 255){
      return 255;
    }else{
      myCol = myColor;
    }
  }
  if(myCol == "red"){
    return getRed();
  }else if(myCol == "blue"){
    return getBlue();
  }else if(myCol == "green"){
    return getGreen();
  }else if(myCol == "purple"){
    return getPurple();
  }else if(myCol == "pink"){
    return getPink();
  }else if(myCol == "yellow"){
    return getYellow();
  }
}
function createPlayerDiv(playerarr,colorarr){
  serverDiv.innerHTML = "";
  for (let i = 0; i < playerarr.length; i++) {
    var player = document.createElement("div");
    var player_clr = document.createElement("div");
    var player_nm = document.createElement("div");
    var status = document.createElement("span");
    player_clr.setAttribute("class","player-color");
    player_nm.setAttribute("class","player-name");
    player.setAttribute("class","player");
    if(playerarr[i].color === myColor){
      player.classList.add("self");
    }
    player.setAttribute("id",colorarr[i]);
    console.log(playerarr[i]);
    player_clr.style.background = colorarr[i];
    player_nm.innerText = str(playerarr[i]);

    player_nm.append(status);
    player.append(player_clr);
    player.append(player_nm);
    serverDiv.append(player);
  }
}