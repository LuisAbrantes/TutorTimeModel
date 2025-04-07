import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import {
    Search,
    X,
    ArrowLeft,
    Grid,
    List,
    CheckCircle,
    AlertCircle,
    Clock,
    MapPin,
    Users,
    User,
    GraduationCap,
    Calendar,
    Share2,
    Mail,
    ExternalLink,
    QrCode,
    Copy
} from 'lucide-react';
import TutorialCard from '../components/TutorialCard';
import LazyImage from '../components/LazyImage';
import { useTheme } from '../context/ThemeContext';

const API_BASE_URL = 'http://localhost:3000/api';
const DEFAULT_IMAGE = '/logo.png';

// Função para gerar URL de compartilhamento
const generateShareURL = (tutorial) => {
    const baseURL = window.location.origin;
    return `${baseURL}/subject/${encodeURIComponent(tutorial.Materia.nome)}?tutorialId=${tutorial.id}`;
};

// Componente para gerar QR code
const QRCodeModal = ({ url, onClose }) => {
    const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-gradient-to-br dark:from-[#1c1c24] dark:to-[#2a2a3a] from-white to-gray-100 rounded-xl p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold dark:text-white text-gray-900">QR Code para Compartilhamento</h3>
                    <button 
                        onClick={onClose}
                        className="bg-black/50 hover:bg-black/70 text-white rounded-full p-1"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                
                <div className="flex justify-center mb-4">
                    <img 
                        src={qrCodeURL} 
                        alt="QR Code para compartilhamento" 
                        className="w-48 h-48 border-4 border-white rounded-lg"
                    />
                </div>
                
                <p className="dark:text-gray-300 text-gray-700 text-sm mb-4 text-center">
                    Escaneie este código QR para acessar diretamente esta monitoria
                </p>
                
                <div className="flex justify-center">
                    <button 
                        onClick={() => {
                            navigator.clipboard.writeText(url);
                            alert('Link copiado!');
                        }}
                        className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                    >
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar Link
                    </button>
                </div>
            </div>
        </div>
    );
};

