package com.controle.patrimonial.bens;

import java.time.LocalDate;

public record DadosAlteracaoBem(Long id, String nome, String tombo, LocalDate aquisicao, double valor, Long setorId, Long responsavelId) { }