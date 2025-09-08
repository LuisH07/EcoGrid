package com.ecogrid.mapper.dto;

public record SubestacaoDTO(
        String idInstalacao,
        String nome,
        String uf,
        String agente,
        Double latitude,
        Double longitude
) {}