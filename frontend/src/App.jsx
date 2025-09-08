import Footer from "../components/footer";
import Header from "../components/header";
import Mapa from "../components/mapa";
import MenuLateral from "../components/menu-lateral";
import { useState, useEffect } from "react";
import { SyncLoader } from "react-spinners";
import "./App.css";

const converterSubestacaoBackendParaFrontend = (subestacaoBackend) => {
  return {
    id: subestacaoBackend.idInstalacao,
    nome: subestacaoBackend.nome,
    lat: subestacaoBackend.latitude,
    lon: subestacaoBackend.longitude,
    dadosCompletos: subestacaoBackend,
  };
};

const converterLinhaBackendParaFrontend = (linhaBackend, subestacoesMap) => {
  // Encontrar subestações pelo ID
  const subA = subestacoesMap[linhaBackend.subestacaoAId];
  const subB = subestacoesMap[linhaBackend.subestacaoBId];

  return {
    id: linhaBackend.idEquipamento,
    subA: subA || {
      id: linhaBackend.subestacaoAId || "unknown",
      nome: linhaBackend.subestacaoANome || "Origem Desconhecida",
      lat: subA?.lat || 0,
      lon: subA?.lon || 0,
    },
    subB: subB || {
      id: linhaBackend.subestacaoBId || "unknown",
      nome: linhaBackend.subestacaoBNome || "Destino Desconhecida",
      lat: subB?.lat || 0,
      lon: subB?.lon || 0,
    },
    cor: linhaBackend.sensivel ? "red" : "blue",
    tensao: `${linhaBackend.tensaoKv} kV`,
    comprimento: `${linhaBackend.comprimentoKm} km`,
    dadosCompletos: linhaBackend,
  };
};

const converterAreaProtegidaBackendParaFrontend = (areaBackend) => {
  const coordsConvertidas = areaBackend.coordenadas.map((coord) => [
    coord[1],
    coord[0],
  ]);

  return {
    id: areaBackend.nome.replace(/\s+/g, "-").toLowerCase(),
    nome: areaBackend.nome,
    uf: areaBackend.unidadeFederativaNordeste,
    area: areaBackend.medidaArea,
    coords: coordsConvertidas,
    dadosCompletos: areaBackend,
  };
};

