function loadBens(pagina = 1) {
    ativarMenu("bens");

    fetch(API + "/bens", { headers: getHeaders() })
        .then(res => res.json())
        .then(data => {

            const itensPorPagina = 10;
            const totalPaginas = Math.ceil(data.length / itensPorPagina);
            const inicio = (pagina - 1) * itensPorPagina;
            const fim = inicio + itensPorPagina;
            const dadosPaginados = data.slice(inicio, fim);

            let html = `
                <div class="div-header-container">
                    <h2>Bens</h2>
                    <button onclick="formNovoBem()">+ NOVO</button>
                </div>

                <table>
                    <tr>
                        <th style="display:none;">ID</th>
                        <th class="col-acoes"></th>
                        <th>Nome</th>
                        <th>Tombo</th>
                        <th>Aquisição</th>
                        <th>Valor</th>
                        <th>Responsável</th>
                        <th>Setor</th>
                        <th></th>
                    </tr>
            `;

            dadosPaginados.forEach(b => {
                html += `
                    <tr>
                        <td style="display:none;">${b.id}</td>
                        <td class="col-acoes">
                            <button onclick="editarBem(${b.id})" ${b.status !== "ATIVO" ? "disabled" : ""}>Editar</button>
                            <button onclick="excluirBem(${b.id})">Excluir</button>
                            <button 
                                onclick="manutencaoBem(${b.id}, '${b.status}')" 
                                ${b.status === "BAIXADO" ? "disabled" : ""}>
                                ${b.status === "EM_MANUTENCAO" ? "Finalizar" : "Manutenção"}
                            </button>
                            <button onclick="baixarBem(${b.id})" ${b.status !== "ATIVO" ? "disabled" : ""}>Baixar</button>
                        </td>
                        <td>${b.nome}</td>
                        <td>${b.tombo}</td>
                        <td>${formatarData(b.aquisicao)}</td>
                        <td>${formatarMoeda(b.valor)}</td>
                        <td>${b.responsavelNome}</td>
                        <td>${b.setorNome}</td>
                        <td style="width: 0px;">
                            <span class="status ${b.status}">
                                ${b.status === "EM_MANUTENCAO" ? "MANUTENÇÃO" : b.status}
                            </span>
                        </td>
                    </tr>
                `;
            });

            html += "</table>";

            // Paginação
            html += `<div class="paginacao">`;

            for (let i = 1; i <= totalPaginas; i++) {
                html += `
                    <button 
                        onclick="loadBens(${i})" 
                        class="${i === pagina ? "active-page" : ""}">
                        ${i}
                    </button>
                `;
            }

            html += `</div>`;

            document.getElementById("conteudo").innerHTML = html;
        });
}

function formNovoBem() {
    document.getElementById("conteudo").innerHTML = `
        <h2>Novo Bem</h2>

        <div class="form-card">
            <div class="form-grid">

                <div class="form-group">
                    <label>Nome</label>
                    <input id="nome">
                </div>

                <div class="form-group">
                    <label>Tombo</label>
                    <input id="tombo">
                </div>

                <div class="form-group">
                    <label>Data de Aquisição</label>
                    <input id="aquisicao" type="date">
                </div>

                <div class="form-group">
                    <label>Valor</label>
                    <input id="valor" type="number" placeholder="R$ 0,00">
                </div>

                <div class="form-group">
                    <label>Responsável</label>
                    <select id="responsavel">
                        <option value="">Selecione o responsável</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Setor</label>
                    <select id="setor">
                        <option value="">Selecione o setor</option>
                    </select>
                </div>

            </div>

            <div class="form-actions">
                <button onclick="loadBens()" style="background: var(--muted);">
                    Cancelar
                </button>
                <button onclick="salvarBem()">
                    Salvar
                </button>
            </div>
        </div>
    `;

    carregarResponsaveis(null);
    carregarSetores(null);
}

function salvarBem() {
    const nome = document.getElementById("nome").value;
    const tombo = document.getElementById("tombo").value;
    const aquisicao = document.getElementById("aquisicao").value;
    const valor = document.getElementById("valor").value;
    const responsavelId = document.getElementById("responsavel").value;
    const setorId = document.getElementById("setor").value;

    if (!nome || !tombo || !aquisicao || !valor || !responsavelId || !setorId) {
        Swal.fire("Erro", "Todos os campos são obrigatórios", "error");
        return;
    }

    fetch(API + "/bens", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ nome, tombo, aquisicao, valor, responsavelId, setorId })
    }).then(() => loadBens());
}

