import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const API_BASE_URL = 'http://localhost:3000/api';
const DEFAULT_IMAGE = '/logo.png';

const SubjectDetail = ({ materia, navigate }) => {
    const [tutorials, setTutorials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTutorials = async () => {
            try {
                setIsLoading(true);

                // First get all tutorials
                const response = await axios.get(`${API_BASE_URL}/tutorials`);

                // Filter tutorials for this subject
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
        };

        fetchTutorials();
    }, [materia]);

    const handleInscricao = async id => {
        try {
            // In a real app with authentication, you'd send the user ID too
            // For now, we'll just increment the inscricoes count
            await axios.get(`http://localhost:3000/inscrito/${id}`);

            // Update the UI optimistically
            setTutorials(prevTutorials =>
                prevTutorials.map(tutorial =>
                    tutorial.id === id
                        ? { ...tutorial, inscricoes: tutorial.inscricoes + 1 }
                        : tutorial
                )
            );

            alert('Inscrição realizada com sucesso!');
        } catch (err) {
            console.error('Error registering for tutorial:', err);
            alert('Erro ao realizar inscrição. Por favor, tente novamente.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <Header navigate={navigate} currentPage="subject" />

            <div className="container mx-auto px-4 py-8 pt-20">
                <h1 className="text-3xl font-bold text-center mb-8 text-white">
                    Monitorias de {materia}
                </h1>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-xl text-gray-400">
                            Carregando monitorias...
                        </p>
                    </div>
                ) : error ? (
                    <div className="text-center">
                        <p className="text-xl text-red-500 mb-4">{error}</p>
                        <button
                            onClick={() => navigate('home')}
                            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                        >
                            Voltar para a Página Inicial
                        </button>
                    </div>
                ) : tutorials.length === 0 ? (
                    <div className="text-center">
                        <p className="text-xl text-gray-400 mb-4">
                            Nenhuma monitoria encontrada para esta matéria.
                        </p>
                        <button
                            onClick={() => navigate('home')}
                            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                        >
                            Voltar para a Página Inicial
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tutorials.map(tutorial => (
                            <div
                                key={tutorial.id}
                                className="bg-gradient-to-br from-[#18181f] to-[#222230] rounded-lg overflow-hidden shadow-lg border border-primary/10 transition-all hover:shadow-xl hover:shadow-primary/20 hover:border-primary/30"
                            >
                                <div
                                    className="h-40 bg-cover bg-center border-b-[3px] border-primary"
                                    style={{
                                        backgroundImage: `url(${tutorial.imagemUrl})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                ></div>

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
                                            {tutorial.Monitor.nome}
                                        </p>
                                        <p>
                                            <span className="text-primary font-medium">
                                                Professor:
                                            </span>{' '}
                                            {tutorial.Professor.nome}
                                        </p>
                                        <p>
                                            <span className="text-primary font-medium">
                                                Horário:
                                            </span>{' '}
                                            {tutorial.horario} - {tutorial.dia}
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
                                            {tutorial.inscricoes}
                                        </p>
                                    </div>

                                    <p className="text-gray-400 mt-4 text-sm border-t border-primary/20 pt-4 line-clamp-3">
                                        {tutorial.descricao}
                                    </p>

                                    <div className="mt-6 flex justify-center">
                                        <button
                                            onClick={() =>
                                                handleInscricao(tutorial.id)
                                            }
                                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                                        >
                                            Inscrever-se
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubjectDetail;
