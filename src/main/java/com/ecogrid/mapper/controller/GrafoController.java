package com.ecogrid.mapper.controller;

import com.ecogrid.mapper.facade.GrafoFacade;
import com.ecogrid.mapper.model.AreaProtegida;
import com.ecogrid.mapper.model.Subestacao;
import com.ecogrid.mapper.model.transmissao.LinhaDeTransmissao;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class GrafoController {
    private final GrafoFacade grafoFacade;

    @GetMapping("subestacoes")
    public List<Subestacao> getAllSubestacao() {
        return grafoFacade.findAllSubestacoes();
    }

    @GetMapping("areasProtegidas")
    public List<AreaProtegida> getAllAreaProtegida() {
        return grafoFacade.findAllAreaProtegida();
    }

    @GetMapping("linhasDeTransmissao")
    public List<LinhaDeTransmissao> getAllLinhasDeTranmissao() {
        return grafoFacade.findAllLinhasDeTranmissao();
    }

    @GetMapping("centralidade")
    public Map<String, Integer> getCentralidade() {
        return grafoFacade.analisarCentralidade()
                .entrySet()
                .stream()
                .collect(Collectors.toMap(
                        entry -> entry.getKey().getNome(),
                        Map.Entry::getValue,
                        Integer::sum // soma em caso de duplicata
                ));
    }

}
