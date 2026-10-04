import { Link, useLocation } from "react-router-dom"
import "./navbar.css"

const icones = {
  casa: <path d="M3 11.5 12 4l9 7.5M5.5 10v9.5h13V10" />,
  mais: <path d="M12 5v14M5 12h14" />
}

const links = [
  { para: "/", nome: "Início", icone: "casa" },
  { para: "/novo", nome: "Novo item", icone: "mais" }
]

export default function Navbar() {
  const { pathname } = useLocation()
  const ativo = Math.max(
    0,
    links.findIndex((l) => (l.para === "/" ? pathname === "/" : pathname.startsWith(l.para)))
  )

  return (
    <nav className="barra" style={{ "--n": links.length, "--i": ativo }} aria-label="Navegação principal">
      <span className="pino" aria-hidden="true" />
      {links.map((l, i) => (
        <Link key={l.para} to={l.para} className={`aba${i === ativo ? " active" : ""}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {icones[l.icone]}
          </svg>
          {l.nome}
        </Link>
      ))}
    </nav>
  )
}
