import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

const ADMIN_EMAIL = "admin@exemple.com"
const ADMIN_PASSWORD = "admin123"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState(location.state?.error || "")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("authToken", "admin-token")
      navigate("/dashboard")
    } else {
      setError("Identifiants invalides")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Connexion administrateur</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Se connecter</button>
        <div className="mt-4 text-xs text-gray-500 text-center">
          <div>Email : <b>admin@exemple.com</b></div>
          <div>Mot de passe : <b>admin123</b></div>
        </div>
      </form>
    </div>
  )
} 