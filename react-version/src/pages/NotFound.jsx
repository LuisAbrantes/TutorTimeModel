import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const NotFound = () => {
    return (
        <>
            <Header />

            <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
                <h1 className="text-5xl font-bold text-red-500 mb-6">404</h1>
                <h2 className="text-3xl font-semibold mb-4">
                    Página Não Encontrada
                </h2>
                <p className="text-gray-400 max-w-md mb-8">
                    A página que você está procurando não existe ou foi movida
                    para outro endereço.
                </p>
                <Link
                    to="/home"
                    className="text-primary hover:text-white py-2 px-6 border border-primary rounded-lg hover:bg-primary transition-colors"
                >
                    Voltar para a Página Inicial
                </Link>
            </div>
        </>
    );
};

export default NotFound;
