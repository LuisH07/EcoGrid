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
        linha.tensao.toLowerCase().includes(termo)
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

  return (
    <aside className="menu-lateral">
      <h2>Controles do Mapa</h2>
      <div className="controles">
        <div className="grupo-controle pesquisa-container">
          <div className="grupo-controle">
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
                {
                  linhaSelecionada.dadosCompletos.informacoesAdministrativas
                    .nome
                }
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
            </div>
          ) : (
            <p className="dado-selecionado">Nenhuma linha selecionada</p>
          )}
        </div>

        {/* Seção do modo edição */}
        {isEditMode && (
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

        <div className="grupo-controle">
          <h3>Gerar caminho alternativo:</h3>
          <button
            className={`select-button ${isEditMode ? "active" : ""}`}
            onClick={onToggleEditMode}
          >
            {isEditMode
              ? subestacaoA && subestacaoB
                ? "Gerar Caminho"
                : "Selecionando..."
              : "Escolher Subestações"}
          </button>
          {isEditMode && (
            <p className="instrucao">• Selecione duas subestações no mapa</p>
          )}
        </div>
      </div>

      <div className="info-painel">
        <h3>Como usar?</h3>
        <p>• Digite para buscar subestações ou linhas</p>
        <p>• Clique nas sugestões para dar zoom</p>
        <p>• Clique nos elementos do mapa para selecionar</p>
        <p>• Use a roda do mouse para zoom manual</p>
        <p>• Arraste para navegar no mapa</p>
        {isEditMode && (
          <p>
            • <strong>Modo Edição:</strong> Selecione duas subestações para
            gerar caminho
          </p>
        )}
      </div>
    </aside>
  );
}
