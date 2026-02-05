package com.controle.patrimonial.indicadores;

import com.controle.patrimonial.movimentacoes.Movimentacao;

import java.time.LocalDate;

public record DadosIndicadoresMovimentacao(String bem, String setorOrigem, String setorDestino, LocalDate data) {
    public DadosIndicadoresMovimentacao(Movimentacao m) {
        this(m.getBem().getNome(), m.getSetorOrigem().getNome(), m.getSetorDestino().getNome(), m.getData());
    }
}

