import React, { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Polygon,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "../../css/mapa.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const customIconRotaAEstrela = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const customIconRotaMelhorada = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const customIconInicio = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const customIconFim = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const customIconCritico = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [30, 48],
  iconAnchor: [15, 48],
  popupAnchor: [1, -40],
  shadowSize: [48, 48],
});

const customIconNormal = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [20, 32],
  iconAnchor: [10, 32],
  popupAnchor: [1, -32],
  shadowSize: [32, 32],
});

const defaultIcon = new L.Icon.Default();

function ZoomController({
  elementoParaZoom,
  modoVisualizacaoRota,
  rotaAEstrela,
  rotaMelhorada,
  areasProtegidas,
}) {
  const map = useMap();
  const lastElementId = useRef(null);

  useEffect(() => {
    if (modoVisualizacaoRota) {
      const todasCoordenadas = [
        ...rotaAEstrela.map((sub) => [sub.lat, sub.lon]),
        ...rotaMelhorada.map((sub) => [sub.lat, sub.lon]),
        ...areasProtegidas.flatMap((area) => area.coords),
      ];

      if (todasCoordenadas.length > 0) {
        const bounds = L.latLngBounds(todasCoordenadas);
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50], animate: true });
        }
      }
      return;
    }

    if (!elementoParaZoom) return;

    const elementId =
      elementoParaZoom.tipo +
      (elementoParaZoom.id || elementoParaZoom.subA?.id);
    if (elementId === lastElementId.current) return;

    lastElementId.current = elementId;

    if (elementoParaZoom.tipo === "subestacao") {
      map.setView([elementoParaZoom.lat, elementoParaZoom.lon], 8, {
        animate: true,
        duration: 1,
      });
    } else if (elementoParaZoom.tipo === "linha") {
      try {
        const bounds = L.latLngBounds([
          [elementoParaZoom.subA.lat, elementoParaZoom.subA.lon],
          [elementoParaZoom.subB.lat, elementoParaZoom.subB.lon],
        ]);

        if (bounds.isValid()) {
          map.fitBounds(bounds, {
            padding: [50, 50],
            animate: true,
            duration: 1,
          });
        }
      } catch (error) {
        console.error("Erro ao aplicar zoom na linha:", error);
      }
    }
  }, [
    elementoParaZoom,
    map,
    modoVisualizacaoRota,
    rotaAEstrela,
    rotaMelhorada,
    areasProtegidas,
  ]);

  return null;
}

function PopupController({
  popupAbertoId,
  popupTipo,
  subestacoes,
  linhasTransmissao,
}) {
  const map = useMap();

  useEffect(() => {
    if (!popupAbertoId || !popupTipo) return;

    setTimeout(() => {
      if (popupTipo === "subestacao") {
        const subestacao = subestacoes.find((sub) => sub.id === popupAbertoId);
        if (subestacao) {
          map.eachLayer((layer) => {
            if (
              layer instanceof L.Marker &&
              layer.getLatLng().lat === subestacao.lat &&
              layer.getLatLng().lng === subestacao.lon
            ) {
              layer.openPopup();
            }
          });
        }
      } else if (popupTipo === "linha") {
        const linha = linhasTransmissao.find((lin) => lin.id === popupAbertoId);
        if (linha) {
          map.eachLayer((layer) => {
            if (layer instanceof L.Polyline) {
              const latlngs = layer.getLatLngs();
              if (
                latlngs.length === 2 &&
                latlngs[0].lat === linha.subA.lat &&
                latlngs[0].lng === linha.subA.lon &&
                latlngs[1].lat === linha.subB.lat &&
                latlngs[1].lng === linha.subB.lon
              ) {
                layer.openPopup();
              }
            }
          });
        }
      }
    }, 300);
  }, [popupAbertoId, popupTipo, map, subestacoes, linhasTransmissao]);

  return null;
}

