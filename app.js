const $ = id => document.getElementById(id);
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
let subjects = read("subjects", []);
let exams = read("wtExams", []);
let profile = read("wtProfile", null);
let selectedGuild = localStorage.getItem("wtGuild") || "";
let toastTimer;

function notify(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}
function saveSubjects() {
  localStorage.setItem("subjects", JSON.stringify(subjects));
  renderSubjects();
  renderSubjectOverview();
  populateRevisionSubjects();
  updateDashboard();
}
function saveExams() {
  localStorage.setItem("wtExams", JSON.stringify(exams));
  renderExams();
  updateDashboard();
}
function showApp() {
  $("loginScreen").classList.add("hidden");
  $("appShell").classList.remove("hidden");
  $("welcomeTitle").textContent = "Welcome back, " + profile.name + ".";
  $("avatarInitial").textContent = profile.name.charAt(0).toUpperCase();
  $("todayLabel").textContent = new Intl.DateTimeFormat("en-IN", {day:"numeric", month:"short", year:"numeric"}).format(new Date());
  showPage("overview");
  renderGuild();
  renderSubjects();
  renderSubjectOverview();
  populateRevisionSubjects();
  renderExams();
  updateModeVisibility();
  updateDashboard();
  renderDailyTasks();
  updateExamPrep();
}

const thoughtsByPage = {
  overview: [
    "Aaj ka chhota effort, kal ka bada result ban sakta hai.",
    "You do not need a perfect day. You need a focused next hour.",
    "Sapne bade rakho, par aaj ka target clear rakho.",
    "Progress slow ho sakti hai, par rukni nahi chahiye.",
    "Your future is shaped by what you practise today."
  ],
  syllabus: [
    "Ek chapter at a time. Bas agla step complete karo.",
    "Confusion learning ka end nahi, starting point hai.",
    "Aaj jo samjha, wahi kal tumhari strength banega.",
    "Consistency beats random bursts of hard work.",
    "Ratta kam, samajh zyada. Build the foundation."
  ],
  exams: [
    "Exam date pressure nahi, planning ka signal hai.",
    "Preparation ka best time hamesha abhi hota hai.",
    "Paper tumhari value decide nahi karta; preparation tumhara control hai.",
    "Stay calm, revise smart, and trust your practice.",
    "Har test feedback hai. Use it, then improve."
  ],
  daily: [
    "Aaj ke 3 focused tasks, kal ke 30 random tasks se behtar hain.",
    "Start small. Finish what you planned.",
    "Discipline ka matlab perfect hona nahi, wapas track par aana hai."
  ],
  subjects: [
    "Every subject becomes manageable when you break it into chapters.",
    "A clear subject list turns a large syllabus into smaller steps."
  ],
  revision: [
    "Revision turns short-term understanding into long-term memory.",
    "A topic is not finished until you can recall it again."
  ],
  timer: [
    "Protect your focus. One task, one session, one finish.",
    "A focused 25 minutes can beat an hour of distraction."
  ],
  notifications: [
    "A useful reminder is a plan asking for your attention.",
    "Check your progress, then decide your next move."
  ],
  settings: [
    "Build a system that supports the way you learn.",
    "A good plan should fit your life, not fight it."
  ],
  prep: [
    "Exam ko ek din mein nahi, roz ke revision se jeeta jaata hai.",
    "Plan clear ho to pressure manageable ho jaata hai.",
    "Practice makes your preparation visible."
  ]
};
let thoughtBag = read("wtThoughtBag", []);
let lastThought = localStorage.getItem("wtLastThought") || "";
function showThought(page) {
  const pool = thoughtsByPage[page] || thoughtsByPage.overview;
  const available = pool.filter(item => item !== lastThought);
  const thought = available[Math.floor(Math.random() * available.length)] || pool[0];
  lastThought = thought;
  localStorage.setItem("wtLastThought", thought);
  $("thoughtText").textContent = thought;
  const labels = {overview:"A NOTE FOR TODAY",daily:"A THOUGHT FOR YOUR DAILY QUEST",syllabus:"A THOUGHT FOR YOUR LEARNING",prep:"A THOUGHT FOR YOUR PREPARATION",exams:"A THOUGHT BEFORE THE EXAM",subjects:"A NOTE FOR YOUR SUBJECTS",revision:"A NOTE FOR REVISION",timer:"A NOTE FOR FOCUS",notifications:"A NOTE FOR YOUR JOURNEY",settings:"A NOTE FOR YOUR STUDY SPACE"};
  $("thoughtLabel").textContent = labels[page] || labels.overview;
}

