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

    @Setter
    private Subestacao subestacaoA;
    @Setter
    private Subestacao subestacaoB;

    private final InformacoesAdministrativas informacoesAdministrativas;

    @Setter
    private double comprimentoKm;
    private final double tensaoKv;

    @Setter
    private boolean sensivel = false;

    @Builder
    private LinhaDeTransmissao(
            Subestacao subestacaoA,
            Subestacao subestacaoB,
            InformacoesAdministrativas informacoesAdministrativas,
            double comprimentoKm,
            double tensaoKv
    ) {
        this.id = COUNTER.incrementAndGet();
        this.subestacaoA = subestacaoA;
        this.subestacaoB = subestacaoB;
        this.informacoesAdministrativas = informacoesAdministrativas;
        this.comprimentoKm = comprimentoKm;
        this.tensaoKv = tensaoKv;
    }
}