/*
const subestacoesTeste = [
  {
    idInstalacao: "INST-12345",
    nome: "Subestação Fortaleza",
    unidadeFederativaNordeste: "CE",
    idAgentePrincipal: "AG-987",
    agentePrincipal: "Companhia Energetica do Ceara",
    dataPrevista: "2025-12-15",
    dataEntrada: "2026-01-10",
    coordenadas: {
      x: -38.5433,
      y: -3.7172,
    },
  },
  {
    idInstalacao: "INST-67890",
    nome: "Subestação Recife",
    unidadeFederativaNordeste: "PE",
    idAgentePrincipal: "AG-654",
    agentePrincipal: "Companhia Energetica de Pernambuco",
    dataPrevista: "2025-11-20",
    dataEntrada: "2026-02-15",
    coordenadas: {
      x: -34.8811,
      y: -8.0539,
    },
  },
  {
    idInstalacao: "INST-24680",
    nome: "Subestação Salvador",
    unidadeFederativaNordeste: "BA",
    idAgentePrincipal: "AG-321",
    agentePrincipal: "Coelba",
    dataPrevista: "2025-10-30",
    dataEntrada: "2026-03-20",
    coordenadas: {
      x: -38.4811,
      y: -12.9714,
    },
  },
  {
    idInstalacao: "INST-13579",
    nome: "Subestação Natal",
    unidadeFederativaNordeste: "RN",
    idAgentePrincipal: "AG-159",
    agentePrincipal: "Cosern",
    dataPrevista: "2025-09-15",
    dataEntrada: "2026-04-10",
    coordenadas: {
      x: -35.2094,
      y: -5.7945,
    },
  },
  {
    idInstalacao: "INST-55555",
    nome: "Subestação João Pessoa",
    unidadeFederativaNordeste: "PB",
    idAgentePrincipal: "AG-555",
    agentePrincipal: "Energisa",
    dataPrevista: "2026-01-01",
    dataEntrada: "2024-07-15",
    coordenadas: {
      x: -34.877,
      y: -7.115,
    },
  },
];

const linhasTeste = [
  {
    subestacaoA: {
      idInstalacao: "INST-67890",
      nome: "Subestação Recife",
      unidadeFederativaNordeste: "PE",
      idAgentePrincipal: "AG-654",
      agentePrincipal: "Companhia Energetica de Pernambuco",
      dataPrevista: "2025-11-20",
      dataEntrada: "2026-02-15",
      coordenadas: {
        x: -34.8811,
        y: -8.0539,
      },
    },
    subestacaoB: {
      idInstalacao: "INST-55555",
      nome: "Subestação João Pessoa",
      unidadeFederativaNordeste: "PB",
      idAgentePrincipal: "AG-555",
      agentePrincipal: "Energisa",
      dataPrevista: "2026-01-01",
      dataEntrada: "2024-07-15",
      coordenadas: {
        x: -34.877,
        y: -7.115,
      },
    },
    informacoesAdministrativas: {
      idInstalacao: "LINHA-001",
      idEquipamento: "EQ-001",
      nome: "Linha Recife/João Pessoa",
      idTipoEquipamento: "TX-01",
      tipoRede: "Transmissão",
      agenteProprietario: "Chesf",
      numeroOutorga: "OUT-2025-001",
      dataEntrada: "2025-01-01",
      dataPrevista: "2024-12-01",
    },
    comprimentoKm: 120.5,
    tensaoKv: 230.0,
    sensivel: true,
  },
  {
    subestacaoA: {
      idInstalacao: "INST-12345",
      nome: "Subestação Fortaleza",
      unidadeFederativaNordeste: "CE",
      idAgentePrincipal: "AG-987",
      agentePrincipal: "Companhia Energetica do Ceara",
      dataPrevista: "2025-12-15",
      dataEntrada: "2026-01-10",
      coordenadas: {
        x: -38.5433,
        y: -3.7172,
      },
    },
    subestacaoB: {
      idInstalacao: "INST-24680",
      nome: "Subestação Salvador",
      unidadeFederativaNordeste: "BA",
      idAgentePrincipal: "AG-321",
      agentePrincipal: "Coelba",
      dataPrevista: "2025-10-30",
      dataEntrada: "2026-03-20",
      coordenadas: {
        x: -38.4811,
        y: -12.9714,
      },
    },
    informacoesAdministrativas: {
      idInstalacao: "LINHA-002",
      idEquipamento: "EQ-002",
      nome: "Linha Fortaleza/Salvador",
      idTipoEquipamento: "TX-02",
      tipoRede: "Transmissão",
      agenteProprietario: "Chesf",
      numeroOutorga: "OUT-2025-002",
      dataEntrada: "2025-03-01",
      dataPrevista: "2024-11-15",
    },
    comprimentoKm: 350.8,
    tensaoKv: 500.0,
    sensivel: false,
  },
  {
    subestacaoA: {
      idInstalacao: "INST-13579",
      nome: "Subestação Natal",
      unidadeFederativaNordeste: "RN",
      idAgentePrincipal: "AG-159",
      agentePrincipal: "Cosern",
      dataPrevista: "2025-09-15",
      dataEntrada: "2026-04-10",
      coordenadas: {
        x: -35.2094,
        y: -5.7945,
      },
    },
    subestacaoB: {
      idInstalacao: "INST-67890",
      nome: "Subestação Recife",
      unidadeFederativaNordeste: "PE",
      idAgentePrincipal: "AG-654",
      agentePrincipal: "Companhia Energetica de Pernambuco",
      dataPrevista: "2025-11-20",
      dataEntrada: "2026-02-15",
      coordenadas: {
        x: -34.8811,
        y: -8.0539,
      },
    },
    informacoesAdministrativas: {
      idInstalacao: "LINHA-003",
      idEquipamento: "EQ-003",
      nome: "Linha Natal/Recife",
      idTipoEquipamento: "TX-03",
      tipoRede: "Transmissão",
      agenteProprietario: "Chesf",
      numeroOutorga: "OUT-2025-003",
      dataEntrada: "2025-02-15",
      dataPrevista: "2024-10-30",
    },
    comprimentoKm: 85.2,
    tensaoKv: 138.0,
    sensivel: true,
  },
];

const areasTeste = [
  {
    nome: "Parque Nacional da Chapada Diamantina",
    unidadeFederativaNordeste: "BA",
    medidaArea: 1520.42,
    geometria: {
      type: "Polygon",
      coordinates: [
        [
          [-41.5, -12.3],
          [-41.2, -12.8],
          [-41.8, -13.0],
          [-41.6, -12.5],
          [-41.5, -12.3],
        ],
      ],
    },
  },
  {
    nome: "Reserva Biológica de teste testando",
    unidadeFederativaNordeste: "AL",
    medidaArea: 45.67,
    geometria: {
      type: "Polygon",
      coordinates: [
        [
          [-36.4, -9.2],
          [-36.3, -9.3],
          [-36.5, -9.4],
          [-36.6, -9.3],
          [-36.4, -9.2],
        ],
      ],
    },
  },
  {
    nome: "Parque Nacional de Jericoacoara",
    unidadeFederativaNordeste: "CE",
    medidaArea: 88.5,
    geometria: {
      type: "Polygon",
      coordinates: [
        [
          [-40.6, -2.9],
          [-40.4, -2.8],
          [-40.3, -3.0],
          [-40.5, -3.2],
          [-40.6, -2.9],
        ],
      ],
    },
  },
  {
    nome: "Parque Nacional dos Lençóis Maranhenses",
    unidadeFederativaNordeste: "MA",
    medidaArea: 1550.0,
    geometria: {
      type: "Polygon",
      coordinates: [
        [
          [-43.2, -2.4],
          [-42.8, -2.3],
          [-42.9, -2.8],
          [-43.3, -2.7],
          [-43.2, -2.4],
        ],
      ],
    },
  },
];
*/

