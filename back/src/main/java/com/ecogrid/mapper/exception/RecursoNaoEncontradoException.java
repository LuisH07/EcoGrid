package com.ecogrid.mapper.exception;

public class RecursoNaoEncontradoException extends RuntimeException {
    public RecursoNaoEncontradoException(String recurso, String campo, Object objeto) {
        super(String.format("%s com %s '%s' não foi encontrado.", recurso, campo, objeto));
    }
}
