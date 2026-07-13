async function logout() {

    const response = await fetch("/api/auth/logout");

    const data = await response.json();

    if (data.success) {

        window.location.href = "/login.html";

    }

}