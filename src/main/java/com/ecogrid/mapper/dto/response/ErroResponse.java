package com.ecogrid.mapper.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ErroResponse {
    private String erro;
    private String menssage;
    private List<StackTraceElement> stackTrace;
    private LocalDateTime timestamp;

    public ErroResponse(String tipoExcecao, String menssage, List<StackTraceElement> stackTrace, LocalDateTime timestamp) {
        this.erro = tipoExcecao;
        this.menssage = menssage;
        this.stackTrace = stackTrace;
        this.timestamp = timestamp;
    }
}