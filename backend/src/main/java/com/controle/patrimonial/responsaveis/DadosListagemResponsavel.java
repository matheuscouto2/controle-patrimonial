package com.controle.patrimonial.responsaveis;

public record DadosListagemResponsavel(Long id, String nome, String email) {
    public DadosListagemResponsavel(Responsavel dados) {
        this(dados.getId(), dados.getNome(), dados.getEmail());
    }
}
