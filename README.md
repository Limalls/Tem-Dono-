# Tem dono? — Achados e Perdidos IFRN

Front-end do sistema de achados e perdidos do campus Pau dos Ferros, feito em **React + Vite** e conectado a uma API real. Atividade da disciplina Programação para Internet (Técnico Integrado em Informática, IFRN).

![Tela inicial](docs/tela-inicial.png)

## O que o sistema faz

- Mostra no topo o nome do dono da chave de acesso.
- Lista os itens encontrados, com busca por texto e filtros por status, categoria e local.
- Abre o detalhe de cada item.
- Cadastra e edita itens usando o mesmo formulário.
- Marca um item como devolvido, informando para quem foi entregue.
- Exclui um item, pedindo confirmação antes.
- Mostra mensagens de carregando, lista vazia e erros da API.
- Tem uma página de perfil com os dados do dono e a contagem de itens.
- Tem dois estilos visuais (padrão e alegre), trocados por um botão no topo. A escolha fica salva no navegador.

## Rotas

| Rota | Tela |
| --- | --- |
| `/` | Lista de itens, busca e filtros |
| `/item/:id` | Detalhe, editar, excluir e marcar como devolvido |
| `/novo` | Cadastro de item |
| `/editar/:id` | Edição de item (mesmo formulário do cadastro) |
| `/perfil` | Dados do dono da chave e totais |

## Como rodar

1. Clone o repositório e entre na pasta:
   ```bash
   git clone https://github.com/SEU-USUARIO/achados-front.git
   cd achados-front
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz com a sua chave da API (veja o `.env.example`):
   ```
   VITE_API_KEY=sua-chave-aqui
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Abra o endereço mostrado no terminal, normalmente `http://localhost:5173`.

O arquivo `.env` está no `.gitignore`, então a chave não vai para o GitHub.

## Tecnologias

- React 18 e Vite
- React Router (rotas)
- Axios, com uma única instância em `src/services/api.js`
- CSS próprio, sem bibliotecas de componentes

## Estrutura

```
src/
  components/   Layout, Navbar, ItemCard
  pages/        Home, Detalhe, Formulario, Perfil
  services/     api.js (instância do Axios)
  utils/        formatarData.js, erros.js
  index.css     estilo padrão
  alegre.css    estilo alegre
```
