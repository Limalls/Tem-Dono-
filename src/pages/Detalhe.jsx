import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../services/api.js"
import { formatarData } from "../utils/formatarData.js"
import { mensagemDeErro } from "../utils/erros.js"

export default function Detalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [erroAcao, setErroAcao] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)
  const [recebedor, setRecebedor] = useState("")

  async function carregar() {
    setCarregando(true)
    setErro("")
    try {
      const resposta = await api.get(`/itens/${id}`)
      setItem(resposta.data)
    } catch (e) {
      setErro(mensagemDeErro(e))
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [id])

  async function devolver(evento) {
    evento.preventDefault()
    if (!recebedor.trim()) {
      setErroAcao("Informe o nome de quem recebeu o item.")
      return
    }
    setEnviando(true)
    setErroAcao("")
    try {
      await api.patch(`/itens/${id}/devolver`, { devolvido_para: recebedor.trim() })
      setRecebedor("")
      await carregar()
    } catch (e) {
      setErroAcao(mensagemDeErro(e))
    } finally {
      setEnviando(false)
    }
  }

  async function excluir() {
    setEnviando(true)
    setErroAcao("")
    try {
      await api.delete(`/itens/${id}`)
      navigate("/")
    } catch (e) {
      setErroAcao(mensagemDeErro(e))
      setConfirmandoExclusao(false)
      setEnviando(false)
    }
  }

  if (carregando && !item) return <p className="aviso">Carregando item...</p>

  if (erro) {
    return (
      <>
        <Link to="/" className="voltar">← Voltar</Link>
        <p className="aviso erro" role="alert">{erro}</p>
      </>
    )
  }

  return (
    <>
      <Link to="/" className="voltar">← Voltar</Link>

      <article className="detalhe">
        <header className="detalhe-topo">
          <h1>{item.nome}</h1>
          <span className={`selo ${item.status}`}>{item.status}</span>
        </header>

        <dl className="campos">
          <dt>Descrição</dt>
          <dd>{item.descricao || "—"}</dd>
          <dt>Categoria</dt>
          <dd>{item.categoria}</dd>
          <dt>Local</dt>
          <dd>{item.local}</dd>
          <dt>Encontrado em</dt>
          <dd>{formatarData(item.data_encontrado)}</dd>
          {item.status === "devolvido" && (
            <>
              <dt>Devolvido para</dt>
              <dd>
                {item.devolvido_para}
                {item.data_devolucao && ` em ${formatarData(item.data_devolucao)}`}
              </dd>
            </>
          )}
        </dl>

        {erroAcao && <p className="aviso erro" role="alert">{erroAcao}</p>}

        <div className="acoes">
          <Link to={`/editar/${item.id}`} className="botao sec">Editar</Link>
          <button className="botao perigo" onClick={() => setConfirmandoExclusao(true)} disabled={enviando}>
            Excluir
          </button>
        </div>

        {confirmandoExclusao && (
          <div className="confirmacao" role="alertdialog">
            <p>Tem certeza que deseja excluir?</p>
            <div className="acoes">
              <button className="botao perigo" onClick={excluir} disabled={enviando}>
                {enviando ? "Excluindo..." : "Excluir"}
              </button>
              <button className="botao sec" onClick={() => setConfirmandoExclusao(false)} disabled={enviando}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {item.status === "aguardando" && (
          <form className="devolucao" onSubmit={devolver}>
            <h2>Marcar como devolvido</h2>
            <div className="linha-form">
              <input
                value={recebedor}
                onChange={(e) => setRecebedor(e.target.value)}
                placeholder="Nome de quem recebeu"
                aria-label="Nome de quem recebeu"
              />
              <button className="botao" disabled={enviando}>
                {enviando ? "Salvando..." : "Confirmar"}
              </button>
            </div>
          </form>
        )}
      </article>
    </>
  )
}
