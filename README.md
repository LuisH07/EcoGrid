# EcoGrid
EcoGrid é um projeto acadêmico da disciplina de AED II que utiliza grafos para modelar a rede de transmissão de energia elétrica. O objetivo principal é permitir a conexão entre subestações, garantindo que a nova rota de transmissão não atravesse áreas de preservação ambiental e utilize algoritmos de grafos para determinar os caminhos mais viáveis.

Projeto realizado por:
- Raphael Augusto Paulino Leite;
- Luis Henrique Domingos da Silva
- Arthur Roberto Araújo Tavares

Este projeto é composto por:  

- *Frontend* em *React*  
- *Backend* em *Java com Spring Boot*  
- Ambos containerizados com *Docker*

## Pré-requisitos  

Antes de rodar o projeto, garanta que você tem instalado:  

- [Docker](https://docs.docker.com/)

## Como rodar o projeto  

1. Clone o repositório:  
   ```bash
   git clone https://github.com/LuisH07/EcoGrid.git
   cd seu-repo

2. Execute os containers:

Backend (porta 8080)

Frontend (porta 3000)

Linux:

    ```bash
    sudo docker compose up --build

Windows:

    ```bash
    docker compose up --build

3. A aplicação estará disponível em:

Backend: http://localhost:8080

Frontend: http://localhost:3000

---

## Endpoints disponíveis

- Linhas críticas

GET /api/v1/linhasDeTransmissao/criticas

- Subestações críticas

GET /api/v1/subestacoes/criticas

- Rota segura entre duas subestações

GET /api/v1/rotaSegura?nomeSubOrigem=XXX&nomeSubDestino=YYY

---

## Swagger

Toda a documentação da API pode ser acessada via Swagger em:

http://localhost:8080/swagger-ui.html

---

## Dados utilizados

Os dados do projeto são obtidos em formato CSV de fontes oficiais, contendo informações de:

Subestações (ID, nome, localização): Sistema Interligado Nacional

Linhas de transmissão (origem, destino, tensão, etc.): Sistema Interligado Nacional

Áreas protegidas (nome, pontos, etc): Cadastro Nacional de Unidades de Conservação


Esses arquivos são carregados pelo backend para montar o grafo elétrico utilizado pelos algoritmos.