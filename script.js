const $ = (id) => document.getElementById(id);

const defaultState = {
  coins: 120, food: 78, energy: 86, mood: 92,
  owned: ["poster"], room: "classic", secrets: [], runs: 0,
  lastVisit: Date.now()
};
let state = loadState();
let toastTimer;

const items = [
  {id:"poster", name:"Classic Spidey Poster", desc:"A hero deserves wall art.", icon:"🕸️", cost:0, room:"classic"},
  {id:"neon", name:"Neon City Lights", desc:"Make the room glow.", icon:"💡", cost:35, room:"neon"},
  {id:"comfy", name:"Comfy Hero Blanket", desc:"Even heroes need a nap.", icon:"🛏️", cost:45, room:"comfy"},
  {id:"comic", name:"Comic Collector Set", desc:"Peak web-head energy.", icon:"📚", cost:60, room:"comic"},
  {id:"plant", name:"Tiny Desk Plant", desc:"A little green sidekick.", icon:"🪴", cost:25, room:"plant"},
  {id:"headphones", name:"Hero Headphones", desc:"Soundtrack to saving NYC.", icon:"🎧", cost:50, room:"headphones"}
];
const secretMessages = [
  "Breaking news: local superhero is ridiculously cool. Sources say his favourite human is also pretty amazing. ❤️",
  "Reminder from your personal support human: drink water, eat something, and stop pretending you don't need rest.",
  "Your reward for being a certified cutie: one (1) virtual hug. Redeemable whenever you want. 🫂",
  "Spider-Man saves New York. You make my days better. Seems like we're both doing important work.",
  "P.S. You're allowed to have bad days. Even superheroes need someone in their corner. I'm cheering for you, always.",
  "Official Spidey report: 10/10 hero, 11/10 face, questionable levels of stubbornness. Case closed. 😭",
  "Your next mission: keep being you. No upgrades required. (Okay, maybe remember to reply to messages.)"
];
const helloLines = [
  "Your friendly neighbourhood bestie.",
  "Fit, friendly, and definitely not skipping leg day.",
  "With great power comes great responsibility... and snack breaks.",
  "I could use a web-slinging partner. You in?",
  "Your favourite human says you're doing great. Just saying.",
  "Not to brag, but I can do pull-ups on buildings."
];

