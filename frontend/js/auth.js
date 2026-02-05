function login() {
    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    fetch("http://localhost:8080/auth", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ usuario, senha })
    })
        .then(res => {
            if (!res.ok) throw new Error("Login inválido");
            return res.json();
        })
        .then(data => {
            localStorage.setItem("token", data.token || "logado");
            window.location.href = "dashboard.html";
        })
        .catch(err => {
            document.getElementById("msg").innerText = err.message;
        });
}