function manutencaoBem(id, status) {
    if (status === "ATIVO") {
        Swal.fire({
            title: "Colocar em manutenção?",
            text: "O bem ficará indisponível para movimentações.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, colocar",
            cancelButtonText: "Cancelar"
        }).then(result => {
            if (result.isConfirmed) {
                fetch(API + "/bens/" + id + "/manutencao", {
                    method: "POST",
                    headers: getHeaders()
                })
                    .then(() => {
                        Swal.fire("Pronto!", "Bem em manutenção.", "success");
                        loadBens();
                    });
            }
        });
    }

    if (status === "EM_MANUTENCAO") {
        Swal.fire({
            title: "Finalizar manutenção?",
            icon: "questionary",
            showCancelButton: true,
            confirmButtonText: "Finalizar",
            cancelButtonText: "Cancelar"
        }).then(result => {
            if (result.isConfirmed) {
                fetch(API + "/bens/" + id + "/finalizar-manutencao", {
                    method: "POST",
                    headers: getHeaders()
                })
                    .then(() => {
                        Swal.fire("Concluído!", "Bem voltou para ATIVO.", "success");
                        loadBens();
                    });
            }
        });
    }
}

function baixarBem(id) {
    Swal.fire({
        title: "Baixar bem?",
        text: "Essa ação é definitiva e o bem não poderá mais ser utilizado.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, baixar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(API + "/bens/" + id + "/baixar", {
                method: "POST",
                headers: getHeaders()
            })
                .then(res => {
                    if (!res.ok) {
                        return res.text().then(msg => {
                            throw new Error(msg || "Erro ao baixar o bem");
                        });
                    }
                    Swal.fire("Concluído!", "Bem baixado com sucesso.", "success");
                    loadBens();
                })
                .catch(err => {
                    Swal.fire("Erro", err.message, "error");
                });
        }
    });
}

function editarBem(id) {
    fetch(API + "/bens/" + id, { headers: getHeaders() })
        .then(res => res.json())
        .then(bem => {

            document.getElementById("conteudo").innerHTML = `
                <h2>Editar Bem</h2>

                <div class="form-card">
                    <input id="id" type="hidden" value="${bem.id}">

                    <div class="form-grid">

                        <div class="form-group">
                            <label>Nome</label>
                            <input id="nome" value="${bem.nome}">
                        </div>

                        <div class="form-group">
                            <label>Tombo</label>
                            <input id="tombo" value="${bem.tombo}">
                        </div>

                        <div class="form-group">
                            <label>Data de Aquisição</label>
                            <input id="aquisicao" type="date" value="${bem.aquisicao}">
                        </div>

                        <div class="form-group">
                            <label>Valor</label>
                            <input id="valor" type="number" value="${bem.valor}">
                        </div>

                        <div class="form-group">
                            <label>Responsável</label>
                            <select id="responsavel">
                                <option value="">Selecione o responsável</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Setor</label>
                            <select id="setor">
                                <option value="">Selecione o setor</option>
                            </select>
                        </div>

                    </div>

                    <div class="form-actions">
                        <button onclick="loadBens()" style="background: var(--muted);">
                            Cancelar
                        </button>
                        <button onclick="atualizarBem()">
                            Atualizar
                        </button>
                    </div>
                </div>
            `;

            carregarResponsaveis(bem.responsavelId);
            carregarSetores(bem.setorId);
        });
}

function atualizarBem() {
    const id = document.getElementById("id").value;
    const nome = document.getElementById("nome").value;
    const tombo = document.getElementById("tombo").value;
    const aquisicao = document.getElementById("aquisicao").value;
    const valor = document.getElementById("valor").value;
    const status = document.getElementById("status").value;
    const responsavelId = document.getElementById("responsavel").value;
    const setorId = document.getElementById("setor").value;

    if (!nome || !tombo || !aquisicao || !valor || !responsavelId || !setorId) {
        Swal.fire("Erro", "Todos os campos são obrigatórios", "error");
        return;
    }

    fetch(API + "/bens", {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ id, nome, tombo, aquisicao, valor, status, responsavelId, setorId })
    }).then(() => loadBens());
}

function excluirBem(id) {
    fetch(API + "/bens/" + id, {
        method: "DELETE",
        headers: getHeaders()
    }).then(() => loadBens());
}

function carregarResponsaveis(id) {
    const select = document.getElementById("responsavel");
    fetch(API + "/responsaveis", { headers: getHeaders() })
        .then(res => res.json())
        .then(lista => {
            lista.forEach(r => {
                const option = document.createElement("option");
                option.value = r.id;
                option.textContent = r.nome;
                select.appendChild(option);
            });
            if (id) {
                select.value = id;
            }
        });
}


function carregarSetores(id) {
    const select = document.getElementById("setor");
    fetch(API + "/setores", { headers: getHeaders() })
        .then(res => res.json())
        .then(lista => {
            lista.forEach(s => {
                const option = document.createElement("option");
                option.value = s.id;
                option.textContent = s.nome;
                select.appendChild(option);
            });
            if (id) {
                select.value = id;
            }
        });
}

function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatarData(dataISO) {
    if (!dataISO) return "";

    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR");
}