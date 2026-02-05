package com.controle.patrimonial.setores;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "setor")
@Entity(name = "setores")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Setor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String descricao;

    public Setor(DadosCadastroSetor dados) {
        this.nome = dados.nome();
        this.descricao = dados.descricao();
    }

    public void atualizaInformacoes(DadosAlteracaoSetor dados) {
        if (dados.nome() != null) {
            this.nome = dados.nome();
        }
        if (dados.descricao() != null) {
            this.descricao = dados.descricao();
        }
    }
}
