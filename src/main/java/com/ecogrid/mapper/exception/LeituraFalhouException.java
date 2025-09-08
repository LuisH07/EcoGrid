package com.ecogrid.mapper.exception;

public class LeituraFalhouException extends RuntimeException {
    public LeituraFalhouException(String recurso, String detalhes) {
        super(String.format("Falha ao ler %s: %s.", recurso, detalhes));
    }
    public LeituraFalhouException(String recurso, Throwable detalhes) {
        super(String.format("Falha ao ler %s: %s.", recurso, detalhes));
    }
}