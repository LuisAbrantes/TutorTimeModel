import React, { useState } from 'react';
import Header from '../components/Header';

const Login = ({ navigate }) => {
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = e => {
        e.preventDefault();

        // Verificação simples de senha
        if (senha === 'admin') {
            navigate('manage', { senha: 'True' });
        } else {
            setError('Senha incorreta. Tente novamente.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-md mx-auto bg-gradient-to-br from-darkAlt to-[#2a2a2a] rounded-xl p-8 shadow-xl border border-primary/10">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Acesso Administrativo
                </h2>

                {error && (
                    <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="senha"
                            className="block text-gray-300 mb-2"
                        >
                            Senha de Administrador
                        </label>
                        <input
                            type="password"
                            id="senha"
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                            className="w-full h-[50px] bg-white/5 border border-white/10 rounded-xl px-4 text-white"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full h-[50px] bg-gradient-to-r from-primary to-secondary border-none rounded-xl text-white font-medium text-base cursor-pointer transition-all hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30"
                    >
                        Entrar
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('home')}
                        className="text-primary hover:underline"
                    >
                        Voltar para a Página Inicial
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
