function loadMovimentacoes() {
    ativarMenu("movimentacoes");
    fetch(API + "/movimentacoes", { headers: getHeaders() })
        .then(res => res.json())
        .then(data => {
            let html = `
                <div class="div-header-container">
                    <h2>Movimentações</h2>
                    <button onclick="formNovoMovimentacao()">+ NOVO</button>
                </div>
                <table>
                    <tr>
                        <th style="display:none;">ID</th>
                        <th class="col-acoes"></th>
                        <th>Bem</th>
                        <th>Setor de Origem</th>
                        <th>Setor de Destino</th>
                        <th>Data</th>
                        <th>Observação</th>
                    </tr>
            `;

            data.forEach(b => {
                html += `
                    <tr>
                        <td style="display:none;">${b.id}</td>
                        <td class="col-acoes">
                            <button onclick="editarMovimentacao(${b.id})">Editar</button>
                            <button onclick="excluirMovimentacoes(${b.id})">Excluir</button>
                        </td>
                        <td>${b.bemNome}</td>
                        <td>${b.setorOrigemNome}</td>
                        <td>${b.setorDestinoNome}</td>
                        <td>${formatarData(b.data)}</td>
                        <td>${b.observacao}</td>
                    </tr>
                `;
            });

            html += "</table>";
            document.getElementById("conteudo").innerHTML = html;
        });
}

function formNovoMovimentacao() {
    document.getElementById("conteudo").innerHTML = `
        <h2>Nova Movimentação</h2>

        <select id="bem" onchange="aoSelecionarBem()">
            <option value="">Selecione o bem</option>
        </select>
        <select id="setor_origem" disabled>
            <option value="">Informe o bem</option>
        </select>
        <select id="setor_destino">
            <option value="">Selecione o setor de destino</option>
        </select>
        <input id="data" type="date">
        <input id="observacao" placeholder="Observações">

        <button onclick="salvarMovimentacao()">Salvar</button>
    `;

    carregarBens(null);
    carregarSetoresDestino(null);
}

function salvarMovimentacao() {
    const bemId = document.getElementById("bem").value;
    const setorOrigemId = document.getElementById("setor_origem").value;
    const setorDestinoId = document.getElementById("setor_destino").value;
    const data = document.getElementById("data").value;
    const observacao = document.getElementById("observacao").value;

    fetch(API + "/movimentacoes", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            bemId,
            setorOrigemId,
            setorDestinoId,
            data,
            observacao
        })
    })
        .then(async response => {
            if (!response.ok) {
                const msg = await response.text();
                throw new Error(msg || "Erro ao salvar movimentação");
            }
        })
        .then(() => {
            Swal.fire({
                icon: "success",
                title: "Sucesso!",
                text: "Movimentação registrada com sucesso"
            });
            loadMovimentacoes();
        })
        .catch(error => {
            Swal.fire({
                icon: "error",
                title: "Erro",
                text: error.message
            });
        });
}

function editarMovimentacao(id) {
    fetch(API + "/movimentacoes/" + id, { headers: getHeaders() })
        .then(res => res.json())
        .then(movimentacao => {
            const bemId = movimentacao.bemId;
            const setorDestinoId = movimentacao.setorDestinoId;

            document.getElementById("conteudo").innerHTML = `
                <h2>Editar Movimentação</h2>

                <input id="id" type="hidden" value="${movimentacao.id}">
                <select id="bem" onchange="aoSelecionarBem()">
                    <option value="">Selecione o bem</option>
                </select>
                <select id="setor_origem" disabled>
                    <option value="">Informe o bem</option>
                </select>
                <select id="setor_destino">
                    <option value="">Selecione o setor de destino</option>
                </select>
                <input id="data" type="date" value="${movimentacao.data}">
                <input id="observacao" placeholder="Observações" value="${movimentacao.observacao}">
                <button onclick="atualizarMovimentacao()">Atualizar</button>
            `;
            carregarBens(bemId);
            carregarSetoresDestino(setorDestinoId);
        });
}

function atualizarMovimentacao() {
    const id = document.getElementById("id").value;
    const bemId = document.getElementById("bem").value;
    const setorOrigemId = document.getElementById("setor_origem").value;
    const setorDestinoId = document.getElementById("setor_destino").value;
    const data = document.getElementById("data").value;
    const observacao = document.getElementById("observacao").value;

    fetch(API + "/movimentacoes", {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ id, bemId, setorOrigemId, setorDestinoId, data, observacao })
    }).then(() => loadMovimentacoes());
}

function excluirMovimentacoes(id) {
    fetch(API + "/movimentacoes/" + id, {
        method: "DELETE",
        headers: getHeaders()
    }).then(() => loadMovimentacoes());
}

function carregarBens(id) {
    const select = document.getElementById("bem");
    fetch(API + "/bens/ativos", { headers: getHeaders() })
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

function aoSelecionarBem() {
    const bemId = document.getElementById("bem").value;
    if (!bemId) return;
    console.log("bem: " + bemId);
    fetch(API + "/bens/" + bemId, { headers: getHeaders() })
        .then(res => res.json())
        .then(bem => {
            setarSetorOrigem(bem);
        });
}

function setarSetorOrigem(bem) {
    const select = document.getElementById("setor_origem");
    select.innerHTML = "";

    const option = document.createElement("option");
    option.value = bem.setorId;
    option.textContent = bem.setorNome;
    option.selected = true;

    select.appendChild(option);
    select.disabled = true;
}

function carregarSetoresDestino(id) {
    const select = document.getElementById("setor_destino");
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

function formatarData(dataISO) {
    if (!dataISO) return "";

    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR");
}