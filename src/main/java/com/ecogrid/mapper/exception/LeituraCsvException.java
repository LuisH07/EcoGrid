package com.ecogrid.mapper.exception;

public class LeituraCsvException extends RuntimeException {
    public LeituraCsvException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
