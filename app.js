const $ = id => document.getElementById(id);

let subjects = JSON.parse(localStorage.getItem("subjects") || "[]");

function save() {
  localStorage.setItem("subjects", JSON.stringify(subjects));
  render();
}

function render() {
  const container = $("subjects");
  container.innerHTML = "";

  let total = 0, completed = 0;

  subjects.forEach((subject, index) => {
    const div = document.createElement("div");
    div.className = "subject";

    const heading = document.createElement("h3");
    heading.textContent = subject.name;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Subject";
    deleteButton.onclick = () => {
      subjects.splice(index, 1);
      save();
    };

    div.append(heading, deleteButton);

    subject.chapters.forEach((chapter, chapterIndex) => {
      total++;
      if (chapter.done) completed++;

      const label = document.createElement("label");
      label.className = "chapter";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = chapter.done;
      checkbox.onchange = () => {
        chapter.done = checkbox.checked;
        save();
      };

      label.append(checkbox, document.createTextNode(chapter.name));
      div.append(label, document.createElement("br"));
    });

    const chapterInput = document.createElement("input");
    chapterInput.placeholder = "Chapter name";

    const addChapter = document.createElement("button");
    addChapter.textContent = "Add Chapter";
    addChapter.onclick = () => {
      const name = chapterInput.value.trim();
      if (!name) return;
      subject.chapters.push({name, done: false});
      save();
    };

    div.append(chapterInput, addChapter);
    container.append(div);
  });

  const percent = total ? Math.round(completed / total * 100) : 0;
  $("overallProgress").value = percent;
  $("progressText").textContent = percent + "%";
}

$("addSubject").onclick = () => {
  const name = $("subjectName").value.trim();
  if (!name) return;

  subjects.push({name, chapters: []});
  $("subjectName").value = "";
  save();
};

$("saveProfile").onclick = () => {
  ["studentName", "studentClass", "studentBoard", "academicYear"].forEach(id => {
    localStorage.setItem(id, $(id).value);
  });
  alert("Profile saved!");
};

["studentName", "studentClass", "studentBoard", "academicYear"].forEach(id => {
  $(id).value = localStorage.getItem(id) || "";
});

$("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("dark", document.body.classList.contains("dark"));
};

if (localStorage.getItem("dark") === "true") {
  document.body.classList.add("dark");
}

render();
