package com.controle.patrimonial.setores;

public record DadosListagemSetor(Long id, String nome, String descricao) {
    public DadosListagemSetor(Setor dados) {
        this(dados.getId(), dados.getNome(), dados.getDescricao());
    }
}
