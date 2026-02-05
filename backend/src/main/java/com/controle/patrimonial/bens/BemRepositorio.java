package com.controle.patrimonial.bens;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BemRepositorio extends JpaRepository<Bem, Long> {
    List<Bem> findByStatus(String status);

    long countByStatus(String status);

    @Query("SELECT SUM(b.valor) FROM bens b WHERE b.status = :status")
    Double somaValorPorStatus(@Param("status") String status);

}
