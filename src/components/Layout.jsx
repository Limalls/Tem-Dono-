import { useEffect, useState } from "react"
import { Link, Outlet } from "react-router-dom"
import api from "../services/api.js"
import Navbar from "./Navbar.jsx"

export default function Layout() {
  const [dono, setDono] = useState(null)

  useEffect(() => {
    async function carregarDono() {
      try {
        const resposta = await api.get("/eu")
        setDono(resposta.data)
      } catch (erro) {
        setDono(null)
      }
    }
    carregarDono()
  }, [])

  return (
    <>
      <div className="fundo" aria-hidden="true">
        <span /><span /><span /><span />
      </div>
      <header className="topo">
        <Link to="/" className="marca">
          <span className="furo" aria-hidden="true" />
          Tem dono?
        </Link>
        <p className="saudacao">
          {dono ? `Olá, ${dono.nome}` : "Olá"}
        </p>
      </header>
      <main className="conteudo">
        <Outlet />
      </main>
      <Navbar />
    </>
  )
}
