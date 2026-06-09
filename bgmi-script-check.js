
// ==================== DATA ====================
let D={
  users:[],
  tournaments:[],
  teams:[],
  matches:[],
  activities:[],
  issues:[],
  payments:[],
  settings:{name:'',upi:'',upiname:'',whatsapp:'',contact:''}
};
let currentUser=null;
let _payTeamId=null,_payTournamentId=null,_bcMatchId=null,_joinTournamentId=null,_replyIssueId=null,_payScreenshot=null;

function save(){localStorage.setItem('bgmi-v2',JSON.stringify(D));}
function load(){const d=localStorage.getItem('bgmi-v2');if(d){try{D={...D,...JSON.parse(d)};}catch(e){}}}
function gid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6);}
function addAct(m){D.activities.unshift({m,t:Date.now()});if(D.activities.length>25)D.activities=D.activities.slice(0,25);}

// ==================== AUTH ====================
function showAuthTab(tab){
  document.querySelectorAll('.auth-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f=>f.classList.remove('active'));
  if(tab==='login'){
    document.querySelectorAll('.auth-tab')[0].classList.add('active');
    document.getElementById('login-form').classList.add('active');
  } else {
    document.querySelectorAll('.auth-tab')[1].classList.add('active');
    document.getElementById('signup-form').classList.add('active');
  }
}

function doLogin(){
  const emailEl=document.getElementById('login-email');
  const passEl=document.getElementById('login-pass');
  const loginInput=emailEl.value||'';
  const passInput=passEl.value||'';
  const email=loginInput.trim().toLowerCase();
  const pass=passInput.trim();
  const errEl=document.getElementById('login-error');
  errEl.style.display='none';
  if(!email||!pass){
    errEl.textContent='❌ Email aur Password dono daalo!';
    errEl.style.display='block';
    return;
  }

  // Admin login
  // Check admin - multiple ways
  const isAdminEmail=(email==='ladakusena01'||email==='admin@rcb.com'||email==='admin');
  const isAdminPass=(pass==='Mohit@kumar1234');

  if(isAdminEmail&&isAdminPass){
    currentUser={id:'admin',name:'Mohit Kumar',email:'ladakusena01',role:'admin'};
    localStorage.setItem('bgmi-user',JSON.stringify(currentUser));
    enterApp();
    return;
  }

  // Player login - case-insensitive email check
  const user=D.users.find(u=>u.email.toLowerCase()===email&&u.pass===pass);
  if(!user){
    // Check if email exists (case-insensitive)
    const emailExists=D.users.find(u=>u.email.toLowerCase()===email);
    if(emailExists){
      errEl.textContent='❌ Galat password hai! Sahi password daalo.';
    } else {
      errEl.textContent='❌ Ye email registered nahi hai! Pehle Sign Up karo.';
    }
    errEl.style.display='block';
    return;
  }
  currentUser=user;
  localStorage.setItem('bgmi-user',JSON.stringify(currentUser));
  enterApp();
}

function doSignup(){
  const name=document.getElementById('signup-name').value.trim();
  const email=document.getElementById('signup-email').value.trim().toLowerCase();
  const phone=document.getElementById('signup-phone').value.trim();
  const bgminame=document.getElementById('signup-bgminame').value.trim();
  const pass=document.getElementById('signup-pass').value;
  if(!name||!email||!pass){toast('❌ Name, Email aur Password zaruri hai!');return;}

  if(D.users.find(u=>u.email.toLowerCase()===email)){toast('❌ Email already registered!');return;}

  const user={id:gid(),name,email,phone,bgminame,pass,role:'player',created:Date.now()};
  D.users.push(user);
  addAct(`👤 "${name}" ne sign up kiya!`);
  save();
  currentUser=user;
  localStorage.setItem('bgmi-user',JSON.stringify(currentUser));
  enterApp();
}

function doLogout(){
  currentUser=null;
  localStorage.removeItem('bgmi-user');
  document.getElementById('main-app').style.display='none';
  document.getElementById('auth-screen').style.display='flex';
}

function enterApp(){
  document.getElementById('auth-screen').style.display='none';
  document.getElementById('main-app').style.display='block';
  buildNav();
  renderAll();
}

// ==================== NAVIGATION ====================
function buildNav(){
  const isAdmin=currentUser?.role==='admin';
  const navHtml=isAdmin?
    `<button class="nav-btn active" data-page="dashboard">🏠 Home</button>
     <button class="nav-btn" data-page="tournaments">🏆 Tournaments</button>
     <button class="nav-btn" data-page="teams">👥 Teams</button>
     <button class="nav-btn" data-page="matches">⚔️ Matches</button>
     <button class="nav-btn" data-page="leaderboard">📊 Rank</button>
     <button class="nav-btn" data-page="admin-support">🚨 Support</button>`:
    `<button class="nav-btn active" data-page="dashboard">🏠 Home</button>
     <button class="nav-btn" data-page="my-tournaments">🏆 My Tournaments</button>
     <button class="nav-btn" data-page="my-matches">⚔️ My Matches</button>
     <button class="nav-btn" data-page="leaderboard">📊 Rank</button>
     <button class="nav-btn" data-page="support">🆘 Help</button>`;

  const btmHtml=isAdmin?
    `<button class="btm-btn active" data-page="dashboard"><span>🏠</span>Home</button>
     <button class="btm-btn" data-page="tournaments"><span>🏆</span>Tournaments</button>
     <button class="btm-btn" data-page="teams"><span>👥</span>Teams</button>
     <button class="btm-btn" data-page="matches"><span>⚔️</span>Matches</button>
     <button class="btm-btn" data-page="leaderboard"><span>📊</span>Rank</button>
     <button class="btm-btn" data-page="admin-support"><span>🚨</span>Support</button>`:
    `<button class="btm-btn active" data-page="dashboard"><span>🏠</span>Home</button>
     <button class="btm-btn" data-page="my-tournaments"><span>🏆</span>Tournaments</button>
     <button class="btm-btn" data-page="my-matches"><span>⚔️</span>Matches</button>
     <button class="btm-btn" data-page="leaderboard"><span>📊</span>Rank</button>
     <button class="btm-btn" data-page="support"><span>🆘</span>Help</button>`;

  document.getElementById('topnav').innerHTML=navHtml;
  document.getElementById('btnav').innerHTML=btmHtml;

  // Header user info
  const roleClass=currentUser?.role==='admin'?'admin':'player';
  const roleLabel=currentUser?.role==='admin'?'👑 ADMIN':'🎮 PLAYER';
  document.getElementById('hdr-user').innerHTML=`<span class="hdr-role ${roleClass}">${roleLabel}</span> ${currentUser?.name}`;

  // Event listeners
  document.querySelectorAll('[data-page]').forEach(b=>{
    b.addEventListener('click',()=>go(b.dataset.page));
  });

  // Set active page
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-dashboard').classList.add('active');
}

function go(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
  const el=document.getElementById('page-'+page);
  if(el)el.classList.add('active');
  renderAll();
}

// ==================== MODAL ====================
function openModal(id){document.getElementById('modal-'+id).classList.add('show');if(id==='create-match')fillTournamentSel();}
function closeModal(id){document.getElementById('modal-'+id).classList.remove('show');}
document.querySelectorAll('.modal-bg').forEach(m=>{m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('show');});});

