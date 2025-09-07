package com.ecogrid.mapper.facade;

import com.ecogrid.mapper.exception.LinhaDeTransmissaoInvalidaException;
import com.ecogrid.mapper.exception.LinhaDeTransmissaoNaoEncontradaException;
import com.ecogrid.mapper.exception.SubestacaoInvalidaException;
import com.ecogrid.mapper.exception.SubestacaoNaoEncontradaException;
import com.ecogrid.mapper.model.AreaProtegida;
import com.ecogrid.mapper.model.Subestacao;
import com.ecogrid.mapper.model.transmissao.LinhaDeTransmissao;
import com.ecogrid.mapper.service.*;

import java.util.ArrayList;
import java.util.List;

public class GrafoFacade {
    private final LeitorCsvService leitorCsvService;
    private final LeitorShapefileService leitorShapefileService;

    public GrafoFacade() {
        this.leitorCsvService = new LeitorCsvService();
        this.leitorShapefileService = new LeitorShapefileService();
        this.grafoService = new GrafoService();
        this.areaProtegidaService = new AreaProtegidaService();
    }

    // -------------------------------------- Area Protegida

    private final AreaProtegidaService areaProtegidaService;

    public List<AreaProtegida> findAllAreaProtegida() {
        return areaProtegidaService.findAllAreaProtegida();
    }

    public boolean verificarInterseccaoEntreDuasSubestacoes(Subestacao subestacaoA, Subestacao subestacaoB) {
        if (subestacaoA == null || subestacaoB == null) {
            throw new SubestacaoInvalidaException("Subestação inválida");
        }
        return areaProtegidaService.verificarInterseccaoEntreDuasSubestacoes(subestacaoA, subestacaoB);
    }

    // -------------------------------------- Grafo

    private final GrafoService grafoService;

    public void carregarGrafo(String caminhoSubestacoes, String caminhoLinhasDeTransmissao, String caminhoAreasProtegidas) {

        List<Subestacao> subestacoes = leitorCsvService.lerSubestacoes(caminhoSubestacoes);
        grafoService.importarSubestacoes(subestacoes);

        List<AreaProtegida> areasProtegidas = leitorShapefileService.lerAreasProtegidas(caminhoAreasProtegidas);
        areaProtegidaService.carregarAreasProtegidas(areasProtegidas);

        List<LinhaDeTransmissao> linhasDeTransmissao = leitorCsvService.lerLinhasDeTransissao(caminhoLinhasDeTransmissao);
        for (LinhaDeTransmissao linha : linhasDeTransmissao) {
            List<Subestacao> subestacoesDaLinha =
                    grafoService.findSubestacoesByNomeLinha(linha.getInformacoesAdministrativas().getNome());

            if (subestacoesDaLinha.isEmpty()) {
                throw new SubestacaoNaoEncontradaException("Subestações da linha não encontradas");
            }

            linha.setSubestacaoA(subestacoesDaLinha.get(0));
            linha.setSubestacaoB(subestacoesDaLinha.get(1));

            if (linha.getComprimentoKm() == -1.0) {
                linha.setComprimentoKm(grafoService.calcularDistancia(subestacoesDaLinha.get(0).getCoordenadas(),
                        subestacoesDaLinha.get(1).getCoordenadas()));
            }

            linha.setSensivel(areaProtegidaService.verificarInterseccaoEntreDuasSubestacoes(linha.getSubestacaoA(), linha.getSubestacaoB()));
        }
        grafoService.importarLinhasDeTransmissao(linhasDeTransmissao);
    }

    public List<Subestacao> findAllSubestacoes() {
        return grafoService.findAllSubestacao();
    }

    public Subestacao findSubestacaoByNome(String nome) {
        return grafoService.findSubestacaoByNome(nome);
    }

    public List<LinhaDeTransmissao> findAllLinhasDeTranmissao() {
        return grafoService.findAllLinhasDeTranmissao();
    }

    public int findQuantidadeDeSubestacoes() {
        return grafoService.findQuantidadeDeSubestacoes();
    }

    public List<LinhaDeTransmissao> findLinhasBySubestacao(Subestacao subestacao) {
        if (subestacao == null) {
            throw new SubestacaoInvalidaException("Subestação inválida");
        }

        if (!grafoService.getGrafo().containsKey(subestacao)) {
            throw new SubestacaoNaoEncontradaException("Subestação não encontrada no grafo");
        }

        return grafoService.findLinhasBySubestacao(subestacao);
    }

    public int findQuantidadeDeLinhasDeTransmissao() {
        return grafoService.findQuantidadeDeLinhasDeTransmissao();
    }

    public void createLinhaDeTransmissao(LinhaDeTransmissao linhaDeTransmissao) {
        if (linhaDeTransmissao == null) {
            throw new LinhaDeTransmissaoInvalidaException("Linha de transmissão inválida");
        }

        Subestacao subestacaoA = linhaDeTransmissao.getSubestacaoA();
        Subestacao subestacaoB = linhaDeTransmissao.getSubestacaoB();

        if (subestacaoA == null || subestacaoB == null) {
            throw new SubestacaoInvalidaException("Subestação inválida");
        }

        if (!grafoService.getGrafo().containsKey(subestacaoA) || !grafoService.getGrafo().containsKey(subestacaoB)) {
            throw new SubestacaoNaoEncontradaException("Subestação não encontrada no grafo");
        }

        grafoService.createLinhaDeTransmissao(linhaDeTransmissao);
    }

    public void deleteLinhaDeTransmissao(LinhaDeTransmissao linhaDeTransmissao) {
        if (linhaDeTransmissao == null) {
            throw new LinhaDeTransmissaoInvalidaException("Linha de transmissão inválida");
        }

        if (!grafoService.findAllLinhasDeTranmissao().contains(linhaDeTransmissao)) {
            throw new LinhaDeTransmissaoNaoEncontradaException("Linha de tramissão não encontrada no grafo");
        }

        grafoService.deleteLinhaDeTransmissao(linhaDeTransmissao);
    }

    public List<Subestacao> encontrarRotaSegura(Subestacao subOrigem, Subestacao subDestino) {
        List<Subestacao> rota = grafoService.algoritmoAStar(subOrigem, subDestino);

        if (rota.size() < 3) {
            return rota;
        }

        List<Subestacao> rotaMelhorada = new ArrayList<>(rota);
        boolean flagMelhoria;
        int contador = 0;

        do {
            flagMelhoria = false;

            for (int i = 0; i < rotaMelhorada.size() - 2; i++) {
                for (int j = i + 2; j < rotaMelhorada.size(); j++) {
                    Subestacao subA = rotaMelhorada.get(i);
                    Subestacao subB = rotaMelhorada.get(j);

                    if (!areaProtegidaService.verificarInterseccaoEntreDuasSubestacoes(subA, subB)) {
                        double economia = grafoService.calcularEconomia(rotaMelhorada, i, j);
                        double percentualEconomia = economia / grafoService.calcularDistanciaTotal(rotaMelhorada, i, j);

                        if (percentualEconomia > 0.05) {
                            grafoService.aplicarAtalho(rotaMelhorada, i, j);
                            flagMelhoria = true;
                            break;
                        }
                    }

                }
                if (flagMelhoria) break;
            }
            contador++;
        } while (flagMelhoria && contador < 150);

        return rotaMelhorada;
    }

}
