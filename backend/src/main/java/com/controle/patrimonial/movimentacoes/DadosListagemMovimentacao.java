package com.controle.patrimonial.movimentacoes;

import java.time.LocalDate;

public record DadosListagemMovimentacao(Long id, LocalDate data, String observacao, Long bemId, String bemNome, Long setorOrigemId, String setorOrigemNome, Long setorDestinoId, String setorDestinoNome) {
    public DadosListagemMovimentacao(Movimentacao dados) {
        this(dados.getId(), dados.getData(), dados.getObservacao(), dados.getBem().getId(), dados.getBem().getNome(), dados.getSetorOrigem().getId(), dados.getSetorOrigem().getNome(), dados.getSetorDestino().getId(), dados.getSetorDestino().getNome());
    }
}
