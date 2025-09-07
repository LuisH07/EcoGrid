package com.ecogrid.mapper.service;

import com.ecogrid.mapper.model.transmissao.LinhaDeTransmissao;
import com.ecogrid.mapper.model.Subestacao;
import com.ecogrid.mapper.util.FormatadorUtil;
import lombok.Getter;
import org.locationtech.jts.geom.Point;
import java.util.*;

public class GrafoService {
    @Getter
    private final Map<Subestacao, List<LinhaDeTransmissao>> grafo = new HashMap<>();

    // -------------------------------------- Subestações

    public List<Subestacao> findAllSubestacao() {
        return new ArrayList<>(grafo.keySet());
    }

    public Subestacao findSubestacaoByNome(String nome) {
        return findSubestacaoByPalavras(
                nome.trim()
                .replace(".", " ")
                .toUpperCase()
                .split("\\s+"));
    }

    private Subestacao findSubestacaoByPalavras(String[] palavras) {
        return grafo.keySet().stream()
                .filter(sub -> {
                    String nomeUpper = sub.getNome().toUpperCase();
                    return Arrays.stream(palavras)
                            .allMatch(nomeUpper::contains);
                })
                .findFirst()
                .orElse(null);
    }

    public List<Subestacao> findSubestacoesByNomeLinha(String nomeLinha) {
        String nomeLinhaFormatado = FormatadorUtil.normalizarNomeLinha(nomeLinha);

        String[] nomesDasSubestacoes = nomeLinhaFormatado.split("/");

        String[] palavrasSubA = nomesDasSubestacoes[0]
                .trim()
                .replace(".", " ")
                .toUpperCase()
                .split("\\s+");

        String[] palavrasSubB = nomesDasSubestacoes[1]
                .trim()
                .replace(".", " ")
                .toUpperCase()
                .split("\\s+");

        Set<String> abreviacoesSet = Set.of("NSA", "SR", "SRA", "BRJ", "VLH", "STO", "STA", "VTS");

        palavrasSubA = Arrays.stream(palavrasSubA)
                .map(palavra -> abreviacoesSet.contains(palavra.toUpperCase()) ? "" : palavra)
                .toArray(String[]::new);

        palavrasSubB = Arrays.stream(palavrasSubB)
                .map(palavra -> abreviacoesSet.contains(palavra.toUpperCase()) ? "" : palavra)
                .toArray(String[]::new);

        Subestacao subA = findSubestacaoByPalavras(palavrasSubA);
        Subestacao subB = findSubestacaoByPalavras(palavrasSubB);

        if (subA != null && subB != null) {
            return List.of(subA, subB);
        }

        return Collections.emptyList();
    }

    public int findQuantidadeDeSubestacoes() {
        return grafo.size();
    }

    public void importarSubestacoes(List<Subestacao> subestacoes) {
        for (Subestacao subestacao : subestacoes) {
            createSubestacao(subestacao);
        }
    }

    public void createSubestacao(Subestacao subestacao) {
        grafo.put(subestacao, new ArrayList<>());
    }

    public void deleteSubestacao(Subestacao subestacao) {
        List<LinhaDeTransmissao> linhasSubestacao = new ArrayList<>(grafo.get(subestacao));
        for (LinhaDeTransmissao linha : linhasSubestacao) {
            deleteLinhaDeTransmissao(linha);
        }
        grafo.remove(subestacao);
    }

    // -------------------------------------- Linhas de transmissão

    public List<LinhaDeTransmissao> findAllLinhasDeTranmissao() {
        List<LinhaDeTransmissao> allLinhas = new ArrayList<>();

        for (List<LinhaDeTransmissao> linhas: grafo.values()) {
            for (LinhaDeTransmissao linhaDeTransmissao : linhas){
                if (!allLinhas.contains(linhaDeTransmissao)) allLinhas.add(linhaDeTransmissao);
            }
        }
        return allLinhas;
    }

    public List<LinhaDeTransmissao> findLinhasBySubestacao(Subestacao subestacao) {
        return new ArrayList<>(grafo.get(subestacao));
    }

    public int findQuantidadeDeLinhasDeTransmissao() {
        return Math.toIntExact(grafo.values().stream()
                .flatMap(List::stream)
                .distinct()
                .count());
    }

    public void importarLinhasDeTransmissao(List<LinhaDeTransmissao> linhasDeTransmissaos) {
        for (LinhaDeTransmissao linha : linhasDeTransmissaos){
            createLinhaDeTransmissao(linha);
        }
    }

    public void createLinhaDeTransmissao(LinhaDeTransmissao linha) {
        Subestacao subestacaoA = linha.getSubestacaoA();
        Subestacao subestacaoB = linha.getSubestacaoB();

        grafo.get(subestacaoA).add(linha);
        grafo.get(subestacaoB).add(linha);
    }

    public void deleteLinhaDeTransmissao(LinhaDeTransmissao linha) {
        Subestacao subestacaoA = linha.getSubestacaoA();
        Subestacao subestacaoB = linha.getSubestacaoB();

        List<LinhaDeTransmissao> listaA = grafo.get(subestacaoA);
        List<LinhaDeTransmissao> listaB = grafo.get(subestacaoB);

        if (listaA != null) listaA.remove(linha);
        if (listaB != null) listaB.remove(linha);
    }

