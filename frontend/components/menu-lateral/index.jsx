import { IoSearchOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import "../../css/menuLateral.css";

export default function MenuLateral({
  pesquisa,
  setPesquisa,
  subestacaoSelecionada,
  linhaSelecionada,
  onSelecionarSugestao,
  subestacoes,
  linhasTransmissao,
  onLimparSelecoes,
  isEditMode,
  subestacaoA,
  subestacaoB,
  onToggleEditMode,
  onLimparEditMode,
  onEncontrarRotaMelhorada,
  modoVisualizacaoRota,
  rotaGerada,
  modoVisualizacaoCritica,
  handleToggleVisualizacaoCritMode,
  linhasTransmissaoCriticas,
}) {
  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

  useEffect(() => {
    if (!pesquisa.trim()) {
      setSugestoes([]);
      setMostrarSugestoes(false);
      return;
    }

    const termo = pesquisa.toLowerCase().trim();
    const sugestoesFiltradas = [];

    subestacoes.forEach((sub) => {
      if (sub.nome.toLowerCase().includes(termo)) {
        sugestoesFiltradas.push({
          tipo: "subestacao",
          item: sub,
          texto: sub.nome,
        });
      }
    });

    linhasTransmissao.forEach((linha) => {
      if (
        linha.subA.nome.toLowerCase().includes(termo) ||
        linha.subB.nome.toLowerCase().includes(termo) ||
        linha.tensao.toLowerCase().includes(termo) ||
        (linha.dadosCompletos.nomeEquipamento &&
          linha.dadosCompletos.nomeEquipamento.toLowerCase().includes(termo))
      ) {
        sugestoesFiltradas.push({
          tipo: "linha",
          item: linha,
          texto: `${linha.subA.nome} → ${linha.subB.nome} (${linha.tensao})`,
        });
      }
    });

    setSugestoes(sugestoesFiltradas);
    setMostrarSugestoes(sugestoesFiltradas.length > 0);
  }, [pesquisa, subestacoes, linhasTransmissao]);

  const handleInputChange = (e) => {
    const valor = e.target.value;
    setPesquisa(valor);

    if (valor.trim() && (!pesquisa || pesquisa.trim() === "") && !isEditMode) {
      onLimparSelecoes();
    }
  };

  const handleSelecionarSugestao = (sugestao) => {
    onSelecionarSugestao(sugestao.item, sugestao.tipo);
    setPesquisa("");
    setMostrarSugestoes(false);
  };

  const handleInputFocus = () => {
    if (pesquisa && pesquisa.trim() && !isEditMode) {
      onLimparSelecoes();
    }

    if (pesquisa && sugestoes.length > 0) {
      setMostrarSugestoes(true);
    }
  };
  const handleInputBlur = () => {
    setTimeout(() => setMostrarSugestoes(false), 200);
  };

  const calcularDistanciaTotal = (rota) => {
    if (!rota || rota.length < 2) return 0;

    let distanciaTotal = 0;
    for (let i = 1; i < rota.length; i++) {
      const lat1 = rota[i - 1].lat;
      const lon1 = rota[i - 1].lon;
      const lat2 = rota[i].lat;
      const lon2 = rota[i].lon;

      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      distanciaTotal += R * c;
    }

    return distanciaTotal;
  };

  return (
    <aside className="menu-lateral">
      <h2>Controles do Mapa</h2>

      {modoVisualizacaoRota ? (
        <div className="modo-rota-controles">
          <div className="info-rotas">
            <h3>Rota Gerada</h3>

            <div className="estatistica-rota">
              <h4>Informações da Rota</h4>
              <p>
                Distância: {calcularDistanciaTotal(rotaGerada).toFixed(4)} km
              </p>
              <p>Subestações: {rotaGerada?.length || 0}</p>
              <p>De: {subestacaoA?.nome}</p>
              <p>Para: {subestacaoB?.nome}</p>
            </div>
          </div>

          <div className="info-painel">
            <h3>Visualização de Rota</h3>
            <p>
              • <span className="cor-azul">● Azul</span>: Rota inicial
            </p>
            <p>
              • <span className="cor-verde">● Verde</span>: Rota gerada
            </p>
            <p>• Clique nos marcadores para ver detalhes</p>
            <p>• Use o botão acima para voltar ao mapa normal</p>
          </div>
        </div>
      ) : (
        <div className="controles">
          <div className="grupo-controle pesquisa-container">
            <div className="input-container">
              <button className="search-button">
                <IoSearchOutline />
              </button>
              <input
                placeholder="Pesquise uma subestação ou linha..."
                value={pesquisa}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                type="text"
              />
            </div>

            {mostrarSugestoes && (
              <div className="sugestoes-popup">
                {sugestoes.map((sugestao, index) => (
                  <div
                    key={index}
                    className="sugestao-item"
                    onClick={() => handleSelecionarSugestao(sugestao)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {sugestao.texto}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grupo-controle">
            <h3>Última Subestação selecionada:</h3>
            {subestacaoSelecionada ? (
              <div className="dado-selecionado">
                <p>
                  <strong>Nome:</strong> {subestacaoSelecionada.nome}
                </p>
                <p>
                  <strong>Coordenadas:</strong>{" "}
                  {subestacaoSelecionada.lat.toFixed(4)},{" "}
                  {subestacaoSelecionada.lon.toFixed(4)}
                </p>
                {subestacaoSelecionada.dadosCompletos && (
                  <>
                    <p>
                      <strong>UF:</strong>{" "}
                      {
                        subestacaoSelecionada.dadosCompletos
                          .unidadeFederativaNordeste
                      }
                    </p>
                    <p>
                      <strong>Agente:</strong>{" "}
                      {subestacaoSelecionada.dadosCompletos.agentePrincipal}
                    </p>
                    <p>
                      <strong>Data Prevista:</strong>{" "}
                      {subestacaoSelecionada.dadosCompletos.dataPrevista ||
                        "N/A"}
                    </p>
                    <p>
                      <strong>Data Entrada:</strong>{" "}
                      {subestacaoSelecionada.dadosCompletos.dataEntrada ||
                        "N/A"}
                    </p>
                  </>
                )}
              </div>
            ) : (
              <p className="dado-selecionado">Nenhuma subestação selecionada</p>
            )}
          </div>

          <div className="grupo-controle">
            <h3>Última Linha de Transmissão selecionada:</h3>
            {linhaSelecionada ? (
              <div className="dado-selecionado">
                <p>
                  <strong>Nome:</strong>{" "}
                  {linhaSelecionada.dadosCompletos.nomeEquipamento ||
                    "Linha de Transmissão"}
                </p>
                <p>
                  <strong>De:</strong> {linhaSelecionada.subA.nome}
                </p>
                <p>
                  <strong>Para:</strong> {linhaSelecionada.subB.nome}
                </p>
                <p>
                  <strong>Tensão:</strong> {linhaSelecionada.tensao}
                </p>
                <p>
                  <strong>Comprimento:</strong> {linhaSelecionada.comprimento}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {linhaSelecionada.dadosCompletos.sensivel
                    ? "Sensível"
                    : "Normal"}
                </p>
                {linhaSelecionada.dadosCompletos.informacoesAdministrativas && (
                  <>
                    <p>
                      <strong>Agente:</strong>{" "}
                      {
                        linhaSelecionada.dadosCompletos
                          .informacoesAdministrativas.agenteProprietario
                      }
                    </p>
                    <p>
                      <strong>Outorga:</strong>{" "}
                      {
                        linhaSelecionada.dadosCompletos
                          .informacoesAdministrativas.numeroOutorga
                      }
                    </p>
                  </>
                )}
              </div>
            ) : (
              <p className="dado-selecionado">Nenhuma linha selecionada</p>
            )}
          </div>

          {isEditMode && !modoVisualizacaoCritica && (
            <div className="grupo-controle">
              <h3>Modo Seleção de Subestações:</h3>
              <div className="dado-selecionado">
                <p>
                  <strong>Subestação A:</strong>{" "}
                  {subestacaoA ? subestacaoA.nome : "Não selecionada"}
                </p>
                <p>
                  <strong>Subestação B:</strong>{" "}
                  {subestacaoB ? subestacaoB.nome : "Não selecionada"}
                </p>
              </div>
              <button
                className="limpar-button"
                onClick={onLimparEditMode}
                disabled={!subestacaoA && !subestacaoB}
              >
                Limpar Seleções
              </button>
            </div>
          )}

          {!modoVisualizacaoCritica && (
            <div className="grupo-controle">
              <h3>Gerar caminho:</h3>

              <button
                className={`select-button ${isEditMode ? "active" : ""}`}
                onClick={() => {
                  if (isEditMode && subestacaoA && subestacaoB) {
                    onEncontrarRotaMelhorada();
                  } else if (!isEditMode) {
                    onToggleEditMode();
                  }
                }}
                disabled={isEditMode && (!subestacaoA || !subestacaoB)}
              >
                {isEditMode
                  ? subestacaoA && subestacaoB
                    ? "Gerar Caminho"
                    : "Selecionando..."
                  : "Escolher Subestações"}
              </button>

              {isEditMode && (
                <button
                  className="cancel-button"
                  onClick={() => {
                    onLimparEditMode();
                    onToggleEditMode();
                  }}
                >
                  Cancelar
                </button>
              )}

              {isEditMode && (
                <p className="instrucao">
                  • Selecione duas subestações no mapa
                </p>
              )}
            </div>
          )}

          <div className="grupo-controle">
            <h3>Visualizar Subestações Críticas:</h3>
            <div className="grupo-checkbox">
              <p>{modoVisualizacaoCritica ? "Desativar" : "Ativar"}</p>
              <input
                type="checkbox"
                checked={modoVisualizacaoCritica}
                onChange={handleToggleVisualizacaoCritMode}
              />
            </div>
          </div>

          <div className="info-painel">
            <h3>Como usar?</h3>
            <p>• Digite para buscar subestações ou linhas</p>
            <p>• Clique nas sugestões para dar zoom</p>
            <p>• Clique nos elementos do mapa para selecionar</p>
            <p>• Use a roda do mouse para zoom manual</p>
            <p>• Arraste para navegar no mapa</p>
            {isEditMode && !modoVisualizacaoCritica && (
              <p>
                • <strong>Modo Edição:</strong> Selecione duas subestações para
                gerar caminho
              </p>
            )}
            {modoVisualizacaoCritica && (
              <>
                <p>
                  • <strong>Modo Visualização Crítica:</strong> Visualizando
                  subestações críticas
                </p>
                <div style={{ marginTop: "10px" }}>
                  <p>
                    <strong>Linhas de Transmissão Críticas:</strong>
                  </p>
                  <ul style={{ paddingLeft: "20px", marginTop: "5px" }}>
                    {linhasTransmissaoCriticas.map((linha) => (
                      <li key={linha.id} style={{color: "black", marginBottom: "5px"}}>
                        {linha.nome || `Linha ${linha.id}`} -{linha.subA.nome} →{" "}
                        {linha.subB.nome}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
