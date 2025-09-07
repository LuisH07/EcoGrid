package com.ecogrid.mapper.ui;

import com.ecogrid.mapper.facade.GrafoFacade;
import com.ecogrid.mapper.model.Subestacao;
import com.ecogrid.mapper.model.transmissao.InformacoesAdministrativas;
import com.ecogrid.mapper.model.transmissao.LinhaDeTransmissao;
import com.ecogrid.mapper.util.FormatadorUtil;
import java.util.List;
import java.util.Scanner;

public class MenuPrincipal {
    private final GrafoFacade grafoFacade;
    private final Scanner scanner = new Scanner(System.in);

    public MenuPrincipal(GrafoFacade grafoFacade) {
        this.grafoFacade = grafoFacade;
    }

    public void iniciar() {
        boolean sair = false;

        while (!sair) {
            exibirOpcoes();
            int opcao = lerOpcao();

            switch (opcao) {
                case 1 -> imprimirSubestacoes(grafoFacade.getAllSubestacoes());
                case 2 -> imprimirLinhasDeTransmissao(grafoFacade.getAllLinhasDeTranmissao());
//                case 3 -> encontrarRota();
//                case 4 -> grafoFacade.analisarKConectividade();
//                case 5 -> grafoFacade.analisarCentralidade();
                case 0 -> {
                    System.out.println("\nSaindo do sistema");
                    sair = true;
                }
                default -> System.out.println("\nOpção inválida! Tente novamente.");
            }
        }
    }

    private void exibirOpcoes() {
        String stringBuilder = new StringBuilder()
                .append("\nMENU PRINCIPAL\n\n")
                .append("1 - Listar subestações\n")
                .append("2 - Listar linhas de transmissão\n")
//                .append("3 - Encontrar rota segura entre subestações\n");
//                .append("4 - Analisar k-conectividade e pontos críticos\n");
//                .append("5 - Analisar centralidade da rede\n");
                .append("0 - Sair\n\n")
                .append("Escolha uma opção: ")
                .toString();

        System.out.print(stringBuilder);
    }

    private int lerOpcao() {
        try {
            return Integer.parseInt(scanner.nextLine().trim());
        } catch (NumberFormatException e) {
            return -1;
        }
    }

    private void imprimirSubestacoes(List<Subestacao> subestacoes) {
        System.out.println("\nTotal de subestações: " + subestacoes.size() + "\n");

        for (Subestacao sub : subestacoes) {
            System.out.println("ID: " + sub.getIdInstalacao());
            System.out.println("Nome: " + sub.getNome());
            System.out.println("UF: " + sub.getUnidadeFederativaNordeste());
            System.out.println("ID agente principal: " + sub.getIdAgentePrincipal());
            System.out.println("Agente principal: " + (sub.getAgentePrincipal() != null ? sub.getAgentePrincipal() : "N/A"));
            System.out.println("Data Entrada: " + (FormatadorUtil.formatarDataToString(sub.getDataEntrada())));
            System.out.println("Data Prevista: " + (FormatadorUtil.formatarDataToString(sub.getDataPrevista())));
            System.out.println("Coordenadas: " + FormatadorUtil.formatarCoordenadasToString(sub.getCoordenadas()));
            System.out.println();
        }
    }

    private void imprimirLinhasDeTransmissao(List<LinhaDeTransmissao> linhas) {
        System.out.println("\nTotal de linhas de transmissão: " + linhas.size());
        System.out.println();

        for (LinhaDeTransmissao linha : linhas) {
            InformacoesAdministrativas info = linha.getInformacoesAdministrativas();

            System.out.println("ID Instalação: " + info.getIdInstalacao());
            System.out.println("ID Equipamento: " + info.getIdEquipamento());
            System.out.println("Nome: " + info.getNome());
            System.out.println("ID Tipo Equipamento: " + info.getIdTipoEquipamento());
            System.out.println("Tipo Rede: " + info.getTipoRede());
            System.out.println("Número Outorga: " + (info.getNumeroOutorga() != null ? info.getNumeroOutorga() : "N/A"));
            System.out.println("Agente Proprietário: " + (info.getAgenteProprietario() != null ? info.getAgenteProprietario() : "N/A"));
            System.out.println("Data Entrada: " + FormatadorUtil.formatarDataToString(info.getDataEntrada()));
            System.out.println("Data Prevista: " + FormatadorUtil.formatarDataToString(info.getDataPrevista()));

            String subA = linha.getSubestacaoA() != null ? linha.getSubestacaoA().getNome() : "N/A";
            String subB = linha.getSubestacaoB() != null ? linha.getSubestacaoB().getNome() : "N/A";
            System.out.println("Subestação A: " + subA);
            System.out.println("Subestação B: " + subB);

            System.out.println("Comprimento: " + FormatadorUtil.formatarComprimentoToString(linha.getComprimentoKm()));
            System.out.println("Tensão: " + String.format("%.1f kV", linha.getTensaoKv()));
            System.out.println("Sensível: " + (linha.isSensivel() ? "Sim" : "Não"));

            System.out.println();
        }
    }

    private void encontrarRota() {
        System.out.print("Digite o nome da subestação de origem: ");
        String nomeOrigem = scanner.nextLine().trim();

        System.out.print("Digite o nome da subestação de destino: ");
        String nomeDestino = scanner.nextLine().trim();

        Subestacao origem = grafoFacade.buscarSubestacaoPorNome(nomeOrigem);
        Subestacao destino = grafoFacade.buscarSubestacaoPorNome(nomeDestino);

        if (origem == null || destino == null) {
            System.out.println("Origem ou destino não encontrados!");
            return;
        }

        List<Subestacao> caminho = grafoFacade.encontrarCaminhoSeguro(origem, destino);

        if (caminho.isEmpty()) {
            System.out.println("Não existe rota segura entre as subestações.");
        } else {
            System.out.println("Rota encontrada:");
            for (int i = 0; i < caminho.size(); i++) {
                Subestacao sub = caminho.get(i);
                System.out.printf("%d. %s (%s)%n", i + 1, sub.getNome(), sub.getUnidadeFederativaNordeste());
            }
        }
    }

}