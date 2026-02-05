package com.controle.patrimonial.movimentacoes;

import java.time.LocalDate;

public record DadosCadastroMovimentacao(LocalDate data, String observacao, Long bemId, Long setorOrigemId, Long setorDestinoId) { }
