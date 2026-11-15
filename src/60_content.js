/* ═════════ PANEL CONTENT ═════════ */
const esc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;');
/* Preview "images" (inline SVG) shown when a crystal is opened */
const IMG={
  0:()=>`<svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg" style="width:100%;border-radius:1em;background:#0f1733">
   <defs><linearGradient id="pg" x1="0" x2="1"><stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#2a6df4"/></linearGradient></defs>
   <rect width="640" height="360" fill="#0f1733"/><rect x="0" y="0" width="640" height="56" fill="url(#pg)"/>
   <text x="24" y="37" font-family="Nunito,sans-serif" font-weight="900" font-size="22" fill="#fff">PROJECTS · github.com/Fahadbin-Alam</text>
   ${[['📱','Muslimo','TypeScript · React Native · FastAPI','Full-stack Islamic learning platform','#1fa36a'],
      ['🎮','Path of the Sahabah','Luau · Roblox Studio · Rojo','Roblox educational game, ages 9–17','#e63946'],
      ['💳','Donation Platform','Cloudflare Pages Functions · Stripe','One World Relief · $20K+ processed','#2a6df4'],
      ['🛰️','Network Automation','Python · Cisco','82nd Airborne · deployment time cut 83%','#7c3aed']].map((p,i)=>{const x=24+(i%2)*300,y=76+Math.floor(i/2)*138;return `
     <rect x="${x}" y="${y}" width="292" height="122" rx="14" fill="#1b2548"/><rect x="${x}" y="${y}" width="8" height="122" rx="4" fill="${p[4]}"/>
     <text x="${x+24}" y="${y+46}" font-size="34">${p[0]}</text>
     <text x="${x+74}" y="${y+36}" font-family="Nunito,sans-serif" font-weight="900" font-size="17" fill="#fff">${esc(p[1])}</text>
     <text x="${x+74}" y="${y+58}" font-family="Nunito,sans-serif" font-weight="700" font-size="11.5" fill="#ffd166">${esc(p[2])}</text>
     <text x="${x+24}" y="${y+96}" font-family="Nunito,sans-serif" font-weight="700" font-size="12" fill="#b7c2e6">${esc(p[3])}</text>`;}).join('')}</svg>`,
  1:()=>{const mc=document.createElement('canvas').getContext('2d'),fitW=(t,w,sz)=>{mc.font=w+' '+sz+'px Nunito,sans-serif';return mc.measureText(t).width>510?' textLength="524" lengthAdjust="spacingAndGlyphs"':'';};
   const line=(y,t,b)=>`<text x="56" y="${y}" font-family="Nunito,sans-serif" font-weight="${b?900:700}" font-size="${b?11.5:10}" fill="${b?'#1c2540':'#3a4260'}"${fitW(t,b?900:700,b?11.5:10)}>${esc(t)}</text>`;
   const sec=(y,t)=>`<text x="56" y="${y}" font-family="Nunito,sans-serif" font-weight="900" font-size="11" fill="#2a6df4" letter-spacing="1.5">${esc(t)}</text><rect x="56" y="${y+5}" width="528" height="1.5" fill="#2a6df4"/>`;
   return `<svg viewBox="0 0 640 436" xmlns="http://www.w3.org/2000/svg" style="width:100%;border-radius:1em;background:#0f1733">
   <rect width="640" height="436" fill="#0f1733"/><rect x="32" y="14" width="576" height="460" rx="6" fill="#fff"/>
   <text x="320" y="46" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="22" fill="#1c2540">Fahadbin Alam</text>
   <text x="320" y="62" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="700" font-size="9.5" fill="#3a4260">856-870-7528 | fma52@drexel.edu | linkedin.com/in/fahadbin-alam- | github.com/Fahadbin-Alam</text>
   <text x="320" y="76" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="700" font-style="italic" font-size="9.5" fill="#3a4260">U.S. Army Veteran (Honorable Discharge) | Secret Clearance</text>
   ${sec(96,'EDUCATION')}${line(112,'Drexel University | B.S. Computer Science | Minors: Mathematics, Data Science, Electrical & Computer Engineering',0)}
   ${sec(131,'TECHNICAL SKILLS')}${line(147,'Languages: Python, TypeScript, JavaScript, C#, SQL, Luau, HTML/CSS',0)}
   ${line(160,'Frameworks & Libraries: FastAPI, React Native (Expo), ASP.NET Core, .NET, SQLAlchemy, Alembic',0)}
   ${line(173,'Databases & Cloud: PostgreSQL, SQLite, Microsoft Azure, Cloudflare Pages/Functions, Docker, Linux',0)}
   ${line(186,'Tools & Testing: Git/GitHub, GitHub Actions, pytest, Unit/Integration Testing, REST APIs, Stripe, RevenueCat, Rojo',0)}
   ${sec(205,'TECHNICAL PROJECTS')}${line(221,'Muslimo — Full-Stack Islamic Learning Platform (April 2026 – Present)',1)}
   ${line(234,'TypeScript, React Native (Expo), Python, FastAPI, SQLAlchemy, Alembic, PostgreSQL, Docker',0)}
   ${line(250,'Path of the Sahabah — Roblox Educational Game (April 2026)',1)}
   ${line(263,'Luau, Roblox Studio, Rojo, DataStoreService, GitHub Actions',0)}
   ${sec(282,'PROFESSIONAL EXPERIENCE')}${line(298,'One World Relief | Founder & Developer (March 2026)',1)}
   ${line(314,'Microsoft Software & Systems Academy (MSSA) | Cloud Application Development Program (June – December 2025)',1)}
   ${line(330,'U.S. Army, 82nd Airborne Division (June 2020 – June 2025)',1)}
   ${line(343,'Communications Systems Specialist (Network Administrator), Sergeant | Army Commendation Medal',0)}
   ${line(359,'Airbnb Host | Operations Automation, North Carolina (2019 – 2023)',1)}
   ${sec(378,'CERTIFICATIONS')}${line(394,'Cisco CCNA | CompTIA Security+ | CompTIA Network+ | CompTIA A+',0)}
   <defs><linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#0f1733"/></linearGradient></defs>
   <rect x="32" y="406" width="576" height="30" fill="url(#fade)"/></svg>`;},
  2:()=>`<svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg" style="width:100%;border-radius:1em;background:#0f1733">
   <rect width="640" height="360" fill="#0f1733"/>
   <text x="24" y="38" font-family="Nunito,sans-serif" font-weight="900" font-size="22" fill="#fff">EXPERIENCE · 2019 → 2026</text>
   <rect x="40" y="200" width="560" height="6" rx="3" fill="#2b365e"/>
   ${[['2019 – 2023','AIRBNB HOST','Python operations automation','🏠','#f0a41e',60],
      ['2020 – 2025','U.S. ARMY · 82nd AIRBORNE','Comms Systems Specialist · SGT','🪖','#6c8848',200],
      ['2025','MSSA · MICROSOFT','Cloud Application Development','☁️','#ff7a59',340],
      ['2026','ONE WORLD RELIEF','Founder & Developer','🌍','#1fa36a',480]].map((e,i)=>{const up=i%2===0,y=up?92:258;return `
     <line x1="${e[5]+40}" y1="203" x2="${e[5]+40}" y2="${up?y+78:y-10}" stroke="${e[4]}" stroke-width="3"/>
     <circle cx="${e[5]+40}" cy="203" r="11" fill="${e[4]}" stroke="#0f1733" stroke-width="4"/>
     <rect x="${e[5]-20}" y="${y-32}" width="150" height="110" rx="12" fill="#1b2548"/>
     <text x="${e[5]+55}" y="${y+12}" text-anchor="middle" font-size="30">${e[3]}</text>
     <text x="${e[5]+55}" y="${y+36}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="10.5" fill="#fff">${esc(e[1])}</text>
     <text x="${e[5]+55}" y="${y+52}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="700" font-size="8.6" fill="#b7c2e6">${esc(e[2])}</text>
     <text x="${e[5]+55}" y="${y+70}" text-anchor="middle" font-family="Nunito,sans-serif" font-weight="900" font-size="10" fill="${e[4]}">${e[0]}</text>`;}).join('')}</svg>`
};
const SC=['#3ddc84','#ff6b6b','#5c93ff','#ffd166','#c084fc','#2dd4bf'];
function bars(s){const ks=Object.keys(s);setTimeout(()=>ks.forEach(k=>{const e=$('bf-'+k.replace(/\W/g,''));if(e)e.style.width=s[k]+'%';}),60);
  return `<div class="card bars" aria-label="Self-rated strengths">${ks.map((k,i)=>`<div class="br"><b>${k}</b><div class="bg"><div class="bf" id="bf-${k.replace(/\W/g,'')}" style="background:${SC[i%6]}"></div></div><i>${s[k]}</i></div>`).join('')}</div>`;}
