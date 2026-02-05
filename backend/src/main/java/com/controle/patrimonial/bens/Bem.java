package com.controle.patrimonial.bens;

import com.controle.patrimonial.responsaveis.Responsavel;
import com.controle.patrimonial.setores.Setor;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Table(name = "bem")
@Entity(name = "bens")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Bem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String tombo;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate aquisicao;
    private double valor;
    private String status;
    @ManyToOne
    @JoinColumn(name = "setor_id")
    private Setor setor;
    @ManyToOne
    @JoinColumn(name = "responsavel_id")
    private Responsavel responsavel;

    public Bem(DadosCadastroBem dados, Setor setor, Responsavel responsavel) {
        this.nome = dados.nome();
        this.tombo = dados.tombo();
        this.aquisicao = dados.aquisicao();
        this.valor = dados.valor();
        this.status = "ATIVO";
        this.setor = setor;
        this.responsavel = responsavel;
    }

    public void atualizaInformacoes(DadosAlteracaoBem dados, Setor setor, Responsavel responsavel) {
        if (dados.nome() != null) {
            this.nome = dados.nome();
        }
        if (dados.tombo() != null) {
            this.tombo = dados.tombo();
        }
        if (dados.aquisicao() != null) {
            this.aquisicao = dados.aquisicao();
        }
        if (dados.valor() != 0) {
            this.valor = dados.valor();
        }
        if (setor != null) {
            this.setor = setor;
        }
        if (responsavel != null) {
            this.responsavel = responsavel;
        }
    }

    public void atualizaSetorBem(Setor setor) {
        this.setor = setor;
    }

    public void atualizaStatusBem(String status) {
        this.status = status;
    }
}
