import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout.jsx"
import Home from "./pages/Home.jsx"
import Detalhe from "./pages/Detalhe.jsx"

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/item/:id" element={<Detalhe />} />

      </Route>
    </Routes>
  )
}
