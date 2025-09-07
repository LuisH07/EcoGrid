package com.ecogrid.mapper.service;

import com.ecogrid.mapper.exception.LeituraShapefileException;
import com.ecogrid.mapper.model.AreaProtegida;
import com.ecogrid.mapper.model.enums.UnidadesFederativasNordeste;
import com.ecogrid.mapper.util.FormatadorUtil;
import org.geotools.data.shapefile.ShapefileDataStore;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.data.simple.SimpleFeatureIterator;
import org.geotools.data.simple.SimpleFeatureSource;
import org.locationtech.jts.geom.Polygon;
import org.opengis.feature.simple.SimpleFeature;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class LeitorShapefileService {

    public List<AreaProtegida> lerAreasProtegidas(String caminho) {
        List<AreaProtegida> areasProtegidas = new ArrayList<>();
        ShapefileDataStore dataStore = null;

        try {
            File arquivo = new File(caminho);
            if (!arquivo.exists()) {
                throw new LeituraShapefileException("Arquivo " + caminho + " não encontrado");
            }

            System.setProperty("org.geotools.referencing.forceXY", "true");
            dataStore = new ShapefileDataStore(arquivo.toURI().toURL());
            dataStore.setCharset(StandardCharsets.UTF_8);

            SimpleFeatureSource featureSource = dataStore.getFeatureSource();
            SimpleFeatureCollection collection = featureSource.getFeatures();

            try (SimpleFeatureIterator iterator = collection.features()) {
                while (iterator.hasNext()) {
                    SimpleFeature feature = iterator.next();
                    AreaProtegida area = criarAreaProtegida(feature);
                    if (area != null) {
                        areasProtegidas.add(area);
                    }
                }
            }
        } catch (IOException exception) {
            throw new LeituraShapefileException("Erro ao ler " + caminho + " Shapefile", exception);
        } finally {
            if (dataStore != null) {
                dataStore.dispose();
            }
        }

        return areasProtegidas;
    }

    private AreaProtegida criarAreaProtegida(SimpleFeature feature) {
        String unidadeFederativaAbrangente = obterString(feature, "UFAbrang");
        UnidadesFederativasNordeste estado = FormatadorUtil.parseEstadoNordeste(unidadeFederativaAbrangente);
        if (estado == null) return null;

        String nome = Optional.ofNullable(obterString(feature, "NomeUC"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(s -> s.replaceAll("\\s+", " "))
                .orElse("N/A");

        Double medidaArea = Optional.ofNullable(obterDouble(feature, "AreaHaAlb")).orElse(0.0);

        Polygon geometria = extrairPoligono(feature);
        if (geometria == null) return null;

        return new AreaProtegida(nome, estado, medidaArea, geometria);
    }

    private String obterString(SimpleFeature feature, String atributo) {
        Object valor = feature.getAttribute(atributo);
        return valor != null ? valor.toString() : null;
    }

    private Double obterDouble(SimpleFeature feature, String atributo) {
        Object valor = feature.getAttribute(atributo);
        return valor instanceof Number number ? number.doubleValue() : null;
    }

    private Polygon extrairPoligono(SimpleFeature feature) {
        Object geometria = feature.getDefaultGeometry();
        if (geometria instanceof Polygon polygon) {
            return polygon;
        } else if (geometria instanceof org.locationtech.jts.geom.MultiPolygon multi) {
            return multi.getNumGeometries() > 0 ? (Polygon) multi.getGeometryN(0) : null;
        }
        return null;
    }

}
