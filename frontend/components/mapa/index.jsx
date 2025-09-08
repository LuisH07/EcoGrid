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
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [20, 32.8],
  iconAnchor: [10, 32.8],
  popupAnchor: [0, -32.8]  
});

function ZoomController({ elementoParaZoom }) {
  const map = useMap();
  const lastElementId = useRef(null);

  useEffect(() => {
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
  }, [elementoParaZoom, map]);

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
}) {
  return (
    <div className="mapa-container">
      <MapContainer center={[-8.0, -37.0]} zoom={6} className="mapa">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Controlador de zoom */}
        <ZoomController elementoParaZoom={elementoParaZoom} />

        <PopupController
          popupAbertoId={popupAbertoId}
          popupTipo={popupTipo}
          subestacoes={subestacoes}
          linhasTransmissao={linhasTransmissao}
        />

        {/* Marcadores das subestações */}
        {subestacoes.map((sub) => (
          <Marker
            key={sub.id}
            position={[sub.lat, sub.lon]}
            eventHandlers={{
              click: () => {
                console.log("Subestação clicada:", sub.id);
                onSubestacaoSelecionada(sub);
              },
            }}
          >
            <Popup>
              <div>
                <h3>{sub.nome}</h3>
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
        ))}

        {/* Linhas de transmissão */}
        {linhasTransmissao.map((linha) => (
          <Polyline
            key={linha.id}
            positions={[
              [linha.subA.lat, linha.subA.lon],
              [linha.subB.lat, linha.subB.lon],
            ]}
            color={linha.cor}
            weight={4}
            eventHandlers={{
              click: (e) => {
                console.log("Linha clicada:", linha.id);
                onLinhaSelecionada(linha);
                L.DomEvent.stopPropagation(e);
              },
            }}
          >
            <Popup>
              <div>
                <h3>{linha.dadosCompletos.nomeEquipamento || "Linha de Transmissão"}</h3>
                <p>
                  <strong>De:</strong> {linha.subA.nome}
                </p>
                <p>
                  <strong>Para:</strong> {linha.subB.nome}
                </p>
                <p>
                  <strong>Tensão:</strong> {linha.tensao}
                </p>
                <p>
                  <strong>Comprimento:</strong> {linha.comprimento}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {linha.dadosCompletos.sensivel ? "Sensível" : "Normal"}
                </p>
                {linha.dadosCompletos.informacoesAdministrativas && (
                  <>
                    <p>
                      <strong>Agente:</strong>{" "}
                      {linha.dadosCompletos.informacoesAdministrativas.agenteProprietario}
                    </p>
                    <p>
                      <strong>Outorga:</strong>{" "}
                      {linha.dadosCompletos.informacoesAdministrativas.numeroOutorga}
                    </p>
                    <p>
                      <strong>Data Prevista:</strong>{" "}
                      {linha.dadosCompletos.informacoesAdministrativas.dataPrevista}
                    </p>
                    <p>
                      <strong>Data Entrada:</strong>{" "}
                      {linha.dadosCompletos.informacoesAdministrativas.dataEntrada}
                    </p>
                  </>
                )}
              </div>
            </Popup>
          </Polyline>
        ))}

        {/* Áreas protegidas */}
        {areasProtegidas.map((area) => (
          <Polygon
            key={area.id}
            positions={area.coords}
            color="green"
            fillOpacity={0.3}
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
      </MapContainer>
    </div>
  );
}