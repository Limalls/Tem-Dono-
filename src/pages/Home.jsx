import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api.js"
import ItemCard from "../components/ItemCard.jsx"
import { mensagemDeErro } from "../utils/erros.js"

export default function Home() {
  const [itens, setItens] = useState([])
  const [categorias, setCategorias] = useState([])
  const [locais, setLocais] = useState([])
  const [busca, setBusca] = useState("")
  const [status, setStatus] = useState("")
  const [categoria, setCategoria] = useState("")
  const [local, setLocal] = useState("")
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    async function carregarOpcoes() {
      try {
        const [cat, loc] = await Promise.all([
          api.get("/categorias"),
          api.get("/locais")
        ])
        setCategorias(cat.data)
        setLocais(loc.data)
      } catch (e) {
      }
    }
    carregarOpcoes()
  }, [])

  useEffect(() => {
    let atual = true
    const espera = setTimeout(async () => {
      setCarregando(true)
      setErro("")
      try {
        const params = {}
        if (busca.trim()) params.busca = busca.trim()
        if (status) params.status = status
        if (categoria) params.categoria = categoria
        if (local) params.local = local
        const resposta = await api.get("/itens", { params })
        if (atual) setItens(resposta.data)
      } catch (e) {
        if (atual) setErro(mensagemDeErro(e))
      } finally {
        if (atual) setCarregando(false)
      }
    }, 300) 

    return () => {
      atual = false
      clearTimeout(espera)
    }
  }, [busca, status, categoria, local])

  return (
    <>
      <div className="titulo-linha">
        <h1>Itens encontrados</h1>
        <Link to="/novo" className="botao">+ Novo item</Link>
      </div>

      <div className="filtros">
        <input
          type="search"
          placeholder="Buscar por nome ou descrição..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          aria-label="Buscar itens"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
          <option value="">Todos os status</option>
          <option value="aguardando">Aguardando</option>
          <option value="devolvido">Devolvido</option>
        </select>
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} aria-label="Categoria">
          <option value="">Todas as categorias</option>
          {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={local} onChange={(e) => setLocal(e.target.value)} aria-label="Local">
          <option value="">Todos os locais</option>
          {locais.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {carregando && <p className="aviso">Carregando itens...</p>}
      {!carregando && erro && <p className="aviso erro" role="alert">{erro}</p>}
      {!carregando && !erro && itens.length === 0 && (
        <p className="aviso">Nenhum item encontrado.</p>
      )}

      {!carregando && !erro && itens.length > 0 && (
        <ul className="lista">
          {itens.map((item) => <ItemCard key={item.id} item={item} />)}
        </ul>
      )}
    </>
  )
}
