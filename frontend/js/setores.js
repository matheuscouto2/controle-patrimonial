function loadSetores() {
    ativarMenu("setores");
    fetch(API + "/setores", { headers: getHeaders() })
        .then(res => res.json())
        .then(data => {
            let html = `
                <div class="div-header-container">
                    <h2>Setores</h2>
                    <button onclick="formNovoSetor()">+ NOVO</button>
                </div>
                <table>
                    <tr>
                        <th style="display: none;">ID</th>
                        <th class="col-acoes"></th>
                        <th>Nome</th>
                        <th>Descrição</th>
                    </tr>
            `;

            data.forEach(b => {
                html += `
                    <tr>
                        <td style="display: none;">${b.id}</td>
                        <td class="col-acoes">
                            <button onclick="editarSetor(${b.id})">Editar</button>
                            <button onclick="excluirSetor(${b.id})">Excluir</button>
                        </td>
                        <td>${b.nome}</td>
                        <td>${b.descricao}</td>
                    </tr>
                `;
            });

            html += "</table>";
            document.getElementById("conteudo").innerHTML = html;
        });
}

function formNovoSetor() {
    document.getElementById("conteudo").innerHTML = `
        <h2>Novo Setor</h2>

        <input id="nome" placeholder="Nome">
        <input id="descricao" placeholder="Descrição">

        <button onclick="salvarSetor()">Salvar</button>
    `;
}

function salvarSetor() {
    const nome = document.getElementById("nome").value;
    const descricao = document.getElementById("descricao").value;

    fetch(API + "/setores", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ nome, descricao })
    }).then(() => loadSetores());
}

function editarSetor(id) {
    fetch(API + "/setores/" + id, { headers: getHeaders() })
        .then(res => res.json())
        .then(setor => {
            document.getElementById("conteudo").innerHTML = `
                <h2>Editar Setor</h2>
                <input id="id" type="hidden" value="${setor.id}">
                <input id="nome" value="${setor.nome}">
                <input id="descricao" value="${setor.descricao}">
                <button onclick="atualizarSetor()">Atualizar</button>
            `;
        });
}

function atualizarSetor() {
    const id = document.getElementById("id").value;
    const nome = document.getElementById("nome").value;
    const descricao = document.getElementById("descricao").value;

    fetch(API + "/setores", {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ id, nome, descricao })
    }).then(() => loadSetores());
}

function excluirSetor(id) {
    fetch(API + "/setores/" + id, {
        method: "DELETE",
        headers: getHeaders()
    }).then(() => loadSetores());
}