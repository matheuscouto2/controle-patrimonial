const API = "http://localhost:8080";

function getHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
    };
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}