// ==================== TOAST ====================
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500);}

function togglePass(id){
  const inp=document.getElementById(id);
  if(!inp)return;
  const isPass=inp.type==='password';
  inp.type=isPass?'text':'password';
  const eye=id==='login-pass'?'eye-login':'eye-signup';
  const eyeEl=document.getElementById(eye);
  if(eyeEl)eyeEl.textContent=isPass?'🙈':'👁️';
}

// ==================== SETTINGS ====================
function saveSettings(){
  D.settings.name=document.getElementById('set-name').value.trim();
  D.settings.upi=document.getElementById('set-upi').value.trim();
  D.settings.upiname=document.getElementById('set-upiname').value.trim();
  D.settings.whatsapp=document.getElementById('set-whatsapp').value.trim();
  D.settings.contact=document.getElementById('set-contact').value.trim();
  save();closeModal('settings');toast('✅ Settings saved!');
}
function loadSettings(){
  const s=D.settings;
  document.getElementById('set-name').value=s.name||'';
  document.getElementById('set-upi').value=s.upi||'';
  document.getElementById('set-upiname').value=s.upiname||'';
  document.getElementById('set-whatsapp').value=s.whatsapp||'';
  document.getElementById('set-contact').value=s.contact||'';
}

// ==================== TOURNAMENT (Admin) ====================
function createTournament(){
  const name=document.getElementById('t-name').value.trim();
  if(!name){toast('❌ Name daalo!');return;}
  D.tournaments.push({
    id:gid(),name,
    mode:document.getElementById('t-mode').value,
    map:document.getElementById('t-map').value,
    max:parseInt(document.getElementById('t-max').value),
    fee:parseInt(document.getElementById('t-fee').value)||0,
    prize:parseInt(document.getElementById('t-prize').value)||0,
    date:document.getElementById('t-date').value,
    status:'upcoming',teams:[],paid:[],created:Date.now()
  });
  addAct(`🏆 "${name}" created!`);
  save();closeModal('create-tournament');renderAll();toast('✅ Tournament created!');
  document.getElementById('t-name').value='';
}
function delTournament(id){if(!confirm('Delete?'))return;D.tournaments=D.tournaments.filter(t=>t.id!==id);D.matches=D.matches.filter(m=>m.tid!==id);save();renderAll();}
function toggleTStatus(id){const t=D.tournaments.find(x=>x.id===id);if(!t)return;t.status={upcoming:'live',live:'done',done:'upcoming'}[t.status];addAct(`📌 "${t.name}" → ${t.status}`);save();renderAll();}
function regTeam(tid,tmid){const t=D.tournaments.find(x=>x.id===tid);if(!t)return;if(t.teams.includes(tmid)){toast('⚠️ Already registered!');return;}if(t.teams.length>=t.max){toast('❌ Full!');return;}t.teams.push(tmid);const tm=D.teams.find(x=>x.id===tmid);addAct(`✅ "${tm?.name}" → "${t.name}"`);save();renderAll();}

// ==================== TOURNAMENT (Player) ====================
let _joinTourId=null;
function openJoinTournament(tid){
  _joinTourId=tid;
  const t=D.tournaments.find(x=>x.id===tid);
  if(!t)return;
  const myTeams=D.teams.filter(tm=>tm.userId===currentUser.id);
  const isRegistered=t.teams.some(tid=>myTeams.find(m=>m.id===tid));
  const isPaid=(t.paid||[]).some(pid=>myTeams.find(m=>m.id===pid));
  const feeText=t.fee>0?`Entry Fee: ₹${t.fee}`:'FREE Entry';

  let h=`
    <div style="text-align:center;margin-bottom:12px">
      <h3 style="color:var(--blue)">${t.name}</h3>
      <span class="badge b-${t.status}">${t.status}</span>
    </div>
    <div class="t-meta" style="justify-content:center">
      <span>🎮 ${t.mode}</span><span>🗺️ ${t.map}</span><span>👥 ${t.teams.length}/${t.max}</span>
    </div>
    <div style="text-align:center;margin:10px 0;font-size:1.1em;color:${t.fee>0?'var(--acc)':'var(--green)'}; font-weight:700">${feeText}</div>
    ${t.prize?`<div style="text-align:center;color:var(--gold);font-weight:700">🏆 Prize: ₹${t.prize}</div>`:''}
    <div style="margin-top:12px">
      <div style="font-weight:700;color:var(--blue);margin-bottom:6px">Teri Teams:</div>
      ${myTeams.length?myTeams.map(tm=>{
        const reg=t.teams.includes(tm.id);
        const paid=(t.paid||[]).includes(tm.id);
        return`<div style="display:flex;justify-content:space-between;align-items:center;padding:8px;background:var(--bg);border-radius:8px;margin-bottom:4px">
          <span><span class="tag" style="background:rgba(0,212,255,.15);color:var(--blue)">${tm.tag}</span> ${tm.name}</span>
          ${reg?`<span class="badge ${paid?'b-paid':'b-unpaid'}">${paid?'✅ Paid':'💰 Pay'}</span>`:'<span style="color:var(--dim);font-size:.8em">Not joined</span>'}
        </div>`;
      }).join(''):'<div style="color:var(--dim);font-size:.85em">Pehle apni team banao!</div>'}
    </div>
  `;
  document.getElementById('join-content').innerHTML=h;
  openModal('join-tournament');
}

function joinTournament(){
  const t=D.tournaments.find(x=>x.id===_joinTourId);
  if(!t)return;
  const myTeams=D.teams.filter(tm=>tm.userId===currentUser.id);
  let joined=false;
  myTeams.forEach(tm=>{
    if(!t.teams.includes(tm.id)){
      t.teams.push(tm.id);
      joined=true;
    }
  });
  if(joined){
    addAct(`🎮 "${currentUser.name}" joined "${t.name}"`);
    save();closeModal('join-tournament');renderAll();toast('✅ Tournament joined!');
  } else {
    toast('⚠️ Already joined ya koi team nahi!');
  }
}

function payTournamentFee(tid,tmid){
  _payTournamentId=tid;_payTeamId=tmid;
  const t=D.tournaments.find(x=>x.id===tid);
  if(!t||!t.fee||!D.settings.upi){toast('❌ UPI ID set nahi hai ya free hai!');return;}
  const upiLink=`upi://pay?pa=${encodeURIComponent(D.settings.upi)}&pn=${encodeURIComponent(D.settings.upiname||D.settings.name)}&am=${t.fee}&cu=INR&tn=${encodeURIComponent('Entry: '+t.name)}`;
  _payScreenshot=null;
  let h=`<div class="pay-card">
    <h4>💳 ENTRY FEE</h4>
    <div style="color:var(--dim);font-size:.85em">${t.name}</div>
    <div class="pay-amount">₹${t.fee}</div>
    <div class="room-label" style="margin-top:8px">Pay to</div>
    <div class="upi-id">${D.settings.upi}</div>
    <div style="color:var(--dim);font-size:.75em">${D.settings.upiname||''}</div>
  </div>
  <div style="text-align:center;margin:10px 0">
    <a href="${upiLink}" style="display:inline-block;padding:12px 30px;background:linear-gradient(135deg,#00b9f5,#7b61ff);color:#fff;text-decoration:none;border-radius:10px;font-family:'Orbitron',sans-serif;font-weight:700;font-size:.9em">💰 Pay ₹${t.fee} via UPI</a>
  </div>
  <div style="font-size:.8em;color:var(--dim);text-align:center;margin-bottom:6px">Upar button se pay karo → UPI ID copy karo ya scan karo</div>`;
  document.getElementById('pay-content').innerHTML=h;
  document.getElementById('pay-extra').style.display='block';
  document.getElementById('pay-utr').value='';
  document.getElementById('pay-screenshot-preview').innerHTML='';
  openModal('payment');
}

