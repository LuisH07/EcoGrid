package com.ecogrid.mapper.controller;

import com.ecogrid.mapper.facade.GrafoFacade;
import com.ecogrid.mapper.model.AreaProtegida;
import com.ecogrid.mapper.model.Subestacao;
import com.ecogrid.mapper.model.transmissao.LinhaDeTransmissao;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class GrafoController {

    private final GrafoFacade grafoFacade;

    @GetMapping("subestacoes")
    public List<Map<String, Object>> getAllSubestacoes() {
        return grafoFacade.findAllSubestacoes().stream().map(sub -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", sub.getId());
            map.put("nome", sub.getNome());
            map.put("uf", sub.getUnidadeFederativaNordeste());
            map.put("latitude", sub.getCoordenadas().getY());
            map.put("longitude", sub.getCoordenadas().getX());
            map.put("agentePrincipal", sub.getAgentePrincipal());
            map.put("dataPrevista", sub.getDataPrevista());
            map.put("dataEntrada", sub.getDataEntrada());
            return map;
        }).collect(Collectors.toList());
    }

    @GetMapping("areasProtegidas")
    public List<Map<String, Object>> getAllAreasProtegidas() {
        return grafoFacade.findAllAreaProtegida().stream().map(area -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", area.getId());
            map.put("nome", area.getNome());
            map.put("uf", area.getUnidadeFederativaNordeste());
            map.put("medidaArea", area.getMedidaArea());
            return map;
        }).collect(Collectors.toList());
    }

    @GetMapping("linhasDeTransmissao")
    public List<Map<String, Object>> getAllLinhasDeTransmissao() {
        return grafoFacade.findAllLinhasDeTranmissao().stream().map(linha -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", linha.getId());
            map.put("subestacaoA", linha.getSubestacaoA().getNome());
            map.put("subestacaoB", linha.getSubestacaoB().getNome());
            map.put("comprimentoKm", linha.getComprimentoKm());
            map.put("tensaoKv", linha.getTensaoKv());
            map.put("sensivel", linha.isSensivel());
            return map;
        }).collect(Collectors.toList());
    }

    @GetMapping("centralidade")
    public Map<String, Integer> getCentralidade() {
        return grafoFacade.analisarCentralidade().entrySet().stream()
                .collect(Collectors.toMap(
                        entry -> entry.getKey().getNome(),
                        Map.Entry::getValue,
                        (v1, v2) -> v1 // em caso de duplicatas, mantém o primeiro
                ));
    }
}