import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';
const DEFAULT_IMAGE = '/logo.png';

const SubjectDetail = ({ materia, navigate }) => {
    const [tutorials, setTutorials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [locationFilter, setLocationFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('grid');
    const [selectedTutorial, setSelectedTutorial] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const searchInputRef = useRef(null);

    // Ensure browser back button works
    useEffect(() => {
        const handlePopState = () => {
            if (typeof navigate === 'function') {
                navigate('home');
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

    const fetchTutorials = useCallback(async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(`${API_BASE_URL}/tutorials`);

            const filteredTutorials = response.data
                .filter(
                    tutorial =>
                        tutorial.Materia.nome.toLowerCase() ===
                        materia.toLowerCase()
                )
                .map(tutorial => ({
                    ...tutorial,
                    imagemUrl: tutorial.imagemUrl || DEFAULT_IMAGE
                }));

            setTutorials(filteredTutorials);
            setIsLoading(false);
        } catch (err) {
            console.error('Error fetching tutorials:', err);
            setError('Failed to load tutorials. Please try again.');
            setIsLoading(false);
        }
    }, [materia]);

    useEffect(() => {
        fetchTutorials();

        const handleKeyDown = e => {
            if (
                e.key === '/' &&
                document.activeElement !== searchInputRef.current
            ) {
                e.preventDefault();
                searchInputRef.current?.focus();
            }

            if (e.key === 'Escape') {
                setShowDetailModal(false);
            }

            if (e.key === 'g' && e.altKey) {
                setActiveTab('grid');
            }

            if (e.key === 'l' && e.altKey) {
                setActiveTab('list');
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [fetchTutorials]);

    const handleInscricao = async id => {
        try {
            await axios.get(`http://localhost:3000/inscrito/${id}`);

            setTutorials(prevTutorials =>
                prevTutorials.map(tutorial =>
                    tutorial.id === id
                        ? { ...tutorial, inscricoes: tutorial.inscricoes + 1 }
                        : tutorial
                )
            );

            const successMessage = document.getElementById('success-message');
            successMessage.classList.remove('opacity-0');
            successMessage.classList.add('opacity-100');

            setTimeout(() => {
                successMessage.classList.remove('opacity-100');
                successMessage.classList.add('opacity-0');
            }, 3000);
        } catch (err) {
            console.error('Error registering for tutorial:', err);

            const errorMessage = document.getElementById('error-message');
            errorMessage.classList.remove('opacity-0');
            errorMessage.classList.add('opacity-100');

            setTimeout(() => {
                errorMessage.classList.remove('opacity-100');
                errorMessage.classList.add('opacity-0');
            }, 3000);
        }
    };

    const filteredTutorials = tutorials.filter(tutorial => {
        const dayMatches = filter === 'all' || filter === tutorial.dia;
        const locationMatches =
            locationFilter === 'all' || tutorial.local === locationFilter;

        const searchMatches =
            searchTerm === '' ||
            tutorial.Monitor.nome
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            tutorial.Professor.nome
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            tutorial.local.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tutorial.descricao
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            tutorial.dia.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tutorial.horario.toLowerCase().includes(searchTerm.toLowerCase());

        return dayMatches && locationMatches && searchMatches;
    });

    const uniqueDays = [
        ...new Set(tutorials.map(tutorial => tutorial.dia))
    ].sort();

    const uniqueLocations = [
        ...new Set(tutorials.map(tutorial => tutorial.local))
    ].sort();

    const handleTutorialClick = tutorial => {
        setSelectedTutorial(tutorial);
        setShowDetailModal(true);
    };

    const clearFilters = () => {
        setFilter('all');
        setLocationFilter('all');
        setSearchTerm('');
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    const handleNavigation = (page, params = {}) => {
        if (typeof navigate === 'function') {
            navigate(page, params);
        } else {
            console.error('Navigation function is not available');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
            <div
                id="success-message"
                className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300 opacity-0"
            >
                <div className="flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Inscrição realizada com sucesso!
                </div>
            </div>

            <div
                id="error-message"
                className="fixed top-20 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300 opacity-0"
            >
                <div className="flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Erro ao realizar inscrição. Por favor, tente novamente.
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 pt-16 animate-fadeIn">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-0">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            Monitorias de {materia}
                        </span>
                    </h1>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleNavigation('home')}
                            className="inline-flex items-center px-4 py-2 bg-primary/20 text-primary hover:bg-primary hover:text-white rounded-lg transition-all duration-300"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Voltar
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="text-center bg-red-500/10 border border-red-500/30 rounded-xl p-8 shadow-lg">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-red-500 mx-auto mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                        <p className="text-xl text-red-500 mb-4">{error}</p>
                        <button
                            onClick={() => fetchTutorials()}
                            className="inline-block px-6 py-3 mr-4 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                        >
                            Tentar Novamente
                        </button>
                        <button
                            onClick={() => handleNavigation('home')}
                            className="inline-block px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Voltar para a Página Inicial
                        </button>
                    </div>
                ) : tutorials.length === 0 ? (
                    <div className="text-center bg-gray-800/50 border border-gray-700 rounded-xl p-8 shadow-lg">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-gray-400 mx-auto mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <p className="text-xl text-gray-400 mb-4">
                            Nenhuma monitoria encontrada para esta matéria.
                        </p>
                        <button
                            onClick={() => handleNavigation('home')}
                            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                        >
                            Voltar para a Página Inicial
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-4 bg-gray-800/30 p-3 rounded-lg text-sm text-gray-400">
                            <span className="font-medium">
                                Dicas de atalhos:
                            </span>{' '}
                            Pressione{' '}
                            <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">
                                /
                            </kbd>{' '}
                            para pesquisar,{' '}
                            <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">
                                Alt+G
                            </kbd>{' '}
                            para visualização em grade,{' '}
                            <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">
                                Alt+L
                            </kbd>{' '}
                            para lista.
                        </div>

                        <div className="mb-8 bg-gray-800/30 p-4 rounded-xl border border-gray-700/50 shadow-lg">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            placeholder="Pesquisar monitor, professor, local..."
                                            className="w-full bg-gray-900/80 text-white border border-gray-700 rounded-lg py-3 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
                                            value={searchTerm}
                                            onChange={e =>
                                                setSearchTerm(e.target.value)
                                            }
                                        />
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 absolute top-3.5 left-3 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <select
                                        value={filter}
                                        onChange={e =>
                                            setFilter(e.target.value)
                                        }
                                        className="bg-gray-900/80 text-white border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                                        aria-label="Filtrar por dia"
                                    >
                                        <option value="all">
                                            Todos os dias
                                        </option>
                                        {uniqueDays.map(day => (
                                            <option key={day} value={day}>
                                                {day}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        value={locationFilter}
                                        onChange={e =>
                                            setLocationFilter(e.target.value)
                                        }
                                        className="bg-gray-900/80 text-white border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                                        aria-label="Filtrar por local"
                                    >
                                        <option value="all">
                                            Todos os locais
                                        </option>
                                        {uniqueLocations.map(location => (
                                            <option
                                                key={location}
                                                value={location}
                                            >
                                                {location}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="flex rounded-lg overflow-hidden border border-gray-700">
                                        <button
                                            onClick={() => setActiveTab('grid')}
                                            className={`px-3 py-2 ${
                                                activeTab === 'grid'
                                                    ? 'bg-primary text-white'
                                                    : 'bg-gray-900/80 text-gray-400'
                                            } transition-colors duration-200`}
                                            aria-label="Visualização em grade"
                                            title="Visualização em grade (Alt+G)"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('list')}
                                            className={`px-3 py-2 ${
                                                activeTab === 'list'
                                                    ? 'bg-primary text-white'
                                                    : 'bg-gray-900/80 text-gray-400'
                                            } transition-colors duration-200`}
                                            aria-label="Visualização em lista"
                                            title="Visualização em lista (Alt+L)"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 6h16M4 12h16M4 18h16"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6 flex justify-between items-center">
                            <div className="text-gray-400">
                                Exibindo {filteredTutorials.length} de{' '}
                                {tutorials.length} monitorias
                            </div>

                            {(filter !== 'all' ||
                                locationFilter !== 'all' ||
                                searchTerm !== '') && (
                                <button
                                    onClick={clearFilters}
                                    className="text-primary hover:text-white hover:bg-primary/20 px-3 py-1 rounded-lg transition-colors flex items-center text-sm"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                    Limpar filtros
                                </button>
                            )}
                        </div>

                        <div className="transition-all duration-300 ease-in-out">
                            {activeTab === 'grid' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredTutorials.map(
                                        (tutorial, index) => (
                                            <div
                                                key={tutorial.id}
                                                className="bg-gradient-to-br from-[#18181f] to-[#222230] rounded-lg overflow-hidden shadow-lg border border-primary/10 transition-all hover:shadow-xl hover:shadow-primary/20 hover:border-primary/30 animate-fadeIn cursor-pointer"
                                                style={{
                                                    animationDelay: `${
                                                        index * 0.1
                                                    }s`
                                                }}
                                                onClick={() =>
                                                    handleTutorialClick(
                                                        tutorial
                                                    )
                                                }
                                                tabIndex="0"
                                                role="button"
                                                aria-label={`Ver detalhes da monitoria de ${tutorial.Materia.nome}`}
                                                onKeyDown={e => {
                                                    if (
                                                        e.key === 'Enter' ||
                                                        e.key === ' '
                                                    ) {
                                                        e.preventDefault();
                                                        handleTutorialClick(
                                                            tutorial
                                                        );
                                                    }
                                                }}
                                            >
                                                <div
                                                    className="h-40 bg-cover bg-center border-b-[3px] border-primary relative group"
                                                    style={{
                                                        backgroundImage: `url(${tutorial.imagemUrl})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition:
                                                            'center'
                                                    }}
                                                >
                                                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                        <span className="text-white font-medium text-lg">
                                                            {
                                                                tutorial.Materia
                                                                    .nome
                                                            }
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="p-5">
                                                    <h2 className="text-xl font-semibold mb-4 pb-2.5 relative text-white">
                                                        {tutorial.Materia.nome}
                                                        <span className="absolute bottom-0 left-0 w-10 h-[3px] bg-primary rounded"></span>
                                                    </h2>

                                                    <div className="space-y-3 text-gray-300 text-sm mb-4">
                                                        <p>
                                                            <span className="text-primary font-medium">
                                                                Monitor:
                                                            </span>{' '}
                                                            {
                                                                tutorial.Monitor
                                                                    .nome
                                                            }
                                                        </p>
                                                        <p>
                                                            <span className="text-primary font-medium">
                                                                Professor:
                                                            </span>{' '}
                                                            {
                                                                tutorial
                                                                    .Professor
                                                                    .nome
                                                            }
                                                        </p>
                                                        <p>
                                                            <span className="text-primary font-medium">
                                                                Horário:
                                                            </span>{' '}
                                                            {tutorial.horario} -{' '}
                                                            {tutorial.dia}
                                                        </p>
                                                        <p>
                                                            <span className="text-primary font-medium">
                                                                Local:
                                                            </span>{' '}
                                                            {tutorial.local}
                                                        </p>
                                                        <p>
                                                            <span className="text-primary font-medium">
                                                                Inscritos:
                                                            </span>{' '}
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                                                                {
                                                                    tutorial.inscricoes
                                                                }
                                                            </span>
                                                        </p>
                                                    </div>

                                                    <p className="text-gray-400 mt-4 text-sm border-t border-primary/20 pt-4 line-clamp-3">
                                                        {tutorial.descricao}
                                                    </p>

                                                    <div className="mt-6 flex justify-center">
                                                        <button
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                handleInscricao(
                                                                    tutorial.id
                                                                );
                                                            }}
                                                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-all duration-300 transform hover:-translate-y-1"
                                                        >
                                                            Inscrever-se
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredTutorials.map(
                                        (tutorial, index) => (
                                            <div
                                                key={tutorial.id}
                                                className="bg-gradient-to-r from-[#18181f] to-[#222230] rounded-lg overflow-hidden shadow-lg border border-primary/10 transition-all hover:shadow-xl hover:shadow-primary/20 hover:border-primary/30 animate-fadeIn cursor-pointer"
                                                style={{
                                                    animationDelay: `${
                                                        index * 0.05
                                                    }s`
                                                }}
                                                onClick={() =>
                                                    handleTutorialClick(
                                                        tutorial
                                                    )
                                                }
                                                tabIndex="0"
                                                role="button"
                                                aria-label={`Ver detalhes da monitoria de ${tutorial.Materia.nome}`}
                                                onKeyDown={e => {
                                                    if (
                                                        e.key === 'Enter' ||
                                                        e.key === ' '
                                                    ) {
                                                        e.preventDefault();
                                                        handleTutorialClick(
                                                            tutorial
                                                        );
                                                    }
                                                }}
                                            >
                                                <div className="flex flex-col md:flex-row">
                                                    <div
                                                        className="w-full md:w-48 h-40 bg-cover bg-center border-b-[3px] md:border-b-0 md:border-r-[3px] border-primary"
                                                        style={{
                                                            backgroundImage: `url(${tutorial.imagemUrl})`,
                                                            backgroundSize:
                                                                'cover',
                                                            backgroundPosition:
                                                                'center'
                                                        }}
                                                    ></div>

                                                    <div className="p-5 flex-1">
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                                                            <h2 className="text-xl font-semibold mb-4 md:mb-0 relative text-white">
                                                                {
                                                                    tutorial
                                                                        .Materia
                                                                        .nome
                                                                }
                                                                <span className="absolute bottom-0 left-0 w-10 h-[3px] bg-primary rounded md:hidden"></span>
                                                            </h2>

                                                            <div className="md:ml-4">
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                                                                    {
                                                                        tutorial.inscricoes
                                                                    }{' '}
                                                                    inscritos
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <p className="text-primary font-medium text-sm">
                                                                    Monitor
                                                                </p>
                                                                <p className="text-gray-300">
                                                                    {
                                                                        tutorial
                                                                            .Monitor
                                                                            .nome
                                                                    }
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <p className="text-primary font-medium text-sm">
                                                                    Professor
                                                                </p>
                                                                <p className="text-gray-300">
                                                                    {
                                                                        tutorial
                                                                            .Professor
                                                                            .nome
                                                                    }
                                                                </p>
                                                            </div>

                                                            <div>
                                                                <p className="text-primary font-medium text-sm">
                                                                    Horário e
                                                                    Local
                                                                </p>
                                                                <p className="text-gray-300">
                                                                    {
                                                                        tutorial.horario
                                                                    }{' '}
                                                                    -{' '}
                                                                    {
                                                                        tutorial.dia
                                                                    }
                                                                </p>
                                                                <p className="text-gray-300">
                                                                    {
                                                                        tutorial.local
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <p className="text-gray-400 mt-4 text-sm line-clamp-2 border-t border-primary/20 pt-4">
                                                            {tutorial.descricao}
                                                        </p>

                                                        <div className="mt-4 flex justify-end">
                                                            <button
                                                                onClick={e => {
                                                                    e.stopPropagation();
                                                                    handleInscricao(
                                                                        tutorial.id
                                                                    );
                                                                }}
                                                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-all duration-300 transform hover:-translate-y-1"
                                                            >
                                                                Inscrever-se
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>

                        {filteredTutorials.length === 0 && (
                            <div className="text-center py-10">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-12 w-12 text-gray-400 mx-auto mb-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <p className="text-gray-400 text-lg">
                                    Nenhuma monitoria corresponde aos filtros
                                    selecionados.
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-4 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                                >
                                    Limpar filtros
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {showDetailModal && selectedTutorial && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fadeIn">
                    <div
                        className="bg-gradient-to-br from-[#1c1c24] to-[#2a2a3a] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <div
                            className="h-60 bg-cover bg-center border-b-[3px] border-primary"
                            style={{
                                backgroundImage: `url(${selectedTutorial.imagemUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                            <div className="flex justify-end p-4">
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-white mb-6">
                                Monitoria de {selectedTutorial.Materia.nome}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="text-primary font-semibold mb-2">
                                        Detalhes da Monitoria
                                    </h3>
                                    <ul className="space-y-3 text-gray-300">
                                        <li className="flex">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-primary mr-2 flex-shrink-0"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span>
                                                <span className="font-medium">
                                                    Monitor:
                                                </span>{' '}
                                                {selectedTutorial.Monitor.nome}
                                            </span>
                                        </li>
                                        <li className="flex">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-primary mr-2 flex-shrink-0"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 a1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                            </svg>
                                            <span>
                                                <span className="font-medium">
                                                    Professor:
                                                </span>{' '}
                                                {
                                                    selectedTutorial.Professor
                                                        .nome
                                                }
                                            </span>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-primary font-semibold mb-2">
                                        Horário e Local
                                    </h3>
                                    <ul className="space-y-3 text-gray-300">
                                        <li className="flex">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-primary mr-2 flex-shrink-0"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span>
                                                <span className="font-medium">
                                                    Horário:
                                                </span>{' '}
                                                {selectedTutorial.horario} -{' '}
                                                {selectedTutorial.dia}
                                            </span>
                                        </li>
                                        <li className="flex">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-primary mr-2 flex-shrink-0"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span>
                                                <span className="font-medium">
                                                    Local:
                                                </span>{' '}
                                                {selectedTutorial.local}
                                            </span>
                                        </li>
                                        <li className="flex">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-primary mr-2 flex-shrink-0"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                            </svg>
                                            <span>
                                                <span className="font-medium">
                                                    Inscritos:
                                                </span>{' '}
                                                {selectedTutorial.inscricoes}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-primary font-semibold mb-2">
                                    Descrição
                                </h3>
                                <p className="text-gray-300">
                                    {selectedTutorial.descricao}
                                </p>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Fechar
                                </button>

                                <button
                                    onClick={() => {
                                        handleInscricao(selectedTutorial.id);
                                        setShowDetailModal(false);
                                    }}
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    Inscrever-se
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubjectDetail;
