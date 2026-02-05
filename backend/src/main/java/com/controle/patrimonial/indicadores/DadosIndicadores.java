package com.controle.patrimonial.indicadores;

import java.util.List;

public record DadosIndicadores(long totalBens, long ativos, long manutencao, long baixados, double valorTotal, List<DadosIndicadoresMovimentacao> ultimasMovimentacoes) { }