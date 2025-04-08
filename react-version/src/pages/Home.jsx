import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    ChevronLeft,
    ChevronRight,
    BookOpen,
    Book,
    Info,
    Calendar
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000/api';
const DEFAULT_IMAGE = '/logo.png';

const Home = ({ navigate }) => {
    const [subjects, setSubjects] = useState([]);
    const [activeItem, setActiveItem] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const intervalRef = useRef(null);

    // Fetch real data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/subjects`);

                if (response.data && response.data.length > 0) {
                    const processedSubjects = response.data.map(subject => ({
                        ...subject,
                        imagemUrl: subject.imagemUrl || DEFAULT_IMAGE
                    }));
                    setSubjects(processedSubjects);
                } else {
                    setSubjects([
                        {
                            id: 0,
                            nome: 'Sem Monitorias',
                            imagemUrl: DEFAULT_IMAGE
                        }
                    ]);
                }

                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching subjects:', err);
                setError('Failed to load subjects. Please try again.');
                setIsLoading(false);

                setSubjects([
                    {
                        id: 0,
                        nome: 'Erro ao Carregar',
                        imagemUrl: DEFAULT_IMAGE
                    }
                ]);
            }
        };

        fetchData();
    }, []);

    // Auto-advance slider
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setActiveItem(
                prevActive => (prevActive + 1) % Math.max(1, subjects.length)
            );
        }, 5000);

        return () => clearInterval(intervalRef.current);
    }, [subjects.length]);

    const handleNext = () => {
        clearInterval(intervalRef.current);
        setActiveItem(
            prevActive => (prevActive + 1) % Math.max(1, subjects.length)
        );

        intervalRef.current = setInterval(() => {
            setActiveItem(
                prevActive => (prevActive + 1) % Math.max(1, subjects.length)
            );
        }, 5000);
    };

    const handlePrev = () => {
        clearInterval(intervalRef.current);
        setActiveItem(
            prevActive =>
                (prevActive - 1 + Math.max(1, subjects.length)) %
                Math.max(1, subjects.length)
        );

        intervalRef.current = setInterval(() => {
            setActiveItem(
                prevActive => (prevActive + 1) % Math.max(1, subjects.length)
            );
        }, 5000);
    };

    const handleThumbnailClick = index => {
        clearInterval(intervalRef.current);
        setActiveItem(index);

        intervalRef.current = setInterval(() => {
            setActiveItem(
                prevActive => (prevActive + 1) % Math.max(1, subjects.length)
            );
        }, 5000);
    };

    const navigateToSubject = subject => {
        navigate('subject', { materia: subject.nome });
    };

    return (
        <div className="relative h-screen bg-dark">
            {/* Header removido daqui, agora está no App.jsx */}

            {/* Slider Items */}
            <div className="relative w-full h-full overflow-hidden">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                            <p className="text-2xl text-white font-medium">
                                Carregando...
                            </p>
                        </div>
                    </div>
                ) : (
                    subjects.map((subject, index) => (
                        <div
                            key={subject.id}
                            className={`absolute inset-0 transition-opacity duration-500 
                            ${
                                index === activeItem
                                    ? 'opacity-100 z-10'
                                    : 'opacity-0'
                            }`}
                        >
                            <div className="w-full h-[70vh] overflow-hidden relative">
                                <div
                                    className="w-full h-full bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url(${subject.imagemUrl})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                ></div>

                                {/* Enhanced gradient overlay for better text visibility */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                            </div>

                            <div className="absolute left-[10%] top-[25%] w-[600px] max-w-[80%] z-20">
                                <p
                                    className={`uppercase tracking-[10px] text-primary font-medium ${
                                        index === activeItem
                                            ? 'animate-fadeIn'
                                            : ''
                                    }`}
                                >
                                    Encontre a sua monitoria
                                </p>
                                <a
                                    href="#"
                                    onClick={e => {
                                        e.preventDefault();
                                        navigateToSubject(subject);
                                    }}
                                    className="group no-underline transition-colors"
                                >
                                    <h2
                                        className={`text-5xl md:text-7xl lg:text-8xl m-0 font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] 
                                        ${
                                            index === activeItem
                                                ? 'animate-fadeIn delay-100'
                                                : ''
                                        }
                                        bg-gradient-to-r from-white to-white bg-clip-text group-hover:text-transparent group-hover:from-primary group-hover:to-secondary transition-all duration-300`}
                                    >
                                        {subject.nome}
                                    </h2>
                                </a>
                                <div
                                    className={`mt-4 bg-dark/60 backdrop-blur-sm rounded-lg p-3 max-w-md border-l-4 border-primary 
                                    ${
                                        index === activeItem
                                            ? 'animate-fadeIn delay-200'
                                            : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Info className="text-primary h-5 w-5 flex-shrink-0" />
                                        <p className="text-gray-200 text-sm md:text-base">
                                            Clique para ver detalhes sobre as
                                            monitorias disponíveis para esta
                                            matéria
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Improved Navigation Arrows with Lucide Icons */}
            <div className="absolute top-[50%] transform -translate-y-1/2 w-full flex justify-between px-4 z-30">
                <button
                    onClick={handlePrev}
                    className="bg-dark/50 backdrop-blur-sm border border-primary/20 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all hover:bg-primary hover:text-white"
                    aria-label="Matéria anterior"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                    onClick={handleNext}
                    className="bg-dark/50 backdrop-blur-sm border border-primary/20 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all hover:bg-primary hover:text-white"
                    aria-label="Próxima matéria"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            </div>

            {/* Enhanced Thumbnails with Lucide Icons */}
            <div className="absolute bottom-[80px] z-20 flex gap-[15px] w-full max-h-[180px] px-[50px] box-border overflow-auto justify-center">
                {subjects.map((subject, index) => (
                    <div
                        key={subject.id}
                        onClick={() => handleThumbnailClick(index)}
                        className={`w-[130px] h-[160px] transition-all duration-500 flex-shrink-0 cursor-pointer relative 
                        ${
                            index === activeItem
                                ? 'ring-4 ring-primary scale-110'
                                : 'brightness-50 hover:brightness-75'
                        }`}
                    >
                        <div
                            className="w-full h-full rounded-lg bg-cover bg-center shadow-lg"
                            style={{
                                backgroundImage: `url(${subject.imagemUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        ></div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 rounded-b-lg">
                            <div className="flex items-center gap-2">
                                <Book className="w-4 h-4 text-primary flex-shrink-0" />
                                <div className="text-white text-sm font-medium line-clamp-2">
                                    {subject.nome}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Botão para o calendário de monitorias */}
            <div className="absolute bottom-[20px] left-0 right-0 flex justify-center z-20">
                <button
                    onClick={() => navigate('calendar')}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30"
                >
                    <Calendar className="h-5 w-5" />
                    <span>Ver calendário de monitorias</span>
                </button>
            </div>
        </div>
    );
};

export default Home;
