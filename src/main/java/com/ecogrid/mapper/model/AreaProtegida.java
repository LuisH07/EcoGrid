package com.ecogrid.mapper.model;

import com.ecogrid.mapper.model.enums.UnidadeFederativa;
import lombok.*;
import org.locationtech.jts.geom.Polygon;
import java.util.concurrent.atomic.AtomicLong;

@Getter
@ToString
@EqualsAndHashCode(of = "id")
public class AreaProtegida {
    private static final AtomicLong COUNTER = new AtomicLong(0);
    private final long id;

    private final String nome;
    private final UnidadeFederativa unidadeFederativa;
    private final double medidaArea;
    private final Polygon geometria;

    public AreaProtegida(String nome, UnidadeFederativa unidadeFederativa, double medidaArea, Polygon geometria) {
        this.id = COUNTER.incrementAndGet();
        this.nome = nome;
        this.unidadeFederativa = unidadeFederativa;
        this.medidaArea = medidaArea;
        this.geometria = geometria;
    }
}