function previewScreenshot(){
  const file=document.getElementById('pay-screenshot').files[0];
  if(!file)return;
  if(file.size>2*1024*1024){toast('❌ Screenshot 2MB se chhota hona chahiye!');return;}
  const reader=new FileReader();
  reader.onload=function(e){
    _payScreenshot=e.target.result;
    document.getElementById('pay-screenshot-preview').innerHTML=`<img src="${e.target.result}" style="max-width:100%;max-height:150px;border-radius:8px;border:1px solid var(--brd)">`;
  };
  reader.readAsDataURL(file);
}

function submitPaymentProof(){
  const utr=document.getElementById('pay-utr').value.trim();
  if(!utr||utr.length<6){toast('❌ UTR number daalo (kam se kam 6 digits)!');return;}
  const t=D.tournaments.find(x=>x.id===_payTournamentId);
  if(!t)return;
  const tm=D.teams.find(x=>x.id===_payTeamId);
  // Check duplicate UTR
  if(D.payments.find(p=>p.utr===utr)){toast('❌ Ye UTR pehle use ho chuka hai!');return;}
  const payment={id:gid(),tournamentId:_payTournamentId,teamId:_payTeamId,teamName:tm?.name||'',teamTag:tm?.tag||'',userId:currentUser.id,userName:currentUser.name,amount:t.fee,utr,screenshot:_payScreenshot||null,status:'pending',created:Date.now()};
  D.payments.push(payment);
  addAct(`💳 Payment proof submitted by "${currentUser.name}" — UTR: ${utr}`);
  save();closeModal('payment');renderAll();toast('✅ Payment proof submit ho gaya! Admin jaldi verify karega. 💪');
  _payScreenshot=null;
}

function autoVerifyPayment(paymentId){
  const p=D.payments.find(x=>x.id===paymentId);
  if(!p||p.status!=='pending')return;
  p.status='verified';
  const t=D.tournaments.find(x=>x.id===p.tournamentId);
  if(t){
    if(!t.paid)t.paid=[];
    if(!t.paid.includes(p.teamId))t.paid.push(p.teamId);
  }
  addAct(`✅ Auto-verified: "${p.userName}" ₹${p.amount} — UTR: ${p.utr}`);
  save();renderAll();toast('✅ Payment verified!');
}

function rejectPayment(paymentId){
  const p=D.payments.find(x=>x.id===paymentId);
  if(!p)return;
  p.status='rejected';
  addAct(`❌ Payment rejected: "${p.userName}" — UTR: ${p.utr}`);
  save();renderAll();toast('❌ Payment rejected');
}
}

// ==================== TEAM ====================
function createTeam(){
  const name=document.getElementById('tm-name').value.trim();
  const tag=document.getElementById('tm-tag').value.trim().toUpperCase();
  const cap=document.getElementById('tm-cap').value.trim();
  if(!name||!tag||!cap){toast('❌ Name, Tag, Captain zaruri!');return;}
  const players=[cap];
  ['tm-p2','tm-p3','tm-p4'].forEach(id=>{const v=document.getElementById(id).value.trim();if(v)players.push(v);});
  const phone=document.getElementById('tm-phone').value.trim();
  const userId=currentUser?.role==='admin'?'admin':currentUser?.id;
  D.teams.push({id:gid(),name,tag,players,cap,phone,userId,created:Date.now()});
  addAct(`👥 "${name}" (${tag}) added!`);
  save();closeModal('create-team');renderAll();toast('✅ Team added!');
  ['tm-name','tm-tag','tm-cap','tm-p2','tm-p3','tm-p4','tm-phone'].forEach(id=>document.getElementById(id).value='');
}
function delTeam(id){if(!confirm('Delete?'))return;D.teams=D.teams.filter(t=>t.id!==id);D.tournaments.forEach(t=>{t.teams=t.teams.filter(x=>x!==id);});save();renderAll();}

// ==================== MATCH (Admin) ====================
function fillTournamentSel(){document.getElementById('m-tour').innerHTML=D.tournaments.map(t=>`<option value="${t.id}">${t.name} (${t.mode})</option>`).join('');}
function createMatch(){
  const tid=document.getElementById('m-tour').value;
  if(!tid){toast('❌ Tournament select!');return;}
  D.matches.push({id:gid(),tid,num:parseInt(document.getElementById('m-num').value)||1,rid:document.getElementById('m-rid').value.trim(),rpw:document.getElementById('m-rpw').value.trim(),date:document.getElementById('m-date').value,status:'upcoming',results:null,created:Date.now()});
  const t=D.tournaments.find(x=>x.id===tid);addAct(`⚔️ Match #${document.getElementById('m-num').value} → "${t?.name}"`);
  save();closeModal('create-match');renderAll();toast('✅ Match scheduled!');
}
function delMatch(id){D.matches=D.matches.filter(m=>m.id!==id);save();renderAll();}
function toggleMStatus(id){const m=D.matches.find(x=>x.id===id);if(!m)return;m.status={upcoming:'live',live:'done',done:'upcoming'}[m.status];save();renderAll();}

// ==================== RESULTS (Admin) ====================
function openResults(id){
  document.getElementById('res-id').value=id;
  const m=D.matches.find(x=>x.id===id);const t=D.tournaments.find(x=>x.id===m?.tid);
  if(!t)return;
  const teams=t.teams.map(tid=>D.teams.find(x=>x.id===tid)).filter(Boolean);
  const prev=m.results||{};
  let h='<div style="font-size:.8em;color:var(--dim);margin-bottom:10px">Position & Kills daalo</div>';
  teams.forEach((tm,i)=>{
    h+=`<div class="card" style="padding:10px;margin-bottom:6px">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px"><span class="tag" style="background:rgba(0,212,255,.15);color:var(--blue)">${tm.tag}</span><span style="font-weight:700;font-size:.9em">${tm.name}</span></div>
      <div style="display:flex;gap:8px">
        <div class="fg" style="flex:1;margin:0"><label>Position</label><input type="number" min="1" value="${prev[tm.id]?.pos||i+1}" id="rp-${tm.id}"></div>
        <div class="fg" style="flex:1;margin:0"><label>Kills</label><input type="number" min="0" value="${prev[tm.id]?.kills||0}" id="rk-${tm.id}"></div>
      </div>
    </div>`;
  });
  document.getElementById('res-form').innerHTML=h||'<p style="color:var(--dim)">Koi team nahi</p>';
  openModal('results');
}
function saveResults(){
  const mid=document.getElementById('res-id').value;const m=D.matches.find(x=>x.id===mid);const t=D.tournaments.find(x=>x.id===m?.tid);
  if(!m||!t)return;const results={};
  t.teams.forEach(tid=>{const pe=document.getElementById('rp-'+tid);const ke=document.getElementById('rk-'+tid);if(pe&&ke)results[tid]={pos:parseInt(pe.value)||1,kills:parseInt(ke.value)||0};});
  m.results=results;m.status='done';addAct(`🏅 Match #${m.num} results saved!`);save();closeModal('results');renderAll();toast('✅ Results saved!');
}

