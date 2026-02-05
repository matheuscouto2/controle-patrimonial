package com.controle.patrimonial.controllers;

import com.controle.patrimonial.bens.Bem;
import com.controle.patrimonial.bens.BemRepositorio;
import com.controle.patrimonial.movimentacoes.*;
import com.controle.patrimonial.setores.Setor;
import com.controle.patrimonial.setores.SetorRepositorio;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/movimentacoes")
public class MovimentacaoController {
    @Autowired
    private MovimentacaoRepositorio movimentacaoRepositorio;
    @Autowired
    private BemRepositorio bemRepositorio;
    @Autowired
    private SetorRepositorio setorRepositorio;

    @PostMapping
    @Transactional
    public ResponseEntity<?> cadastrar(@RequestBody DadosCadastroMovimentacao dados) {
        if (!bemRepositorio.existsById(dados.bemId())) {
            return ResponseEntity.notFound().build();
        }
        if (!setorRepositorio.existsById(dados.setorOrigemId())) {
            return ResponseEntity.notFound().build();
        }
        if (!setorRepositorio.existsById(dados.setorDestinoId())) {
            return ResponseEntity.notFound().build();
        }
        if (dados.setorOrigemId().equals(dados.setorDestinoId())) {
            return ResponseEntity.badRequest().body("Setor de destino não pode ser igual ao de origem");
        }
        Bem bem = bemRepositorio.getReferenceById(dados.bemId());
        Setor setorOrigem = setorRepositorio.getReferenceById(dados.setorOrigemId());
        Setor setorDestino = setorRepositorio.getReferenceById(dados.setorDestinoId());
        Movimentacao movimentacao = movimentacaoRepositorio.save(new Movimentacao(dados, bem, setorOrigem, setorDestino));
        Long id = movimentacao.getId();
        URI uri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/{id}").buildAndExpand(id).toUri();
        bem.atualizaSetorBem(setorDestino);
        return ResponseEntity.created(uri).build();
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        var lista = movimentacaoRepositorio.findAll().stream().map(DadosListagemMovimentacao::new).toList();
        return ResponseEntity.ok(lista);
    }

    @PutMapping
    @Transactional
    public ResponseEntity<?> atualizar(@RequestBody DadosAlteracaoMovimentacao dados) {
        if (!movimentacaoRepositorio.existsById(dados.id())) {
            return ResponseEntity.notFound().build();
        }
        if (!bemRepositorio.existsById(dados.bemId())) {
            return ResponseEntity.notFound().build();
        }
        if (!setorRepositorio.existsById(dados.setorOrigemId())) {
            return ResponseEntity.notFound().build();
        }
        if (!setorRepositorio.existsById(dados.setorDestinoId())) {
            return ResponseEntity.notFound().build();
        }
        Bem bem = bemRepositorio.getReferenceById(dados.bemId());
        Setor setorOrigem = setorRepositorio.getReferenceById(dados.setorOrigemId());
        Setor setorDestino = setorRepositorio.getReferenceById(dados.setorDestinoId());
        Movimentacao movimentacao = movimentacaoRepositorio.getReferenceById(dados.id());
        movimentacao.atualizaInformacoes(dados, bem, setorOrigem, setorDestino);
        return ResponseEntity.ok(movimentacao);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if (!movimentacaoRepositorio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        movimentacaoRepositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DadosListagemMovimentacao> detalhar(@PathVariable Long id) {
        if (!movimentacaoRepositorio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Movimentacao movimentacao = movimentacaoRepositorio.getReferenceById(id);
        return ResponseEntity.ok(new DadosListagemMovimentacao(movimentacao));
    }
}
