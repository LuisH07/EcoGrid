package com.ecogrid.mapper.exception;

public class RecursoInvalidoException extends RuntimeException {
    public RecursoInvalidoException(String recurso, String motivo) {
        super(String.format("%s é inválido: %s.", recurso, motivo));
    }

    public RecursoInvalidoException(String recurso, Throwable detalhes) {
        super(String.format("%s é inválido: %s.", recurso, detalhes));
    }
}