// ==================== BROADCAST (Admin) ====================
function openBroadcast(matchId){
  _bcMatchId=matchId;const m=D.matches.find(x=>x.id===matchId);const t=D.tournaments.find(x=>x.id===m?.tid);
  if(!m||!t)return;
  let h=`<div style="margin-bottom:10px"><span style="font-weight:700">${t.name}</span> — Match #${m.num}</div>
    <div class="broadcast-card">
      <div class="room-label">🔑 ROOM ID</div><div class="room-info"><span class="room-value">${m.rid||'TBA'}</span></div>
      <div class="room-label">🔒 PASSWORD</div><div class="room-info"><span class="room-value">${m.rpw||'TBA'}</span></div>
      ${m.date?`<div style="color:var(--dim);font-size:.8em;margin-top:6px">📅 ${fmtDate(m.date)}</div>`:''}
    </div>
    <div style="margin-top:10px"><div style="font-weight:700;font-size:.85em;color:var(--blue);margin-bottom:6px">Teams (${t.teams.length}):</div>
      ${t.teams.map(tid=>{const tm=D.teams.find(x=>x.id===tid);return tm?`<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--brd);font-size:.85em"><span><span class="tag" style="background:rgba(0,212,255,.15);color:var(--blue)">${tm.tag}</span> ${tm.name}</span><span style="color:var(--dim);font-size:.8em">${tm.phone||'—'}</span></div>`:'';}).join('')}</div>`;
  document.getElementById('broadcast-content').innerHTML=h;openModal('broadcast');
}
function broadcastWhatsApp(){
  const m=D.matches.find(x=>x.id===_bcMatchId);const t=D.tournaments.find(x=>x.id===m?.tid);if(!m||!t)return;
  const msg=`🎮 *${t.name} — Match #${m.num}*\n🔑 *Room ID:* \`${m.rid||'TBA'}\`\n🔒 *Password:* \`${m.rpw||'TBA'}\`\n${m.date?`📅 *Time:* ${fmtDate(m.date)}\n`:''}\n⚡ Jaldi join karo!`;
  const teamsWithPhone=t.teams.map(tid=>D.teams.find(x=>x.id===tid)).filter(tm=>tm?.phone);
  if(teamsWithPhone.length>0){teamsWithPhone.forEach(tm=>{const phone=tm.phone.replace(/[^0-9]/g,'');window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,'_blank');});toast(`📱 Opening WhatsApp for ${teamsWithPhone.length} teams...`);}
  else{window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`,'_blank');toast('📱 WhatsApp khula!');}
}
function copyAllRoomIds(){
  const m=D.matches.find(x=>x.id===_bcMatchId);const t=D.tournaments.find(x=>x.id===m?.tid);if(!m||!t)return;
  const text=`🎮 ${t.name} — Match #${m.num}\n🔑 Room ID: ${m.rid||'TBA'}\n🔒 Password: ${m.rpw||'TBA'}${m.date?'\n📅 '+fmtDate(m.date):''}`;
  navigator.clipboard.writeText(text).then(()=>toast('📋 Copied!')).catch(()=>{const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);toast('📋 Copied!');});
}

// ==================== POINTS ====================
function calcPts(pos,kills){const pp={1:50,2:35,3:28,4:22,5:16,6:12,7:9,8:7,9:5,10:4,11:3,12:2,13:1,14:1};return(pp[pos]||0)+(kills*2);}

// ==================== RENDER ====================
function renderAll(){
  const isAdmin=currentUser?.role==='admin';
  if(isAdmin){renderDashAdmin();renderTournamentsAdmin();renderTeamsAdmin();renderMatchesAdmin();}
  else{renderDashPlayer();renderMyTournaments();renderMyMatches();renderSupport();}
  renderLeaderboard();
  if(isAdmin)renderAdminSupport();
}

// ----- ADMIN -----
function renderDashAdmin(){
  const el=document.getElementById('page-dashboard');
  el.innerHTML=`
    <div class="stats">
      <div class="stat"><div class="stat-v">${D.tournaments.length}</div><div class="stat-l">Tournaments</div></div>
      <div class="stat"><div class="stat-v">${D.teams.length}</div><div class="stat-l">Teams</div></div>
      <div class="stat"><div class="stat-v">${D.users.length}</div><div class="stat-l">Players</div></div>
      <div class="stat"><div class="stat-v">${D.matches.length}</div><div class="stat-l">Matches</div></div>
    </div>
    <div class="card">
      <h3>⚡ Quick Actions</h3>
      <div class="btn-grp">
        <button class="btn btn-p btn-sm" onclick="openModal('create-tournament')">🏆 Tournament</button>
        <button class="btn btn-s btn-sm" onclick="openModal('create-team')">👥 Team</button>
        <button class="btn btn-s btn-sm" onclick="openModal('create-match')">⚔️ Match</button>
        <button class="btn btn-s btn-sm" onclick="loadSettings();openModal('settings')">⚙️ Settings</button>
      </div>
    </div>
    <div class="card"><h3>📋 Activity</h3><div id="act-list">${D.activities.slice(0,10).map(a=>`<div style="padding:5px 0;border-bottom:1px solid var(--brd);font-size:.85em;display:flex;justify-content:space-between"><span>${a.m}</span><span style="color:var(--dim);font-size:.75em;white-space:nowrap;margin-left:8px">${tAgo(a.t)}</span></div>`).join('')||'<div class="empty"><div class="empty-i">📭</div>No activity</div>'}</div></div>
  `;
}