    // -------------------------------------- Caminhos

    public List<Subestacao> algoritmoAStar(Subestacao origem, Subestacao destino) {
        Map<Subestacao, Double> custoG = new HashMap<>();
        Map<Subestacao, Subestacao> veioDe = new HashMap<>();
        Map<Subestacao, Double> fScore = new HashMap<>();
        Set<Subestacao> visitados = new HashSet<>();

        PriorityQueue<Subestacao> filaPrioritaria = new PriorityQueue<>(Comparator.comparingDouble(sub ->
                fScore.getOrDefault(sub, Double.MAX_VALUE)));

        for (Subestacao sub : findAllSubestacao()) {
            custoG.put(sub, Double.MAX_VALUE);
            fScore.put(sub, Double.MAX_VALUE);
        }

        custoG.put(origem, 0.0);
        fScore.put(origem, heuristica(origem, destino));
        filaPrioritaria.add(origem);

        while (!filaPrioritaria.isEmpty()) {
            Subestacao atual = filaPrioritaria.poll();

            if (atual.equals(destino)) {
                return reconstruirCaminho(veioDe, atual);
            }

            visitados.add(atual);

            for (LinhaDeTransmissao linha : grafo.getOrDefault(atual, Collections.emptyList())) {
                Subestacao vizinho = findVizinho(atual, linha);

                if (vizinho == null || visitados.contains(vizinho)) continue;
                if (linha.isSensivel()) continue;

                double custoTentativo = custoG.get(atual) + linha.getComprimentoKm();

                if (custoTentativo < custoG.get(vizinho)) {
                    veioDe.put(vizinho, atual);
                    custoG.put(vizinho, custoTentativo);
                    fScore.put(vizinho, custoTentativo + heuristica(vizinho, destino));

                    //garante atualização da fila
                    filaPrioritaria.remove(vizinho);
                    filaPrioritaria.add(vizinho);
                }
            }
        }
        return Collections.emptyList();
    }

    public double calcularDistancia(Point pointA, Point pointB) {
        if (pointA == null || pointB == null) return Double.MAX_VALUE;

        double longitude1 = pointA.getX();
        double latitude1 = pointA.getY();

        double longitude2 = pointB.getX();
        double latitude2 = pointB.getY();

        double deltaLongitudeKm = (longitude2 - longitude1) * 111.32 * Math.cos(Math.toRadians((latitude1 + latitude2) / 2));
        double deltaLatitudeKm = (latitude2 - latitude1) * 111.32;

        return Math.sqrt(deltaLongitudeKm * deltaLongitudeKm + deltaLatitudeKm * deltaLatitudeKm);
    }

    private double heuristica(Subestacao subA, Subestacao subB) {
        return calcularDistancia(subA.getCoordenadas(), subB.getCoordenadas());
    }

    private Subestacao findVizinho(Subestacao subestacao, LinhaDeTransmissao linha) {
        if (subestacao.equals(linha.getSubestacaoA())) return linha.getSubestacaoB();
        if (subestacao.equals(linha.getSubestacaoB())) return linha.getSubestacaoA();

        return null;
    }

    private List<Subestacao> reconstruirCaminho(Map<Subestacao, Subestacao> veioDe, Subestacao atual) {
        List<Subestacao> caminho = new ArrayList<>();
        caminho.add(atual);

        while (veioDe.containsKey(atual)) {
            atual = veioDe.get(atual);
            caminho.add(0, atual);
        }
        return caminho;
    }

    public double calcularEconomia(List<Subestacao> rota, int inicio, int fim){
        double distanciaAtual = 0;

        for (int i = inicio; i < fim; i++) {
            distanciaAtual += calcularDistancia(rota.get(i).getCoordenadas(),
                    rota.get(i +1).getCoordenadas());
        }

        double distanciaAtalho = calcularDistancia(rota.get(inicio).getCoordenadas(),
                rota.get(fim).getCoordenadas());

        return distanciaAtual - distanciaAtalho;
    }

    public double calcularDistanciaTotal(List<Subestacao> rota, int inicio, int fim){
        double total = 0;
        for (int i = inicio; i < fim; i++) {
            total += calcularDistancia(rota.get(i).getCoordenadas(), rota.get(i+1).getCoordenadas());
        }
        return total;
    }

    public void aplicarAtalho(List<Subestacao> rota, int inicio, int fim) {
        rota.subList(inicio + 1, fim).clear();
    }

    public boolean isConexo() {
        Set<Subestacao> visitados = new HashSet<>();
        Subestacao primeiroVertice = grafo.keySet().iterator().next();

        buscaEmProfundidade(primeiroVertice, visitados);

        return visitados.size() == grafo.size();
    }

    private void buscaEmProfundidade(Subestacao atual, Set<Subestacao> visitados) {
        if (visitados.contains(atual)) {
            return;
        }

        visitados.add(atual);

        List<LinhaDeTransmissao> adjacentes = grafo.get(atual);
        if (adjacentes != null) {
            for (LinhaDeTransmissao linha : adjacentes) {
                Subestacao vizinho = findVizinho(atual, linha);
                if (vizinho != null) {
                    buscaEmProfundidade(vizinho, visitados);
                }
            }
        }
    }
}
