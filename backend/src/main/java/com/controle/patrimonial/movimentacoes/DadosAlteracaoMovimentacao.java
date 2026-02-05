package com.controle.patrimonial.movimentacoes;

import java.time.LocalDate;

public record DadosAlteracaoMovimentacao(Long id, LocalDate data, String observacao, Long bemId, Long setorOrigemId, Long setorDestinoId) { }
