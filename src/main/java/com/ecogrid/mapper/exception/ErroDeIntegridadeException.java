package com.ecogrid.mapper.exception;

public class ErroDeIntegridadeException extends RuntimeException {
    public ErroDeIntegridadeException(String recurso, String motivo) {
        super(String.format("Erro de integridade em %s: %s.", recurso, motivo));
    }
}