function loadDashboard() {
    ativarMenu("dash");
    fetch(API + "/dashboard", { headers: getHeaders() })
        .then(res => res.json())
        .then(d => {
            document.getElementById("conteudo").innerHTML = `
                <h2>Dashboard</h2>

                <div class="cards">
                    <div class="card">
                        <span>Total de Bens</span>
                        <strong>${d.totalBens}</strong>
                    </div>

                    <div class="card ativo">
                        <span>Ativos</span>
                        <strong>${d.ativos}</strong>
                    </div>

                    <div class="card manutencao">
                        <span>Manutenção</span>
                        <strong>${d.manutencao}</strong>
                    </div>

                    <div class="card baixado">
                        <span>Baixados</span>
                        <strong>${d.baixados}</strong>
                    </div>

                    <div class="card valor">
                        <span>Valor do Patrimônio</span>
                        <strong>${formatarMoeda(d.valorTotal)}</strong>
                    </div>
                </div>

                <h3>Últimas movimentações</h3>
                <table>
                    <tr>
                        <th>Bem</th>
                        <th>Origem</th>
                        <th>Destino</th>
                        <th>Data</th>
                    </tr>
                    ${d.ultimasMovimentacoes.map(m => `
                        <tr>
                            <td>${m.bem}</td>
                            <td>${m.setorOrigem}</td>
                            <td>${m.setorDestino}</td>
                            <td>${formatarData(m.data)}</td>
                        </tr>
                    `).join("")}
                </table>
            `;
        });
}