package com.controle.patrimonial.controllers;

import com.controle.patrimonial.responsaveis.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/responsaveis")
public class ResponsavelController {
    @Autowired
    private ResponsavelRepositorio responsavelRepositorio;

    @PostMapping
    @Transactional
    public ResponseEntity<?> cadastrar(@RequestBody DadosCadastroResponsavel dados) {
        Responsavel responsavel = responsavelRepositorio.save(new Responsavel(dados));
        Long id = responsavel.getId();
        URI uri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/{id}").buildAndExpand(id).toUri();
        return ResponseEntity.created(uri).build();
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        var lista = responsavelRepositorio.findAll().stream().map(DadosListagemResponsavel::new).toList();
        return ResponseEntity.ok(lista);
    }

    @PutMapping
    @Transactional
    public ResponseEntity<?> atualizar(@RequestBody DadosAlteracaoResponsavel dados) {
        if (!responsavelRepositorio.existsById(dados.id())) {
            return ResponseEntity.notFound().build();
        }
        Responsavel responsavel = responsavelRepositorio.getReferenceById(dados.id());
        responsavel.atualizaInformacoes(dados);
        return ResponseEntity.ok(responsavel);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if (!responsavelRepositorio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        responsavelRepositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Responsavel> detalhar(@PathVariable Long id) {
        Responsavel responsavel = responsavelRepositorio.getReferenceById(id);
        return ResponseEntity.ok(responsavel);
    }
}
