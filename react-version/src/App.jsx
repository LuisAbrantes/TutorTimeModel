import React, { useState, lazy, Suspense } from 'react';
import Header from './components/Header';
import './index.css';

// Usando React.lazy para carregamento sob demanda dos componentes
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Login = lazy(() => import('./pages/Login'));
const Manage = lazy(() => import('./pages/Manage'));
const SubjectDetail = lazy(() => import('./pages/SubjectDetail'));
const Calendar = lazy(() => import('./pages/Calendar'));
const AITutor = lazy(() => import('./pages/AITutor'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Componente de loading para Suspense
const Loading = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
);

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
                return <About navigate={navigate} />;
            case 'manage':
                if (currentParams.senha) {
                    return (
                        <Manage
                            senha={currentParams.senha}
                            navigate={navigate}
                        />
                    );
                }
                return <Login navigate={navigate} />;
            case 'subject':
                return (
                    <SubjectDetail
                        materia={currentParams.materia}
                        navigate={navigate}
                    />
                );
            case 'calendar':
                return <Calendar navigate={navigate} />;
            case 'tutor':
                return <AITutor navigate={navigate} />;
            default:
                return <NotFound navigate={navigate} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            <Header navigate={navigate} currentPage={currentPage} />
            <main className="flex-grow">
                <Suspense fallback={<Loading />}>{renderContent()}</Suspense>
            </main>
        </div>
    );
}

export default App;
