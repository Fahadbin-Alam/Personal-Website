/* ═════════ DATA — from the résumé (November 2026) + linktr.ee/fahadbin.alam ═════════ */
const IS_TOUCH=matchMedia('(pointer:coarse)').matches||(('ontouchstart' in window)&&!matchMedia('(pointer:fine)').matches);
const ACT=IS_TOUCH?'TALK':'ENTER';                 // what the "talk / open" control is called on this device
const F={name:'FAHADBIN',email:'fma52@drexel.edu',linktree:'https://linktr.ee/fahadbin.alam',
  linkedin:'https://www.linkedin.com/in/fahadbin-alam-/',github:'https://github.com/Fahadbin-Alam',
  nonprofit:'https://one-world-relief.org',book:'https://www.amazon.com/Ivory-Fahadbin-Mihad-Alam/dp/B0B9QM23FH',
  discord:'https://discord.gg/mmMQe7vq',phone:'tel:+18568707528',
  muslimo:'https://github.com/Fahadbin-Alam/Muslimo',sahabah:'https://github.com/Fahadbin-Alam/Roblox-Islamic-Game',
  /* No hosted résumé PDF yet: the résumé-file button points at Linktree. Put a PDF URL here to switch every such button to it. */
  resumePdf:''};
const RESUME_LINK=F.resumePdf?['DOWNLOAD RÉSUMÉ (PDF)',F.resumePdf,'green']:['RÉSUMÉ · LINKTREE',F.linktree,'green'];

/* Résumé bullets, kept word for word */
const R={
  muslimo:[
    `Architected a cross-platform learning platform pairing a TypeScript/React Native client with a Python/FastAPI backend of 40+ REST endpoints, serving 251 lessons and 645 quiz questions with gamified progression and social features.`,
    `Designed an 18-table relational schema with SQLAlchemy and 11 versioned Alembic migrations, and implemented offline-first sync that stores progress on-device and uploads it to the server on reconnect.`,
    `Secured accounts and paid features with PBKDF2 password hashing, server-side Google token verification, and authenticated RevenueCat webhooks, keeping the server the single source of truth for premium access.`,
    `Built a GitHub Actions CI pipeline running 95 backend pytest tests, frontend unit tests, TypeScript type checks, and Android/iOS bundle exports on every pull request, surfacing regressions before merge.`],
  sahabah:[
    `Engineered game systems for an educational Roblox experience for ages 9–17, including XP progression, quests, quizzes, achievements, and daily streaks built on shared data modules.`,
    `Implemented fault-tolerant DataStoreService persistence with 120-second autosaves, 3 load retries, and data-loss guards.`,
    `Enforced server-authoritative quiz scoring with input validation and submission cooldowns, verified by 20 automated Luau tests across 3 suites and static analysis in GitHub Actions.`],
  owr:[
    `Independently architected and deployed a serverless donation platform on Cloudflare Pages Functions with Stripe Checkout, processing $20K+ across 50+ donations for multiple fundraising campaigns.`,
    `Secured the payment backend with HMAC-SHA256 webhook signature verification and automated invalid-signature tests, ensuring only authentic Stripe events update donation records.`,
    `Automated Stripe-to-Google Sheets donation tracking (10 fields per record), saving about 4 hours of bookkeeping monthly.`],
  mssa:[
    `Engineered a C#/.NET application with 4 core features using object-oriented architecture and persistent storage.`,
    `Deployed ASP.NET Core REST APIs and a SQL database to Microsoft Azure, validated with unit and integration tests.`],
  army:[
    `Automated Cisco configuration in Python across 10+ devices and 25+ files, cutting deployment time 83% (3 hrs to 30 min).`,
    `Engineered Python configuration-change detection, accelerating root-cause analysis across 50+ network incidents.`,
    `Led a 5-person team in standardizing incident-response workflows, contributing to an estimated 25–30% less downtime.`],
  airbnb:[
    `Automated 3 operational workflows in Python (guest communications, vendor coordination, and expense tracking) for 3–5 rental properties, producing tax-ready financial records without manual bookkeeping.`],
};
const SKILLS=[
  ['Languages','Python · TypeScript · JavaScript · C# · SQL · Luau · HTML/CSS'],
  ['Frameworks & Libraries','FastAPI · React Native (Expo) · ASP.NET Core · .NET · SQLAlchemy · Alembic'],
  ['Databases & Cloud','PostgreSQL · SQLite · Microsoft Azure · Cloudflare Pages/Functions · Docker · Linux'],
  ['Tools & Testing','Git/GitHub · GitHub Actions · pytest · Unit/Integration Testing · REST APIs · Stripe · RevenueCat · Rojo'],
];

