package com.ecogrid.mapper.service;

import com.ecogrid.mapper.exception.CoordenadasInvalidasException;
import com.ecogrid.mapper.exception.LeituraCsvException;
import com.ecogrid.mapper.model.enums.UnidadesFederativasNordeste;
import com.ecogrid.mapper.model.transmissao.InformacoesAdministrativas;
import com.ecogrid.mapper.model.transmissao.LinhaDeTransmissao;
import com.ecogrid.mapper.model.Subestacao;
import com.ecogrid.mapper.util.FormatadorUtil;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class LeitorCsvService {

    public List<Subestacao> lerSubestacoes(String caminho) {
        List<Subestacao> subestacoes = new ArrayList<>();

        try (BufferedReader bufferedReaderr = new BufferedReader(
                new InputStreamReader(Files.newInputStream(Paths.get(caminho)), StandardCharsets.UTF_8))) {

            String linhaCsv;
            while ((linhaCsv = bufferedReaderr.readLine()) != null) {
                if (linhaCsv.trim().isEmpty()) continue;

                Subestacao subestacao = criarSubestacaoCsv(linhaCsv);
                subestacoes.add(subestacao);
            }
        } catch (IOException exception) {
            throw new LeituraCsvException("Erro ao ler arquivo de subestações CSV: " + caminho, exception);
        }

        return subestacoes;
    }

    private Subestacao criarSubestacaoCsv(String linhaCsv) {
        String[] partes = linhaCsv.split(";");

        String idInstalacao = partes[0].trim();

        String nome = FormatadorUtil.normalizarNomeSubestacao(partes[1].trim());

        UnidadesFederativasNordeste unidadeFederativaNordeste =
                FormatadorUtil.normalizarUnidadeFederativaSubestacao(partes[1].trim());

        String idAgentePrincipal = partes[2].trim();

        String agentePrincipal = null;
        if (!partes[3].isEmpty()) agentePrincipal = partes[3].trim();

        LocalDate dataPrevista = null;
        if (!partes[4].isEmpty()) dataPrevista = FormatadorUtil.parseData(partes[4].trim());

        LocalDate dataEntrada = null;
        Point coordenadas;

        String[] dataECoordenadas = partes[5].trim().split(",");

        if (!dataECoordenadas[0].isEmpty()) dataEntrada = FormatadorUtil.parseData(dataECoordenadas[0]);
        coordenadas = criarPonto(dataECoordenadas[1], dataECoordenadas[2]);

        return Subestacao.builder()
                .idInstalacao(idInstalacao)
                .nome(nome)
                .unidadeFederativaNordeste(unidadeFederativaNordeste)
                .idAgentePrincipal(idAgentePrincipal)
                .agentePrincipal(agentePrincipal)
                .dataPrevista(dataPrevista)
                .dataEntrada(dataEntrada)
                .coordenadas(coordenadas)
                .build();
    }

    private Point criarPonto(String longitudeStr, String latitudeStr) {
        try {
            double longitude = Double.parseDouble(longitudeStr);
            double latitude = Double.parseDouble(latitudeStr);
            return new GeometryFactory().createPoint(new Coordinate(longitude, latitude));
        } catch (NumberFormatException exception) {
            throw new CoordenadasInvalidasException("Coordenadas inválidas: " + longitudeStr + ", " + latitudeStr, exception);
        }
    }

    public List<LinhaDeTransmissao> lerLinhasDeTransissao(String caminho) {
        List<LinhaDeTransmissao> linhasDeTransmissao = new ArrayList<>();

        try (BufferedReader bufferedReaderr = new BufferedReader(
                new InputStreamReader(Files.newInputStream(Paths.get(caminho)), StandardCharsets.UTF_8))) {

            String linha;
            while ((linha = bufferedReaderr.readLine()) != null) {
                if (linha.trim().isEmpty()) continue;

                LinhaDeTransmissao linhaDeTransmissao = criarLinhaDeTransmissaoCsv(linha);
                linhasDeTransmissao.add(linhaDeTransmissao);
            }
        } catch (IOException exception) {
            throw new LeituraCsvException("Erro ao ler arquivo de linhas de transmissão CSV: " + caminho,
                    exception);
        }

        return linhasDeTransmissao;
    }

    private LinhaDeTransmissao criarLinhaDeTransmissaoCsv(String linhaCsv) {
        String[] partes = linhaCsv.split(";");

        String idInstalacao = partes[0].trim();
        String idEquipamento = partes[1].trim();

        String nome = partes[2].trim().replaceAll("\\s+", " ");

        String idTipoEquipamento = partes[3].trim();
        String tipoRede = partes[4].trim();

        String agenteProprietario = null;
        if (!partes[5].isEmpty()) agenteProprietario = partes[5].trim();

        String numeroOutorga = null;
        if (!partes[6].isEmpty()) numeroOutorga = partes[6].trim();

        double comprimentoKm = -1.0;
        if (!partes[16].isEmpty()) comprimentoKm = Double.parseDouble(partes[16].trim());

        double tensaoKv = 0.0;
        if (!partes[18].isEmpty()) tensaoKv = Double.parseDouble(partes[18].trim());

        LocalDate dataEntrada = null;
        if (!partes[20].isEmpty()) dataEntrada = FormatadorUtil.parseData(partes[20].trim());

        LocalDate dataPrevista = null;
        if (partes.length > 21 && !partes[21].isEmpty()) {
            dataPrevista = FormatadorUtil.parseData(partes[21].trim());
        }

        InformacoesAdministrativas informacoesAdministrativas =
            new InformacoesAdministrativas(
                idInstalacao,
                idEquipamento,
                nome,
                idTipoEquipamento,
                tipoRede,
                agenteProprietario,
                numeroOutorga,
                dataEntrada,
                dataPrevista);

        return LinhaDeTransmissao.builder()
                .informacoesAdministrativas(informacoesAdministrativas)
                .comprimentoKm(comprimentoKm)
                .tensaoKv(tensaoKv)
                .build();
    }
}
