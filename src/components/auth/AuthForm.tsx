import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { setError, clearError } from '@/store/features/authSlice';
import { Mail, Lock, Google } from 'lucide-react';

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      dispatch(setError((error as Error).message));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      dispatch(setError((error as Error).message));
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isLogin ? 'Connexion' : 'Inscription'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <div className="mt-1 relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
          <div className="mt-1 relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full btn btn-primary"
        >
          {isLogin ? 'Se connecter' : "S'inscrire"}
        </button>
      </form>

      <div className="mt-4">
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 btn bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <Google className="h-5 w-5" />
          Continuer avec Google
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-gray-600">
        {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="ml-1 text-primary-600 hover:text-primary-500"
        >
          {isLogin ? "S'inscrire" : "Se connecter"}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;