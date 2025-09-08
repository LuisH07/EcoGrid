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
    lat: subestacaoBackend.coordenadas.y,
    lon: subestacaoBackend.coordenadas.x,
    dadosCompletos: subestacaoBackend,
  };
};

const converterLinhaBackendParaFrontend = (linhaBackend, subestacoesMap) => {
  const subA = subestacoesMap[linhaBackend.subestacaoA?.idInstalacao];
  const subB = subestacoesMap[linhaBackend.subestacaoB?.idInstalacao];

  return {
    id: linhaBackend.informacoesAdministrativas.idInstalacao,
    subA: subA || {
      id: linhaBackend.subestacaoA?.idInstalacao || "unknown",
      nome: linhaBackend.subestacaoA?.nome || "Origem Desconhecida",
      lat: linhaBackend.subestacaoA?.coordenadas?.y || 0,
      lon: linhaBackend.subestacaoA?.coordenadas?.x || 0,
    },
    subB: subB || {
      id: linhaBackend.subestacaoB?.idInstalacao || "unknown",
      nome: linhaBackend.subestacaoB?.nome || "Destino Desconhecida",
      lat: linhaBackend.subestacaoB?.coordenadas?.y || 0,
      lon: linhaBackend.subestacaoB?.coordenadas?.x || 0,
    },
    cor: linhaBackend.sensivel ? "red" : "blue",
    tensao: `${linhaBackend.tensaoKv} kV`,
    comprimento: `${linhaBackend.comprimentoKm} km`,
    dadosCompletos: linhaBackend,
  };
};

const converterAreaProtegidaBackendParaFrontend = (areaBackend) => {
  //coordenadas geoJSON [lon, lat] para leaflet [lat, lon]
  const coordsConvertidas = areaBackend.geometria.coordinates[0].map(
    (coord) => [coord[1], coord[0]]
  );

  return {
    id: areaBackend.nome.replace(/\s+/g, "-").toLowerCase(),
    nome: areaBackend.nome,
    uf: areaBackend.unidadeFederativaNordeste,
    area: areaBackend.medidaArea,
    coords: coordsConvertidas,
    dadosCompletos: areaBackend,
  };
};

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
    nome: "Reserva Biológica de Pedra Talhada",
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

  /*
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);
        setErro(null);

        //carregar subestações
        const responseSub = await fetch(
          "link das subestações"
        );
        const subestacoesBackend = await responseSub.json();

        //carregar linhas de transmissão
        const responseLinhas = await fetch(
          "link das linhas"
        );
        const linhasBackend = await responseLinhas.json();

        //carregar áreas protegidas
        const responseAreas = await fetch(
          "link das areas protegidas"
        );
        const areasBackend = await responseAreas.json();

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
        console.error("Erro ao carregar dados:", error);
        setErro("Erro ao carregar dados do servidor");
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);
  */
  
  useEffect(() => {
    const carregarDadosTeste = async () => {
      try {
        setCarregando(true);

        //simular delay de carregamento
        await new Promise((resolve) => setTimeout(resolve, 1000));

        //converter subestações de teste
        const subestacoesConvertidas = subestacoesTeste.map(
          converterSubestacaoBackendParaFrontend
        );

        //criar mapa de subestações
        const subestacoesMap = {};
        subestacoesConvertidas.forEach((sub) => {
          subestacoesMap[sub.id] = sub;
        });

        //converter linhas de teste
        const linhasConvertidas = linhasTeste.map((linha) =>
          converterLinhaBackendParaFrontend(linha, subestacoesMap)
        );

        //converter áreas protegidas de teste
        const areasConvertidas = areasTeste.map(
          converterAreaProtegidaBackendParaFrontend
        );

        setSubestacoes(subestacoesConvertidas);
        setLinhasTransmissao(linhasConvertidas);
        setAreasProtegidas(areasConvertidas);
      } catch (error) {
        console.error("Erro ao carregar dados de teste:", error);
        setErro("Erro ao carregar dados");
      } finally {
        setCarregando(false);
      }
    };

    carregarDadosTeste();
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
