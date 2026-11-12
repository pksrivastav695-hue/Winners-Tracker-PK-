const $ = id => document.getElementById(id);
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
let subjects = read("subjects", []);
let exams = read("wtExams", []);
let profile = read("wtProfile", null);
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
  renderSubjects();
  renderExams();
  updateDashboard();
}
function showPage(page) {
  document.querySelectorAll(".page").forEach(el => el.classList.add("hidden"));
  $(page + "Page").classList.remove("hidden");
  document.querySelectorAll(".nav-link").forEach(btn => btn.classList.toggle("active", btn.dataset.page === page));
  const titles = {overview:"Overview", syllabus:"Syllabus Tracker", exams:"Exam Datesheet"};
  const subtitles = {overview:"YOUR PROGRESS, YOUR PACE", syllabus:"BUILD YOUR PLAN", exams:"PLAN AHEAD"};
  $("pageTitle").textContent = titles[page];
  $("pageEyebrow").textContent = subtitles[page];
}
document.querySelectorAll(".nav-link").forEach(btn => btn.addEventListener("click", () => showPage(btn.dataset.page)));
document.querySelectorAll("[data-go]").forEach(btn => btn.addEventListener("click", () => showPage(btn.dataset.go)));

$("loginForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = $("loginName").value.trim();
  const studentClass = $("loginClass").value.trim();
  if (!name || !studentClass) return;
  profile = {name, studentClass};
  localStorage.setItem("wtProfile", JSON.stringify(profile));
  showApp();
});
$("logoutBtn").addEventListener("click", () => {
  $("loginScreen").classList.remove("hidden");
  $("appShell").classList.add("hidden");
  $("loginName").value = profile?.name || "";
  $("loginClass").value = profile?.studentClass || "";
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
  renderExams(); updateDashboard(); notify("Exam added to your datesheet.");
});
function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN",{day:"numeric",month:"short",year:"numeric"}).format(new Date(date+"T00:00:00"));
}
function renderExams() {
  const list = $("examList");
  list.innerHTML = "";
  $("examCount").textContent = exams.length + (exams.length === 1 ? " exam" : " exams");
  const today = new Date().toISOString().slice(0,10);
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
function updateDashboard() {
  const total = subjects.reduce((sum,s)=>sum+s.chapters.length,0);
  const done = subjects.reduce((sum,s)=>sum+s.chapters.filter(c=>c.done).length,0);
  const percent = total ? Math.round(done/total*100) : 0;
  const today = new Date().toISOString().slice(0,10);
  const upcoming = exams.filter(e=>e.date>=today).sort((a,b)=>a.date.localeCompare(b.date));
  $("completedStat").textContent = done;
  $("chapterTotal").textContent = "of " + total + " chapters";
  $("progressStat").textContent = percent + "%";
  $("progressBar").style.width = percent + "%";
  $("examStat").textContent = upcoming.length;
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
$("themeToggle").addEventListener("click",()=>{
  document.body.classList.toggle("light-mode");
  localStorage.setItem("wtLight",document.body.classList.contains("light-mode"));
});
if(localStorage.getItem("wtLight")==="true") document.body.classList.add("light-mode");
$("loginName").value = profile?.name || "";
$("loginClass").value = profile?.studentClass || "";
if(profile && profile.name && profile.studentClass) showApp();
if ("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
