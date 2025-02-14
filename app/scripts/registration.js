import "./../scss/registration.scss";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");
  if (form) {
    form.addEventListener("submit", handleSubmit, { once: true }); // Ensures it runs only once
  }
});

async function handleSubmit(e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const userData = {
    username,
    email,
    password,
  };

  console.log("Sending data:", userData); // Debugging log

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      alert("User registered successfully!");
      document.getElementById("registrationForm").reset(); // ✅ Fix
    } else {
      const error = await response.json();
      alert(error.message);
    }
  } catch (error) {
    console.error(error);
  }
}
