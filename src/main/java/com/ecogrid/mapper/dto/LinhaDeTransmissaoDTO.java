package com.ecogrid.mapper.dto;

public record LinhaDeTransmissaoDTO(
        String id,
        String subestacaoA,
        String subestacaoB,
        Double comprimento,
        Double tensao
) {}