function App() {
  const [subestacoes, setSubestacoes] = useState([]);
  const [linhasTransmissao, setLinhasTransmissao] = useState([]);
  const [areasProtegidas, setAreasProtegidas] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [subestacaoSelecionada, setSubestacaoSelecionada] = useState(null);
  const [linhaSelecionada, setLinhaSelecionada] = useState(null);
  const [elementoParaZoom, setElementoParaZoom] = useState(null);
  const [popupAbertoId, setPopupAbertoId] = useState(null);
  const [popupTipo, setPopupTipo] = useState(null);
  const [subestacaoA, setSubestacaoA] = useState(null);
  const [subestacaoB, setSubestacaoB] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const handleSubestacaoSelecionada = (sub) => {
    if (isEditMode) {
      if (!subestacaoA) {
        setSubestacaoA(sub);
      } else if (!subestacaoB && subestacaoA.id !== sub.id) {
        setSubestacaoB(sub);
      } else if (subestacaoA.id === sub.id) {
        setSubestacaoA(null);
      } else if (subestacaoB && subestacaoB.id === sub.id) {
        setSubestacaoB(null);
      }
    } else {
      if (subestacaoSelecionada && subestacaoSelecionada.id === sub.id) {
        setSubestacaoSelecionada(null);
        setPopupAbertoId(null);
        setPopupTipo(null);
      } else {
        setSubestacaoSelecionada(sub);
        setPopupAbertoId(sub.id);
        setPopupTipo("subestacao");
      }
    }
  };

  const handleLinhaSelecionada = (linha) => {
    if (linhaSelecionada && linhaSelecionada.id === linha.id) {
      setLinhaSelecionada(null);
      setPopupAbertoId(null);
      setPopupTipo(null);
    } else {
      setLinhaSelecionada(linha);
      setPopupAbertoId(linha.id);
      setPopupTipo("linha");
    }
  };

  const handleSelecionarSugestao = (elemento, tipo) => {
    if (isEditMode && tipo === "subestacao") {
      if (!subestacaoA) {
        setSubestacaoA(elemento);
        setPopupAbertoId(elemento.id);
        setPopupTipo("subestacao");
      } else if (!subestacaoB && subestacaoA.id !== elemento.id) {
        setSubestacaoB(elemento);
        setPopupAbertoId(elemento.id);
        setPopupTipo("subestacao");
      } else if (subestacaoA.id === elemento.id) {
        setSubestacaoA(null);
      } else if (subestacaoB && subestacaoB.id === elemento.id) {
        setSubestacaoB(null);
      }
    } else {
      if (tipo === "subestacao") {
        if (isEditMode) {
          setSubestacaoA(null);
          setSubestacaoB(null);
          setIsEditMode(false);
        }
        handleSubestacaoSelecionada(elemento);
      } else {
        handleLinhaSelecionada(elemento);
      }
    }
  };

  const handleLimparSelecoes = () => {
    setSubestacaoSelecionada(null);
    setLinhaSelecionada(null);
    setPopupAbertoId(null);
    setPopupTipo(null);
  };

  const handleToggleEditMode = () => {
    if (isEditMode && subestacaoA && subestacaoB) {
      console.log(
        "Gerando caminho entre:",
        subestacaoA.nome,
        "e",
        subestacaoB.nome
      );
    }
    setIsEditMode(!isEditMode);
  };

  const handleLimparEditMode = () => {
    setSubestacaoA(null);
    setSubestacaoB(null);
  };

  useEffect(() => {
    if (subestacaoSelecionada) {
      setElementoParaZoom({ ...subestacaoSelecionada, tipo: "subestacao" });
    } else if (linhaSelecionada) {
      setElementoParaZoom({ ...linhaSelecionada, tipo: "linha" });
    } else {
      setElementoParaZoom(null);
    }
  }, [subestacaoSelecionada, linhaSelecionada]);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);
        setErro(null);

        try {
          //carregar subestações
          const responseSub = await fetch("http://localhost:8080/api/v1/subestacoes");

          if (!responseSub.ok) throw new Error("Erro ao carregar subestações");
          const subestacoesBackend = await responseSub.json();

          //carregar linhas de transmissão
          const responseLinhas = await fetch("http://localhost:8080/api/v1/linhasDeTransmissao");

          if (!responseLinhas.ok) throw new Error("Erro ao carregar linhas");
          const linhasBackend = await responseLinhas.json();

          //carregar áreas protegidas
          const responseAreas = await fetch("http://localhost:8080/api/v1/areasProtegidas");

          if (!responseAreas.ok)
            throw new Error("Erro ao carregar áreas protegidas");
          const areasBackend = await responseAreas.json();

          //converter dados
          const subestacoesConvertidas = subestacoesBackend.map(
            converterSubestacaoBackendParaFrontend
          );

          const subestacoesMap = {};
          subestacoesConvertidas.forEach((sub) => {
            subestacoesMap[sub.id] = sub;
          });

          const linhasConvertidas = linhasBackend.map((linha) =>
            converterLinhaBackendParaFrontend(linha, subestacoesMap)
          );

          const areasConvertidas = areasBackend.map(
            converterAreaProtegidaBackendParaFrontend
          );

          setSubestacoes(subestacoesConvertidas);
          setLinhasTransmissao(linhasConvertidas);
          setAreasProtegidas(areasConvertidas);
        } catch (error) {
          console.warn(
            "Erro ao conectar com backend, usando dados de teste:",
            error
          );
          //fallback
          await carregarDadosTeste();
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setErro("Erro ao carregar dados. " + error.message);
      } finally {
        setCarregando(false);
      }
    };

    const carregarDadosTeste = async () => {
      //dados de teste para subestações
      const subestacoesTeste = [
        {
          idInstalacao: "INST-12345",
          nome: "Subestação Fortaleza",
          unidadeFederativaNordeste: "CE",
          idAgentePrincipal: "AG-987",
          agentePrincipal: "Companhia Energetica do Ceara",
          dataPrevista: "2025-12-15",
          dataEntrada: "2026-01-10",
          latitude: -3.7172,
          longitude: -38.5433,
        },
        {
          idInstalacao: "INST-67890",
          nome: "Subestação Recife",
          unidadeFederativaNordeste: "PE",
          idAgentePrincipal: "AG-654",
          agentePrincipal: "Companhia Energetica de Pernambuco",
          dataPrevista: "2025-11-20",
          dataEntrada: "2026-02-15",
          latitude: -8.0539,
          longitude: -34.8811,
        },
      ];

      //dados de teste para linhas
      const linhasTeste = [
        {
          subestacaoAId: "INST-67890",
          subestacaoANome: "Subestação Recife",
          subestacaoBId: "INST-12345",
          subestacaoBNome: "Subestação Fortaleza",
          idEquipamento: "LT123",
          nomeEquipamento: "Linha 500kV Recife-Fortaleza",
          comprimentoKm: 350.8,
          tensaoKv: 500.0,
          sensivel: true,
        },
      ];

      //dados de teste para áreas protegidas
      const areasTeste = [
        {
          nome: "Parque Nacional do Sertão",
          unidadeFederativaNordeste: "PE",
          medidaArea: 12345.67,
          coordenadas: [
            [-8.12345, -35.12345],
            [-8.1235, -35.1235],
            [-8.12355, -35.12355],
            [-8.12345, -35.12345],
          ],
        },
      ];

      //converter dados de teste
      const subestacoesConvertidas = subestacoesTeste.map(
        converterSubestacaoBackendParaFrontend
      );

      const subestacoesMap = {};
      subestacoesConvertidas.forEach((sub) => {
        subestacoesMap[sub.id] = sub;
      });

      const linhasConvertidas = linhasTeste.map((linha) =>
        converterLinhaBackendParaFrontend(linha, subestacoesMap)
      );

      const areasConvertidas = areasTeste.map(
        converterAreaProtegidaBackendParaFrontend
      );

      setSubestacoes(subestacoesConvertidas);
      setLinhasTransmissao(linhasConvertidas);
      setAreasProtegidas(areasConvertidas);
    };

    carregarDados();
  }, []);

  if (carregando) {
    return (
      <>
        <Header />
        <div className="carregando">
          <SyncLoader size={"60px"} color="#273348" />
        </div>
        <Footer />
      </>
    );
  }

  if (erro) {
    return (
      <>
        <Header />
        <div className="carregando">
          <p>{erro}</p>
          <button onClick={() => window.location.reload()}>
            Tentar novamente
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="main-wrapper">
        <MenuLateral
          pesquisa={pesquisa}
          setPesquisa={setPesquisa}
          subestacaoSelecionada={subestacaoSelecionada}
          linhaSelecionada={linhaSelecionada}
          onSelecionarSugestao={handleSelecionarSugestao}
          onLimparSelecoes={handleLimparSelecoes}
          isEditMode={isEditMode}
          subestacaoA={subestacaoA}
          subestacaoB={subestacaoB}
          onToggleEditMode={handleToggleEditMode}
          onLimparEditMode={handleLimparEditMode}
          subestacoes={subestacoes}
          linhasTransmissao={linhasTransmissao}
        />
        <Mapa
          subestacoes={subestacoes}
          linhasTransmissao={linhasTransmissao}
          areasProtegidas={areasProtegidas}
          onSubestacaoSelecionada={handleSubestacaoSelecionada}
          onLinhaSelecionada={handleLinhaSelecionada}
          elementoParaZoom={elementoParaZoom}
          popupAbertoId={popupAbertoId}
          popupTipo={popupTipo}
        />
      </div>
      <Footer />
    </>
  );
}

export default App;
