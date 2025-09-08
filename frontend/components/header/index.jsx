import "../../css/layout/header.css";
import { PiGraph } from "react-icons/pi";

export default function Header() {
  return (
    <header className="header">
      <div className="main-header">
        <div className="title-wrapper">
          <h1>Subestações e Linhas de Transmissão</h1>
          <p>Mapa - Grafo</p>
        </div>
        <div className="logo-wrapper">
          <p>
            <PiGraph />
          </p>
        </div>
      </div>
    </header>
  );
}
