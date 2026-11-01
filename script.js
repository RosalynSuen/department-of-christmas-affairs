let finalScore =0;
let applicantName = "";

// 1. Begin Investigation button

const button = document.querySelector("#investigateBtn");

button.addEventListener("click", function() {

    applicantName = document.querySelector("#applicant").value;

    if (applicantName.trim() === "") {
        alert("Please enter your name before proceeding.");
        return;
    }

    alert("Your Christmas conduct is now under investigation!");

    document.querySelector("#assessment").hidden = false;

    button.hidden = true;
    document.querySelector("#applicant").disabled = true;
    document.querySelector('label[for="applicant"]').hidden = true;

});


// 2. Find the HTML elements we need
const questions = document.querySelectorAll(".question-step");

const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const progress = document.getElementById("progress");
const progressFill = document.getElementById("progress-fill");

let currentQuestion = 0;

let isAnimating = false;


// 3. Display the current question
function showQuestion() {

questions.forEach(question => {
    question.classList.remove(
        "active",
        "slide-in",
        "slide-out",
        "slide-in-left",
        "slide-out-right"
    );
});

    const current = questions[currentQuestion];

    current.classList.add("active", "slide-in");

    progress.textContent =
        `QUESTION ${currentQuestion + 1} OF ${questions.length}`;

    progressFill.style.width =
        `${((currentQuestion + 1) / questions.length) * 100}%`;

    backBtn.hidden = currentQuestion === 0;

    nextBtn.textContent =
        currentQuestion === questions.length - 1
        ? "SUBMIT APPLICATION →"
        : "NEXT QUESTION →";
}


// 4. Move between questions
nextBtn.addEventListener("click", function() {
if (isAnimating) return;

    const selected = questions[currentQuestion]
        .querySelector('input[type="radio"]:checked');

    if (!selected) {
        alert("Please provide an answer before proceeding.");
        return;
    }

    if (currentQuestion < questions.length - 1) {

        const current = questions[currentQuestion];

        isAnimating = true;
        current.classList.remove("slide-in", "slide-in-left");
        current.classList.add("slide-out");

        setTimeout(function() {
        currentQuestion++;
        showQuestion();
        isAnimating = false;
        }, 300);

    } else {
        showResult();
    }
});


// Back button: return to the previous question

backBtn.addEventListener("click", function() {

    // Ignore clicks while another animation is running
    if (isAnimating) return;

    if (currentQuestion > 0) {

        // Find the question currently being displayed
        const current = questions[currentQuestion];

        // Tell JavaScript that an animation has started
        isAnimating = true;

        // Animate the current question towards the right
        current.classList.remove("slide-in");
        current.classList.add("slide-out-right");

        // Wait for the animation to finish
        setTimeout(function() {

            // Move back one question
            currentQuestion--;

            // Display the previous question
            showQuestion();

            // Give the previous question its entrance animation
            questions[currentQuestion].classList.remove("slide-in");
            questions[currentQuestion].classList.add("slide-in-left");

            // Allow the user to click again
            isAnimating = false;

        }, 300);
    }
});


// 5. Collect all five answers
function collectAnswers() {

    const answers = [];

    questions.forEach(question => {

        const selected = question.querySelector(
            'input[type="radio"]:checked'
        );

        answers.push(selected.value);
    });

    return answers;
}


// 6. Calculate the total score
function calculateScore(answers) {

    let score = 0;

    answers.forEach(answer => {
        score = score + Number(answer);
    });

    return score;
}


// 7. Decide the official verdict
function getVerdict(score) {

    if (score <= 2) {
        return "MODEL CHRISTMAS CITIZEN";
    }

    else if (score <= 6) {
        return "UNDER MILD SUSPICION";
    }

    else {
        return "CHRISTMAS MENACE";
    }
}


// 8. Decide the penalty
function getPenalty(score) {

    if (score <= 2) {
        return "You are officially permitted to assist Santa.";
    }

    else if (score <= 6) {
    return "Your Christmas privileges are temporarily suspended. You are required to report for departmental reassignment.";
    }

    else {
        return "You are sentenced to 48 hours of compulsory Christmas service";
    }

}

// 9. Save applicant to the Naughty & Nice Register

