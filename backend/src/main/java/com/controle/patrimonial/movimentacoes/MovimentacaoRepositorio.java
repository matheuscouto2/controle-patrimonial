package com.controle.patrimonial.movimentacoes;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovimentacaoRepositorio extends JpaRepository<Movimentacao, Long> {
    List<Movimentacao> findTop5ByOrderByDataDesc();
}
