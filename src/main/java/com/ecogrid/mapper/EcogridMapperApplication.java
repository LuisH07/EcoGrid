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

        String caminhoSubestacoes = "/app/data/subestacoes.csv";
        String caminhoLinhasDeTransmissao = "/app/data/linhas-de-transmissao.csv";
        String caminhoAreasProtegidas = "/app/data/limites_ucs_federais_21072025/limites_ucs_federais_21072025.shp";

        grafoFacade.carregarGrafo(caminhoSubestacoes, caminhoLinhasDeTransmissao, caminhoAreasProtegidas);

        System.out.println("Grafo carregado");
    }
}