function saveApplicant(name, score, verdict) {

    // Retrieve the existing register from the browser
    // JSON.parse converts the saved string back into an array
    // If no register exists yet, start with an empty array
    let applicants = JSON.parse(
        localStorage.getItem("christmasApplicants")
    ) || [];


    // Create a new object containing this applicant's details
    const newApplicant = {
        name: name,
        score: score,
        verdict: verdict
    };


    // Add the new applicant to the existing array
    applicants.push(newApplicant);


    // Convert the updated array into a string
    // Save the string in the browser's localStorage
    localStorage.setItem(
        "christmasApplicants",
        JSON.stringify(applicants)
    );
}

// 10. Typewriter effect for the official verdict

// Load the typewriter sound effect
const typingSound = new Audio("typewriter.mp3");

function typeWriter(element, text, speed = 60) {

    // Keep track of which character we are typing
    let i = 0;

    // Clear the existing text
    element.textContent = "";

    // Add the typing animation class
    element.classList.add("typing");

    // Start the typewriter sound
    typingSound.currentTime = 0;
    typingSound.playbackRate = 1.5;
    typingSound.play();

    // This function types one character at a time
    function type() {

        if (i < text.length) {

            // Add the next character
            element.textContent += text.charAt(i);

            // Move to the next character
            i++;

            // Wait before typing the next character
            setTimeout(type, speed);

        } else {

            // Typing is finished: remove animation and stop sound
            element.classList.remove("typing");
            typingSound.pause();
            typingSound.currentTime = 0;

        }
    }

    // Start typing
    type();
}


// 11. Show the final result

function showResult() {

    // Collect the answers selected by the applicant
    const answers = collectAnswers();

    // Calculate the total score
    finalScore = calculateScore(answers);

    // Determine the applicant's verdict
    const verdict = getVerdict(finalScore);

    // Determine the applicant's punishment
    const penalty = getPenalty(finalScore);


    // Save the applicant's details to localStorage
    // This happens for ALL applicants, including model citizens
    saveApplicant(applicantName, finalScore, verdict);


    // Display the verdict using the typewriter effect
    typeWriter(document.querySelector("#verdict"), verdict, 80);


    // Display the penalty after a one-second delay
    setTimeout(function() {

        document.querySelector("#penalty").textContent = penalty;

        // Reveal the buttons after another delay
        setTimeout(function() {
            document.querySelector(".result-buttons").style.opacity = "1";
        }, 1200);

    }, 1000);


    // Hide the introduction and assessment form
    document.querySelector("#intro").hidden = true;
    document.querySelector("#christmas-form").hidden = true;

    // Show the result section
    document.querySelector("#result").hidden = false;


    // Find the official circular stamp
    const stamp = document.getElementById("verdict-stamp");


    // Change the stamp according to the applicant's score
    if (finalScore <= 2) {
        stamp.querySelector(".stamp-main").textContent = "APPROVED";

    } else if (finalScore <= 6) {
        stamp.querySelector(".stamp-main").textContent = "PROVISIONAL";

    } else {
        stamp.querySelector(".stamp-main").textContent = "GUILTY";
    }


    // Find the accept button
    const acceptButton = document.getElementById("accept-button");


   // Change the buttons depending on the verdict
if (finalScore <= 2) {

    // Model citizens can claim their certificate
    acceptButton.textContent = "Claim your official certificate";
    acceptButton.classList.add("reward-button");

    // No appeal needed for a model citizen
    appealButton.hidden = true;
    appealMessage.hidden = true;

} else if (finalScore <= 6) {

    // Mild suspicion
    acceptButton.classList.remove("reward-button");
    acceptButton.textContent = "Accept punishment";

    appealButton.textContent = "Appeal decision";
    appealButton.hidden = false;
    appealMessage.hidden = false;

} else {

    // Christmas menace
    acceptButton.classList.remove("reward-button");
    acceptButton.textContent = "Accept punishment";

    appealButton.textContent = "Request a pardon from Santa";
    appealButton.hidden = false;
    appealMessage.hidden = false;
}
}


// 12. Appeal and result button interactions

// Find the appeal button and its message area
const appealButton = document.getElementById("appeal-button");
const appealMessage = document.getElementById("appeal-message");

