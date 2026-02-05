package com.controle.patrimonial.responsaveis;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "responsavel")
@Entity(name = "responsaveis")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Responsavel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String email;

    public Responsavel(DadosCadastroResponsavel dados) {
        this.nome = dados.nome();
        this.email = dados.email();
    }

    public void atualizaInformacoes(DadosAlteracaoResponsavel dados) {
        if (dados.nome() != null) {
            this.nome = dados.nome();
        }
        if (dados.email() != null) {
            this.email = dados.email();
        }
    }
}