function updateModeVisibility() {
  const daily=profile?.modes?.daily!==false, exam=profile?.modes?.exam===true;
  document.querySelectorAll('[data-page="daily"],[data-page="timer"]').forEach(el=>el.hidden=!daily);
  document.querySelectorAll('[data-page="prep"],[data-page="exams"]').forEach(el=>el.hidden=!exam);
  if(!daily&&["daily","timer"].includes(document.querySelector(".nav-link.active")?.dataset.page))showPage("overview");
  if(!exam&&["prep","exams"].includes(document.querySelector(".nav-link.active")?.dataset.page))showPage("overview");
}
function showPage(page) {
  document.querySelectorAll(".page").forEach(el => el.classList.add("hidden"));
  const target = $(page + "Page");
  if (!target) return;
  target.classList.remove("hidden");
  document.querySelectorAll(".nav-link").forEach(btn => btn.classList.toggle("active", btn.dataset.page === page));
  const titles = {overview:"Overview",daily:"Daily Study",syllabus:"Syllabus Tracker",prep:"Exam Preparation",exams:"Exam Datesheet",subjects:"Subjects",revision:"Revision Room",timer:"Study Timer",notifications:"Notifications",settings:"Settings"};
  const subtitles = {overview:"YOUR PROGRESS, YOUR PACE",daily:"PLAN TODAY, ONE TASK AT A TIME",syllabus:"BUILD YOUR PLAN",prep:"PREPARE WITH A PLAN",exams:"PLAN AHEAD",subjects:"YOUR ACADEMIC MAP",revision:"REVISE AND RETAIN",timer:"FOCUS SESSION",notifications:"YOUR STUDY UPDATES",settings:"PERSONALISE YOUR SPACE"};
  $("pageTitle").textContent = titles[page];
  $("pageEyebrow").textContent = subtitles[page];
  showThought(page);
  if (page === "daily") renderDailyTasks();
  if (page === "prep") updateExamPrep();
  if (page === "subjects") renderSubjectOverview();
  if (page === "revision") renderRevisions();
  if (page === "notifications") renderNotifications();
  if (page === "settings") loadSettings();
  $("appShell").classList.remove("nav-open");
  $("menuToggle").setAttribute("aria-expanded","false");
}
document.querySelectorAll(".nav-link").forEach(btn => btn.addEventListener("click", () => showPage(btn.dataset.page)));
$("menuToggle").addEventListener("click", () => {
  const open = $("appShell").classList.toggle("nav-open");
  $("menuToggle").setAttribute("aria-expanded", String(open));
});
document.querySelectorAll("[data-go]").forEach(btn => btn.addEventListener("click", () => showPage(btn.dataset.go)));
document.querySelectorAll("[data-guild]").forEach(btn => btn.addEventListener("click", () => {
  selectedGuild = btn.dataset.guild;
  localStorage.setItem("wtGuild", selectedGuild);
  renderGuild();
  notify(selectedGuild + " guild selected.");
}));
function renderGuild() {
  document.querySelectorAll("[data-guild]").forEach(btn => btn.classList.toggle("chosen", btn.dataset.guild === selectedGuild));
  $("guildSelected").textContent = selectedGuild ? "✦ Your guild: " + selectedGuild : "Choose a guild to personalise your study hall.";
}

