import { Link } from "react-router-dom"

function formatarData(iso) {
  if (!iso) return ""
  const [ano, mes, dia] = iso.split("-")
  return `${dia}/${mes}/${ano}`
}

export default function ItemCard({ item }) {
  return (
    <li>
      <Link to={`/item/${item.id}`} className={`etiqueta ${item.status}`}>
        <span className="furo" aria-hidden="true" />
        <div className="etiqueta-corpo">
          <h3>{item.nome}</h3>
          <p className="meta">
            {item.categoria} — {item.local}, {formatarData(item.data_encontrado)}
          </p>
        </div>
        <span className={`selo ${item.status}`}>{item.status}</span>
      </Link>
    </li>
  )
}