function loadState(){
  try {
    const saved = JSON.parse(localStorage.getItem("spideyLittleWorld"));
    return saved ? {...structuredClone(defaultState), ...saved} : structuredClone(defaultState);
  } catch { return structuredClone(defaultState); }
}
function saveState(){ localStorage.setItem("spideyLittleWorld", JSON.stringify(state)); }
function clamp(n){ return Math.max(0, Math.min(100, n)); }
function toast(message){
  const el = $("toast"); el.textContent = message; el.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(()=>el.classList.remove("show"), 2300);
}
function say(message){
  $("speechBubble").textContent = message;
  $("speechBubble").classList.add("show");
  $("spidey").classList.remove("excited"); void $("spidey").offsetWidth; $("spidey").classList.add("excited");
  setTimeout(()=>$("speechBubble").classList.remove("show"), 3000);
}
function renderStats(){
  $("coinCount").textContent = state.coins;
  ["food","energy","mood"].forEach(k=>{
    $(k+"Value").textContent = state[k]+"%";
    $(k+"Bar").style.width = state[k]+"%";
  });
  $("messageCount").textContent = String(Math.min(state.secrets.length, secretMessages.length)).padStart(2,"0");
}
function renderShop(){
  $("shopList").innerHTML = items.map(item=>{
    const owned = state.owned.includes(item.id);
    const canBuy = state.coins >= item.cost;
    return `<div class="shop-item"><div class="item-art">${item.icon}</div><div class="item-info"><b>${item.name}</b><small>${item.desc}</small></div><button class="buy-btn ${owned?'owned':''}" data-item="${item.id}" ${owned?'disabled':''}>${owned?'✓ OWNED':`● ${item.cost}`}</button></div>`;
  }).join("");
  $("shopList").querySelectorAll("[data-item]").forEach(btn=>btn.addEventListener("click",()=>buyItem(btn.dataset.item)));
}
function applyRoom(){
  document.body.classList.remove("room-neon","room-comfy","room-comic");
  if(state.room==="neon") document.body.classList.add("room-neon");
  if(state.room==="comfy") document.body.classList.add("room-comfy");
  if(state.room==="comic") document.body.classList.add("room-comic");
  if(state.owned.includes("plant")) $("roomScene").classList.add("has-plant");
  $("roomTitle").textContent = state.room==="classic" ? "SPIDEY'S ROOM" : `SPIDEY'S ${state.room.toUpperCase()} ROOM`;
}
function buyItem(id){
  const item = items.find(x=>x.id===id); if(!item) return;
  if(state.owned.includes(id)) return;
  if(state.coins < item.cost){toast("Not enough web coins yet! Try a city run. 🕸️");return;}
  state.coins -= item.cost; state.owned.push(id); state.room = item.room;
  saveState(); renderAll(); toast(`${item.name} unlocked! Looking good, web-head.`);
}
function action(type){
  if(type==="feed"){
    if(state.food>=100){say("I'm full! Save me a slice for later.");toast("Spidey's snack level is already full!");return;}
    state.food=clamp(state.food+22); state.mood=clamp(state.mood+5); say("PIZZA TIME! You know the way to a hero's heart.");
    toast("Spidey enjoyed a pizza snack. +22 snack level 🍕");
  } else if(type==="rest"){
    state.energy=clamp(state.energy+25); state.mood=clamp(state.mood+3); say("Power nap complete. Back to being amazing.");
    toast("Energy restored. Even heroes need rest. 🛏️");
  } else if(type==="play"){
    if(state.energy<12){say("I'm running low on energy. Let me rest first?");toast("Spidey needs a little rest before playing.");return;}
    state.energy=clamp(state.energy-12);state.mood=clamp(state.mood+17);state.food=clamp(state.food-5);
    say("That was fun! Next time, let's swing across the whole city.");
    toast("Hangout complete! Mood boosted. 🕸️");
  } else if(type==="compliment"){
    state.mood=clamp(state.mood+10);say(["Aw, stop it... actually, keep going.","Your compliments are more powerful than my spider-sense.","I am blushing under this mask. Probably.","You have excellent taste in superheroes."][Math.floor(Math.random()*4)]);
    toast("Compliment received. Hero ego: gently boosted. ❤️");
  }
  saveState();renderStats();
}
function renderAll(){renderStats();renderShop();applyRoom();}
document.querySelectorAll("[data-action]").forEach(btn=>btn.addEventListener("click",()=>action(btn.dataset.action)));
$("talkBtn").addEventListener("click",()=>say(helloLines[Math.floor(Math.random()*helloLines.length)]));
$("petWrap").addEventListener("click",()=>say(helloLines[Math.floor(Math.random()*helloLines.length)]));
$("unlockMessage").addEventListener("click",()=>{
  let next = secretMessages.findIndex((_,i)=>!state.secrets.includes(i));
  if(next<0){say("You've found all my secrets! But you can reread them any time.");$("secretMessage").textContent=secretMessages[state.secrets[state.secrets.length-1] ?? 0];toast("All secret messages found, legend!");return;}
  state.secrets.push(next);$("secretMessage").textContent=secretMessages[next];
  saveState();renderStats();say("Psst... a secret message just for you.");toast("Secret message unlocked! ✉");
});
$("resetBtn").addEventListener("click",()=>{
  if(confirm("Reset Spidey's world? Your coins, items and progress will be cleared on this device.")){
    state=structuredClone(defaultState);saveState();renderAll();$("secretMessage").textContent="Psst... there are messages hidden around this little world. Keep checking in, superhero.";toast("World reset. A fresh start for your friendly neighbourhood pet.");
  }
});

