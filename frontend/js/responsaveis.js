function loadResponsaveis(pagina = 1) {
    ativarMenu("responsaveis");

    fetch(API + "/responsaveis", { headers: getHeaders() })
        .then(res => res.json())
        .then(data => {

            const itensPorPagina = 10;
            const totalPaginas = Math.ceil(data.length / itensPorPagina);
            const inicio = (pagina - 1) * itensPorPagina;
            const fim = inicio + itensPorPagina;
            const dadosPaginados = data.slice(inicio, fim);

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

            dadosPaginados.forEach(b => {
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

            // Paginação
            html += `<div class="paginacao">`;

            for (let i = 1; i <= totalPaginas; i++) {
                html += `
                    <button 
                        onclick="loadResponsaveis(${i})" 
                        class="${i === pagina ? "active-page" : ""}">
                        ${i}
                    </button>
                `;
            }

            html += `</div>`;

            document.getElementById("conteudo").innerHTML = html;
        });
}

function formNovoResponsavel() {
    document.getElementById("conteudo").innerHTML = `
        <h2>Novo Responsável</h2>

        <div class="form-card">
            <div class="form-grid">

                <div class="form-group">
                    <label>Nome</label>
                    <input id="nome">
                </div>

                <div class="form-group">
                    <label>Email</label>
                    <input id="email" type="email">
                </div>

            </div>

            <div class="form-actions">
                <button onclick="loadResponsaveis()" style="background: var(--muted);">
                    Cancelar
                </button>
                <button onclick="salvarResponsavel()">
                    Salvar
                </button>
            </div>
        </div>
    `;
}

function salvarResponsavel() {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;

    if (!nome || !email) {
        Swal.fire("Erro", "Todos os campos são obrigatórios", "error");
        return;
    }

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
    <h2>Editar Responsável</h2>

    <div class="form-card">
        <input id="id" type="hidden" value="${responsavel.id}">

        <div class="form-grid">

            <div class="form-group">
                <label>Nome</label>
                <input id="nome" value="${responsavel.nome}">
            </div>

            <div class="form-group">
                <label>Email</label>
                <input id="email" type="email" value="${responsavel.email}">
            </div>

        </div>

        <div class="form-actions">
            <button onclick="loadResponsaveis()" style="background: var(--muted);">
                Cancelar
            </button>
            <button onclick="atualizarResponsavel()">
                Atualizar
            </button>
        </div>
    </div>
`;
        });
}

function atualizarResponsavel() {
    const id = document.getElementById("id").value;
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;

    if (!nome || !email) {
        Swal.fire("Erro", "Todos os campos são obrigatórios", "error");
        return;
    }

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