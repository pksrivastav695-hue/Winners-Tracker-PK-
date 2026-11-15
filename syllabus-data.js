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
    "State Board": {
      "Uttar Pradesh": {
        "10": { session:"2026-27", level:"partial", source:"UPMSP", subjects:[
          { id:"upmsp10-maths", name:"Mathematics", chapters:["Real Numbers","Polynomials","Pair of Linear Equations in Two Variables","Quadratic Equations","Arithmetic Progressions","Coordinate Geometry","Triangles","Circles","Introduction to Trigonometry","Trigonometric Identities","Heights and Distances","Areas Related to Circles","Surface Areas and Volumes","Statistics","Probability"] },
          { id:"upmsp10-social-science", name:"Social Science", chapters:["The Rise of Nationalism in Europe","Nationalism in India","The Making of a Global World","The Age of Industrialisation","Print Culture and the Modern World","Resources and Development","Forest and Wildlife Resources","Water Resources","Agriculture","Minerals and Energy Resources","Manufacturing Industries","Lifelines of National Economy","Power Sharing","Federalism","Gender, Religion and Caste","Political Parties","Outcomes of Democracy","Development","Sectors of the Indian Economy","Money and Credit","Globalisation and the Indian Economy","Consumer Rights"] }
          { id:"upmsp10-english", name:"English", chapters:[
            "First Flight: A Letter to God","First Flight: Nelson Mandela - Long Walk to Freedom","First Flight: Two Stories about Flying","First Flight: From the Diary of Anne Frank","First Flight: Glimpses of India","First Flight: Mijbil the Otter","First Flight: Madam Rides the Bus","First Flight: The Sermon at Benares","First Flight: The Proposal",
            "Poem: Dust of Snow","Poem: Fire and Ice","Poem: A Tiger in the Zoo","Poem: How to Tell Wild Animals","Poem: The Ball Poem","Poem: Amanda!","Poem: The Trees","Poem: Fog","Poem: The Tale of Custard the Dragon","Poem: For Anne Gregory",
            "Footprints Without Feet: A Triumph of Surgery","Footprints Without Feet: The Thief's Story","Footprints Without Feet: The Midnight Visitor","Footprints Without Feet: A Question of Trust","Footprints Without Feet: Footprints Without Feet","Footprints Without Feet: The Making of a Scientist","Footprints Without Feet: The Necklace","Footprints Without Feet: Bholi","Footprints Without Feet: The Book That Saved the Earth"
          ]},
        ], note:"Official UPMSP Class 10 Mathematics and English syllabus for academic session 2026-27. Social Science is also included; other subjects remain to be imported." }
      }
    },
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
            "First Flight: A Letter to God","First Flight: Nelson Mandela - Long Walk to Freedom","First Flight: Two Stories about Flying","First Flight: From the Diary of Anne Frank","First Flight: Glimpses of India","First Flight: Mijbil the Otter","First Flight: Madam Rides the Bus","First Flight: The Sermon at Benares","First Flight: The Proposal",
            "Poem: Dust of Snow","Poem: Fire and Ice","Poem: A Tiger in the Zoo","Poem: How to Tell Wild Animals","Poem: The Ball Poem","Poem: Amanda!","Poem: The Trees","Poem: Fog","Poem: The Tale of Custard the Dragon","Poem: For Anne Gregory",
            "Footprints Without Feet: A Triumph of Surgery","Footprints Without Feet: The Thief's Story","Footprints Without Feet: The Midnight Visitor","Footprints Without Feet: A Question of Trust","Footprints Without Feet: Footprints Without Feet","Footprints Without Feet: The Making of a Scientist","Footprints Without Feet: The Necklace","Footprints Without Feet: Bholi","Footprints Without Feet: The Book That Saved the Earth",
            "Reading Comprehension","Writing Skills and Grammar"
          ]},
          { id:"cbse10-social-science", name:"Social Science", chapters:[
            "History: The Rise of Nationalism in Europe","History: Nationalism in India","History: The Making of a Global World","History: The Age of Industrialisation (Periodic Assessment)","History: Print Culture and the Modern World",
            "Geography: Resources and Development","Geography: Forest and Wildlife Resources","Geography: Water Resources","Geography: Agriculture","Geography: Minerals and Energy Resources","Geography: Manufacturing Industries","Geography: Lifelines of National Economy (Map Work)",
            "Political Science: Power-sharing","Political Science: Federalism","Political Science: Gender, Religion and Caste","Political Science: Political Parties","Political Science: Outcomes of Democracy",
            "Economics: Development","Economics: Sectors of the Indian Economy","Economics: Money and Credit","Economics: Globalisation and the Indian Economy","Economics: Consumer Rights (Project Work)"
          ]},
          { id:"cbse10-hindi-b", name:"Hindi Course-B", chapters:[
            "गद्य: बड़े भाई साहब","गद्य: डायरी का एक पन्ना","गद्य: तताँरा-वामीरो कथा","गद्य: तीसरी कसम के शिल्पकार शैलेन्द्र","गद्य: अब कहाँ दूसरे के दुख से दुखी होने वाले","गद्य: पतझर में टूटी पत्तियाँ","गद्य: कारतूस",
            "काव्य: साखी","काव्य: पद","काव्य: मनुष्यता","काव्य: पर्वत प्रदेश में पावस","काव्य: तोप","काव्य: कर चले हम फ़िदा","काव्य: आत्मत्राण",
            "संचयन: हरिहर काका","संचयन: सपनों के-से दिन","संचयन: टोपी शुक्ला",
            "व्याकरण: पदबंध","व्याकरण: रचना के आधार पर वाक्य रूपांतरण","व्याकरण: समास","व्याकरण: मुहावरे",
            "लेखन: अनुच्छेद","लेखन: औपचारिक पत्र","लेखन: सूचना","लेखन: विज्ञापन","लेखन: ई-मेल / लघुकथा"
          ]},
          { id:"cbse10-it402", name:"Information Technology (402)", chapters:[
            "Employability Skills: Communication Skills-II","Employability Skills: Self-Management Skills-II","Employability Skills: ICT Skills-II","Employability Skills: Entrepreneurial Skills-II","Employability Skills: Green Skills-II",
            "Digital Documentation: Introduction to Styles","Digital Documentation: Working with Images","Digital Documentation: Advanced Features of Writer",
            "Electronic Spreadsheet: Analyse Data Using Scenarios and Goal Seek","Electronic Spreadsheet: Using Macros in Spreadsheet","Electronic Spreadsheet: Linking Spreadsheet Data","Electronic Spreadsheet: Share and Review a Spreadsheet",
            "Database Management System: Introduction to Database Management System","Database Management System: Creating and Using Tables","Database Management System: Working with Queries","Database Management System: Forms and Reports",
            "Web Applications and Security: Maintain Healthy, Safe and Secure Working Environment"
          ]}
        ],
        note:"Verified from CBSE's 2026-27 Class X curriculum PDFs for Mathematics, Science, Social Science, English, Hindi Course-B and Information Technology (402). The catalogue is still partial for language alternatives and other optional subjects."
      }
    }
  }
};