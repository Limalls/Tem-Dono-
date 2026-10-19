import { useEffect, useState } from "react"
import { Link, Outlet } from "react-router-dom"
import api from "../services/api.js"
import Navbar from "./Navbar.jsx"

export default function Layout() {
  const [dono, setDono] = useState(null)
  const [alegre, setAlegre] = useState(() => {
    try { return localStorage.getItem("estilo") === "alegre" } catch (e) { return false }
  })

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

  useEffect(() => {
    document.documentElement.dataset.estilo = alegre ? "alegre" : ""
    try { localStorage.setItem("estilo", alegre ? "alegre" : "padrao") } catch (e) {}
  }, [alegre])

    function trocarEstilo() {
    const html = document.documentElement
    html.classList.add("trocando")
    setAlegre(!alegre)
    setTimeout(() => html.classList.remove("trocando"), 400)
  }

  return (
    <>
      <header className="topo">
        <Link to="/" className="marca">
          Tem dono?<small>Achados e perdidos · IFRN</small>
        </Link>
        <div className="topo-dir">
          <button className="estilo-btn" onClick={trocarEstilo} aria-pressed={alegre}>
            {alegre ? "Estilo padrão" : "Estilo alegre"}
          </button>
          <p className="saudacao">{dono ? `Olá, ${dono.nome}` : "Olá"}</p>
        </div>
      </header>
      <main className="conteudo">
        <Outlet />
      </main>
      <Navbar />
    </>
  )
}
