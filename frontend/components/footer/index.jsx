import "../../css/layout/footer.css";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="main-footer">
        <div className="text-wrapper">
          <p>&copy; 2025, Criado por:</p>
          <div className="name-wrapper">
            <p>Raphael Augusto Paulino Leite,  Arthur Roberto Araújo Tavares  e  Luís Henrique Domingos da Silva</p>
          </div>
        </div>
        <div className="git-wrapper">
          <a href="https://github.com/LuisH07/EcoGrid.git">
            <FaGithub className="git-icon" />
            <p>Repositório Github</p>
          </a>
        </div>
      </div>
    </footer>
  );
}
