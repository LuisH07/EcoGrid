package com.ecogrid.mapper.dto.response;

import com.ecogrid.mapper.model.Subestacao;
import com.ecogrid.mapper.model.enums.UnidadesFederativasNordeste;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class SubestacaoResponse {
    private String idInstalacao;
    private String nome;
    private UnidadesFederativasNordeste unidadeFederativaNordeste;
    private String idAgentePrincipal;
    private String agentePrincipal;
    private LocalDate dataPrevista;
    private LocalDate dataEntrada;
    private double latitude;
    private double longitude;

    public SubestacaoResponse(Subestacao sub) {
        this.idInstalacao = sub.getIdInstalacao();
        this.nome = sub.getNome();
        this.unidadeFederativaNordeste = sub.getUnidadeFederativaNordeste();
        this.idAgentePrincipal = sub.getIdAgentePrincipal();
        this.agentePrincipal = sub.getAgentePrincipal();
        this.dataPrevista = sub.getDataPrevista();
        this.dataEntrada = sub.getDataEntrada();
        if (sub.getCoordenadas() != null) {
            this.latitude = sub.getCoordenadas().getY();
            this.longitude = sub.getCoordenadas().getX();
        }
    }
}
