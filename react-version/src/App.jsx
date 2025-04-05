import React, { useState } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Manage from './pages/Manage';
import SubjectDetail from './pages/SubjectDetail';
import NotFound from './pages/NotFound';
import './index.css';

function App() {
    // Estado para gerenciar a "página" atual
    const [currentPage, setCurrentPage] = useState('home');
    const [currentParams, setCurrentParams] = useState({});

    // Função para navegar entre as páginas
    const navigate = (page, params = {}) => {
        setCurrentPage(page);
        setCurrentParams(params);
        // Atualiza a URL para manter compatibilidade com navegação do navegador
        window.history.pushState(
            {},
            '',
            `/${page}${params.senha ? `/${params.senha}` : ''}${
                params.materia ? `/${params.materia}` : ''
            }`
        );
    };

    // Renderizar o conteúdo baseado na página atual
    const renderContent = () => {
        switch (currentPage) {
            case 'home':
                return <Home navigate={navigate} />;
            case 'about':
                return <About />;
            case 'manage':
                if (currentParams.senha) {
                    return <Manage senha={currentParams.senha} />;
                }
                return <Login navigate={navigate} />;
            case 'subject':
                return <SubjectDetail materia={currentParams.materia} />;
            default:
                return <NotFound navigate={navigate} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            <Header navigate={navigate} currentPage={currentPage} />

            <main className="flex-grow">{renderContent()}</main>
        </div>
    );
}

export default App;
