package com.ecogrid.mapper.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Ecogrid Mapper API")
                        .version("1.0")
                        .description("API acadêmica para mapeamento de redes elétricas utilizando grafos.")
                        .contact(new Contact()
                                .name("Luis Henrique, Arthur Roberto e Raphael Augusto")
                                .email("luishenriqueds01@gmail.com")));
    }
}
