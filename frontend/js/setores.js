function loadSetores(pagina = 1) {
    ativarMenu("setores");

    fetch(API + "/setores", { headers: getHeaders() })
        .then(res => res.json())
        .then(data => {

            const itensPorPagina = 5;
            const totalPaginas = Math.ceil(data.length / itensPorPagina);
            const inicio = (pagina - 1) * itensPorPagina;
            const fim = inicio + itensPorPagina;
            const dadosPaginados = data.slice(inicio, fim);

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

            dadosPaginados.forEach(b => {
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

            // Paginação
            html += `<div class="paginacao">`;

            for (let i = 1; i <= totalPaginas; i++) {
                html += `
                    <button 
                        onclick="loadSetores(${i})" 
                        class="${i === pagina ? "active-page" : ""}">
                        ${i}
                    </button>
                `;
            }

            html += `</div>`;

            document.getElementById("conteudo").innerHTML = html;
        });
}

function formNovoSetor() {
    document.getElementById("conteudo").innerHTML = `
        <h2>Novo Setor</h2>

        <div class="form-card">
            <div class="form-grid">

                <div class="form-group">
                    <label>Nome</label>
                    <input id="nome">
                </div>

                <div class="form-group">
                    <label>Descrição</label>
                    <input id="descricao">
                </div>

            </div>

            <div class="form-actions">
                <button onclick="loadSetores()" style="background: var(--muted);">
                    Cancelar
                </button>
                <button onclick="salvarSetor()">
                    Salvar
                </button>
            </div>
        </div>
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

                <div class="form-card">
                    <input id="id" type="hidden" value="${setor.id}">

                    <div class="form-grid">

                        <div class="form-group">
                            <label>Nome</label>
                            <input id="nome" value="${setor.nome}">
                        </div>

                        <div class="form-group">
                            <label>Descrição</label>
                            <input id="descricao" value="${setor.descricao}">
                        </div>

                    </div>

                    <div class="form-actions">
                        <button onclick="loadSetores()" style="background: var(--muted);">
                            Cancelar
                        </button>
                        <button onclick="atualizarSetor()">
                            Atualizar
                        </button>
                    </div>
                </div>
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