function subjectsForSetup(studentClass, stream) {
  const grade = Number(studentClass);
  if (grade >= 11) {
    const choices = {
      PCM:["Physics","Chemistry","Mathematics","English"],
      PCB:["Physics","Chemistry","Biology","English"],
      PCMB:["Physics","Chemistry","Mathematics","Biology","English"],
      Commerce:["Accountancy","Business Studies","Economics","English"],
      Humanities:["History","Political Science","Geography","English"]
    };
    return choices[stream] || [];
  }
  const common = ["English","Mathematics","Science","Social Science"];
  if (grade <= 8) return ["English","Hindi","Mathematics","Science","Social Science"];
  return [...common,"Hindi"];
}
$("loginClass").addEventListener("change", () => {
  const senior = Number($("loginClass").value) >= 11;
  $("streamField").hidden = !senior;
  if (!senior) $("studentStream").value = "";
});
$("examMode").addEventListener("change", () => {
  $("targetExamField").hidden = !$("examMode").checked;
});
$("loginForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = $("loginName").value.trim();
  const studentClass = $("loginClass").value;
  const stream = $("studentStream").value;
  const dailyMode = $("dailyMode").checked;
  const examMode = $("examMode").checked;
  if (!name || !studentClass) return notify("Enter your name and class.");
  if (!dailyMode && !examMode) return notify("Choose at least one study mode.");
  if (Number(studentClass) >= 11 && !stream) return notify("Choose your stream first.");
  profile = {
    name, studentClass, school:$("schoolName").value.trim(),
    board:$("boardName").value, stream,
    phone:$("studentPhone").value.trim(), email:$("studentEmail").value.trim(),
    modes:{daily:dailyMode,exam:examMode}, targetExamDate:$("targetExamDate").value
  };
  localStorage.setItem("wtProfile", JSON.stringify(profile));
  if (!subjects.length) {
    subjects = subjectsForSetup(studentClass,stream).map(name => ({name,chapters:[]}));
    localStorage.setItem("subjects",JSON.stringify(subjects));
  }
  if (examMode && profile.targetExamDate && !exams.some(e=>e.name==="Target Exam")) {
    exams.push({id:Date.now(),name:"Target Exam",subject:"All subjects",date:profile.targetExamDate,time:""});
    localStorage.setItem("wtExams",JSON.stringify(exams));
  }
  showApp();
});

$("logoutBtn").addEventListener("click", () => {
  $("loginScreen").classList.remove("hidden");
  $("appShell").classList.add("hidden");
  $("loginName").value = profile?.name || "";
  $("loginClass").value = profile?.studentClass || "";
  $("schoolName").value = profile?.school || "";
  $("boardName").value = profile?.board || "";
  $("studentPhone").value = profile?.phone || "";
  $("studentEmail").value = profile?.email || "";
  $("dailyMode").checked = profile?.modes?.daily ?? true;
  $("examMode").checked = profile?.modes?.exam ?? false;
  $("studentStream").value = profile?.stream || "";
  $("streamField").hidden = Number(profile?.studentClass) < 11;
  $("targetExamField").hidden = !profile?.modes?.exam;
  $("targetExamDate").value = profile?.targetExamDate || "";
});

$("addSubject").addEventListener("click", () => {
  const name = $("subjectName").value.trim();
  if (!name) return notify("Enter a subject name first.");
  if (subjects.some(s => s.name.toLowerCase() === name.toLowerCase())) return notify("That subject already exists.");
  subjects.push({name, chapters:[]});
  $("subjectName").value = "";
  saveSubjects();
  notify("Subject added.");
});
$("subjectName").addEventListener("keydown", e => { if(e.key === "Enter") $("addSubject").click(); });

