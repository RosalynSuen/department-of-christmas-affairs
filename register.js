
// 1. Retrieve the saved applicants
const applicants = JSON.parse(
    localStorage.getItem("christmasApplicants")
) || [];

// 2. Find the containers in register.html
const registerList = document.getElementById("register-list");
const wantedStamp = document.getElementById("wanted-stamp");

const emptyRegister = document.getElementById("empty-register");

// Show a message if nobody has completed the assessment
if (applicants.length === 0) {
    emptyRegister.hidden = false;
}

// 3. Show the wanted stamp if anyone scores 10
if (applicants.length > 0) {
    const highestScore = Math.max(
        ...applicants.map(applicant => Number(applicant.score))
    );

    wantedStamp.hidden = highestScore !== 10;
}

// 4. Sort applicants by score, highest first
applicants.sort(function(a, b) {
    return b.score - a.score;
});

// 5. Create a table
const table = document.createElement("table")

// 6. Create the table headings
const header = document.createElement("tr");

const headings = ["Rank", "Applicant", "Score", "Verdict"];

headings.forEach(function(heading) {
    const th = document.createElement("th");
    th.textContent = heading;
    header.appendChild(th);
});

table.appendChild(header);

// 7. Add each applicant to the table
applicants.forEach(function(applicant, index) {
    const row = document.createElement("tr");

    const rank = document.createElement("td");
    rank.textContent = index + 1;

    const name = document.createElement("td");
    name.textContent = applicant.name;

    const score = document.createElement("td");
    score.textContent = applicant.score + " / 10";

    const verdict = document.createElement("td");
    verdict.textContent = applicant.verdict;

    // Add colour according to the applicant's verdict
    if (applicant.verdict === "MODEL CHRISTMAS CITIZEN") {
        verdict.classList.add("rank-citizen");
    } else if (applicant.verdict === "UNDER MILD SUSPICION") {
        verdict.classList.add("rank-suspicion");
    } else {
        verdict.classList.add("rank-menace");
    }

    row.appendChild(rank);
    row.appendChild(name);
    row.appendChild(score);
    row.appendChild(verdict);

    table.appendChild(row);
});

// 8. Display the completed table
registerList.appendChild(table);

if (applicants.length === 0) {
    // Don't create an empty table
    table.hidden = true;
}