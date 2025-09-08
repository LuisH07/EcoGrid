package com.ecogrid.mapper.service;

import com.ecogrid.mapper.model.AreaProtegida;
import com.ecogrid.mapper.model.Subestacao;
import lombok.Getter;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.LineString;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class AreaProtegidaService {
    @Getter
    private final List<AreaProtegida> areasProtegidas = new ArrayList<>();

    public List<AreaProtegida> findAllAreaProtegida() {
        return areasProtegidas;
    }

    public void carregarAreasProtegidas(List<AreaProtegida> areas) {
        areasProtegidas.addAll(areas);
    }

    public boolean verificarInterseccaoEntreDuasSubestacoes(Subestacao subestacaoA, Subestacao subestacaoB) {
        GeometryFactory geometryFactory = new GeometryFactory();
        Coordinate coordinateA = new Coordinate(subestacaoA.getCoordenadas().getX(), subestacaoA.getCoordenadas().getY());
        Coordinate coordinateB = new Coordinate(subestacaoB.getCoordenadas().getX(), subestacaoB.getCoordenadas().getY());

        LineString ligacao = geometryFactory.createLineString(new Coordinate[] {coordinateA, coordinateB});

        return areasProtegidas.stream()
                .filter(area -> area.getGeometria() != null)
                .anyMatch(area -> ligacao.intersects(area.getGeometria()));
    }
}
