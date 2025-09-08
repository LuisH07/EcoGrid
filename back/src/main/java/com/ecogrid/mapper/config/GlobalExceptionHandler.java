package com.ecogrid.mapper.config;

import com.ecogrid.mapper.dto.response.ErroResponse;
import com.ecogrid.mapper.exception.ErroDeIntegridadeException;
import com.ecogrid.mapper.exception.LeituraFalhouException;
import com.ecogrid.mapper.exception.RecursoInvalidoException;
import com.ecogrid.mapper.exception.RecursoNaoEncontradoException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.time.LocalDateTime;
import java.util.Arrays;

@ControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroResponse> handleRecursoNaoEncontrado(RecursoNaoEncontradoException exception) {
        logger.warn("Recurso não encontrado: {}", exception.getMessage());
        ErroResponse erro = new ErroResponse(
                "Recurso não encontrado",
                exception.getMessage(),
                Arrays.asList(exception.getStackTrace()),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(erro, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(RecursoInvalidoException.class)
    public ResponseEntity<ErroResponse> handleRecursoInvalido(RecursoInvalidoException exception) {
        logger.warn("Recurso inválido: {}", exception.getMessage());
        ErroResponse erro = new ErroResponse(
                "Recurso inválido",
                exception.getMessage(),
                Arrays.asList(exception.getStackTrace()),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(erro, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(LeituraFalhouException.class)
    public ResponseEntity<ErroResponse> handleLeituraFalhou(LeituraFalhouException exception) {
        logger.warn("Falha na leitura de arquivo: {}", exception.getMessage());
        ErroResponse erro = new ErroResponse(
                "Falha ao ler arquivo",
                exception.getMessage(),
                Arrays.asList(exception.getStackTrace()),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(erro, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(ErroDeIntegridadeException.class)
    public ResponseEntity<ErroResponse> handleErroDeIntegridade(ErroDeIntegridadeException exception) {
        logger.warn("Erro de integridade de dados: {}", exception.getMessage());
        ErroResponse erro = new ErroResponse(
                "Erro de Integridade",
                exception.getMessage(),
                Arrays.asList(exception.getStackTrace()),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(erro, HttpStatus.CONFLICT);
    }
}