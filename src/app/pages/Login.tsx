import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { MainLayout } from '../components/MainLayout';
import { authRepo } from '@/data/repos/authRepo';
import hcrSolLogo from '@/assets/4cc5722396a543fc4af4b21d4f57e4ae31cf2825.png';


export function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/hub';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const success = await authRepo.login(email, password);

      if (success) {
        navigate(redirect);
      } else {
        setError(authRepo.getAuthState().loginError || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Ocurrió un error inesperado al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout showSidebars={false}>
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md w-full px-4">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block hover:opacity-80 transition-opacity mb-4">
              <img src={hcrSolLogo} alt="HCR Sol" className="h-20 w-auto mx-auto object-contain" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso al Hub</h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Password Form */}
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          {/* Helper Text */}


          <div className="mt-8 text-center">
            <Link
              to="/"
              className="text-base text-blue-600 hover:text-blue-700"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}