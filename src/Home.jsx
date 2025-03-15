import { useState, useEffect } from 'react';

function Home() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Sample tutoring sessions data - would come from API in real app
    const tutoringSessions = [
        {
            id: 1,
            subject: 'Cálculo Avançado',
            tutor: 'Profª Camila Santos',
            time: 'Segunda-feira, 14:00 - 16:00',
            location: 'Laboratório 7',
            color: 'from-purple-500 to-indigo-600',
            icon: '📊'
        },
        {
            id: 2,
            subject: 'Programação em Python',
            tutor: 'Prof. Rafael Oliveira',
            time: 'Terça-feira, 15:30 - 17:30',
            location: 'Sala de Computação A3',
            color: 'from-blue-500 to-teal-400',
            icon: '💻'
        },
        {
            id: 3,
            subject: 'Física Quântica',
            tutor: 'Prof. Eduardo Martins',
            time: 'Quarta-feira, 13:00 - 15:00',
            location: 'Laboratório de Física',
            color: 'from-amber-500 to-red-500',
            icon: '⚛️'
        },
        {
            id: 4,
            subject: 'Eletrônica Digital',
            tutor: 'Profª Luiza Costa',
            time: 'Quinta-feira, 16:00 - 18:00',
            location: 'Laboratório de Eletrônica',
            color: 'from-emerald-500 to-cyan-500',
            icon: '🔌'
        }
    ];

    // Auto-rotate sessions every 8 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isAnimating) {
                nextSession();
            }
        }, 8000);

        return () => clearInterval(interval);
    }, [activeIndex, isAnimating]);

    const nextSession = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setActiveIndex(prev => (prev + 1) % tutoringSessions.length);
            setIsAnimating(false);
        }, 500);
    };

    const prevSession = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setActiveIndex(
                prev =>
                    (prev - 1 + tutoringSessions.length) %
                    tutoringSessions.length
            );
            setIsAnimating(false);
        }, 500);
    };

    return (
        <section className="relative h-[calc(100vh-64px)] overflow-hidden bg-gray-900 text-white">
            {/* Dynamic background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzBoLTZWMGg2djMwem0wIDBoMzB2NkgzNnYtNn
                oiLz48L2c+PC9nPjwvc3ZnPg==')] -z-10"
                ></div>
                <div className="absolute h-full w-full bg-gradient-to-b from-black/0 via-black/20 to-black/80"></div>
            </div>

            {/* Featured session - Full Screen Display */}
            <div
                className={`h-full w-full flex items-center justify-center px-8 transition-opacity duration-500 ${
                    isAnimating ? 'opacity-0' : 'opacity-100'
                }`}
            >
                <div className="w-full max-w-6xl">
                    <div
                        className={`bg-gradient-to-r ${tutoringSessions[activeIndex].color} rounded-2xl shadow-2xl p-10 transform transition-all duration-500 hover:scale-[1.01]`}
                    >
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="mb-8 md:mb-0 md:mr-8 bg-white/20 p-8 rounded-full">
                                <span className="text-8xl mb-4 block animate-pulse">
                                    {tutoringSessions[activeIndex].icon}
                                </span>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-5xl font-bold mb-4">
                                    {tutoringSessions[activeIndex].subject}
                                </h2>
                                <div className="bg-white/20 h-1 w-24 mb-6"></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-xl">
                                    <div>
                                        <p className="text-white/80 mb-1">
                                            Tutor
                                        </p>
                                        <p className="font-semibold">
                                            {
                                                tutoringSessions[activeIndex]
                                                    .tutor
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-white/80 mb-1">
                                            Horário
                                        </p>
                                        <p className="font-semibold">
                                            {tutoringSessions[activeIndex].time}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-white/80 mb-1">
                                            Local
                                        </p>
                                        <p className="font-semibold">
                                            {
                                                tutoringSessions[activeIndex]
                                                    .location
                                            }
                                        </p>
                                    </div>
                                </div>

                                <button className="mt-8 bg-white text-gray-900 px-8 py-4 rounded-lg font-bold hover:bg-opacity-90 transition-colors flex items-center hover:shadow-lg">
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                    Participar desta monitoria
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Session navigation */}
                    <div className="flex justify-between mt-8">
                        <button
                            onClick={prevSession}
                            className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors hover:scale-110"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>

                        <div className="flex space-x-2">
                            {tutoringSessions.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setIsAnimating(true);
                                        setTimeout(() => {
                                            setActiveIndex(index);
                                            setIsAnimating(false);
                                        }, 500);
                                    }}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                        activeIndex === index
                                            ? 'bg-white w-6'
                                            : 'bg-white/30 hover:bg-white/50'
                                    }`}
                                    aria-label={`View tutoring session ${
                                        index + 1
                                    }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextSession}
                            className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors hover:scale-110"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Home;
