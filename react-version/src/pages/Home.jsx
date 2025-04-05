import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Header from '../components/Header';

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
        <div className="relative h-screen">
            <Header navigate={navigate} currentPage="home" />

            {/* Slider Items */}
            <div className="relative w-full h-full overflow-hidden">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <p className="text-2xl text-white">Carregando...</p>
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
                            <div className="w-full h-[60vh] overflow-hidden relative">
                                <div
                                    className="w-full h-full bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url(${subject.imagemUrl})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                ></div>

                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                            </div>

                            <div className="absolute left-[10%] top-[20%] w-[500px] max-w-[80%] z-20">
                                <p
                                    className={`uppercase tracking-[10px] text-white ${
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
                                    className="text-white no-underline hover:text-primary transition-colors"
                                >
                                    <h2
                                        className={`text-5xl md:text-7xl lg:text-8xl m-0 font-bold ${
                                            index === activeItem
                                                ? 'animate-fadeIn delay-100'
                                                : ''
                                        }`}
                                    >
                                        {subject.nome}
                                    </h2>
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Navigation Arrows */}
            <div className="absolute top-[30%] right-[50px] z-30">
                <button
                    onClick={handlePrev}
                    className="bg-white bg-opacity-30 border-none w-10 h-10 rounded text-xl text-white transition-all hover:bg-white hover:text-black"
                >
                    &lt;
                </button>
                <button
                    onClick={handleNext}
                    className="bg-white bg-opacity-30 border-none w-10 h-10 rounded text-xl text-white transition-all hover:bg-white hover:text-black mt-2"
                >
                    &gt;
                </button>
            </div>

            {/* Thumbnails */}
            <div className="absolute bottom-[50px] z-20 flex gap-[10px] w-full h-auto max-h-[180px] px-[50px] box-border overflow-auto justify-center">
                {subjects.map((subject, index) => (
                    <div
                        key={subject.id}
                        onClick={() => handleThumbnailClick(index)}
                        className={`w-[120px] h-[150px] transition-all duration-500 flex-shrink-0 cursor-pointer relative
                        ${
                            index === activeItem
                                ? 'brightness-150'
                                : 'brightness-50'
                        }`}
                    >
                        <div
                            className="w-full h-full rounded-lg bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${subject.imagemUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        ></div>
                        <div className="absolute bottom-2 left-2 right-2 text-white text-sm font-medium">
                            {subject.nome}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
