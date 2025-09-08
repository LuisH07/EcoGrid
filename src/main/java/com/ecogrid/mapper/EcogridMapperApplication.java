package com.ecogrid.mapper;

import com.ecogrid.mapper.facade.GrafoFacade;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
public class EcogridMapperApplication {

    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(EcogridMapperApplication.class, args);

        GrafoFacade grafoFacade = context.getBean(GrafoFacade.class);

        String caminhoSubestacoes = "src/main/resources/data/subestacoes.csv";
        String caminhoLinhasDeTransmissao = "src/main/resources/data/linhas-de-transmissao.csv";
        String caminhoAreasProtegidas = "src/main/resources/data/limites_ucs_federais_21072025/limites_ucs_federais_21072025.shp";

        grafoFacade.carregarGrafo(caminhoSubestacoes, caminhoLinhasDeTransmissao, caminhoAreasProtegidas);

        System.out.println("Grafo carregado no startup!");
    }

}