function renderTournamentsAdmin(){
  const el=document.getElementById('page-tournaments');
  if(!D.tournaments.length){el.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h2 style="font-family:Orbitron;color:var(--acc);font-size:1em">🏆 Tournaments</h2><button class="btn btn-p btn-sm" onclick="openModal(\'create-tournament\')">+ Create</button></div><div class="empty"><div class="empty-i">🏆</div>No tournaments yet</div>';return;}
  el.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h2 style="font-family:Orbitron;color:var(--acc);font-size:1em">🏆 Tournaments</h2><button class="btn btn-p btn-sm" onclick="openModal(\'create-tournament\')">+ Create</button></div>`+
  D.tournaments.map(t=>{
    const freeTeams=D.teams.filter(tm=>!t.teams.includes(tm.id));
    const regTeams=t.teams.map(tid=>D.teams.find(x=>x.id===tid)).filter(Boolean);
    const paidTeams=t.paid||[];
    return`<div class="card tc"><div style="display:flex;justify-content:space-between;align-items:start"><div><h3 style="margin-bottom:3px">${t.name}</h3><span class="badge b-${t.status}">${t.status}</span></div><button class="btn btn-sm btn-s" onclick="toggleTStatus('${t.id}')">🔄</button></div>
    <div class="t-meta"><span>🎮 ${t.mode}</span><span>🗺️ ${t.map}</span><span>👥 ${t.teams.length}/${t.max}</span>${t.fee?`<span>💰 ₹${t.fee}</span>`:''}${t.prize?`<span>🏆 ₹${t.prize}</span>`:''}${t.date?`<span>📅 ${fmtDate(t.date)}</span>`:''}</div>
    ${regTeams.length?`<div style="margin:6px 0;display:flex;flex-wrap:wrap;gap:3px">${regTeams.map(tm=>{const isPaid=paidTeams.includes(tm.id);return`<span class="tag" style="background:${isPaid?'rgba(0,255,136,.15)':'rgba(255,70,85,.15)'};color:${isPaid?'var(--green)':'var(--acc)'}">${tm.tag} ${isPaid?'✅':''}</span>`;}).join('')}</div>`:''}
    ${t.status!=='done'?`<div style="margin:6px 0;display:flex;flex-wrap:wrap;gap:4px">${freeTeams.slice(0,5).map(tm=>`<button class="btn btn-sm btn-s" onclick="regTeam('${t.id}','${tm.id}')">${tm.tag}</button>`).join('')}${freeTeams.length>5?`<span style="color:var(--dim);font-size:.8em;line-height:2">+${freeTeams.length-5}</span>`:''}</div>`:''}
    <div class="btn-grp"><button class="btn btn-sm btn-d" onclick="delTournament('${t.id}')">🗑️</button></div></div>`;
  }).join('');
}

function renderTeamsAdmin(){
  const el=document.getElementById('page-teams');
  el.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h2 style="font-family:Orbitron;color:var(--blue);font-size:1em">👥 Teams</h2><button class="btn btn-p btn-sm" onclick="openModal('create-team')">+ Add</button></div>`+
  (D.teams.length?D.teams.map(t=>`<div class="card"><div style="display:flex;justify-content:space-between;align-items:center"><div><h3 style="color:var(--blue);margin-bottom:2px"><span class="tag" style="background:rgba(0,212,255,.15);color:var(--blue)">${t.tag}</span> ${t.name}</h3><div style="font-size:.78em;color:var(--dim)">IGL: ${t.cap} ${t.phone?'• 📱':''}</div></div><button class="btn btn-sm btn-d" onclick="delTeam('${t.id}')">🗑️</button></div><div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:3px">${t.players.map((p,i)=>`<span style="padding:2px 7px;background:var(--bg);border-radius:4px;font-size:.78em">${i===0?'👑':'•'} ${p}</span>`).join('')}</div></div>`).join(''):'<div class="empty"><div class="empty-i">👥</div>No teams yet</div>');
}

function renderMatchesAdmin(){
  const el=document.getElementById('page-matches');
  el.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h2 style="font-family:Orbitron;color:var(--green);font-size:1em">⚔️ Matches</h2><button class="btn btn-p btn-sm" onclick="openModal('create-match')">+ Schedule</button></div>`+
  (D.matches.length?[...D.matches].reverse().map(m=>{const t=D.tournaments.find(x=>x.id===m.tid);return`<div class="card" style="border-left:3px solid var(--acc)"><div style="display:flex;justify-content:space-between;align-items:center"><h3 style="font-size:.9em">Match #${m.num} <span class="badge b-${m.status}" style="margin-left:6px">${m.status}</span></h3><span style="font-size:.75em;color:var(--dim)">${t?.name||'?'}</span></div>${m.date?`<div class="t-meta"><span>📅 ${fmtDate(m.date)}</span></div>`:''}${m.rid?`<div style="margin:6px 0;padding:8px;background:var(--bg);border-radius:6px;font-family:Orbitron;font-size:.78em;display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px"><span>🔑 <span style="color:var(--green)">${m.rid}</span> 🔒 <span style="color:var(--blue)">${m.rpw||'---'}</span></span><button class="btn btn-sm btn-g" onclick="openBroadcast('${m.id}')">📢 Broadcast</button></div>`:''}<div class="btn-grp"><button class="btn btn-sm btn-s" onclick="toggleMStatus('${m.id}')">🔄</button>${m.status!=='done'?`<button class="btn btn-sm btn-p" onclick="openResults('${m.id}')">🏅 Results</button>`:''}${m.rid?`<button class="btn btn-sm btn-w" onclick="openBroadcast('${m.id}')">📢</button>`:''}<button class="btn btn-sm btn-d" onclick="delMatch('${m.id}')">🗑️</button></div>${m.results?renderMResults(m):''}</div>`;}).join(''):'<div class="empty"><div class="empty-i">⚔️</div>No matches yet</div>');
}

// ----- PLAYER -----
function renderDashPlayer(){
  const el=document.getElementById('page-dashboard');
  const myTeams=D.teams.filter(t=>t.userId===currentUser.id);
  const myTourIds=D.tournaments.filter(t=>t.teams.some(tid=>myTeams.find(m=>m.id===tid))).map(t=>t.id);
  const upcomingMatches=D.matches.filter(m=>myTourIds.includes(m.tid)&&m.status!=='done');

  el.innerHTML=`
    <div class="player-welcome">
      <h2>Welcome, ${currentUser.name}! 🎮</h2>
      <p>BGMI Name: ${currentUser.bgminame||'Not set'}</p>
    </div>
    <div class="stats">
      <div class="stat"><div class="stat-v">${myTeams.length}</div><div class="stat-l">My Teams</div></div>
      <div class="stat"><div class="stat-v">${myTourIds.length}</div><div class="stat-l">Joined</div></div>
      <div class="stat"><div class="stat-v">${upcomingMatches.length}</div><div class="stat-l">Upcoming</div></div>
      <div class="stat"><div class="stat-v">${D.tournaments.filter(t=>t.status==='live').length}</div><div class="stat-l">Live</div></div>
    </div>
    <div class="card">
      <h3>⚡ Quick Actions</h3>
      <div class="btn-grp">
        <button class="btn btn-p btn-sm" onclick="openModal('create-team')">👥 Add Team</button>
        <button class="btn btn-s btn-sm" onclick="go('my-tournaments')">🏆 Browse</button>
      </div>
    </div>
    <div class="card"><h3>📋 My Activity</h3>${D.activities.filter(a=>a.m.includes(currentUser.name)).slice(0,5).map(a=>`<div style="padding:5px 0;border-bottom:1px solid var(--brd);font-size:.85em">${a.m} <span style="color:var(--dim);font-size:.75em;float:right">${tAgo(a.t)}</span></div>`).join('')||'<div style="color:var(--dim);font-size:.85em">Abhi koi activity nahi</div>'}</div>
  `;
}

function renderMyTournaments(){
  const el=document.getElementById('page-my-tournaments');
  const myTeams=D.teams.filter(t=>t.userId===currentUser.id);
  el.innerHTML=`<h2 style="font-family:Orbitron;color:var(--acc);font-size:1em;margin-bottom:12px">🏆 Available Tournaments</h2>`+
  (D.tournaments.filter(t=>t.status!=='done').length?D.tournaments.filter(t=>t.status!=='done').map(t=>{
    const isJoined=t.teams.some(tid=>myTeams.find(m=>m.id===tid));
    return`<div class="card tc"><div style="display:flex;justify-content:space-between;align-items:start"><div><h3 style="margin-bottom:3px">${t.name}</h3><span class="badge b-${t.status}">${t.status}</span></div></div>
    <div class="t-meta"><span>🎮 ${t.mode}</span><span>🗺️ ${t.map}</span><span>👥 ${t.teams.length}/${t.max}</span>${t.fee?`<span>💰 ₹${t.fee}</span>`:''}${t.prize?`<span>🏆 ₹${t.prize}</span>`:''}</div>
    <div class="btn-grp">
      ${isJoined?`<button class="btn btn-sm btn-g" disabled>✅ Joined</button><button class="btn btn-sm btn-s" onclick="openJoinTournament('${t.id}')">📋 Details</button>`:`<button class="btn btn-sm btn-p" onclick="openJoinTournament('${t.id}')">🎮 Join</button>`}
    </div></div>`;
  }).join(''):'<div class="empty"><div class="empty-i">🏆</div>Abhi koi tournament nahi hai</div>');
}

function renderMyMatches(){
  const el=document.getElementById('page-my-matches');
  const myTeams=D.teams.filter(t=>t.userId===currentUser.id);
  const myMatches=D.matches.filter(m=>{
    const t=D.tournaments.find(x=>x.id===m.tid);
    return t&&t.teams.some(tid=>myTeams.find(m=>m.id===tid));
  });
  el.innerHTML=`<h2 style="font-family:Orbitron;color:var(--green);font-size:1em;margin-bottom:12px">⚔️ My Matches</h2>`+
  (myMatches.length?myMatches.reverse().map(m=>{
    const t=D.tournaments.find(x=>x.id===m.tid);
    return`<div class="card" style="border-left:3px solid var(--acc)"><h3 style="font-size:.9em">Match #${m.num} <span class="badge b-${m.status}" style="margin-left:6px">${m.status}</span></h3>
    <div style="font-size:.8em;color:var(--dim)">${t?.name||''}</div>
    ${m.date?`<div class="t-meta"><span>📅 ${fmtDate(m.date)}</span></div>`:''}
    ${m.rid?`<div style="margin:8px 0;padding:10px;background:var(--bg);border-radius:8px;text-align:center"><div class="room-label">🔑 ROOM ID</div><div class="room-info"><span class="room-value">${m.rid}</span></div><div class="room-label">🔒 PASSWORD</div><div class="room-info"><span class="room-value">${m.rpw||'---'}</span></div></div>`:'<div style="color:var(--dim);font-size:.8em;margin-top:4px">Room ID abhi available nahi hai</div>'}
    ${m.results?renderMResults(m):''}</div>`;
  }).join(''):'<div class="empty"><div class="empty-i">⚔️</div>Abhi koi match nahi hai</div>');
}

// ----- SHARED -----
function renderMResults(m){
  const entries=Object.entries(m.results).sort((a,b)=>a[1].pos-b[1].pos);
  let h='<div style="margin-top:8px;border-top:1px solid var(--brd);padding-top:8px">';
  entries.forEach(([tid,r])=>{const tm=D.teams.find(x=>x.id===tid);const pts=calcPts(r.pos,r.kills);const pc=r.pos<=3?`color:${r.pos===1?'var(--gold)':r.pos===2?'#c0c0c0':'#cd7f32'}`:'color:var(--dim)';h+=`<div style="display:flex;align-items:center;gap:6px;padding:3px 0;font-size:.82em"><span style="font-family:Orbitron;font-weight:900;width:28px;${pc}">#${r.pos}</span><span style="font-weight:700;flex:1">${tm?.tag||'???'} ${tm?.name||'?'}</span><span style="color:var(--acc)">${r.kills}k</span><span style="font-family:Orbitron;color:var(--gold);font-weight:700">${pts}p</span></div>`;});
  return h+'</div>';
}

function renderLeaderboard(){
  const el=document.getElementById('page-leaderboard');
  const st={};D.teams.forEach(t=>{st[t.id]={team:t,pts:0,kills:0,matches:0,pl:[]};});
  D.matches.filter(m=>m.results).forEach(m=>{Object.entries(m.results).forEach(([tid,r])=>{if(!st[tid])return;const pts=calcPts(r.pos,r.kills);st[tid].pts+=pts;st[tid].kills+=r.kills;st[tid].matches++;st[tid].pl.push(r.pos);});});
  const sorted=Object.values(st).sort((a,b)=>b.pts-a.pts||b.kills-a.kills);
  const el2=document.getElementById('page-leaderboard');
  el2.innerHTML=`<h2 style="font-family:Orbitron;color:var(--gold);margin-bottom:12px;font-size:1em">📊 Leaderboard</h2>`+(sorted.length?sorted.map((s,i)=>{const avg=s.matches?(s.pl.reduce((a,b)=>a+b,0)/s.matches).toFixed(1):'-';return`<div class="lb"><div class="lb-r ${i===0?'r1':i===1?'r2':i===2?'r3':''}">#${i+1}</div><div class="lb-i"><div class="lb-n"><span class="tag" style="background:rgba(0,212,255,.15);color:var(--blue)">${s.team.tag}</span> ${s.team.name}</div><div class="lb-d">${s.matches} matches • ${s.kills} kills • Avg #${avg}</div></div><div class="lb-s"><div class="lb-p">${s.pts}</div><div class="lb-k">PTS</div></div></div>`;}).join(''):'<div class="empty"><div class="empty-i">📊</div>Add matches & results</div>');
}

// ==================== UTILS ====================
// ==================== SUPPORT ====================
function submitIssue(){
  const tid=document.getElementById('ri-tournament').value;
  const team=document.getElementById('ri-team').value.trim();
  const amount=document.getElementById('ri-amount').value;
  const txn=document.getElementById('ri-txn').value.trim();
  const date=document.getElementById('ri-date').value;
  const phone=document.getElementById('ri-phone').value.trim();
  const desc=document.getElementById('ri-desc').value.trim();
  if(!team||!amount||!txn){toast('❌ Team, Amount aur Transaction ID zaruri hai!');return;}
  const issue={id:gid(),userId:currentUser.id,userName:currentUser.name,tournamentId:tid,team,amount:parseInt(amount),txn,date,phone,desc,status:'pending',reply:'',created:Date.now()};
  D.issues.push(issue);
  addAct(`🚨 Payment issue reported by "${currentUser.name}" — ₹${amount}`);
  save();closeModal('report-issue');renderAll();toast('✅ Issue submitted! Admin ko notify ho gaya.');
  ['ri-team','ri-amount','ri-txn','ri-phone','ri-desc'].forEach(id=>{if(document.getElementById(id))document.getElementById(id).value='';});
}

function toggleFaq(el){el.parentElement.classList.toggle('open');}

function openReportIssue(){
  const sel=document.getElementById('ri-tournament');
  if(sel)sel.innerHTML=D.tournaments.map(t=>`<option value="${t.id}">${t.name}</option>`).join('');
  openModal('report-issue');
}

function renderSupport(){
  const el=document.getElementById('page-support');if(!el)return;
  const myIssues=D.issues.filter(i=>i.userId===currentUser.id);
  const myPayments=D.payments.filter(p=>p.userId===currentUser.id);
  const contactLine=D.settings.whatsapp?`WhatsApp: ${D.settings.whatsapp}`:D.settings.contact?`Contact: ${D.settings.contact}`:D.settings.upi?`UPI: ${D.settings.upi}`:'Abhi available nahi';
  el.innerHTML=`
    <h2 style="font-family:Orbitron;color:var(--acc);font-size:1em;margin-bottom:12px">🆘 Help & Support</h2>
    ${myPayments.length?`<div class="support-card"><h3 style="color:var(--blue);margin-bottom:8px;font-size:.95em">💳 Meri Payments</h3>${myPayments.map(p=>{
      const t=D.tournaments.find(x=>x.id===p.tournamentId);
      return`<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--brd);font-size:.85em"><span>${t?.name||'?'} — ₹${p.amount}</span><span class="issue-status ${p.status==='verified'?'resolved':p.status==='rejected'?'rejected':'pending'}">${p.status==='verified'?'✅ Verified':p.status==='rejected'?'❌ Rejected':'⏳ Pending'}</span></div>`;
    }).join('')}</div>`:''}
    <div class="support-card">
      <h3 style="color:var(--blue);margin-bottom:8px;font-size:.95em">📞 Contact Organizer</h3>
      <div style="color:var(--text);font-size:.9em;margin-bottom:8px">${contactLine}</div>
      ${D.settings.whatsapp?`<a href="https://wa.me/${D.settings.whatsapp.replace(/[^0-9]/g,'')}" target="_blank" class="btn btn-w btn-sm">📱 WhatsApp Karo</a>`:''}
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <h3 style="color:var(--gold);font-size:.9em">❓ Frequently Asked Questions</h3>
    </div>
    <div class="faq-item"><div class="faq-q" onclick="toggleFaq(this)">💳 Payment nahi gaya, kya karu?</div><div class="faq-a">Agar aapne UPI se payment kiya lekin app mein confirm nahi ho raha, toh "Report Issue" button dabao. UPI Transaction ID zarur daalo. Admin 24 ghante mein verify karke payment confirm kar dega.</div></div>
    <div class="faq-item"><div class="faq-q" onclick="toggleFaq(this)">🔑 Room ID kahan milega?</div><div class="faq-a">Match start hone se pehle admin "Room ID Broadcast" karega — WhatsApp pe seedha aayega. Ya app mein "My Matches" section mein dekho.</div></div>
    <div class="faq-item"><div class="faq-q" onclick="toggleFaq(this)">🏆 Prize kaise milega?</div><div class="faq-a">Tournament khatam hone ke baad admin winner ko directly UPI pe bhejega. Leaderboard mein rank dekho.</div></div>
    <div class="faq-item"><div class="faq-q" onclick="toggleFaq(this)">👥 Team kaise banau?</div><div class="faq-a">Dashboard pe "Add Team" button dabao. Team name, tag, players ka naam daalo. Max 4 players ki team bana sakte ho.</div></div>
    <div class="faq-item"><div class="faq-q" onclick="toggleFaq(this)">🎮 Tournament kaise join karu?</div><div class="faq-a">"My Tournaments" mein jao → kisi bhi upcoming tournament pe "Join" button dabao → apni team select karo. Entry fee hai toh payment karo.</div></div>
    <div class="faq-item"><div class="faq-q" onclick="toggleFaq(this)">🔄 Payment verify kab hoga?</div><div class="faq-a">Admin usually 1-2 ghante mein verify kar leta hai. Agar 24 ghante ho gaye toh "Report Issue" karo.</div></div>
    <div class="btn-grp" style="margin-top:14px">
      <button class="btn btn-p btn-sm" onclick="openReportIssue()">🚨 Report Payment Issue</button>
    </div>
    ${myIssues.length?`<div style="margin-top:16px"><h3 style="color:var(--blue);font-size:.9em;margin-bottom:8px">📋 My Issues</h3>${myIssues.map(i=>{
      const t=D.tournaments.find(x=>x.id===i.tournamentId);
      return`<div class="issue-card"><div style="display:flex;justify-content:space-between;align-items:center"><span style="font-weight:700;font-size:.9em">₹${i.amount} — ${t?.name||'?'}</span><span class="issue-status ${i.status}">${i.status==='resolved'?'✅ Resolved':i.status==='rejected'?'❌ Rejected':'⏳ Pending'}</span></div><div style="font-size:.78em;color:var(--dim);margin-top:4px">Team: ${i.team} • TXN: ${i.txn} • ${fmtDate(i.created)}</div>${i.reply?`<div style="margin-top:6px;padding:8px;background:var(--bg);border-radius:6px;font-size:.85em;border-left:3px solid var(--green)"><b style="color:var(--green)">Admin Reply:</b> ${i.reply}</div>`:''}</div>`;
    }).join('')}</div>`:''}
  `;
}

function renderAdminSupport(){
  const el=document.getElementById('page-admin-support');if(!el)return;
  const pending=D.issues.filter(i=>i.status==='pending');
  const resolved=D.issues.filter(i=>i.status!=='pending');
  const pendingPayments=D.payments.filter(p=>p.status==='pending');
  const verifiedPayments=D.payments.filter(p=>p.status==='verified');
  el.innerHTML=`
    <h2 style="font-family:Orbitron;color:var(--acc);font-size:1em;margin-bottom:12px">🚨 Support Issues</h2>
    <div class="stats">
      <div class="stat"><div class="stat-v">${pending.length}</div><div class="stat-l">Pending Issues</div></div>
      <div class="stat"><div class="stat-v">${pendingPayments.length}</div><div class="stat-l">Payment Proofs</div></div>
    </div>
    ${pendingPayments.length?`<div class="card" style="border-left:3px solid var(--gold)"><h3 style="color:var(--gold);font-size:.9em;margin-bottom:10px">💳 Payment Proofs — Verify Karo</h3>${pendingPayments.map(p=>{
      const t=D.tournaments.find(x=>x.id===p.tournamentId);
      return`<div class="issue-card" style="border-left:3px solid var(--blue)"><div style="display:flex;justify-content:space-between;align-items:center"><span style="font-weight:700">${p.userName} <span class="tag" style="background:rgba(0,212,255,.15);color:var(--blue)">${p.teamTag}</span></span><span style="font-family:Orbitron;color:var(--acc);font-weight:700">₹${p.amount}</span></div><div style="font-size:.82em;color:var(--dim);margin-top:4px">Team: ${p.teamName} • Tournament: ${t?.name||'?'}</div><div style="margin-top:6px;padding:8px;background:var(--bg);border-radius:6px"><div style="font-size:.75em;color:var(--dim)">UPI TRANSACTION ID (UTR)</div><div style="font-family:Orbitron;font-size:1.1em;color:var(--green);letter-spacing:2px;font-weight:700">${p.utr}</div></div>${p.screenshot?`<div style="margin-top:8px;text-align:center"><img src="${p.screenshot}" style="max-width:100%;max-height:200px;border-radius:8px;border:1px solid var(--brd);cursor:pointer" onclick="window.open('${p.screenshot}','_blank')"></div>`:'<div style="font-size:.8em;color:var(--dim);margin-top:4px">📷 Screenshot nahi diya</div>'}<div style="font-size:.75em;color:var(--dim);margin-top:4px">${fmtDate(p.created)}</div><div class="btn-grp"><button class="btn btn-sm btn-g" onclick="autoVerifyPayment('${p.id}')">✅ Verify</button><button class="btn btn-sm btn-d" onclick="rejectPayment('${p.id}')">❌ Reject</button></div></div>`;
    }).join('')}</div>`:'<div style="color:var(--green);text-align:center;padding:10px">✅ Koi pending payment nahi!</div>'}
    ${verifiedPayments.length?`<div style="margin-top:12px"><h3 style="color:var(--green);font-size:.85em;margin-bottom:8px">✅ Verified Payments (${verifiedPayments.length})</h3><div style="max-height:150px;overflow-y:auto">${verifiedPayments.slice(0,20).map(p=>`<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--brd);font-size:.82em"><span>${p.userName} — ${p.teamTag}</span><span style="color:var(--green)">₹${p.amount} ✅</span></div>`).join('')}</div></div>`:''}
    ${pending.length?`<div style="margin-top:16px"><h3 style="color:var(--gold);font-size:.9em;margin-bottom:8px">📋 Payment Issues (${pending.length})</h3>${pending.map(i=>{
      const t=D.tournaments.find(x=>x.id===i.tournamentId);
      return`<div class="issue-card" style="border-left:3px solid var(--gold)"><div style="display:flex;justify-content:space-between;align-items:center"><span style="font-weight:700">${i.userName}</span><span class="issue-status pending">⏳ Pending</span></div><div style="margin-top:4px;font-size:.85em"><b>₹${i.amount}</b> — ${t?.name||'?'}<br><span style="color:var(--dim)">Team: ${i.team} • TXN: ${i.txn}</span></div>${i.desc?`<div style="margin-top:4px;font-size:.8em;color:var(--dim)">"${i.desc}"</div>`:''}${i.phone?`<div style="font-size:.78em;color:var(--blue);margin-top:2px">📱 ${i.phone}</div>`:''}<div style="font-size:.75em;color:var(--dim);margin-top:2px">${fmtDate(i.created)}</div><div class="btn-grp"><button class="btn btn-sm btn-p" onclick="openAdminReply('${i.id}')">💬 Reply</button><button class="btn btn-sm btn-g" onclick="resolveIssue('${i.id}','${currentUser.name}')">✅ Resolve</button></div></div>`;
    }).join('')}</div>`:'<div style="color:var(--green);text-align:center;padding:10px">✅ Koi pending issue nahi!</div>'}
    ${resolved.length?`<h3 style="color:var(--green);font-size:.85em;margin:12px 0 8px">✅ Resolved</h3>${resolved.slice(0,10).map(i=>{
      const t=D.tournaments.find(x=>x.id===i.tournamentId);
      return`<div class="issue-card" style="opacity:.7"><div style="display:flex;justify-content:space-between"><span style="font-weight:700;font-size:.85em">${i.userName}</span><span class="issue-status ${i.status}">${i.status==='resolved'?'✅ Resolved':'❌ Rejected'}</span></div><div style="font-size:.78em;color:var(--dim);margin-top:3px">₹${i.amount} — ${t?.name||'?'} — ${i.team}</div></div>`;
    }).join('')}`:''}
  `;
}

function openAdminReply(issueId){
  _replyIssueId=issueId;
  const i=D.issues.find(x=>x.id===issueId);if(!i)return;
  const t=D.tournaments.find(x=>x.id===i.tournamentId);
  document.getElementById('admin-reply-content').innerHTML=`
    <div class="card" style="margin-bottom:12px;padding:10px">
      <div style="font-weight:700">${i.userName} — ₹${i.amount}</div>
      <div style="font-size:.85em;color:var(--dim)">Team: ${i.team} • ${t?.name||'?'}</div>
      <div style="font-size:.85em;color:var(--dim)">TXN: ${i.txn}</div>
      ${i.desc?`<div style="margin-top:4px;font-size:.85em">"${i.desc}"</div>`:''}
    </div>`;
  document.getElementById('admin-reply-text').value=i.reply||'';
  document.getElementById('admin-reply-status').value=i.status;
  openModal('admin-reply');
}

function sendReply(){
  const i=D.issues.find(x=>x.id===_replyIssueId);if(!i)return;
  const reply=document.getElementById('admin-reply-text').value.trim();
  const status=document.getElementById('admin-reply-status').value;
  i.reply=reply;i.status=status;
  addAct(`💬 Issue replied: "${i.userName}" → ${status}`);
  save();closeModal('admin-reply');renderAll();toast('✅ Reply sent!');
}

function resolveIssue(id,adminName){
  const i=D.issues.find(x=>x.id===id);if(!i)return;
  i.status='resolved';i.reply=i.reply||`Payment verified by ${adminName}`;
  addAct(`✅ Payment resolved: "${i.userName}" ₹${i.amount}`);
  save();renderAll();toast('✅ Issue resolved!');
}

// ==================== UTILS ====================
function fmtDate(d){if(!d)return'';return new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short'})+' '+new Date(d).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});}
function tAgo(ts){const d=Date.now()-ts;if(d<60000)return'abhi';if(d<3600000)return Math.floor(d/60000)+'m ago';if(d<86400000)return Math.floor(d/3600000)+'h ago';return Math.floor(d/86400000)+'d ago';}

// ==================== INIT ====================
load();
const savedUser=localStorage.getItem('bgmi-user');
if(savedUser){try{currentUser=JSON.parse(savedUser);enterApp();}catch(e){}}

// Eye button - touch compatible (sabhi browsers/WebView ke liye)
function bindEye(eyeId,inputId){
  const el=document.getElementById(eyeId);
  if(!el)return;
  const handler=function(e){e.preventDefault();e.stopPropagation();togglePass(inputId);return false;};
  el.addEventListener('click',handler);
  el.addEventListener('touchend',handler);
}
bindEye('eye-login','login-pass');
bindEye('eye-signup','signup-pass');

// Login button - touch compatible (DOMContentLoaded issue fix: direct binding)
(function(){
  var loginBtn=document.querySelector('#login-form .btn-full');
  if(loginBtn){
    var h=function(e){e.preventDefault();e.stopPropagation();doLogin();return false;};
    loginBtn.addEventListener('click',h);
    loginBtn.addEventListener('touchend',h);
  }
  var signupBtn=document.querySelector('#signup-form .btn-full');
  if(signupBtn){
    var sh=function(e){e.preventDefault();e.stopPropagation();doSignup();return false;};
    signupBtn.addEventListener('click',sh);
    signupBtn.addEventListener('touchend',sh);
  }
})();