function renderSubjects() {
  const container = $("subjects");
  container.innerHTML = "";
  if (!subjects.length) {
    container.innerHTML = '<div class="empty-card"><span>✧</span><h3>Your study shelf is waiting.</h3><p>Add your first subject to start tracking chapters.</p></div>';
    return;
  }
  subjects.forEach((subject, index) => {
    const total = subject.chapters.length;
    const done = subject.chapters.filter(c => c.done).length;
    const card = document.createElement("article");
    card.className = "subject-card";
    const head = document.createElement("div");
    head.className = "subject-head";
    const title = document.createElement("div");
    const h3 = document.createElement("h3");
    h3.textContent = subject.name;
    const meta = document.createElement("p");
    meta.textContent = done + " of " + total + " chapters complete";
    title.append(h3, meta);
    const del = document.createElement("button");
    del.className = "subtle-btn";
    del.textContent = "⋯";
    del.title = "Delete subject";
    del.addEventListener("click", () => {
      if (!confirm("Delete " + subject.name + " and all its chapters?")) return;
      subjects.splice(index,1); saveSubjects(); notify("Subject deleted.");
    });
    head.append(title,del);
    const track = document.createElement("div");
    track.className = "subject-track";
    const fill = document.createElement("i");
    fill.style.width = (total ? done/total*100 : 0) + "%";
    track.append(fill);
    card.append(head,track);
    const chapterList = document.createElement("div");
    chapterList.className = "chapter-list";
    subject.chapters.forEach((chapter, chapterIndex) => {
      const label = document.createElement("label");
      label.className = "chapter-row" + (chapter.done ? " is-done" : "");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = !!chapter.done;
      checkbox.addEventListener("change", () => {
        chapter.done = checkbox.checked; saveSubjects();
      });
      const text = document.createElement("span");
      text.textContent = chapter.name;
      const remove = document.createElement("button");
      remove.type = "button"; remove.className = "chapter-delete"; remove.textContent = "×"; remove.title = "Remove chapter";
      remove.addEventListener("click", e => {
        e.preventDefault(); subject.chapters.splice(chapterIndex,1); saveSubjects();
      });
      label.append(checkbox,text,remove);
      chapterList.append(label);
    });
    const addWrap = document.createElement("form");
    addWrap.className = "chapter-add";
    const input = document.createElement("input");
    input.placeholder = "Add a chapter or topic...";
    const add = document.createElement("button");
    add.type = "submit"; add.textContent = "+";
    addWrap.append(input,add);
    addWrap.addEventListener("submit", e => {
      e.preventDefault();
      const name = input.value.trim();
      if (!name) return;
      subject.chapters.push({name,done:false}); saveSubjects();
    });
    card.append(chapterList,addWrap);
    container.append(card);
  });
}
$("examForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = $("examName").value.trim();
  const subject = $("examSubject").value.trim();
  const date = $("examDate").value;
  const time = $("examTime").value;
  if (!name || !subject || !date) return;
  exams.push({id:Date.now(),name,subject,date,time});
  exams.sort((a,b) => (a.date + (a.time||"")).localeCompare(b.date + (b.time||"")));
  localStorage.setItem("wtExams", JSON.stringify(exams));
  $("examForm").reset();
  renderExams(); updateDashboard(); addNotice("Exam added",subject+" was added to your datesheet."); notify("Exam added to your datesheet.");
});
function localDateKey(date=new Date()) { return [date.getFullYear(),String(date.getMonth()+1).padStart(2,"0"),String(date.getDate()).padStart(2,"0")].join("-"); }
function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN",{day:"numeric",month:"short",year:"numeric"}).format(new Date(date+"T00:00:00"));
}
function renderExams() {
  const list = $("examList");
  list.innerHTML = "";
  $("examCount").textContent = exams.length + (exams.length === 1 ? " exam" : " exams");
  const today = localDateKey();
  const upcoming = exams.filter(e => e.date >= today).sort((a,b)=>a.date.localeCompare(b.date));
  if (!exams.length) {
    list.innerHTML = '<p class="empty-state">Your datesheet is empty. Add your first exam above.</p>';
    return;
  }
  exams.sort((a,b)=>a.date.localeCompare(b.date)).forEach(exam => {
    const row = document.createElement("div");
    row.className = "exam-row";
    const date = document.createElement("div");
    date.className = "exam-date";
    const d = new Date(exam.date+"T00:00:00");
    date.innerHTML = '<strong></strong><span></span>';
    date.querySelector("strong").textContent = new Intl.DateTimeFormat("en-IN",{day:"2-digit"}).format(d);
    date.querySelector("span").textContent = new Intl.DateTimeFormat("en-IN",{month:"short"}).format(d);
    const info = document.createElement("div");
    info.className = "exam-info";
    const h = document.createElement("h4"); h.textContent = exam.name;
    const p = document.createElement("p"); p.textContent = exam.subject + (exam.time ? " · " + exam.time : "");
    info.append(h,p);
    const status = document.createElement("span");
    status.className = "exam-status" + (exam.date < today ? " past" : "");
    status.textContent = exam.date < today ? "Completed date" : (exam.date === today ? "Today" : "Upcoming");
    const del = document.createElement("button"); del.className = "subtle-btn"; del.textContent = "×"; del.title = "Delete exam";
    del.addEventListener("click",()=>{exams=exams.filter(e=>e.id!==exam.id);saveExams();notify("Exam removed.");});
    row.append(date,info,status,del);
    list.append(row);
  });
}
function updateExamPrep() {
  const total = subjects.reduce((sum,s)=>sum+s.chapters.length,0);
  const done = subjects.reduce((sum,s)=>sum+s.chapters.filter(c=>c.done).length,0);
  const pct = total ? Math.round(done/total*100) : 0;
  const today = new Date(); today.setHours(0,0,0,0);
  const upcoming = exams.filter(e=>new Date(e.date+"T00:00:00")>=today).sort((a,b)=>a.date.localeCompare(b.date));
  $("prepProgress").textContent = pct + "%";
  $("prepChapters").textContent = done + " of " + total + " chapters";
  $("prepExamCount").textContent = upcoming.length;
  if (!upcoming.length) {
    $("prepNextExam").textContent = "Not set";
    $("prepCountdown").textContent = "Add an exam date";
  } else {
    const next = upcoming[0], date = new Date(next.date+"T00:00:00");
    const days = Math.ceil((date-today)/86400000);
    $("prepNextExam").textContent = next.subject || next.name;
    $("prepCountdown").textContent = days === 0 ? "Your exam is today" : days + " days remaining · " + formatDate(next.date);
  }
}
let dailyTasks = read("wtDailyTasks", {});
function todayKey(){ return localDateKey(); }
function renderDailyTasks() {
  const key=todayKey(), tasks=dailyTasks[key] || [];
  const list=$("dailyTasks"); if(!list) return;
  list.innerHTML="";
  $("dailyCount").textContent=tasks.filter(t=>t.done).length+" / "+tasks.length+" done";
  const subjectSelect=$("dailySubject");
  if(subjectSelect){const current=subjectSelect.value;subjectSelect.innerHTML='<option value="">Subject (optional)</option>';subjects.forEach(s=>{const o=document.createElement("option");o.value=s.name;o.textContent=s.name;subjectSelect.append(o);});subjectSelect.value=current;}
  if(!tasks.length){list.innerHTML='<p class="empty-state">No targets yet. Add the first small task.</p>';return;}
  tasks.forEach((task,index)=>{
    const row=document.createElement("label");row.className="daily-task"+(task.done?" is-done":"");
    const check=document.createElement("input");check.type="checkbox";check.checked=!!task.done;
    check.addEventListener("change",()=>{task.done=check.checked;dailyTasks[key]=tasks;localStorage.setItem("wtDailyTasks",JSON.stringify(dailyTasks));renderDailyTasks();});
    const name=document.createElement("span");name.textContent=task.name;
    const subject=document.createElement("small");subject.textContent=task.subject||"Personal target";
    const del=document.createElement("button");del.type="button";del.className="subtle-btn";del.textContent="×";del.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();tasks.splice(index,1);dailyTasks[key]=tasks;localStorage.setItem("wtDailyTasks",JSON.stringify(dailyTasks));renderDailyTasks();});
    row.append(check,name,subject,del);list.append(row);
  });
}
$("dailyForm").addEventListener("submit",e=>{
  e.preventDefault();const name=$("dailyTask").value.trim();if(!name)return;
  const key=todayKey();dailyTasks[key]=dailyTasks[key]||[];
  dailyTasks[key].push({name,subject:$("dailySubject").value,done:false});
  localStorage.setItem("wtDailyTasks",JSON.stringify(dailyTasks));$("dailyForm").reset();renderDailyTasks();notify("Daily target added.");
});
function updateDashboard() {
  const total = subjects.reduce((sum,s)=>sum+s.chapters.length,0);
  const done = subjects.reduce((sum,s)=>sum+s.chapters.filter(c=>c.done).length,0);
  const percent = total ? Math.round(done/total*100) : 0;
  const today = localDateKey();
  const upcoming = exams.filter(e=>e.date>=today).sort((a,b)=>a.date.localeCompare(b.date));
  $("completedStat").textContent = done;
  $("chapterTotal").textContent = "of " + total + " chapters";
  $("progressStat").textContent = percent + "%";
  $("progressBar").style.width = percent + "%";
  $("examStat").textContent = upcoming.length;
  updateExamPrep();
  $("ringPercent").textContent = percent + "%";
  $("progressRing").style.setProperty("--progress", (percent*3.6) + "deg");
  const upcomingList = $("upcomingList");
  upcomingList.innerHTML = "";
  if (!upcoming.length) {
    upcomingList.innerHTML = '<p class="empty-state">No upcoming exams. Add your datesheet to see it here.</p>';
  } else {
    upcoming.slice(0,3).forEach(exam=>{
      const row=document.createElement("div"); row.className="upcoming-item";
      const title=document.createElement("strong"); title.textContent=exam.name;
      const sub=document.createElement("span"); sub.textContent=exam.subject+" · "+formatDate(exam.date);
      row.append(title,sub); upcomingList.append(row);
    });
  }
}

