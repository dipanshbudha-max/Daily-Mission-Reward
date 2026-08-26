const KEY="dmr_v1";let db=JSON.parse(localStorage.getItem(KEY)||'{"users":{},"current":null}');let editMissionId=null;
function saveDB(){localStorage.setItem(KEY,JSON.stringify(db))}
function current(){return db.current?db.users[db.current]:null}
function uid(){return db.current}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function openAuth(type){document.getElementById('authBody').innerHTML=type==='login'?`<h2>🔐 Login</h2><form onsubmit="login(event)"><label>Email</label><input id="aEmail" type="email" required><label>Password</label><input id="aPass" type="password" required><button class="primary wide">Login</button></form><div class="authswitch">No account? <button onclick="openAuth('register')">Create Account</button></div>`:`<h2>👤 Create Account</h2><form onsubmit="register(event)"><label>Name</label><input id="aName" required maxlength="60"><label>Email</label><input id="aEmail" type="email" required><label>Password</label><input id="aPass" type="password" minlength="6" required><button class="primary wide">Create Account</button></form><div class="authswitch">Already registered? <button onclick="openAuth('login')">Login</button></div>`;document.getElementById('authModal').classList.add('on')}
function closeModals(){document.querySelectorAll('.modal').forEach(x=>x.classList.remove('on'))}
function register(e){e.preventDefault();let name=aName.value.trim(),email=aEmail.value.trim().toLowerCase(),pass=aPass.value;if(db.users[email])return alert('Email already registered.');db.users[email]={id:email,name,email,password:pass,points:0,missions:[],history:[],reward:{name:'My Final Reward',points:500,claimed:false}};db.current=email;saveDB();closeModals();render()}
function login(e){e.preventDefault();let email=aEmail.value.trim().toLowerCase(),pass=aPass.value;if(!db.users[email]||db.users[email].password!==pass)return alert('Incorrect email or password.');db.current=email;saveDB();closeModals();render()}
function logout(){db.current=null;saveDB();render()}
function render(){if(!current()){landing.classList.remove('hidden');dashboard.classList.add('hidden');navUser.innerHTML='';return}landing.classList.add('hidden');dashboard.classList.remove('hidden');navUser.innerHTML=`👤 ${escapeHTML(current().name)} <button class="secondary" onclick="logout()">Logout</button>`;welcome.textContent=`Welcome, ${current().name}!`;updateStatuses();points.textContent=current().points;missionCount.textContent=`${current().missions.length} / 10`;rewardCost.textContent=current().reward.points;rewardRequired.textContent=current().reward.points;rewardPoints.textContent=current().points;rewardName.textContent=current().reward.name;claimedText.textContent=current().reward.claimed?'🎉 Reward claimed! Customize a new reward anytime.':'';claimBtn.disabled=current().points<current().reward.points||current().reward.claimed;claimBtn.textContent=current().reward.claimed?'✅ Claimed':current().points>=current().reward.points?'🎁 Claim Reward':'🔒 Not Enough Points';renderMissions()}
function updateStatuses(){let now=Date.now();current().missions.forEach(m=>{if(m.status==='completed')return;if(now<new Date(m.start).getTime())m.status='upcoming';else if(now<=new Date(m.end).getTime())m.status='active';else m.status='expired'});saveDB()}
function renderMissions(){missions.innerHTML=current().missions.map(m=>`<div class="mission"><div class="num">MISSION ${m.number}</div><h2>${escapeHTML(m.title)}</h2><div class="info">⭐ ${m.points} points<br>🟢 ${fmt(m.start)}<br>🔴 ${fmt(m.end)}</div><span class="status ${m.status}">${m.status.toUpperCase()}</span><div class="actions">${m.status==='active'?`<button class="complete" onclick="completeMission('${m.id}')">✓ Complete</button>`:''}<button class="edit" onclick="openMission('${m.id}')">Edit</button><button class="delete" onclick="deleteMission('${m.id}')">Delete</button></div></div>`).join('')||'<div class="card"><h2>No missions yet 🎯</h2><p>Create your first mission.</p></div>'}
function fmt(x){return new Date(x).toLocaleString([], {dateStyle:'medium',timeStyle:'short'})}
function openMission(id){if(current().missions.length>=10&&!id)return alert('Maximum 10 missions.');editMissionId=id||null;missionHeading.textContent=id?'✏️ Edit Mission':'➕ Add Mission';if(id){let m=current().missions.find(x=>x.id===id);mTitle.value=m.title;mPoints.value=m.points;mStart.value=local(m.start);mEnd.value=local(m.end)}else{document.querySelector('#missionModal form').reset();editId.value=''}missionModal.classList.add('on')}
function local(x){let d=new Date(x),p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`}
function saveMission(e){e.preventDefault();let title=mTitle.value.trim(),pointsN=+mPoints.value,start=new Date(mStart.value),end=new Date(mEnd.value);if(!title||pointsN<1||isNaN(start)||isNaN(end)||end<=start)return alert('Please enter valid mission details.');if(editMissionId){let m=current().missions.find(x=>x.id===editMissionId);if(m.status==='completed')return alert('Completed missions cannot be edited.');Object.assign(m,{title,points:pointsN,start:start.toISOString(),end:end.toISOString()})}else{let nums=current().missions.map(m=>m.number);let n=1;while(nums.includes(n))n++;current().missions.push({id:crypto.randomUUID(),number:n,title,points:pointsN,start:start.toISOString(),end:end.toISOString(),status:'upcoming'})}saveDB();closeModals();render()}
function deleteMission(id){if(!confirm('Delete this mission?'))return;current().missions=current().missions.filter(m=>m.id!==id);saveDB();render()}
function completeMission(id){let m=current().missions.find(x=>x.id===id);if(!m)return;let now=Date.now();if(now<new Date(m.start))return alert('Mission has not started yet.');if(now>new Date(m.end)){m.status='expired';saveDB();render();return alert('Mission expired.');}if(m.status!=='active')return; m.status='completed';m.completedAt=new Date().toISOString();current().points+=m.points;current().history.unshift({type:'mission',points:m.points,desc:`Completed: ${m.title}`,date:new Date().toISOString()});saveDB();setCharacter('🥳');render()}
function openReward(){rName.value=current().reward.name;rPoints.value=current().reward.points;rewardModal.classList.add('on')}
function saveReward(e){e.preventDefault();current().reward.name=rName.value.trim();current().reward.points=Math.max(1,+rPoints.value);current().reward.claimed=false;saveDB();closeModals();render()}
function claimReward(){let r=current().reward;if(r.claimed)return;if(current().points<r.points)return alert('Not enough points.');if(!confirm(`Claim "${r.name}" for ${r.points} points?`))return;current().points-=r.points;r.claimed=true;current().history.unshift({type:'reward',points:-r.points,desc:`Claimed: ${r.name}`,date:new Date().toISOString()});saveDB();setCharacter('🤩');render();alert('🎉 Final reward claimed!')}
function showHistory(){history.innerHTML=current().history.length?current().history.map(h=>`<div class="historyrow"><b class="${h.points>=0?'plus':'minus'}">${h.points>=0?'+':''}${h.points}</b><span>${escapeHTML(h.desc)}</span><small>${fmt(h.date)}</small></div>`).join(''):'<p>No point history yet.</p>';historyModal.classList.add('on')}
let characterTimer=null;
function setCharacter(x,duration=3000){
  clearTimeout(characterTimer);
  character.textContent=x;

  characterTimer=setTimeout(()=>{
    if(current()){
      let active=current().missions.some(m=>m.status==='active');
      character.textContent=active?'😄':'🙂';
    }
  },duration);
}
setInterval(()=>{
  if(current()){
    updateStatuses();
    renderMissions();
  }
},1000);

render();
