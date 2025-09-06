package com.ecogrid.mapper.model.transmissao;

import com.ecogrid.mapper.model.Subestacao;
import lombok.*;
import java.util.concurrent.atomic.AtomicLong;

@Getter
@ToString
@EqualsAndHashCode(of = "id")
public class LinhaDeTransmissao {
    private static final AtomicLong COUNTER = new AtomicLong(0);
    private final long id;

    private final Subestacao subestacaoA;
    private final Subestacao subestacaoB;

    private final CaracteristicasOperacionais caracteristicasOperacionais;
    private final InformacoesAdministrativas informacoesAdministrativas;

    private final double comprimentoKm;

    @Setter
    private boolean interceptaAreaProtegida = false;

    @Builder
    private LinhaDeTransmissao(
            Subestacao subestacaoA,
            Subestacao subestacaoB,
            CaracteristicasOperacionais caracteristicasOperacionais,
            InformacoesAdministrativas infos,
            double comprimentoKm
    ) {
        this.id = COUNTER.incrementAndGet();
        this.subestacaoA = subestacaoA;
        this.subestacaoB = subestacaoB;
        this.caracteristicasOperacionais = caracteristicasOperacionais;
        this.informacoesAdministrativas = infos;
        this.comprimentoKm = comprimentoKm;
    }
}