/* Additional study tools */
let revisions = read("wtRevisions", []);
let notices = read("wtNotifications", []);
function addNotice(title, message) {
  notices.unshift({id:Date.now()+Math.random(),title,message,created:new Date().toISOString(),read:false});
  notices=notices.slice(0,40); localStorage.setItem("wtNotifications",JSON.stringify(notices)); updateNotificationBadge();
}
function updateNotificationBadge() {
  const badge=$("notificationBadge"); if(!badge)return;
  const unread=notices.filter(n=>!n.read).length; badge.textContent=unread; badge.hidden=!unread;
}
function renderNotifications() {
  const list=$("notificationList"); if(!list)return; list.innerHTML="";
  if(!notices.length){list.innerHTML='<p class="empty-state">No notifications yet. Your study updates will appear here.</p>';return;}
  notices.forEach(n=>{
    const item=document.createElement("article");item.className="notice-row"+(n.read?" read":"");
    const copy=document.createElement("div");const title=document.createElement("strong");title.textContent=n.title;
    const msg=document.createElement("p");msg.textContent=n.message;
    const time=document.createElement("small");time.textContent=new Date(n.created).toLocaleString("en-IN");
    copy.append(title,msg,time);const mark=document.createElement("button");mark.className="text-btn";mark.textContent=n.read?"Read":"Mark read";
    mark.addEventListener("click",()=>{n.read=true;localStorage.setItem("wtNotifications",JSON.stringify(notices));renderNotifications();updateNotificationBadge();});
    item.append(copy,mark);list.append(item);
  });
}
$("clearNotifications").addEventListener("click",()=>{notices=[];localStorage.setItem("wtNotifications","[]");renderNotifications();updateNotificationBadge();});
$("notificationQuick").addEventListener("click",()=>showPage("notifications"));
function renderSubjectOverview() {
  const wrap=$("subjectOverview");if(!wrap)return;wrap.innerHTML="";
  if(!subjects.length){wrap.innerHTML='<div class="empty-card"><h3>No subjects yet</h3><p>Add subjects in the Syllabus Tracker.</p></div>';return;}
  subjects.forEach(sub=>{
    const total=sub.chapters.length,done=sub.chapters.filter(c=>c.done).length;
    const card=document.createElement("article");card.className="subject-card";
    const title=document.createElement("h3");title.textContent=sub.name;
    const meta=document.createElement("p");meta.className="muted";meta.textContent=done+" / "+total+" chapters completed";
    const track=document.createElement("div");track.className="subject-track";const fill=document.createElement("i");fill.style.width=(total?done/total*100:0)+"%";track.append(fill);
    const open=document.createElement("button");open.className="text-btn";open.textContent="Manage chapters →";open.addEventListener("click",()=>showPage("syllabus"));
    card.append(title,meta,track,open);wrap.append(card);
  });
}
function populateRevisionSubjects() {
  const sel=$("revisionSubject");if(!sel)return;const current=sel.value;sel.innerHTML='<option value="">Choose subject</option>';
  subjects.forEach(sub=>{const o=document.createElement("option");o.value=sub.name;o.textContent=sub.name;sel.append(o);});sel.value=current;
  populateRevisionChapters();
}
function populateRevisionChapters() {
  const subject=$("revisionSubject")?.value,sel=$("revisionChapter");if(!sel)return;sel.innerHTML='<option value="">Choose chapter</option>';
  const found=subjects.find(s=>s.name===subject);
  (found?.chapters||[]).forEach(ch=>{const o=document.createElement("option");o.value=ch.name;o.textContent=ch.name;sel.append(o);});
}
$("revisionSubject").addEventListener("change",populateRevisionChapters);
$("revisionForm").addEventListener("submit",e=>{
  e.preventDefault();const subject=$("revisionSubject").value,chapter=$("revisionChapter").value,date=$("revisionDate").value;
  if(!subject||!chapter||!date)return;
  revisions.push({id:Date.now(),subject,chapter,date,done:false});localStorage.setItem("wtRevisions",JSON.stringify(revisions));
  $("revisionForm").reset();populateRevisionSubjects();renderRevisions();addNotice("Revision scheduled",chapter+" ("+subject+") is scheduled for "+formatDate(date)+".");notify("Revision scheduled.");
});
function renderRevisions() {
  const list=$("revisionList");if(!list)return;list.innerHTML="";
  revisions.sort((a,b)=>a.date.localeCompare(b.date));
  $("revisionCount").textContent=revisions.filter(r=>!r.done).length+" pending";
  if(!revisions.length){list.innerHTML='<p class="empty-state">No revision tasks scheduled.</p>';return;}
  revisions.forEach(r=>{
    const row=document.createElement("div");row.className="revision-row"+(r.done?" read":"");
    const check=document.createElement("input");check.type="checkbox";check.checked=r.done;check.addEventListener("change",()=>{r.done=check.checked;localStorage.setItem("wtRevisions",JSON.stringify(revisions));renderRevisions();});
    const info=document.createElement("div");const name=document.createElement("strong");name.textContent=r.chapter;const meta=document.createElement("small");meta.textContent=r.subject+" · "+formatDate(r.date);info.append(name,meta);
    const del=document.createElement("button");del.className="subtle-btn";del.textContent="×";del.addEventListener("click",()=>{revisions=revisions.filter(x=>x.id!==r.id);localStorage.setItem("wtRevisions",JSON.stringify(revisions));renderRevisions();});
    row.append(check,info,del);list.append(row);
  });
}
let timerSeconds=25*60,timerRemaining=timerSeconds,timerInterval=null;
function paintTimer(){const m=String(Math.floor(timerRemaining/60)).padStart(2,"0"),sec=String(timerRemaining%60).padStart(2,"0");$("timerDisplay").textContent=m+":"+sec;}
document.querySelectorAll("[data-minutes]").forEach(btn=>btn.addEventListener("click",()=>{
  clearInterval(timerInterval);timerInterval=null;timerSeconds=Number(btn.dataset.minutes)*60;timerRemaining=timerSeconds;paintTimer();
  document.querySelectorAll(".timer-preset").forEach(b=>b.classList.toggle("active",b===btn));$("timerStatus").textContent="Session ready.";
}));
$("timerStart").addEventListener("click",()=>{
  if(timerInterval)return;$("timerStatus").textContent="Focus session running.";
  timerInterval=setInterval(()=>{timerRemaining--;paintTimer();if(timerRemaining<=0){clearInterval(timerInterval);timerInterval=null;timerRemaining=0;paintTimer();$("timerStatus").textContent="Session complete. Take a short break.";addNotice("Focus session complete","You completed a study timer session.");notify("Focus session complete.");}},1000);
});
$("timerPause").addEventListener("click",()=>{clearInterval(timerInterval);timerInterval=null;$("timerStatus").textContent="Session paused.";});
$("timerReset").addEventListener("click",()=>{clearInterval(timerInterval);timerInterval=null;timerRemaining=timerSeconds;paintTimer();$("timerStatus").textContent="Timer reset.";});
function loadSettings(){
  $("settingsName").value=profile?.name||"";$("settingsClass").value=profile?.studentClass||"10";$("settingsSchool").value=profile?.school||"";
  $("settingsBoard").value=profile?.board||"";$("settingsStream").value=profile?.stream||"";
  $("settingsDaily").checked=profile?.modes?.daily??true;$("settingsExam").checked=profile?.modes?.exam??false;
  $("reminderEnabled").checked=localStorage.getItem("wtReminderEnabled")==="true";$("reminderTime").value=localStorage.getItem("wtReminderTime")||"19:00";
  $("notificationPermission").textContent="Browser permission: "+("Notification" in window?Notification.permission:"not supported in this browser")+". Daily reminders are checked while this app is open.";
}
$("settingsForm").addEventListener("submit",e=>{
  e.preventDefault();const grade=$("settingsClass").value,stream=$("settingsStream").value;
  if(! $("settingsDaily").checked && ! $("settingsExam").checked)return notify("Choose at least one study mode.");
  if(Number(grade)>=11&&!stream)return notify("Choose a stream for Class 11–12.");
  profile={...profile,name:$("settingsName").value.trim(),studentClass:grade,school:$("settingsSchool").value.trim(),board:$("settingsBoard").value.trim(),stream,modes:{daily:$("settingsDaily").checked,exam:$("settingsExam").checked}};
  localStorage.setItem("wtProfile",JSON.stringify(profile));$("welcomeTitle").textContent="Welcome back, "+profile.name+".";$("avatarInitial").textContent=profile.name.charAt(0).toUpperCase();updateModeVisibility();notify("Profile updated.");
});
$("reminderEnabled").addEventListener("change",()=>localStorage.setItem("wtReminderEnabled",String($("reminderEnabled").checked)));
$("reminderTime").addEventListener("change",()=>localStorage.setItem("wtReminderTime",$("reminderTime").value));
$("enableNotifications").addEventListener("click",async()=>{
  if(!("Notification" in window))return notify("Browser notifications are not supported.");
  const permission=await Notification.requestPermission();$("notificationPermission").textContent="Browser permission: "+permission+". Daily reminders are checked while this app is open.";notify("Notification permission: "+permission);
});
function checkDailyReminder(){
  if(localStorage.getItem("wtReminderEnabled")!=="true"||!("Notification" in window)||Notification.permission!=="granted")return;
  const now=new Date(),time=localStorage.getItem("wtReminderTime")||"19:00",today=now.toLocaleDateString("en-CA");
  if(now.toTimeString().slice(0,5)===time&&localStorage.getItem("wtReminderSent")!==today){
    new Notification("Winners Tracker",{body:"Your daily study plan is waiting. Open the app and review today's targets."});
    localStorage.setItem("wtReminderSent",today);addNotice("Daily study reminder","Your daily study plan is waiting.");
  }
}
setInterval(checkDailyReminder,30000);
$("exportData").addEventListener("click",()=>{
  const data={profile,subjects,exams,dailyTasks,revisions,notices,guild:selectedGuild};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download="winners-tracker-backup.json";a.click();URL.revokeObjectURL(url);notify("Backup exported.");
});
$("resetData").addEventListener("click",()=>{
  if(!confirm("This will permanently clear this browser's Winners Tracker data. Export a backup first if needed. Continue?"))return;
  ["wtProfile","subjects","wtExams","wtDailyTasks","wtRevisions","wtNotifications","wtGuild","wtThoughtBag","wtLastThought","wtReminderEnabled","wtReminderTime","wtReminderSent"].forEach(k=>localStorage.removeItem(k));
  location.reload();
});
updateNotificationBadge();

$("themeToggle").addEventListener("click",()=>{
  document.body.classList.toggle("light-mode");
  localStorage.setItem("wtLight",document.body.classList.contains("light-mode"));
});
if(localStorage.getItem("wtLight")==="true") document.body.classList.add("light-mode");
$("loginName").value = profile?.name || "";
$("loginClass").value = profile?.studentClass || "";
$("schoolName").value = profile?.school || "";
$("boardName").value = profile?.board || "";
$("studentPhone").value = profile?.phone || "";
$("studentEmail").value = profile?.email || "";
$("dailyMode").checked = profile?.modes?.daily ?? true;
$("examMode").checked = profile?.modes?.exam ?? false;
$("studentStream").value = profile?.stream || "";
$("streamField").hidden = Number(profile?.studentClass) < 11;
$("targetExamField").hidden = !profile?.modes?.exam;
$("targetExamDate").value = profile?.targetExamDate || "";
if(profile && profile.name && profile.studentClass) showApp();
else showThought("overview");
if ("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
