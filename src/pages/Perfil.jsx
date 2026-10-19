import { useEffect, useState } from "react"
import api from "../services/api.js"
import { mensagemDeErro } from "../utils/erros.js"

const rotulos = { nome: "Nome", matricula: "Matrícula", turma: "Turma", total_itens: "Total de itens" }

function rotulo(chave) {
  return rotulos[chave] ?? chave.charAt(0).toUpperCase() + chave.slice(1).replace(/_/g, " ")
}

export default function Perfil() {
  const [dono, setDono] = useState(null)
  const [itens, setItens] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    async function carregar() {
      try {
        const [eu, lista] = await Promise.all([api.get("/eu"), api.get("/itens")])
        setDono(eu.data)
        setItens(lista.data)
      } catch (e) {
        setErro(mensagemDeErro(e))
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

  if (carregando) return <p className="aviso">Carregando perfil...</p>
  if (erro) return <p className="aviso erro" role="alert">{erro}</p>

  const aguardando = itens.filter((i) => i.status === "aguardando").length
  const devolvidos = itens.filter((i) => i.status === "devolvido").length

  return (
    <>
      <div className="titulo-linha">
        <h1>Perfil</h1>
      </div>

      <div className="stats">
        <div><strong>{itens.length}</strong><span>itens</span></div>
        <div><strong>{aguardando}</strong><span>aguardando</span></div>
        <div><strong>{devolvidos}</strong><span>devolvidos</span></div>
      </div>

      <article className="detalhe">
        <dl className="campos">
          {Object.entries(dono)
            .filter(([, valor]) => typeof valor !== "object")
            .map(([chave, valor]) => (
              <div key={chave} className="campo">
                <dt>{rotulo(chave)}</dt>
                <dd>{String(valor)}</dd>
              </div>
            ))}
        </dl>
      </article>
    </>
  )
}
