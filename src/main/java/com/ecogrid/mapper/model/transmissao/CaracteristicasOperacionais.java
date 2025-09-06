package com.ecogrid.mapper.model.transmissao;

import lombok.*;

@Getter
@ToString
@AllArgsConstructor
public class CaracteristicasOperacionais {
    private final double longaSL;
    private final double curtaSL;
    private final double longaCL;
    private final double curtaCL;
    private final double fatorLimitanteLonga;
    private final double fatorLimitanteCurta;
    private final double resistencia;         // %
    private final double reatancia;           // %
    private final double susceptanciaShunt;   // MVAr
    private final double tensao;              // kV
}