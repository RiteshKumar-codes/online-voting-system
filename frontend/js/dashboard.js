const API_URL = "http://localhost:5000/api";


// Get token
const token = localStorage.getItem("token");


// Protect dashboard
if (!token) {

    window.location.href = "login.html";
}


// Get user
const user = JSON.parse(
    localStorage.getItem("user")
);


// Show welcome message
const welcome =
    document.getElementById("welcome");


if (user) {

    welcome.textContent =
        `Welcome, ${user.name}`;
}


// Logout
const logoutBtn =
    document.getElementById("logoutBtn");


logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "login.html";
});


// Load elections
async function loadElections() {

    try {

        const response = await fetch(
            `${API_URL}/elections`,
            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            console.error(data.message);

            return;
        }


        const electionsContainer =
            document.getElementById("elections");


        electionsContainer.innerHTML = "";


        data.elections.forEach((election) => {

            const div =
                document.createElement("div");

            div.innerHTML = `
                <h3>${election.title}</h3>

                <p>
                    ${election.description || ""}
                </p>

                <p>
                    Status:
                    ${election.status}
                </p>

                <hr>
            `;

            electionsContainer.appendChild(div);

        });


    } catch (error) {

        console.error(
            "Error loading elections:",
            error
        );
    }
}


loadElections();