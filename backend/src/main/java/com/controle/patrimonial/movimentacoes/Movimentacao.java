package com.controle.patrimonial.movimentacoes;

import com.controle.patrimonial.bens.Bem;
import com.controle.patrimonial.setores.Setor;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Table(name = "movimentacao")
@Entity(name = "movimentacoes")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Movimentacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "bem_id")
    private Bem bem;
    @ManyToOne
    @JoinColumn(name = "setor_origem_id")
    private Setor setorOrigem;
    @ManyToOne
    @JoinColumn(name = "setor_destino_id")
    private Setor setorDestino;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate data;
    @Lob
    private String observacao;

    public Movimentacao(DadosCadastroMovimentacao dados, Bem bem, Setor setorOrigem, Setor setorDestino) {
        this.data = dados.data();
        this.observacao = dados.observacao();
        this.bem = bem;
        this.setorOrigem = setorOrigem;
        this.setorDestino = setorDestino;
    }

    public void atualizaInformacoes(DadosAlteracaoMovimentacao dados, Bem bem, Setor setorOrigem, Setor setorDestino) {
        if (dados.data() != null) {
            this.data = dados.data();
        }
        if (dados.observacao() != null) {
            this.observacao = dados.observacao();
        }
        if (bem != null) {
            this.bem = bem;
        }
        if (setorOrigem != null) {
            this.setorOrigem = setorOrigem;
        }
        if (setorDestino != null) {
            this.setorDestino = setorDestino;
        }
    }
}
