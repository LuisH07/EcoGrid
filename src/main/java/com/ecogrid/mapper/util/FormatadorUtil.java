package com.ecogrid.mapper.util;

import com.ecogrid.mapper.exception.DataInvalidaException;
import com.ecogrid.mapper.model.enums.UnidadesFederativasNordeste;
import org.locationtech.jts.geom.Point;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class FormatadorUtil {

    public static String normalizarNomeSubestacao(String nomeSubestacao) {

        String[] partesNome = nomeSubestacao.trim().split("\\s+");

        StringBuilder nomeBuilder = new StringBuilder();
        for (int i = 0; i < partesNome.length - 1; i++) {
            nomeBuilder.append(partesNome[i]).append(" ");
        }
        return nomeBuilder.toString().trim();
    }

    public static String formatarComprimentoToString(double comprimentoKm) {
        if (comprimentoKm == 0.0) {
            return "< 1.0 km";
        }
        return String.format("%.1f km", comprimentoKm);
    }

    public static UnidadesFederativasNordeste normalizarUnidadeFederativaSubestacao(String nomeSubestacao) {
        String[] partesNome = nomeSubestacao.trim().split("\\s+");

        return UnidadesFederativasNordeste.valueOf(partesNome[partesNome.length - 1]);
    }

    public static String normalizarNomeLinha(String nome) {
        String[] partesDoNome = nome.split(" ");

        StringBuilder nomeBuilder = new StringBuilder();
        for (int index = 3; index < partesDoNome.length - 3; index++) {
            nomeBuilder.append(partesDoNome[index]).append(" ");
        }

        return nomeBuilder.toString();
    }

    public static LocalDate parseData(String dataStr) {
        try {
            return LocalDate.parse(dataStr, DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        } catch (DateTimeParseException exception) {
            throw new DataInvalidaException("Formato de data inválido: " + dataStr, exception);
        }
    }

    public static String formatarDataToString(LocalDate data) {
        if (data == null) {
            return "N/A";
        }
        return data.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }

    public static UnidadesFederativasNordeste parseEstadoNordeste(String unidadeFederativa) {
        if (unidadeFederativa == null || unidadeFederativa.isBlank()) return null;
        try {
            return UnidadesFederativasNordeste.valueOf(unidadeFederativa.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    public static String formatarCoordenadasToString(Point coordenadas) {
        if (coordenadas == null) {
            return "N/A";
        }
        return String.format("%.6f, %.6f", coordenadas.getX(), coordenadas.getY());
    }
}
