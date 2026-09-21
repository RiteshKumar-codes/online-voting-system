const API_URL =  "https://online-voting-system-vb11.onrender.com"

//Register
const registerFrm = document.getElementById("registerForm");

if(registerFrm){
    registerFrm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const message = document.getElementById("message");

        try{
            const response = await fetch(`${API_URL}/auth/register`, 
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if(!response.ok){
                message.textContent = data.message || "Registration Failed"
                return;
            }

            message.textContent = "Registration successful! Redirecting to login...";

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);

        } catch(error){
            console.log(error);

            message.textContent = "Unable to connect to server";
        }
    });
}

// Login
const loginForm = document.getElementById("loginForm");

if(loginForm){

     loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const message =
            document.getElementById("message");


        try {

            const response = await fetch(
                `${API_URL}/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                message.textContent =
                    data.message || "Login failed";

                return;
            }

            // save jwt
            localStorage.setItem(
                "token",
                data.token
            );

            //save user information
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

              message.textContent =
                "Login successful!";


            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 500);


        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to connect to server";
        }

    });
}