// Componente para o botão de compartilhamento
const ShareButton = React.memo(({ tutorial }) => {
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [showQRCode, setShowQRCode] = useState(false);
    const shareURL = generateShareURL(tutorial);
    
    const handleShare = (platform) => {
        switch (platform) {
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(`Confira esta monitoria de ${tutorial.Materia.nome}: ${shareURL}`)}`, '_blank');
                break;
            case 'email':
                window.open(`mailto:?subject=${encodeURIComponent(`Monitoria de ${tutorial.Materia.nome}`)}&body=${encodeURIComponent(`Olá! Confira esta monitoria:\n\nMatéria: ${tutorial.Materia.nome}\nMonitor: ${tutorial.Monitor.nome}\nHorário: ${tutorial.horario} - ${tutorial.dia}\nLocal: ${tutorial.local}\n\nLink: ${shareURL}`)}`, '_blank');
                break;
            case 'copy':
                navigator.clipboard.writeText(shareURL).then(() => {
                    alert('Link copiado para a área de transferência!');
                });
                break;
            case 'qrcode':
                setShowQRCode(true);
                setShowShareOptions(false);
                break;
            default:
                console.error('Plataforma de compartilhamento não suportada');
        }
    };
    
    return (
        <div className="relative">
            <button 
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="flex items-center px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                aria-label="Compartilhar monitoria"
            >
                <Share2 className="h-5 w-5 mr-2" />
                Compartilhar
            </button>
            
            {showShareOptions && (
                <div className="absolute right-0 bottom-12 bg-gradient-to-br dark:from-[#1c1c24] dark:to-[#2a2a3a] from-white to-gray-100 rounded-lg p-3 shadow-xl border dark:border-gray-700/50 border-gray-300/50 z-10 animate-fadeIn">
                    <div className="flex flex-col space-y-2">
                        <button 
                            onClick={() => handleShare('whatsapp')}
                            className="flex items-center px-3 py-2 hover:bg-green-500/20 dark:text-white text-gray-900 rounded-lg transition-colors text-sm"
                        >
                            <ExternalLink className="h-4 w-4 mr-2 text-green-400" />
                            WhatsApp
                        </button>
                        <button 
                            onClick={() => handleShare('email')}
                            className="flex items-center px-3 py-2 hover:bg-blue-500/20 dark:text-white text-gray-900 rounded-lg transition-colors text-sm"
                        >
                            <Mail className="h-4 w-4 mr-2 text-blue-400" />
                            Email
                        </button>
                        <button 
                            onClick={() => handleShare('copy')}
                            className="flex items-center px-3 py-2 hover:bg-yellow-500/20 dark:text-white text-gray-900 rounded-lg transition-colors text-sm"
                        >
                            <Copy className="h-4 w-4 mr-2 text-yellow-400" />
                            Copiar link
                        </button>
                        <button 
                            onClick={() => handleShare('qrcode')}
                            className="flex items-center px-3 py-2 hover:bg-purple-500/20 dark:text-white text-gray-900 rounded-lg transition-colors text-sm"
                        >
                            <QrCode className="h-4 w-4 mr-2 text-purple-400" />
                            Gerar QR code
                        </button>
                    </div>
                </div>
            )}
            
            {showQRCode && (
                <QRCodeModal 
                    url={shareURL}
                    onClose={() => setShowQRCode(false)}
                />
            )}
        </div>
    );
});

// Componente principal
const SubjectDetail = ({ materia = '', navigate }) => {
    const { darkMode } = useTheme();
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
                .filter(tutorial => {
                    // Verifica se o tutorial tem a estrutura correta antes de acessar as propriedades
                    if (
                        !tutorial ||
                        !tutorial.Materia ||
                        !tutorial.Materia.nome
                    ) {
                        return false;
                    }
                    return (
                        tutorial.Materia.nome.toLowerCase() ===
                        materia.toLowerCase()
                    );
                })
                .map(tutorial => ({
                    ...tutorial,
                    imagemUrl: tutorial.imagemUrl || DEFAULT_IMAGE
                }));

            setTutorials(filteredTutorials);
            setIsLoading(false);
            
            // Verificar se há um ID de tutorial na URL para abrir diretamente
            const urlParams = new URLSearchParams(window.location.search);
            const tutorialId = urlParams.get('tutorialId');
            
            if (tutorialId) {
                const tutorialToOpen = filteredTutorials.find(t => t.id.toString() === tutorialId);
                if (tutorialToOpen) {
                    setSelectedTutorial(tutorialToOpen);
                    setShowDetailModal(true);
                }
            }
        } catch (err) {
            console.error('Error fetching tutorials:', err);
            setError('Failed to load tutorials. Please try again.');
            setIsLoading(false);
        }
    }, [materia]);

    useEffect(() => {
        fetchTutorials();

        const handleKeyDown = e => {
            // Atalho para pesquisa
            if (
                e.key === '/' &&
                document.activeElement !== searchInputRef.current
            ) {
                e.preventDefault();
                searchInputRef.current?.focus();
            }

            // Fechamento modal com ESC
            if (e.key === 'Escape') {
                setShowDetailModal(false);
            }

            // Detecta se estamos em Mac OS (Command) ou outros sistemas (Control)
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const modifierKey = isMac ? e.metaKey : e.ctrlKey;

            // Visualização em grade com Command/Control+Shift+G
            if ((e.key === 'g' || e.key === 'G') && modifierKey && e.shiftKey) {
                e.preventDefault();
                setActiveTab('grid');
            }

            // Visualização em lista com Command/Control+Shift+L
            if ((e.key === 'l' || e.key === 'L') && modifierKey && e.shiftKey) {
                e.preventDefault();
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

    // Memorizar os tutoriais filtrados
    const filteredTutorials = React.useMemo(() => {
        return tutorials.filter(tutorial => {
            // Skip tutorials with missing required properties
            if (!tutorial || !tutorial.Monitor || !tutorial.Professor) {
                return false;
            }

            const dayMatches = filter === 'all' || filter === tutorial.dia;
            const locationMatches =
                locationFilter === 'all' || tutorial.local === locationFilter;

            // Safely access properties with optional chaining and nullish coalescing
            const searchMatches =
                searchTerm === '' ||
                (tutorial.Monitor?.nome || '')
                    .toLowerCase()
                    .includes((searchTerm || '').toLowerCase()) ||
                (tutorial.Professor?.nome || '')
                    .toLowerCase()
                    .includes((searchTerm || '').toLowerCase()) ||
                (tutorial.local || '')
                    .toLowerCase()
                    .includes((searchTerm || '').toLowerCase()) ||
                (tutorial.descricao || '')
                    .toLowerCase()
                    .includes((searchTerm || '').toLowerCase()) ||
                (tutorial.dia || '')
                    .toLowerCase()
                    .includes((searchTerm || '').toLowerCase()) ||
                (tutorial.horario || '')
                    .toLowerCase()
                    .includes((searchTerm || '').toLowerCase());

            return dayMatches && locationMatches && searchMatches;
        });
    }, [tutorials, filter, locationFilter, searchTerm]);

    const uniqueDays = React.useMemo(() => {
        return [
            ...new Set(
                tutorials
                    .filter(tutorial => tutorial && tutorial.dia)
                    .map(tutorial => tutorial.dia)
            )
        ].sort();
    }, [tutorials]);

    const uniqueLocations = React.useMemo(() => {
        return [
            ...new Set(
                tutorials
                    .filter(tutorial => tutorial && tutorial.local)
                    .map(tutorial => tutorial.local)
            )
        ].sort();
    }, [tutorials]);

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
        <div className="min-h-screen dark:bg-gradient-to-b dark:from-gray-900 dark:to-black bg-gradient-to-b from-light to-lightAlt transition-colors duration-300">
            <div
                id="success-message"
                className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300 opacity-0"
            >
                <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Inscrição realizada com sucesso!
                </div>
            </div>

            <div
                id="error-message"
                className="fixed top-20 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300 opacity-0"
            >
                <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Erro ao realizar inscrição. Por favor, tente novamente.
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 pt-16 animate-fadeIn">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold dark:text-white text-gray-900 mb-4 md:mb-0">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            Monitorias de {materia}
                        </span>
                    </h1>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleNavigation('calendar')}
                            className="inline-flex items-center px-4 py-2 bg-primary/20 text-primary hover:bg-primary hover:text-white rounded-lg transition-all duration-300 mr-2"
                        >
                            <Calendar className="h-5 w-5 mr-2" />
                            Ver calendário
                        </button>
                        <button
                            onClick={() => handleNavigation('home')}
                            className="inline-flex items-center px-4 py-2 bg-primary/20 text-primary hover:bg-primary hover:text-white rounded-lg transition-all duration-300"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
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
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <p className="text-xl text-red-500 mb-4">{error}</p>
                        <button
                            onClick={() => fetchTutorials()}
                            className="inline-block px-6 py-3 mr-4 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                        >
                            Tentar Novamente
                        </button>
                        <button
                            onClick={() => handleNavigation('home')}
                            className="inline-block px-6 py-3 dark:bg-gray-700 bg-gray-300 dark:text-white text-gray-900 rounded-lg hover:bg-gray-600 hover:text-white transition-colors"
                        >
                            Voltar para a Página Inicial
                        </button>
                    </div>
                ) : tutorials.length === 0 ? (
                    <div className="text-center dark:bg-gray-800/50 bg-gray-100 border dark:border-gray-700 border-gray-300 rounded-xl p-8 shadow-lg">
                        <Users className="h-12 w-12 dark:text-gray-400 text-gray-500 mx-auto mb-4" />
                        <p className="text-xl dark:text-gray-400 text-gray-600 mb-4">
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
                        <div className="mb-4 dark:bg-gray-800/30 bg-gray-200 p-3 rounded-lg text-sm dark:text-gray-400 text-gray-600">
                            <span className="font-medium">
                                Dicas de atalhos:
                            </span>{' '}
                            Pressione{' '}
                            <kbd className="px-2 py-1 dark:bg-gray-700 bg-gray-300 rounded text-xs">
                                /
                            </kbd>{' '}
                            para pesquisar,{' '}
                            <kbd className="px-2 py-1 dark:bg-gray-700 bg-gray-300 rounded text-xs">
                                Command/Control+Shift+G
                            </kbd>{' '}
                            para visualização em grade,{' '}
                            <kbd className="px-2 py-1 dark:bg-gray-700 bg-gray-300 rounded text-xs">
                                Command/Control+Shift+L
                            </kbd>{' '}
                            para lista.
                        </div>

                        <div className="mb-8 dark:bg-gray-800/30 bg-white/80 p-4 rounded-xl border dark:border-gray-700/50 border-gray-300/50 shadow-lg">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            placeholder="Pesquisar monitor, professor, local..."
                                            className="w-full dark:bg-gray-900/80 bg-white text-gray-900 dark:text-white border dark:border-gray-700 border-gray-300 rounded-lg py-3 px-4 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
                                            value={searchTerm}
                                            onChange={e =>
                                                setSearchTerm(e.target.value)
                                            }
                                        />
                                        <Search className="h-5 w-5 absolute top-3.5 left-3 dark:text-gray-400 text-gray-500" />
                                        {searchTerm && (
                                            <button
                                                onClick={() => {
                                                    setSearchTerm('');
                                                    searchInputRef.current?.focus();
                                                }}
                                                className="absolute right-3 top-3.5 dark:text-gray-400 text-gray-500 hover:text-primary transition-colors"
                                                aria-label="Limpar pesquisa"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <select
                                        value={filter}
                                        onChange={e =>
                                            setFilter(e.target.value)
                                        }
                                        className="dark:bg-gray-900/80 bg-white dark:text-white text-gray-900 border dark:border-gray-700 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
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
                                        className="dark:bg-gray-900/80 bg-white dark:text-white text-gray-900 border dark:border-gray-700 border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
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

                                    <div className="flex rounded-lg overflow-hidden border dark:border-gray-700 border-gray-300">
                                        <button
                                            onClick={() => setActiveTab('grid')}
                                            className={`px-3 py-2 ${
                                                activeTab === 'grid'
                                                    ? 'bg-primary text-white'
                                                    : 'dark:bg-gray-900/80 bg-white/80 dark:text-gray-400 text-gray-600'
                                            } transition-colors duration-200`}
                                            aria-label="Visualização em grade"
                                            title="Visualização em grade (Command/Control+Shift+G)"
                                        >
                                            <Grid className="h-6 w-6" />
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('list')}
                                            className={`px-3 py-2 ${
                                                activeTab === 'list'
                                                    ? 'bg-primary text-white'
                                                    : 'dark:bg-gray-900/80 bg-white/80 dark:text-gray-400 text-gray-600'
                                            } transition-colors duration-200`}
                                            aria-label="Visualização em lista"
                                            title="Visualização em lista (Command/Control+Shift+L)"
                                        >
                                            <List className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6 flex justify-between items-center">
                            <div className="dark:text-gray-400 text-gray-600">
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
                                    <X className="h-4 w-4 mr-1" />
                                    Limpar filtros
                                </button>
                            )}
                        </div>

                        <div className="transition-all duration-300 ease-in-out">
                            {activeTab === 'grid' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredTutorials.map(
                                        (tutorial, index) => (
                                            <TutorialCard 
                                                key={`${tutorial.id}-${index}`}
                                                tutorial={tutorial}
                                                onClick={handleTutorialClick}
                                                onInscricao={handleInscricao}
                                            />
                                        )
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredTutorials.map(
                                        (tutorial, index) => (
                                            <div
                                                key={`${tutorial.id}-${index}`}
                                                className="bg-gradient-to-r dark:from-[#18181f] dark:to-[#222230] from-white to-gray-100 rounded-lg overflow-hidden shadow-lg border dark:border-primary/10 border-primary/20 transition-all hover:shadow-xl hover:shadow-primary/20 hover:border-primary/30 animate-fadeIn cursor-pointer"
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
                                                    <div className="relative w-full md:w-48 h-40">
                                                        <LazyImage 
                                                            src={tutorial.imagemUrl}
                                                            alt={`Imagem da monitoria de ${tutorial.Materia.nome}`}
                                                            className="w-full h-full border-b-[3px] md:border-b-0 md:border-r-[3px] border-primary"
                                                        />
                                                    </div>

                                                    <div className="p-5 flex-1">
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                                                            <h2 className="text-xl font-semibold mb-4 md:mb-0 relative dark:text-white text-gray-900">
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
                                                                <p className="dark:text-gray-300 text-gray-700">
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
                                                                <p className="dark:text-gray-300 text-gray-700">
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
                                                                <p className="dark:text-gray-300 text-gray-700">
                                                                    {
                                                                        tutorial.horario
                                                                    }{' '}
                                                                    -{' '}
                                                                    {
                                                                        tutorial.dia
                                                                    }
                                                                </p>
                                                                <p className="dark:text-gray-300 text-gray-700">
                                                                    {
                                                                        tutorial.local
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <p className="dark:text-gray-400 text-gray-600 mt-4 text-sm line-clamp-2 border-t dark:border-primary/20 border-primary/30 pt-4">
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
                                <Users className="h-12 w-12 dark:text-gray-400 text-gray-500 mx-auto mb-4" />
                                <p className="dark:text-gray-400 text-gray-600 text-lg">
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
                        className="bg-gradient-to-br dark:from-[#1c1c24] dark:to-[#2a2a3a] from-white to-gray-100 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="relative h-60">
                            <LazyImage 
                                src={selectedTutorial.imagemUrl}
                                alt={`Imagem da monitoria de ${selectedTutorial.Materia.nome}`}
                                className="h-60 border-b-[3px] border-primary"
                            />
                            <div className="absolute top-0 right-0 p-4">
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold dark:text-white text-gray-900">
                                    Monitoria de {selectedTutorial.Materia.nome}
                                </h2>
                                
                                <ShareButton tutorial={selectedTutorial} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="text-primary font-semibold mb-2">
                                        Detalhes da Monitoria
                                    </h3>
                                    <ul className="space-y-3 dark:text-gray-300 text-gray-700">
                                        <li className="flex">
                                            <User className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                                            <span>
                                                <span className="font-medium">
                                                    Monitor:
                                                </span>{' '}
                                                {selectedTutorial.Monitor.nome}
                                            </span>
                                        </li>
                                        <li className="flex">
                                            <GraduationCap className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
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
                                    <ul className="space-y-3 dark:text-gray-300 text-gray-700">
                                        <li className="flex">
                                            <Clock className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                                            <span>
                                                <span className="font-medium">
                                                    Horário:
                                                </span>{' '}
                                                {selectedTutorial.horario} -{' '}
                                                {selectedTutorial.dia}
                                            </span>
                                        </li>
                                        <li className="flex">
                                            <MapPin className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                                            <span>
                                                <span className="font-medium">
                                                    Local:
                                                </span>{' '}
                                                {selectedTutorial.local}
                                            </span>
                                        </li>
                                        <li className="flex">
                                            <Users className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
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
                                <p className="dark:text-gray-300 text-gray-700">
                                    {selectedTutorial.descricao}
                                </p>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="px-6 py-2 dark:bg-gray-700 bg-gray-200 dark:text-white text-gray-900 rounded-lg hover:bg-gray-600 hover:text-white transition-colors"
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
