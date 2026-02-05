package com.controle.patrimonial.controllers;

import com.controle.patrimonial.seguranca.TokenService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AutenticacaoController {
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;
    public AutenticacaoController(TokenService tokenService, AuthenticationManager authenticationManager) {
        this.tokenService = tokenService;
        this.authenticationManager = authenticationManager;
    }
    @PostMapping
    public ResponseEntity<?> autenticar(@RequestBody @Valid Login credenciais) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(credenciais.getUsuario(), credenciais.getSenha());
        try {
            Authentication authentication = authenticationManager.authenticate(authenticationToken);
            String token = tokenService.gerarToken(authentication.getName());
            return ResponseEntity.ok().body(new Token(token, "Bearer"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Credenciais inválidas");
        }
    }
}

@Getter
@Setter
class Login {
    private String usuario;
    private String senha;
}

@Getter
@Setter
@AllArgsConstructor
class Token {
    private String token;
    private String tipo;
}