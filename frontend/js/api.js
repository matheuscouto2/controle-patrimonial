const API = "https://controle-patrimonial-cr56.onrender.com";

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