export default function Mapa({
  subestacoes,
  linhasTransmissao,
  areasProtegidas,
  onSubestacaoSelecionada,
  onLinhaSelecionada,
  elementoParaZoom,
  popupAbertoId,
  popupTipo,
  rotaAEstrela,
  rotaMelhorada,
  modoVisualizacaoRota,
  onVoltarMapaNormal,
  subestacoesCriticas,
  modoVisualizacaoCritica,
}) {
  const mapRef = useRef();

  const isSubestacaoCritica = (subestacao) => {
    return (
      subestacoesCriticas &&
      subestacoesCriticas.some((sub) => sub.id === subestacao.id)
    );
  };

  return (
    <div className="mapa-container">
      {modoVisualizacaoRota && (
        <div className="mapa-overlay-controls">
          <button onClick={onVoltarMapaNormal} className="botao-voltar-overlay">
            ← Voltar ao Mapa Normal
          </button>
          <div className="legenda-rotas">
            <div className="legenda-item">
              <div className="cor-rota-aestrela"></div>
              <span>Rota A* ({rotaAEstrela.length} subestações)</span>
            </div>
            <div className="legenda-item">
              <div className="cor-rota-melhorada"></div>
              <span>Rota Alternativa ({rotaMelhorada.length} subestações)</span>
            </div>
          </div>
        </div>
      )}

      {modoVisualizacaoCritica && (
        <div className="mapa-overlay-controls" style={{ top: "80px" }}>
          <div className="legenda-rotas">
            <div className="legenda-item">
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  background: "red",
                  borderRadius: "50%",
                }}
              ></div>
              <span>Subestações Críticas</span>
            </div>
            <div className="legenda-item">
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  background: "grey",
                  borderRadius: "50%",
                  opacity: "0.5",
                }}
              ></div>
              <span>Elementos Normais</span>
            </div>
          </div>
        </div>
      )}

      <MapContainer
        center={[-8.0, -37.0]}
        zoom={6}
        className="mapa"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ZoomController
          elementoParaZoom={elementoParaZoom}
          modoVisualizacaoRota={modoVisualizacaoRota}
          rotaAEstrela={rotaAEstrela}
          rotaMelhorada={rotaMelhorada}
          areasProtegidas={areasProtegidas}
        />

        <PopupController
          popupAbertoId={popupAbertoId}
          popupTipo={popupTipo}
          subestacoes={subestacoes}
          linhasTransmissao={linhasTransmissao}
        />

        {/* ÁREAS PROTEGIDAS */}
        {areasProtegidas.map((area) => (
          <Polygon
            key={area.id}
            positions={area.coords}
            color="green"
            fillOpacity={modoVisualizacaoCritica ? 0.1 : 0.3}
          >
            <Popup>
              <div>
                <h3>{area.nome}</h3>
                <p>
                  <strong>UF:</strong> {area.uf}
                </p>
                <p>
                  <strong>Área:</strong> {area.area.toLocaleString("pt-BR")}{" "}
                  hectares
                </p>
                {area.dadosCompletos?.medidaArea && (
                  <p>
                    <strong>Área Total:</strong>{" "}
                    {area.dadosCompletos.medidaArea.toLocaleString("pt-BR")} km²
                  </p>
                )}
              </div>
            </Popup>
          </Polygon>
        ))}

        {modoVisualizacaoRota ? (
          <>
            {/* Renderizar rota A* */}
            {rotaAEstrela.map((subestacao, index) => (
              <Marker
                key={`aestrela-${subestacao.id}-${index}`}
                position={[subestacao.lat, subestacao.lon]}
                icon={customIconRotaAEstrela}
              >
                <Popup>
                  <div>
                    <h3>{subestacao.nome}</h3>
                    <p>
                      <strong>Rota A* - Ponto {index + 1}</strong>
                    </p>
                    <p>ID: {subestacao.id}</p>
                    <p>
                      Estado:{" "}
                      {subestacao.dadosCompletos.unidadeFederativaNordeste}
                    </p>
                    <p>Agente: {subestacao.dadosCompletos.agentePrincipal}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Renderizar rota melhorada */}
            {rotaMelhorada.map((subestacao, index) => (
              <Marker
                key={`melhorada-${subestacao.id}-${index}`}
                position={[subestacao.lat, subestacao.lon]}
                icon={customIconRotaMelhorada}
              >
                <Popup>
                  <div>
                    <h3>{subestacao.nome}</h3>
                    <p>
                      <strong>Rota Melhorada - Ponto {index + 1}</strong>
                    </p>
                    <p>ID: {subestacao.id}</p>
                    <p>
                      Estado:{" "}
                      {subestacao.dadosCompletos.unidadeFederativaNordeste}
                    </p>
                    <p>Agente: {subestacao.dadosCompletos.agentePrincipal}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Linhas da rota A* */}
            {rotaAEstrela.length > 1 && (
              <Polyline
                positions={rotaAEstrela.map((sub) => [sub.lat, sub.lon])}
                color="blue"
                weight={4}
                dashArray="5, 10"
              />
            )}

            {/* Linhas da rota melhorada */}
            {rotaMelhorada.length > 1 && (
              <Polyline
                positions={rotaMelhorada.map((sub) => [sub.lat, sub.lon])}
                color="green"
                weight={6}
              />
            )}

            {/* Marcadores de início e fim */}
            {rotaAEstrela.length > 0 && (
              <>
                <Marker
                  position={[rotaAEstrela[0].lat, rotaAEstrela[0].lon]}
                  icon={customIconInicio}
                >
                  <Popup>
                    <div>
                      <h3>Início - {rotaAEstrela[0].nome}</h3>
                      <p>Ponto de partida da rota</p>
                    </div>
                  </Popup>
                </Marker>
                <Marker
                  position={[
                    rotaAEstrela[rotaAEstrela.length - 1].lat,
                    rotaAEstrela[rotaAEstrela.length - 1].lon,
                  ]}
                  icon={customIconFim}
                >
                  <Popup>
                    <div>
                      <h3>
                        Destino - {rotaAEstrela[rotaAEstrela.length - 1].nome}
                      </h3>
                      <p>Ponto de chegada da rota</p>
                    </div>
                  </Popup>
                </Marker>
              </>
            )}
          </>
        ) : (
          <>
            {/* SUBESTAÇÕES */}
            {subestacoes.map((sub) => {
              const isCritica = isSubestacaoCritica(sub);
              return (
                <Marker
                  key={sub.id}
                  position={[sub.lat, sub.lon]}
                  icon={
                    modoVisualizacaoCritica
                      ? isCritica
                        ? customIconCritico
                        : customIconNormal
                      : defaultIcon
                  }
                  opacity={modoVisualizacaoCritica ? (isCritica ? 1 : 0.3) : 1}
                  eventHandlers={{
                    click: () => {
                      onSubestacaoSelecionada(sub);
                    },
                  }}
                >
                  <Popup>
                    <div>
                      <h3>{sub.nome}</h3>
                      {isCritica && (
                        <p style={{ color: "red", fontWeight: "bold" }}>
                          CRÍTICA
                        </p>
                      )}
                      <p>
                        <strong>ID:</strong> {sub.id}
                      </p>
                      <p>
                        <strong>Coordenadas:</strong> {sub.lat.toFixed(4)},{" "}
                        {sub.lon.toFixed(4)}
                      </p>
                      {sub.dadosCompletos && (
                        <>
                          <p>
                            <strong>UF:</strong>{" "}
                            {sub.dadosCompletos.unidadeFederativaNordeste}
                          </p>
                          <p>
                            <strong>Agente:</strong>{" "}
                            {sub.dadosCompletos.agentePrincipal}
                          </p>
                          <p>
                            <strong>Data Prevista:</strong>{" "}
                            {sub.dadosCompletos.dataPrevista}
                          </p>
                          <p>
                            <strong>Data Entrada:</strong>{" "}
                            {sub.dadosCompletos.dataEntrada}
                          </p>
                        </>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* LINHAS DE TRANSMISSÃO*/}
            {linhasTransmissao.map((linha) => (
              <Polyline
                key={linha.id}
                positions={[
                  [linha.subA.lat, linha.subA.lon],
                  [linha.subB.lat, linha.subB.lon],
                ]}
                color={linha.cor || "blue"}
                weight={4}
                opacity={1}
                eventHandlers={{
                  click: (e) => {
                    onLinhaSelecionada(linha);
                    L.DomEvent.stopPropagation(e);
                  },
                }}
              >
                <Popup>
                  <div>
                    <h3>
                      {linha.dadosCompletos?.nomeEquipamento ||
                        "Linha de Transmissão"}
                    </h3>
                    <p>
                      <strong>ID:</strong> {linha.id}
                    </p>
                    <p>
                      <strong>De:</strong> {linha.subA.nome} (ID:{" "}
                      {linha.subA.id})
                    </p>
                    <p>
                      <strong>Para:</strong> {linha.subB.nome} (ID:{" "}
                      {linha.subB.id})
                    </p>
                    <p>
                      <strong>Tensão:</strong> {linha.tensao}
                    </p>
                    <p>
                      <strong>Comprimento:</strong> {linha.comprimento}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {linha.dadosCompletos?.sensivel ? "Sensível" : "Normal"}
                    </p>
                  </div>
                </Popup>
              </Polyline>
            ))}
          </>
        )}
      </MapContainer>
    </div>
  );
}