package com.controle.patrimonial.bens;

import java.time.LocalDate;

public record DadosListagemBem(Long id, String nome, String tombo, LocalDate aquisicao, double valor, String status, Long setorId, String setorNome, Long responsavelId, String responsavelNome) {
    public DadosListagemBem(Bem dados) {
        this(dados.getId(), dados.getNome(), dados.getTombo(), dados.getAquisicao(), dados.getValor(), dados.getStatus(), dados.getSetor().getId(), dados.getSetor().getNome(), dados.getResponsavel().getId(), dados.getResponsavel().getNome());
    }
}
