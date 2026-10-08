import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../services/api.js"
import { mensagemDeErro } from "../utils/erros.js"

// "2026-10-08" no fuso local
const hoje = () => new Date().toLocaleDateString("sv-SE")

const vazio = { nome: "", descricao: "", categoria: "", local: "", data_encontrado: hoje() }

// O mesmo componente atende /novo e /editar/:id
export default function Formulario() {
  const { id } = useParams()
  const editando = Boolean(id)
  const navigate = useNavigate()

  const [dados, setDados] = useState(vazio)
  const [categorias, setCategorias] = useState([])
  const [locais, setLocais] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState(null)

  useEffect(() => {
    async function carregar() {
      setCarregando(true)
      setErro("")
      try {
        const [cat, loc] = await Promise.all([api.get("/categorias"), api.get("/locais")])
        setCategorias(cat.data)
        setLocais(loc.data)
        if (editando) {
          const resposta = await api.get(`/itens/${id}`)
          const { nome, descricao, categoria, local, data_encontrado } = resposta.data
          setDados({ nome, descricao: descricao ?? "", categoria, local, data_encontrado })
        } else {
          setDados(vazio)
        }
      } catch (e) {
        setErro(mensagemDeErro(e))
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [id])

  // depois de salvar, mostra a mensagem por um instante e vai para o detalhe
  useEffect(() => {
    if (!sucesso) return
    const t = setTimeout(() => navigate(sucesso.destino), 1000)
    return () => clearTimeout(t)
  }, [sucesso])

  function alterar(campo, valor) {
    setDados((antigo) => ({ ...antigo, [campo]: valor }))
  }

  async function salvar(evento) {
    evento.preventDefault()
    setErro("")
    if (!dados.nome.trim() || !dados.categoria || !dados.local || !dados.data_encontrado) {
      setErro("Preencha nome, categoria, local e a data em que foi encontrado.")
      return
    }
    setEnviando(true)
    try {
      const corpo = { ...dados, nome: dados.nome.trim(), descricao: dados.descricao.trim() }
      const resposta = editando
        ? await api.put(`/itens/${id}`, corpo)
        : await api.post("/itens", corpo)
      const idSalvo = resposta.data?.id ?? id
      setSucesso({
        mensagem: editando ? "Item atualizado!" : "Item cadastrado!",
        destino: idSalvo ? `/item/${idSalvo}` : "/"
      })
    } catch (e) {
      setErro(mensagemDeErro(e))
      setEnviando(false)
    }
  }

  const voltarPara = editando ? `/item/${id}` : "/"

  if (carregando) return <p className="aviso">Carregando formulário...</p>

  return (
    <>
      <Link to={voltarPara} className="voltar">← Voltar</Link>
      <div className="titulo-linha">
        <h1>{editando ? "Editar item" : "Novo item"}</h1>
      </div>

      <form className="form" onSubmit={salvar} noValidate>
        <label>
          Nome
          <input value={dados.nome} onChange={(e) => alterar("nome", e.target.value)} placeholder="Ex.: Garrafa térmica azul" />
        </label>

        <label>
          Descrição
          <textarea value={dados.descricao} onChange={(e) => alterar("descricao", e.target.value)} placeholder="Cor, marca, detalhes que ajudem a reconhecer" />
        </label>

        <label>
          Categoria
          <select value={dados.categoria} onChange={(e) => alterar("categoria", e.target.value)}>
            <option value="">Selecione...</option>
            {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <label>
          Local
          <select value={dados.local} onChange={(e) => alterar("local", e.target.value)}>
            <option value="">Selecione...</option>
            {locais.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>

        <label>
          Data em que foi encontrado
          <input type="date" max={hoje()} value={dados.data_encontrado} onChange={(e) => alterar("data_encontrado", e.target.value)} />
        </label>

        {erro && <p className="aviso erro" role="alert">{erro}</p>}
        {sucesso && <p className="aviso ok" role="status">{sucesso.mensagem}</p>}

        <div className="acoes">
          <button className="botao" disabled={enviando}>{enviando ? "Salvando..." : "Salvar"}</button>
          <Link to={voltarPara} className="botao sec">Cancelar</Link>
        </div>
      </form>
    </>
  )
}
