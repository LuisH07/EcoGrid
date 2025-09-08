package com.ecogrid.mapper.dto.response;

import com.ecogrid.mapper.model.Subestacao;
import com.ecogrid.mapper.model.transmissao.InformacoesAdministrativas;
import com.ecogrid.mapper.model.transmissao.LinhaDeTransmissao;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LinhaDeTransmissaoResponse {

    private String subestacaoAId;
    private String subestacaoANome;
    private String subestacaoBId;
    private String subestacaoBNome;

    private String idEquipamento;
    private String nomeEquipamento;
    private double comprimentoKm;
    private double tensaoKv;
    private boolean sensivel;

    public LinhaDeTransmissaoResponse(LinhaDeTransmissao linha) {
        Subestacao subestacaoA = linha.getSubestacaoA();
        Subestacao subestacaoB = linha.getSubestacaoB();
        InformacoesAdministrativas info = linha.getInformacoesAdministrativas();

        if (subestacaoA != null) {
            this.subestacaoAId = subestacaoA.getIdInstalacao();
            this.subestacaoANome = subestacaoA.getNome();
        }

        if (subestacaoB != null) {
            this.subestacaoBId = subestacaoB.getIdInstalacao();
            this.subestacaoBNome = subestacaoB.getNome();
        }

        if (info != null) {
            this.idEquipamento = info.getIdEquipamento();
            this.nomeEquipamento = info.getNome();
        }

        this.comprimentoKm = linha.getComprimentoKm();
        this.tensaoKv = linha.getTensaoKv();
        this.sensivel = linha.isSensivel();
    }
}
