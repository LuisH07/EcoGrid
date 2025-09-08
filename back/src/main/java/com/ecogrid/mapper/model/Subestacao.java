package com.ecogrid.mapper.model;

import com.ecogrid.mapper.model.enums.UnidadesFederativasNordeste;
import lombok.*;
import org.locationtech.jts.geom.Point;
import java.time.LocalDate;
import java.util.concurrent.atomic.AtomicLong;

@Getter
@ToString
@EqualsAndHashCode(of = "id")
public class Subestacao {
    private static final AtomicLong COUNTER = new AtomicLong(0);
    private final long id;

    private final String idInstalacao;
    private final String nome;
    private final UnidadesFederativasNordeste unidadeFederativaNordeste;
    private final String idAgentePrincipal;
    private final String agentePrincipal;
    private final LocalDate dataPrevista;
    private final LocalDate dataEntrada;
    private final Point coordenadas;

    @Builder
    private Subestacao(String idInstalacao, String nome,
                       UnidadesFederativasNordeste unidadeFederativaNordeste, String idAgentePrincipal,
                       String agentePrincipal, LocalDate dataPrevista, LocalDate dataEntrada, Point coordenadas) {
        this.id = COUNTER.incrementAndGet();
        this.idInstalacao = idInstalacao;
        this.nome = nome;
        this.unidadeFederativaNordeste = unidadeFederativaNordeste;
        this.idAgentePrincipal = idAgentePrincipal;
        this.agentePrincipal = agentePrincipal;
        this.dataPrevista = dataPrevista;
        this.dataEntrada = dataEntrada;
        this.coordenadas = coordenadas;
    }
}
