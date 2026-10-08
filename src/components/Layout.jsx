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
      <header className="topo">
        <Link to="/" className="marca">
          Tem dono?<small>Achados e perdidos · IFRN</small>
        </Link>
        <p className="saudacao">{dono ? `Olá, ${dono.nome}` : "Olá"}</p>
      </header>
      <main className="conteudo">
        <Outlet />
      </main>
      <Navbar />
    </>
  )
}
