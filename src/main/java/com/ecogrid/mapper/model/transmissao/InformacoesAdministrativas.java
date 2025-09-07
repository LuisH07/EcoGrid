package com.ecogrid.mapper.model.transmissao;

import lombok.*;
import java.time.LocalDate;

@Getter
@ToString
@AllArgsConstructor
public class InformacoesAdministrativas {
    private final String idInstalacao;
    private final String idEquipamento;
    private final String nome;
    private final String idTipoEquipamento;
    private final String tipoRede;
    private final String agenteProprietario;
    private final String numeroOutorga;
    private final LocalDate dataEntrada;
    private final LocalDate dataPrevista;
}
