package com.controle.patrimonial.controllers;

import com.controle.patrimonial.bens.*;
import com.controle.patrimonial.responsaveis.Responsavel;
import com.controle.patrimonial.responsaveis.ResponsavelRepositorio;
import com.controle.patrimonial.setores.Setor;
import com.controle.patrimonial.setores.SetorRepositorio;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/bens")
public class BemController {
    @Autowired
    private BemRepositorio bemRepositorio;
    @Autowired
    private SetorRepositorio setorRepositorio;
    @Autowired
    private ResponsavelRepositorio responsavelRepositorio;

    @PostMapping
    @Transactional
    public ResponseEntity<?> cadastrar(@RequestBody DadosCadastroBem dados) {
        if (!setorRepositorio.existsById(dados.setorId())) {
            return ResponseEntity.notFound().build();
        }
        if (!responsavelRepositorio.existsById(dados.responsavelId())) {
            return ResponseEntity.notFound().build();
        }
        Setor setor = setorRepositorio.getReferenceById(dados.setorId());
        Responsavel responsavel = responsavelRepositorio.getReferenceById(dados.responsavelId());
        Bem bem = bemRepositorio.save(new Bem(dados, setor, responsavel));
        Long id = bem.getId();
        URI uri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/{id}").buildAndExpand(id).toUri();
        return ResponseEntity.created(uri).build();
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        var lista = bemRepositorio.findAll().stream().map(DadosListagemBem::new).toList();
        return ResponseEntity.ok(lista);
    }

    @PutMapping
    @Transactional
    public ResponseEntity<?> atualizar(@RequestBody DadosAlteracaoBem dados) {
        if (!bemRepositorio.existsById(dados.id())) {
            return ResponseEntity.notFound().build();
        }
        if (!setorRepositorio.existsById(dados.setorId())) {
            return ResponseEntity.notFound().build();
        }
        if (!responsavelRepositorio.existsById(dados.responsavelId())) {
            return ResponseEntity.notFound().build();
        }
        Setor setor = setorRepositorio.getReferenceById(dados.setorId());
        Responsavel responsavel = responsavelRepositorio.getReferenceById(dados.responsavelId());
        Bem bem = bemRepositorio.getReferenceById(dados.id());
        bem.atualizaInformacoes(dados, setor, responsavel);
        return ResponseEntity.ok(bem);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if (!bemRepositorio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        bemRepositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DadosListagemBem> detalhar(@PathVariable Long id) {
        Bem bem = bemRepositorio.getReferenceById(id);
        return ResponseEntity.ok(new DadosListagemBem(bem));
    }

    @PostMapping("/{id}/manutencao")
    @Transactional
    public ResponseEntity<?> manutencao(@PathVariable Long id) {
        if (!bemRepositorio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Bem bem = bemRepositorio.getReferenceById(id);
        bem.atualizaStatusBem("EM_MANUTENCAO");
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/finalizar-manutencao")
    @Transactional
    public ResponseEntity<?> finalizarManutencao(@PathVariable Long id) {
        if (!bemRepositorio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Bem bem = bemRepositorio.getReferenceById(id);
        bem.atualizaStatusBem("ATIVO");
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/baixar")
    @Transactional
    public ResponseEntity<?> baixar(@PathVariable Long id) {
        if (!bemRepositorio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Bem bem = bemRepositorio.getReferenceById(id);
        bem.atualizaStatusBem("BAIXADO");
        return ResponseEntity.ok().build();
    }

    @GetMapping("/ativos")
    public ResponseEntity<?> listaAtivos() {
        var lista = bemRepositorio.findByStatus("ATIVO").stream().map(DadosListagemBem::new).toList();
        return ResponseEntity.ok(lista);
    }
}
