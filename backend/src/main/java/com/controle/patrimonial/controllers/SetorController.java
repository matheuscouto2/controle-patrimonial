package com.controle.patrimonial.controllers;

import com.controle.patrimonial.setores.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/setores")
public class SetorController {
    @Autowired
    private SetorRepositorio setorRepositorio;

    @PostMapping
    @Transactional
    public ResponseEntity<?> cadastrar(@RequestBody DadosCadastroSetor dados) {
        Setor setor = setorRepositorio.save(new Setor(dados));
        Long id = setor.getId();
        URI uri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/{id}").buildAndExpand(id).toUri();
        return ResponseEntity.created(uri).build();
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        var lista = setorRepositorio.findAll().stream().map(DadosListagemSetor::new).toList();
        return ResponseEntity.ok(lista);
    }

    @PutMapping
    @Transactional
    public ResponseEntity<?> atualizar(@RequestBody DadosAlteracaoSetor dados) {
        if (!setorRepositorio.existsById(dados.id())) {
            return ResponseEntity.notFound().build();
        }
        Setor setor = setorRepositorio.getReferenceById(dados.id());
        setor.atualizaInformacoes(dados);
        return ResponseEntity.ok(setor);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if (!setorRepositorio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        setorRepositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Setor> detalhar(@PathVariable Long id) {
        Setor setor = setorRepositorio.getReferenceById(id);
        return ResponseEntity.ok(setor);
    }
}