/* The three crystals on the Workshop table */
const CRYSTALS=[
  {n:'PROJECTS',t:'BUILDER',c:'#7c3aed',e:'⚙️',f:'Two lead projects: MUSLIMO, a full-stack Islamic learning platform (React Native + FastAPI, 40+ REST endpoints, 251 lessons, 645 quiz questions), and PATH OF THE SAHABAH, a Roblox educational game in Luau. Plus a live donation platform and Army network automation. Visit the four kiosks in PROJECT PARK to see each one.',s:{CODE:94,DESIGN:86,SHIPPING:90,IMPACT:88,RANGE:92},links:[['MUSLIMO ON GITHUB',F.muslimo,'green'],['PATH OF THE SAHABAH ON GITHUB',F.sahabah,'red'],['ALL CODE ON GITHUB',F.github,'dark']]},
  {n:'RÉSUMÉ',t:'DOCUMENT',c:'#2a6df4',e:'📄',f:'One page: full-stack projects in Python and TypeScript, a serverless donation platform that has processed $20K+, five years in the 82nd Airborne Division, and four certifications. U.S. Army Veteran (Honorable Discharge) · Secret Clearance.',s:{CLARITY:95,SKILLS:90,CERTS:96,DEPTH:88,FORMAT:92},links:[RESUME_LINK,['CONNECT ON LINKEDIN',F.linkedin,''],['EMAIL · fma52@drexel.edu','mailto:'+F.email,'purple']]},
  {n:'EXPERIENCE',t:'VETERAN',c:'#1fa36a',e:'🪖',f:'Founder & Developer of ONE WORLD RELIEF (2026). MICROSOFT SOFTWARE & SYSTEMS ACADEMY, Cloud Application Development Program (2025). U.S. ARMY, 82nd AIRBORNE DIVISION — Communications Systems Specialist, Sergeant (2020 – 2025). AIRBNB HOST who automated his rental operations in Python (2019 – 2023). Visit the barracks, the MSSA Center and One World Relief for the full story.',s:{LEADERSHIP:96,NETWORKS:94,AUTOMATION:90,CLOUD:85,GRIT:99},links:[['VIEW ON LINKEDIN',F.linkedin,''],['ONE WORLD RELIEF',F.nonprofit,'green']]},
];
/* The four kiosks in Project Park */
const KIOSKS=[
  {n:'MUSLIMO',e:'📱',t:'FULL-STACK',c:'#1fa36a',sub:'Full-Stack Islamic Learning Platform',when:'April 2026 – Present',stack:'TypeScript, React Native (Expo), Python, FastAPI, SQLAlchemy, Alembic, PostgreSQL, Docker',f:R.muslimo,
   moves:[['TYPESCRIPT','React Native (Expo)'],['PYTHON · FASTAPI','40+ REST endpoints'],['POSTGRESQL','18 tables · 11 migrations'],['GITHUB ACTIONS','95 pytest tests in CI']],links:[['MUSLIMO ON GITHUB',F.muslimo,'dark']]},
  {n:'PATH OF THE SAHABAH',e:'🎮',t:'LUAU',c:'#e63946',sub:'Roblox Educational Game',when:'April 2026',stack:'Luau, Roblox Studio, Rojo, DataStoreService, GitHub Actions',f:R.sahabah,
   moves:[['LUAU','Roblox Studio · Rojo'],['DATASTORE','120-second autosaves'],['SERVER SCORING','Validation · cooldowns'],['GITHUB ACTIONS','20 automated tests']],links:[['PATH OF THE SAHABAH ON GITHUB',F.sahabah,'dark']]},
  {n:'DONATION PLATFORM',e:'💳',t:'SERVERLESS',c:'#2a6df4',sub:'One World Relief · Founder & Developer',when:'March 2026',stack:'Cloudflare Pages Functions, Stripe Checkout, HMAC-SHA256 webhooks, Google Sheets',f:R.owr,
   moves:[['CLOUDFLARE','Pages Functions'],['STRIPE CHECKOUT','$20K+ · 50+ donations'],['HMAC-SHA256','Webhook verification'],['GOOGLE SHEETS','10 fields per record']],links:[['VISIT ONE-WORLD-RELIEF.ORG',F.nonprofit,'green']]},
  {n:'NETWORK AUTOMATION',e:'🛰️',t:'PYTHON',c:'#7c3aed',sub:'U.S. Army, 82nd Airborne Division',when:'June 2020 – June 2025',stack:'Python, Cisco',f:R.army.slice(0,2),
   moves:[['PYTHON','Configuration automation'],['CISCO','10+ devices · 25+ files'],['83% FASTER','3 hrs to 30 min'],['CHANGE DETECTION','50+ incidents']],links:[['VIEW ON LINKEDIN',F.linkedin,'']]},
];