const nb=l=>l.replace(/ · (\S+)$/,' · <span class="nb">$1</span>');        // keep an address or number on one line
const lk=a=>a.map(([l,u,c])=>/^(mailto|tel):/.test(u)?`<a class="btn ${c}" href="${u}"><span>${nb(l)}</span></a>`:`<a class="btn ${c}" href="${u}" target="_blank" rel="noopener"><span>${nb(l)} ↗</span><span class="sr"> (opens in a new tab)</span></a>`).join('');
const back=(l='◀ BACK')=>`<button class="btn gray" type="button" onclick="closePanels()">${l}</button>`;
const cards=a=>a.map(t=>`<div class="card flavor">${esc(t)}</div>`).join('');
const moves=a=>`<div class="moves">${a.map(([m,d])=>`<div class="mv">${esc(m)}<small>${esc(d)}</small></div>`).join('')}</div>`;
function showEntry(h,cls,html){$('entry-h').className='ph '+cls;$('entry-h').innerHTML=h;$('entry-b').innerHTML=html;openPanel('entry');$('entry-b').scrollTop=0;}

/* The whole résumé as readable text (the picture above it is only a thumbnail on a phone) */
function resumeText(){const ent=(t,when,sub,bl)=>`<div class="rt"><b>${esc(t)}</b><i>${esc(when)}</i></div>${sub?`<div class="st">${esc(sub)}</div>`:''}<ul>${bl.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
  return `<div class="card rs">
   <div class="rc"><b>Fahadbin Alam</b><br>856-870-7528 · fma52@drexel.edu<br>linkedin.com/in/fahadbin-alam- · github.com/Fahadbin-Alam<br><i>U.S. Army Veteran (Honorable Discharge) | Secret Clearance</i></div>
   <h4>EDUCATION</h4><div class="rt"><b>Drexel University</b><i>Philadelphia, PA</i></div><div>B.S. Computer Science | Minors: Mathematics, Data Science, Electrical &amp; Computer Engineering</div>
   <h4>TECHNICAL SKILLS</h4>${SKILLS.map(([k,v])=>`<div><b>${esc(k)}:</b> ${esc(v.replace(/ · /g,', '))}</div>`).join('')}
   <h4>TECHNICAL PROJECTS</h4>
   ${ent('Muslimo — Full-Stack Islamic Learning Platform','April 2026 – Present',KIOSKS[0].stack,R.muslimo)}
   ${ent('Path of the Sahabah — Roblox Educational Game','April 2026',KIOSKS[1].stack,R.sahabah)}
   <h4>PROFESSIONAL EXPERIENCE</h4>
   ${ent('One World Relief | Founder & Developer','March 2026','',R.owr)}
   ${ent('Microsoft Software & Systems Academy (MSSA) | Cloud Application Development Program','June – December 2025','',R.mssa)}
   ${ent('U.S. Army, 82nd Airborne Division','June 2020 – June 2025','Communications Systems Specialist (Network Administrator), Sergeant | Army Commendation Medal',R.army)}
   ${ent('Airbnb Host | Operations Automation, North Carolina','2019 – 2023','',R.airbnb)}
   <h4>CERTIFICATIONS</h4><div>Cisco CCNA | CompTIA Security+ | CompTIA Network+ | CompTIA A+</div></div>`;}
/* The three crystals collected in the Workshop (also reachable from the menu) */
const got=new Set();let allDone=false;
const CCLS=['purple','blue','green'];
function mark(i){got.add(i);$('prog').innerHTML=`<b>◆</b> <span><i>${got.size}</i>/3</span>`;$('prog').setAttribute('aria-label',`Crystals collected: ${got.size} of 3`);}
const crystalBody=i=>{const p=CRYSTALS[i];return `<div class="img">${IMG[i]()}</div><div class="card flavor">${esc(p.f)}</div>`+
  (i===1?`<div class="btnrow">${lk(p.links)}</div>${resumeText()}`:`${bars(p.s)}<div class="btnrow">${lk(p.links)}</div>`);};
function openCrystal(i){const p=CRYSTALS[i];mark(i);showEntry(`<span>${p.n}</span><small>COLLECTED ${got.size} / 3</small>`,CCLS[i],crystalBody(i)+back('◀ CLOSE'));}
function crystalPick(){showEntry(`<span>WHERE TO START?</span><small>THE WORKSHOP</small>`,'',
  `<div class="card lite flavor">MENTOR: Each crystal holds a part of FAHADBIN's professional life. Pick one!</div>
   <div class="list">${CRYSTALS.map((p,i)=>`<button class="li" type="button" onclick="crystalInfo(${i})"><span class="ico" style="background:${p.c}"><span>${p.e}</span></span><span><span class="n">${p.n}</span><br><span class="s">${p.t}</span></span><span class="pill${got.has(i)?' done':''}">${got.has(i)?'✓ COLLECTED':'OPEN ›'}</span></button>`).join('')}</div>${back('◀ NOT NOW')}`);}
function crystalInfo(i){const p=CRYSTALS[i];mark(i);showEntry(`<span>${p.n}</span><small>COLLECTED ${got.size} / 3</small>`,CCLS[i],
  crystalBody(i)+`<button class="btn gray" type="button" onclick="crystalPick()">◀ BACK</button>`);}

/* Plain-text résumé: the "skip the game" view for busy readers (title button, HUD button, R key, menu, or #resume in the link) */
function openResume(){showEntry(`<span>FAHADBIN ALAM</span><small>RÉSUMÉ</small>`,'navy',
  `<div class="card row"><div class="ico" style="background:#4878d8"><span>📄</span></div><div><div class="t1">Fahadbin Alam</div><div class="t2">B.S. Computer Science student at Drexel University<br>U.S. Army Veteran (Honorable Discharge) · Secret Clearance</div></div></div>
   <div class="btnrow">${lk([RESUME_LINK,['LINKEDIN',F.linkedin,''],['GITHUB',F.github,'dark'],['EMAIL · '+F.email,'mailto:'+F.email,'purple']])}</div>
   ${resumeText()}
   <div class="card rs"><h4 style="margin-top:0">ALSO</h4><div>Author of the book <b>The Ivory</b> (<a href="${F.book}" target="_blank" rel="noopener">Amazon ↗</a>) · Founder of <a href="${F.nonprofit}" target="_blank" rel="noopener">One World Relief ↗</a>, a nonprofit that supports orphans and builds water wells.</div></div>
   ${started?back('◀ BACK TO THE GAME'):`<button class="btn green" type="button" onclick="closePanels();start()">▶ PLAY THE GAME INSTEAD</button>`+back('◀ CLOSE')}`);}

const INTERIOR={
  home(){showEntry(`<span>CONTACT CARD</span><small>📌 ON THE FRIDGE</small>`,'',
   `<div class="card row"><div class="ico" style="background:#e63946"><span>👤</span></div><div><div class="t1">FAHADBIN ALAM</div><div class="t2">Computer Science student at Drexel University<br>U.S. Army Veteran (Honorable Discharge) · Philadelphia, PA</div></div></div>
    <div class="card lite flavor">"Become the top 1% of the 1% by helping those get up there with you 😊"</div>
    <div class="btnrow">${lk([['EMAIL · fma52@drexel.edu','mailto:'+F.email,''],['CALL · 856-870-7528',F.phone,'green'],['LINKEDIN',F.linkedin,'purple'],['LINKTREE · ALL MY LINKS',F.linktree,'dark']])}</div><button class="btn gray" type="button" onclick="openResume()">READ THE TEXT RÉSUMÉ</button>${back('◀ CLOSE')}`);},
  army(){showEntry(`<span>82nd AIRBORNE DIVISION</span><small>JUNE 2020 – JUNE 2025</small>`,'green',
   `<div class="card row"><div class="ico" style="background:#6c8848"><span>🪖</span></div><div><div class="t1">SGT ALAM · U.S. ARMY</div><div class="t2"><span class="type" style="background:#6c8848">ARMY</span>Communications Systems Specialist (Network Administrator) · Sergeant</div></div></div>
    ${cards(R.army)}
    ${moves([['PYTHON AUTOMATION','10+ devices · 25+ files'],['83% FASTER','3 hrs to 30 min'],['CHANGE DETECTION','50+ network incidents'],['TEAM LEAD','5-person team']])}
    <div class="card row lite"><span style="font-size:2.4em">🎖️</span><div><div class="t1" style="font-size:1.05em">ARMY COMMENDATION MEDAL</div><div class="t2">U.S. Army Veteran (Honorable Discharge)<br>Secret Clearance</div></div></div>
    <div class="card row lite"><span style="font-size:2.4em">🪂</span><div><div class="t1" style="font-size:1.05em">AIRBORNE</div><div class="t2">He jumped from aircraft with the 82nd. The AIRFIELD is just east of the barracks — or jump right now:</div></div></div>
    <button class="btn gold" type="button" onclick="closePanels();startJump()">🪂 PARACHUTE INTO TOWN</button>
    ${lk([['VIEW ON LINKEDIN',F.linkedin,'']])}${back('◀ LEAVE BARRACKS')}`);},
  drex(){showEntry(`<span>DREXEL UNIVERSITY</span><small>PHILADELPHIA, PA</small>`,'blue',
   `<div class="card row"><div class="ico" style="background:#2a6df4"><span>🎓</span></div><div><div class="t1">B.S. COMPUTER SCIENCE</div><div class="t2">Minors: Mathematics · Data Science · Electrical &amp; Computer Engineering</div></div></div>
    <div class="card flavor" style="opacity:.8">CERTIFICATIONS</div>
    <div class="badges"><div class="badge"><span class="ic">🛰️</span>CISCO<br>CCNA</div><div class="badge"><span class="ic">🛡️</span>COMPTIA<br>SECURITY+</div><div class="badge"><span class="ic">🌐</span>COMPTIA<br>NETWORK+</div><div class="badge"><span class="ic">💾</span>COMPTIA<br>A+</div></div>
    <div class="card flavor" style="opacity:.8">TECHNICAL SKILLS</div>
    <div class="moves one">${SKILLS.map(([m,d])=>`<div class="mv">${esc(m.toUpperCase())}<small>${esc(d)}</small></div>`).join('')}</div>${back('◀ LEAVE CAMPUS')}`);},
  mssa(){showEntry(`<span>MSSA CENTER</span><small>JUNE – DECEMBER 2025</small>`,'',
   `<div class="card row"><div class="ico" style="background:#ff7a59"><span>☁️</span></div><div><div class="t1">MICROSOFT SOFTWARE &amp; SYSTEMS ACADEMY</div><div class="t2">Cloud Application Development Program</div></div></div>
    ${cards(R.mssa)}
    ${bars({'C#':90,'.NET':88,'ASP.NET':86,'AZURE':84,'TESTING':85})}${back('◀ LEAVE CENTER')}`);},
  owr(){showEntry(`<span>ONE WORLD RELIEF</span><small>MARCH 2026</small>`,'green',
   `<div class="card row"><div class="ico" style="background:#1fa36a"><span>🌍</span></div><div><div class="t1">ONE WORLD RELIEF</div><div class="t2"><span class="type" style="background:#1fa36a">NONPROFIT</span>Founder &amp; Developer</div></div></div>
    ${cards(R.owr)}
    ${moves([['CLOUDFLARE','Pages Functions · serverless'],['STRIPE CHECKOUT','$20K+ · 50+ donations'],['HMAC-SHA256','Webhook verification'],['GOOGLE SHEETS','10 fields per record']])}
    ${lk([['VISIT / DONATE · ONE-WORLD-RELIEF.ORG',F.nonprofit,'green']])}${back('◀ LEAVE')}`);},
  mart(){showEntry(`<span>BOOK MART</span><small>SHOP</small>`,'purple',
   `<div class="card row"><div class="ico" style="background:#7c3aed"><span>📕</span></div><div><div class="t1">THE IVORY</div><div class="t2">by Fahadbin Mihad Alam · Available on Amazon</div></div></div>
    <div class="card row lite"><span style="font-size:2.2em">🏠</span><div><div class="t1" style="font-size:1.05em">AIRBNB HOST · 2019 – 2023</div><div class="t2">Operations Automation, North Carolina</div></div></div>
    <div class="card flavor">CLERK: The author also hosted on Airbnb. ${esc(R.airbnb[0])}</div>
    ${lk([['BUY THE IVORY ON AMAZON',F.book,'purple'],['JOIN THE MUSLIM DISCORD',F.discord,''],['ALL LINKS · LINKTREE',F.linktree,'dark']])}${back('◀ LEAVE SHOP')}`);},
};

function openProject(i){const w=KIOSKS[i];seen.add(w.n);
  showEntry(`<span>${w.n}</span><small>${w.t}</small>`,'purple',
   `<div class="card row"><div class="ico" style="background:${w.c}"><span>${w.e}</span></div><div><div class="t1">${w.n}</div><div class="t2"><span class="type" style="background:${w.c}">${w.t}</span>${esc(w.sub)}<br>${w.when} · ${seen.size}/${KIOSKS.length} kiosks viewed</div></div></div>
    <div class="card lite flavor" style="font-size:.95em;opacity:.85">${esc(w.stack)}</div>
    ${cards(w.f)}${moves(w.moves)}
    ${lk(w.links)}${back('◀ BACK TO THE PARK')}`);}

function contactCard(){showEntry(`<span>CONTACT CARD</span><small>BULLETIN BOARD</small>`,'gold',
  `<div class="card row"><div class="ico" style="background:#f0a41e"><span>🧑‍💻</span></div><div><div class="t1">FAHADBIN ALAM</div><div class="t2">CS Student · U.S. Army Veteran (Honorable Discharge)<br>Kiosks viewed: ${seen.size}/${KIOSKS.length} · Certs: 4 · Secret Clearance</div></div></div>
   <div class="badges"><div class="badge"><span class="ic">🛰️</span>CCNA</div><div class="badge"><span class="ic">🛡️</span>SEC+</div><div class="badge"><span class="ic">🌐</span>NET+</div><div class="badge"><span class="ic">💾</span>A+</div></div>
   <div class="btnrow">${lk([['LINKEDIN',F.linkedin,''],['GITHUB',F.github,'dark'],['ONE WORLD RELIEF',F.nonprofit,'green'],['LINKTREE',F.linktree,'gold'],['EMAIL · '+F.email,'mailto:'+F.email,'purple'],['CALL · 856-870-7528',F.phone,'green']])}</div>
   <button class="btn gray" type="button" onclick="openResume()">READ THE TEXT RÉSUMÉ</button>${back('◀ CLOSE')}`);}
