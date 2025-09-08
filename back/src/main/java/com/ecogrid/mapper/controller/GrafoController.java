package com.ecogrid.mapper.controller;

import com.ecogrid.mapper.dto.response.AreaProtegidaResponse;
import com.ecogrid.mapper.dto.response.LinhaDeTransmissaoResponse;
import com.ecogrid.mapper.dto.response.SubestacaoResponse;
import com.ecogrid.mapper.facade.GrafoFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class GrafoController {
    private final GrafoFacade grafoFacade;

    @GetMapping("subestacoes")
    public List<SubestacaoResponse> getAllSubestacoes() {
        return grafoFacade.findAllSubestacoes()
                .stream()
                .map(SubestacaoResponse::new)
                .toList();
    }

    @GetMapping("subestacoes/buscar")
    public SubestacaoResponse getSubestacaoByNome(@RequestParam("nomeSubestacao") String nomeSubestacao) {
        return new SubestacaoResponse(grafoFacade.findSubestacaoByNome(nomeSubestacao));
    }

    @GetMapping("linhasDeTransmissao")
    public List<LinhaDeTransmissaoResponse> getAllLinhaDeTransmissao() {
        return grafoFacade.findAllLinhasDeTransmissao()
                .stream()
                .map(LinhaDeTransmissaoResponse::new)
                .toList();
    }

    @GetMapping("areasProtegidas")
    public List<AreaProtegidaResponse> getAllAreaProtegida() {
        return grafoFacade.findAllAreaProtegida()
                .stream()
                .map(AreaProtegidaResponse::new)
                .toList();
    }

    @GetMapping("rotaSegura")
    public List<List<SubestacaoResponse>> getRotaSegura(
            @RequestParam("nomeSubOrigem") String nomeSubOrigem,
            @RequestParam("nomeSubDestino") String nomeSubDestino) {

        return grafoFacade.findRotaSegura(nomeSubOrigem, nomeSubDestino)
                .stream()
                .map(rota -> rota.stream()
                        .map(SubestacaoResponse::new)
                        .toList())
                .toList();
    }

    @GetMapping("subestacoes/criticas")
    public Set<SubestacaoResponse> getSubestacoesCriticas() {
        return grafoFacade.findSubestacoesCriticas()
                .stream()
                .map(SubestacaoResponse::new)
                .collect(Collectors.toSet());
    }

    @GetMapping("linhasDeTransmissao/criticas")
    public List<LinhaDeTransmissaoResponse> getLinhasDeTransmissaoCriticas() {
        return grafoFacade.findLinhasDeTransmissaoCriticas()
                .stream()
                .map(LinhaDeTransmissaoResponse::new)
                .toList();
    }

}