// A lightweight canvas mini-game: tap / Space to swing upward, collect coins, avoid pigeons.
const canvas=$("gameCanvas"), ctx=canvas.getContext("2d");
let game={running:false,frame:0,y:190,vy:0,x:80,obstacles:[],coins:[],score:0,world:0,lastSpawn:0};
function pixelRect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),w,h);}
function drawCity(){
  pixelRect(0,0,640,300,"#172644");
  for(let i=0;i<7;i++){
    let x=((i*115-game.world*.35)%760+760)%760-90;
    let h=65+(i*31%80);
    pixelRect(x,210-h,70,h,"#24395c");
    for(let wx=x+10;wx<x+62;wx+=17) for(let wy=220-h+12;wy<205;wy+=19) pixelRect(wx,wy,6,7,"#ffd16688");
    pixelRect(x+18,210-h-12,30,12,"#304a70");
  }
  pixelRect(0,235,640,65,"#0d1830");
  for(let x=0;x<640;x+=24){pixelRect(x-(game.world%24),235,13,4,"#344969");}
  // web strands
  ctx.strokeStyle="#536b90";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,24);ctx.lineTo(640,24);ctx.stroke();
  for(let x=30;x<640;x+=70){ctx.beginPath();ctx.moveTo(x,24);ctx.lineTo(x+20,46);ctx.stroke();}
}
function drawPixelSpidey(x,y){
  // Athletic, slim superhero silhouette; pixel-art proportions, not chubby.
  pixelRect(x+7,y,14,13,"#d72e45");pixelRect(x+4,y+4,20,8,"#d72e45");
  pixelRect(x+6,y+4,5,6,"#f4f4f2");pixelRect(x+17,y+4,5,6,"#f4f4f2");
  pixelRect(x+10,y+13,8,4,"#b9223a");
  pixelRect(x+4,y+17,20,18,"#d72e45");pixelRect(x+1,y+19,5,15,"#d72e45");pixelRect(x+22,y+19,5,15,"#d72e45");
  pixelRect(x+7,y+19,14,12,"#d72e45");pixelRect(x+11,y+21,6,8,"#172644");
  pixelRect(x+7,y+34,7,16,"#1e5597");pixelRect(x+15,y+34,7,16,"#1e5597");
  pixelRect(x+5,y+47,10,5,"#d72e45");pixelRect(x+14,y+47,10,5,"#d72e45");
  // mask web hints
  ctx.strokeStyle="#8f2339";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+5,y+7);ctx.lineTo(x+22,y+7);ctx.moveTo(x+13,y+1);ctx.lineTo(x+13,y+12);ctx.stroke();
}
function drawCoin(x,y){pixelRect(x+3,y,7,12,"#ffd166");pixelRect(x,y+3,13,6,"#ffd166");pixelRect(x+4,y+4,5,4,"#fff0a6");}
function drawPigeon(o){pixelRect(o.x+2,o.y+5,20,11,"#aab9cb");pixelRect(o.x+7,o.y,10,10,"#c6d0dc");pixelRect(o.x+16,o.y+3,8,5,"#d6a16a");pixelRect(o.x+7,o.y+15,3,5,"#e5a75d");pixelRect(o.x+14,o.y+15,3,5,"#e5a75d");}
function drawGame(){
  drawCity();
  if(game.running){
    // web line swings above the hero
    ctx.strokeStyle="#e9edf6";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(game.x+14,0);ctx.lineTo(game.x+14,game.y+7);ctx.stroke();
    game.coins.forEach(c=>drawCoin(c.x,c.y));game.obstacles.forEach(drawPigeon);
    drawPixelSpidey(game.x,game.y);
    pixelRect(16,16,90,5,"#354a6b");pixelRect(16,16,Math.max(0,90-Math.floor(game.y/3)),5,"#f04452");
    ctx.fillStyle="#dbe5f5";ctx.font="10px monospace";ctx.fillText("WEB-SLING POWER",16,12);
  } else {
    drawPixelSpidey(95,177);
    ctx.fillStyle="#dbe5f5";ctx.font="12px monospace";ctx.fillText("READY TO SWING?",245,65);
    ctx.fillStyle="#95a9c6";ctx.font="10px monospace";ctx.fillText("COLLECT COINS · DODGE PIGEONS",220,84);
  }
}
function startRun(){
  if(game.running)return;
  game={running:true,frame:0,y:170,vy:0,x:90,obstacles:[],coins:[],score:0,world:0,lastSpawn:0};
  $("gameOverlay").classList.add("hidden");$("gameStatus").textContent="SWINGING THROUGH NYC";$("runCoins").textContent="0";
  requestAnimationFrame(loopGame);
}
function swing(){if(game.running)game.vy=-4.5;}
function loopGame(){
  if(!game.running)return;
  game.frame++;game.world+=3.1;
  game.vy+=.22;game.y+=game.vy;
  if(game.y<45){game.y=45;game.vy=.6;}if(game.y>210){endRun("You clipped a rooftop!");return;}
  if(game.frame-game.lastSpawn>68){
    game.lastSpawn=game.frame;
    if(Math.random()>.25)game.coins.push({x:660,y:70+Math.random()*115});
    else game.obstacles.push({x:660,y:70+Math.random()*130});
  }
  game.coins.forEach(c=>c.x-=3.5);game.obstacles.forEach(o=>o.x-=3.5);
  game.coins=game.coins.filter(c=>c.x>-20);game.obstacles=game.obstacles.filter(o=>o.x>-40);
  for(let i=game.coins.length-1;i>=0;i--){
    const c=game.coins[i];
    if(c.x<game.x+30&&c.x+13>game.x&&c.y<game.y+53&&c.y+12>game.y){
      game.coins.splice(i,1);game.score++;$("runCoins").textContent=game.score;
    }
  }
  for(const o of game.obstacles){
    if(o.x<game.x+25&&o.x+24>game.x&&o.y<game.y+50&&o.y+20>game.y){endRun("Pigeon attack! Try again, web-head.");return;}
  }
  drawGame();requestAnimationFrame(loopGame);
}
function endRun(message){
  game.running=false;
  const earned=game.score*5+5;state.coins+=earned;state.energy=clamp(state.energy-10);state.mood=clamp(state.mood+8);state.runs++;
  saveState();renderAll();$("gameStatus").textContent="RUN COMPLETE";$("gameOverlay").classList.remove("hidden");
  $("gameOverlay").innerHTML=`<div class="overlay-icon">✦</div><b>${message.toUpperCase()}</b><span>You collected ${game.score} coin${game.score===1?"":"s"} and earned ${earned} web coins!</span><button class="primary-btn" id="againBtn">↻ Run it back</button>`;
  $("againBtn").addEventListener("click",startRun);
  toast(`Run complete! +${earned} web coins. Nice swinging!`);
}
$("startGame").addEventListener("click",startRun);
canvas.addEventListener("pointerdown",swing);
window.addEventListener("keydown",e=>{if(e.code==="Space"){if(game.running){e.preventDefault();swing();}else if(document.activeElement.tagName!=="BUTTON"){e.preventDefault();startRun();}}});
drawGame();renderAll();
// Gentle decay over time, capped so a returning player isn't punished too hard.
const elapsed=Math.max(0,Math.min(8,Math.floor((Date.now()-(state.lastVisit||Date.now()))/3600000)));
if(elapsed){state.food=clamp(state.food-elapsed*2);state.energy=clamp(state.energy-elapsed*2);state.mood=clamp(state.mood-elapsed);state.lastVisit=Date.now();saveState();renderStats();}
setInterval(()=>{if(!game.running){state.food=clamp(state.food-1);state.energy=clamp(state.energy-1);if(state.food<25||state.energy<25)state.mood=clamp(state.mood-1);saveState();renderStats();}},90000);
