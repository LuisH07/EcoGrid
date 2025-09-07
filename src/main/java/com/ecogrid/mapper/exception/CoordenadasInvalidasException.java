package com.ecogrid.mapper.exception;

public class CoordenadasInvalidasException extends RuntimeException {
    public CoordenadasInvalidasException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
