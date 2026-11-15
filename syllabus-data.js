/* Winners Tracker syllabus catalogue.
   Only entries with an official source and checked chapter/topic data are auto-loaded.
   Expand this catalogue board-by-board; never infer a board's chapters from another board. */
window.WT_SYLLABUS = {
  session: "2026-27",
  sources: {
    CBSE: { label: "CBSE Academic Curriculum 2026-27", url: "https://cbseacademic.nic.in/curriculum_2027.html" },
    CISCE_ICSE: { label: "CISCE ICSE Regulations & Syllabuses 2027", url: "https://cisce.org/icse-regulations-and-syllabuses-2027/" },
    CISCE_ISC: { label: "CISCE ISC Regulations & Syllabuses 2027", url: "https://www.cisce.org/wp-content/uploads/2025/02/1.-ISC-Regulations.pdf" },
    UPMSP: { label: "UPMSP official syllabus portal", url: "https://upmsp.edu.in/Board_Syllabus.aspx" }
  },
  data: {
    "CBSE": {
      "10": {
        session: "2026-27",
        level: "partial",
        source: "CBSE",
        subjects: [
          { id:"cbse10-maths", name:"Mathematics", chapters:[
            "Real Numbers","Polynomials","Pair of Linear Equations in Two Variables","Quadratic Equations","Arithmetic Progressions",
            "Coordinate Geometry","Triangles","Circles","Introduction to Trigonometry","Trigonometric Identities","Heights and Distances",
            "Areas Related to Circles","Surface Areas and Volumes","Statistics","Probability"
          ]},
          { id:"cbse10-science", name:"Science", chapters:[
            "Chemical Reactions and Equations","Periodic Classification of Elements (Formative)","Acids, Bases and Salts",
            "Metals and Non-metals","Carbon and its Compounds","Life Processes","Control and Coordination","Reproduction",
            "Heredity and Evolution (Formative)","Light: Reflection and Refraction","The Human Eye and the Colourful World",
            "Electricity","Magnetic Effects of Electric Current","Our Environment"
          ]},
          { id:"cbse10-english", name:"English Language and Literature", chapters:[
            "Reading Comprehension","Writing Skills and Grammar","First Flight - Prose and Poetry","Footprints Without Feet"
          ]}
        ],
        note:"Verified from CBSE's 2026-27 Class X curriculum PDFs. This starter set is partial: school language choice, Social Science and optional subjects still need to be matched to the student's exact subject combination."
      }
    }
  }
};