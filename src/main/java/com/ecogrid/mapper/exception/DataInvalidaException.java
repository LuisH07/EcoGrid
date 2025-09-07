package com.ecogrid.mapper.exception;

public class DataInvalidaException extends RuntimeException {
    public DataInvalidaException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
