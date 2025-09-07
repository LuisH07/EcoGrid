package com.ecogrid.mapper.exception;

public class LeituraShapefileException extends RuntimeException {
    public LeituraShapefileException(String mensagem) {
        super(mensagem);
    }

    public LeituraShapefileException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
