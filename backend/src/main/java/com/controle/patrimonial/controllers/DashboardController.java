package com.controle.patrimonial.controllers;

import com.controle.patrimonial.bens.BemRepositorio;
import com.controle.patrimonial.indicadores.DadosIndicadores;
import com.controle.patrimonial.indicadores.DadosIndicadoresMovimentacao;
import com.controle.patrimonial.movimentacoes.MovimentacaoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {
    @Autowired
    private BemRepositorio bemRepositorio;
    @Autowired
    private MovimentacaoRepositorio movimentacaoRepositorio;

    @GetMapping
    public ResponseEntity<?> dadosDashboard() {

        long totalBens = bemRepositorio.count();
        long ativos = bemRepositorio.countByStatus("ATIVO");
        long manutencao = bemRepositorio.countByStatus("EM_MANUTENCAO");
        long baixados = bemRepositorio.countByStatus("BAIXADO");

        Double valorTotal = bemRepositorio.somaValorPorStatus("ATIVO");
        if (valorTotal == null) valorTotal = 0.0;

        var ultimasMovimentacoes =
                movimentacaoRepositorio.findTop5ByOrderByDataDesc()
                        .stream()
                        .map(DadosIndicadoresMovimentacao::new)
                        .toList();

        return ResponseEntity.ok(
                new DadosIndicadores(
                        totalBens,
                        ativos,
                        manutencao,
                        baixados,
                        valorTotal,
                        ultimasMovimentacoes
                )
        );
    }
}

