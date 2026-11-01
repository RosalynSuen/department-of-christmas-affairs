
async function loadApplicants() {

    // 1. Find the containers in register.html
    const registerList = document.getElementById("register-list");
    const wantedStamp = document.getElementById("wanted-stamp");
    const emptyRegister = document.getElementById("empty-register");

    // 2. Retrieve applicants from the shared Supabase database
    const { data: applicants, error } = await supabaseClient
        .from("applicants")
        .select("id, name, score, verdict, created_at")
        .order("score", { ascending: false });

    // 3. Check whether the database request worked
    if (error) {
        console.error("Could not retrieve applicants:", error);
        emptyRegister.hidden = false;
        emptyRegister.textContent =
            "The official register is temporarily unavailable. Please try again later.";
        return;
    }

    // 4. Show a message if nobody has completed the assessment
    if (applicants.length === 0) {
        emptyRegister.hidden = false;
        return;
    }

    // 5. Show the Wanted stamp if anyone scores 10
    const highestScore = Math.max(
        ...applicants.map(applicant => Number(applicant.score))
    );

    wantedStamp.hidden = highestScore !== 10;

    // 6. Create a table
    const table = document.createElement("table");

    // 7. Create the table headings
    const header = document.createElement("tr");

    const headings = ["Rank", "Applicant", "Score", "Verdict"];

    headings.forEach(function(heading) {
        const th = document.createElement("th");
        th.textContent = heading;
        header.appendChild(th);
    });

    table.appendChild(header);

    // 8. Add each applicant to the table
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

    // 9. Display the completed table
    registerList.appendChild(table);
}

// Run the function when the page loads
loadApplicants();
