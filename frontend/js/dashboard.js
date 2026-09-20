const API_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");

const welcome = document.getElementById("welcome");
const logoutBtn = document.getElementById("logoutBtn");

const electionsContainer = document.getElementById("elections");
const electionMessage = document.getElementById("electionMessage");

const candidateSection = document.getElementById("candidateSection");
const candidateHeading = document.getElementById("candidateHeading");
const candidateMessage = document.getElementById("candidateMessage");
const candidatesContainer = document.getElementById("candidates");

// Check authentication
if (!token) {
    window.location.href = "login.html";
}

// Show user information
const user = JSON.parse(localStorage.getItem("user") || "null");

if (user && welcome) {
    welcome.textContent = `Welcome, ${user.name}!`;
}

// Logout
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";
});

// Common function for authenticated API requests
async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || `Request failed: ${response.status}`);
    }

    return data;
}

// Load elections
async function loadElections() {
    electionsContainer.replaceChildren();
    electionMessage.textContent = "Loading elections...";

    try {
        const data = await apiRequest(`${API_URL}/elections`);

        // Supports either an array or { elections: [...] }
        const elections = Array.isArray(data)
            ? data
            : data.elections;

        if (!Array.isArray(elections) || elections.length === 0) {
            electionMessage.textContent = "No elections are available.";
            return;
        }

        electionMessage.textContent = "";

        elections.forEach((election) => {
            const card = document.createElement("article");
            card.className = "election-card";

            const title = document.createElement("h3");
            title.textContent = election.title;

            const description = document.createElement("p");
            description.textContent =
                election.description || "No description provided.";

            const status = document.createElement("span");
            status.className = `status status-${election.status}`;
            status.textContent = election.status;

            const viewButton = document.createElement("button");
            viewButton.textContent = "View Candidates";

            viewButton.addEventListener("click", () => {
                loadCandidates(election);
            });

            card.append(title, description, status, viewButton);
            electionsContainer.appendChild(card);
        });
    } catch (error) {
        electionMessage.textContent = error.message;

        if (error.message.includes("401")) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "login.html";
        }
    }
}

// Load candidates for selected election
async function loadCandidates(election) {
    candidateSection.hidden = false;
    candidateHeading.textContent =
        `Candidates — ${election.title}`;

    candidatesContainer.replaceChildren();
    candidateMessage.textContent = "Loading candidates...";

    candidateSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    try {
        const data = await apiRequest(
            `${API_URL}/candidates/election/${election.id}`
        );

        // Supports either an array or { candidates: [...] }
        const candidates = Array.isArray(data)
            ? data
            : data.candidates;

        if (!Array.isArray(candidates) || candidates.length === 0) {
            candidateMessage.textContent =
                "No candidates have been added to this election.";
            return;
        }

        candidateMessage.textContent = "";

        candidates.forEach((candidate) => {
            const card = document.createElement("article");
            card.className = "candidate-card";

            const name = document.createElement("h3");
            name.textContent = candidate.name;

            const description = document.createElement("p");
            description.textContent =
                candidate.description || "No description provided.";

            const selectButton = document.createElement("button");
            selectButton.textContent = "Select Candidate";

            selectButton.addEventListener("click", () => {
                selectCandidate(
                    election,
                    candidate,
                    card,
                    selectButton
                );
            });

            card.append(name, description, selectButton);
            candidatesContainer.appendChild(card);
        });
    } catch (error) {
        candidateMessage.textContent = error.message;
    }
}

// Day 11: select a candidate locally.
// Actual vote submission will be implemented on Day 12.
function selectCandidate(election, candidate, selectedCard, button) {
    candidatesContainer
        .querySelectorAll(".candidate-card")
        .forEach((card) => {
            card.classList.remove("selected");
            const cardButton = card.querySelector("button");
            if (cardButton) {
                cardButton.textContent = "Select Candidate";
            }
        });

    selectedCard.classList.add("selected");
    button.textContent = "Selected";

    candidateMessage.textContent =
        `You selected ${candidate.name} for ${election.title}. ` +
        "Your vote has NOT been submitted yet.";
}

// Start
loadElections();