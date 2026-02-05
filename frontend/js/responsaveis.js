function loadResponsaveis() {
    ativarMenu("responsaveis");
    fetch(API + "/responsaveis", { headers: getHeaders() })
        .then(res => res.json())
        .then(data => {
            let html = `
                <div class="div-header-container">
                    <h2>Responsáveis</h2>
                    <button onclick="formNovoResponsavel()">+ NOVO</button>
                </div>
                <table>
                    <tr>
                        <th style="display: none;">ID</th>
                        <th class="col-acoes"></th>
                        <th>Nome</th>
                        <th>Email</th>
                    </tr>
            `;

            data.forEach(b => {
                html += `
                    <tr>
                        <td style="display: none;">${b.id}</td>
                        <td class="col-acoes">
                            <button onclick="editarResponsavel(${b.id})">Editar</button>
                            <button onclick="excluirResponsavel(${b.id})">Excluir</button>
                        </td>
                        <td>${b.nome}</td>
                        <td>${b.email}</td>
                    </tr>
                `;
            });

            html += "</table>";
            document.getElementById("conteudo").innerHTML = html;
        });
}

function formNovoResponsavel() {
    document.getElementById("conteudo").innerHTML = `
        <h2>Novo Responsavel</h2>

        <input id="nome" placeholder="Nome">
        <input id="email" placeholder="Email">

        <button onclick="salvarResponsavel()">Salvar</button>
    `;
}

function salvarResponsavel() {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;

    fetch(API + "/responsaveis", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ nome, email })
    }).then(() => loadResponsaveis());
}

function editarResponsavel(id) {
    fetch(API + "/responsaveis/" + id, { headers: getHeaders() })
        .then(res => res.json())
        .then(responsavel => {
            document.getElementById("conteudo").innerHTML = `
                <h2>Editar Responsavel</h2>
                <input id="id" type="hidden" value="${responsavel.id}">
                <input id="nome" value="${responsavel.nome}">
                <input id="email" value="${responsavel.email}">
                <button onclick="atualizarResponsavel()">Atualizar</button>
            `;
        });
}

function atualizarResponsavel() {
    const id = document.getElementById("id").value;
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;

    fetch(API + "/responsaveis", {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ id, nome, email })
    }).then(() => loadResponsaveis());
}

function excluirResponsavel(id) {
    fetch(API + "/responsaveis/" + id, {
        method: "DELETE",
        headers: getHeaders()
    }).then(() => loadResponsaveis());
}