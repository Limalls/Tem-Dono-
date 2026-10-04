export function mensagemDeErro(erro) {
  const status = erro.response?.status
  if (status === 401) return "Não foi possível carregar. Verifique sua chave no arquivo .env."
  if (status === 404) return "Item não encontrado."
  if (status === 422) {
    const detalhe = erro.response.data?.detail
    return Array.isArray(detalhe) ? detalhe[0]?.msg ?? "Dados inválidos." : detalhe ?? "Dados inválidos."
  }
  if (!erro.response) return "Sem conexão com a API. Verifique sua internet."
  return "Algo deu errado. Tente novamente."
}
