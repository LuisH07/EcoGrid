package com.ecogrid.mapper.dto.response;

import com.ecogrid.mapper.model.AreaProtegida;
import com.ecogrid.mapper.model.enums.UnidadesFederativasNordeste;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.locationtech.jts.geom.Polygon;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class AreaProtegidaResponse {
    private String nome;
    private UnidadesFederativasNordeste unidadeFederativaNordeste;
    private double medidaArea;
    private List<List<Double>> coordenadas;

    public AreaProtegidaResponse(AreaProtegida areaProtegida) {
        this.nome = areaProtegida.getNome();
        this.unidadeFederativaNordeste = areaProtegida.getUnidadeFederativaNordeste();
        this.medidaArea = areaProtegida.getMedidaArea();
        Polygon polygon = areaProtegida.getGeometria();

        if (polygon != null) {
            this.coordenadas = Arrays.stream(polygon.getCoordinates())
                    .map(coord -> List.of(coord.getX(), coord.getY()))
                    .collect(Collectors.toList());
        }
    }
}