// Count how many times someone tries to appeal
let attemptCount = 0;

// Display increasingly frustrated messages
const messages = [
    "Please stop trying.",
    "The appeals department is closed.",
    "Your appeal has been rejected.",
    "Santa has been informed of your behaviour.",
    "STOP. THERE IS NO APPEAL."
];

// Display the first question when the page loads
showQuestion();

appealButton.addEventListener("mouseenter", function() {
    attemptCount++;

    const randomX = Math.random() * 200 - 100;
    const randomY = Math.random() * 100 - 50;

    appealButton.style.transform =
        `translate(${randomX}px, ${randomY}px)`;

    const messageIndex = Math.min(attemptCount - 1, messages.length - 1);

    appealMessage.textContent = messages[messageIndex];
});

document.getElementById("accept-button").addEventListener("click", function() {

    if (finalScore <= 2) {

        // Show the certificate to Model Citizens
        document.querySelector("#certificate-name").textContent = applicantName;

        document.querySelector("#result").hidden = true;
        document.querySelector("#certificate").hidden = false;

        document.querySelector("#certificate .scoreboard-link").hidden = false;
        
    } else {

        // Show the punishment notice to everyone else
        document.querySelector("#result").hidden = true;
        document.querySelector("#punishment").hidden = false;

    }

});

appealButton.addEventListener("click", function() {
    window.location.reload();
});

// 13. North Pole punishment lottery

const punishments = [
    {
        title: "THE WRAPPING DEPARTMENT",
        description: "You must wrap 100 presents using newspaper and one metre of ribbon."
    },
    {
        title: "REINDEER SERVICES",
        description: "You must clean the reindeer stables and apologise personally to every single reindeer. Yes, all of them."
    },
    {
        title: "SANTA'S COMPLAINTS DEPARTMENT",
        description: "You must answer letters from children disappointed with their presents."
    },
    {
        title: "ELF ADMINISTRATION",
        description: "You must count the inventory. Then count it again. One elf will supervise you."
    },
    {
        title: "CHRISTMAS QUALITY CONTROL",
        description: "You must inspect 500 Christmas crackers for questionable jokes."
    },
    {
        title: "NORTH POLE CATERING",
        description: "You must peel potatoes for the elves' Christmas dinner."
    },
    {
        title: "TOY REPAIRS",
        description: "You must repair broken toys using instructions written in an unknown language."
    },
    {
        title: "NAUGHTY LIST INVESTIGATIONS",
        description: "You must investigate 200 suspicious entries and submit a report to Santa."
    }
];

// Find the Report for Duty button
const reportButton = document.getElementById("report-button");

// Find the assignment area
const assignment = document.getElementById("assignment");

reportButton.addEventListener("click", function() {

    // Pick a random punishment
    const randomIndex = Math.floor(
        Math.random() * punishments.length
    );

    const selectedPunishment = punishments[randomIndex];

    // Show the loading state
    reportButton.textContent = "ALLOCATING YOUR ASSIGNMENT...";
    reportButton.classList.add("loading");
    reportButton.disabled = true;

    // Wait one second before revealing the assignment
    setTimeout(function() {

        document.getElementById("assignment-title").textContent =
            selectedPunishment.title;

        document.getElementById("assignment-description").textContent =
            selectedPunishment.description;

        assignment.hidden = false;

        reportButton.hidden = true;

        document.querySelector("#punishment .scoreboard-link").hidden = false;

    }, 1000);

});

//Secret message
const santaImage = document.querySelector(".santa-image");
const secretMessage = document.querySelector("#secret-message");
const secretText = document.querySelector("#secret-text");

const secretMessages = [
    "Santa has denied allegations of eating the mince pies intended for staff.",
    "Rudolph has formally requested a pay rise.",
    "Mrs Claus has confiscated Santa's search history.",
    "The elves have been working on a union agreement.",
    "CLASSIFIED: Santa has a secret admirer. Further investigation is prohibited."
];

let santaClicks = 0;

santaImage.addEventListener("click", function() {
    const messageIndex = santaClicks % secretMessages.length;

    secretText.textContent = secretMessages[messageIndex];
    secretMessage.hidden = false;

    santaClicks++;
});