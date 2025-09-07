package com.ecogrid.mapper;

import com.ecogrid.mapper.facade.GrafoFacade;
import com.ecogrid.mapper.ui.MenuPrincipal;

public class EcogridMapperApplication {

    public static void main(String[] args) {
        GrafoFacade grafoFacade = new GrafoFacade();

        String caminhoSubestacoes = "src/main/resources/data/subestacoes.csv";
        String caminhoLinhasDeTransmissao = "src/main/resources/data/linhas-de-transmissao.csv";
        String caminhoAreasProtegidas = "src/main/resources/data/limites_ucs_federais_21072025/limites_ucs_federais_21072025.shp";

        grafoFacade.carregarGrafo(caminhoSubestacoes, caminhoLinhasDeTransmissao, caminhoAreasProtegidas);

        MenuPrincipal menuPrincipal = new MenuPrincipal(grafoFacade);
        menuPrincipal.iniciar();
    }
}
