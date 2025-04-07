import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Calendar as CalendarIcon,
    ArrowLeft,
    User,
    GraduationCap,
    Clock,
    MapPin,
    RefreshCw,
    Info,
    AlertCircle
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000/api';
const DEFAULT_IMAGE = '/logo.png';

// Array de dias da semana com possíveis variações
const DIAS_SEMANA = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const DIAS_VARIANTES = {
    Segunda: ['segunda', 'segunda-feira', 'seg', '2'],
    Terça: ['terça', 'terça-feira', 'terca', 'terca-feira', 'ter', '3'],
    Quarta: ['quarta', 'quarta-feira', 'qua', '4'],
    Quinta: ['quinta', 'quinta-feira', 'qui', '5'],
    Sexta: ['sexta', 'sexta-feira', 'sex', '6'],
    Sábado: ['sábado', 'sabado', 'sab', '7']
};

// Função para normalizar o nome do dia
const normalizeDia = dia => {
    if (!dia) return null;

    // Converter para minúsculas e remover espaços em branco extras
    const diaLowerCase = dia.toLowerCase().trim();

    // Verificar se o dia corresponde a alguma das variantes
    for (const [diaPadronizado, variantes] of Object.entries(DIAS_VARIANTES)) {
        if (
            variantes.includes(diaLowerCase) ||
            diaPadronizado.toLowerCase() === diaLowerCase
        ) {
            return diaPadronizado;
        }
    }

    // Se não encontrou correspondência, retorna o dia original
    console.warn(`Dia não reconhecido: ${dia}`);
    return dia;
};

const Calendar = ({ navigate }) => {
    const [tutorials, setTutorials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDay, setSelectedDay] = useState('');
    const [tutorialsByDay, setTutorialsByDay] = useState({});
    const [refreshKey, setRefreshKey] = useState(0);
    const [showDistribution, setShowDistribution] = useState(false);
    const [debugInfo, setDebugInfo] = useState([]);
    const [showDebug, setShowDebug] = useState(false);

    // Função para buscar as monitorias do banco de dados
    const fetchTutorials = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(`${API_BASE_URL}/tutorials`);
            const debugItems = [];

            // Verificar se há dados válidos retornados
            if (!response.data || response.data.length === 0) {
                console.log('Nenhuma monitoria encontrada no banco de dados');
                const emptyTutorials = {};
                DIAS_SEMANA.forEach(dia => {
                    emptyTutorials[dia] = [];
                });
                setTutorialsByDay(emptyTutorials);
                setSelectedDay(DIAS_SEMANA[0]);
                setTutorials([]);
                setDebugInfo([
                    'Nenhuma monitoria encontrada no banco de dados'
                ]);
                setIsLoading(false);
                return;
            }

            // Processa os dados das monitorias
            const data = response.data.map(tutorial => {
                // Normalizar o dia para garantir consistência
                const diaOriginal = tutorial.dia;
                const diaNormalizado = normalizeDia(diaOriginal);

                debugItems.push(
                    `ID: ${tutorial.id}, Dia Original: "${diaOriginal}", Normalizado: "${diaNormalizado}"`
                );

                return {
                    ...tutorial,
                    dia: diaNormalizado, // Substituir pelo dia normalizado
                    diaOriginal: diaOriginal, // Manter o valor original para referência
                    imagemUrl: tutorial.imagemUrl || DEFAULT_IMAGE
                };
            });

            // Logs para debug
            console.log(`Total de monitorias encontradas: ${data.length}`);
            debugItems.push(`Total de monitorias encontradas: ${data.length}`);

            setTutorials(data);

            // Organizar tutoriais por dia
            const tutorialsByDayMap = {};
            DIAS_SEMANA.forEach(dia => {
                const filteredTutorials = data.filter(
                    tutorial => tutorial.dia === dia
                );
                tutorialsByDayMap[dia] = filteredTutorials;
                console.log(
                    `Monitorias para ${dia}: ${filteredTutorials.length}`
                );
                debugItems.push(
                    `Monitorias para ${dia}: ${filteredTutorials.length}`
                );
            });

            setTutorialsByDay(tutorialsByDayMap);
            setDebugInfo(debugItems);

            // Contar quantas monitorias ficaram sem classificação
            const tutoriaisNaoClassificados = data.filter(
                tutorial => !DIAS_SEMANA.includes(tutorial.dia)
            );
            if (tutoriaisNaoClassificados.length > 0) {
                console.warn(
                    `${tutoriaisNaoClassificados.length} monitorias não foram classificadas em nenhum dia:`
                );
                tutoriaisNaoClassificados.forEach(t =>
                    console.warn(`- ID: ${t.id}, Dia: ${t.diaOriginal}`)
                );
                debugItems.push(
                    `ATENÇÃO: ${tutoriaisNaoClassificados.length} monitorias não classificadas`
                );
                tutoriaisNaoClassificados.forEach(t =>
                    debugItems.push(`- ID: ${t.id}, Dia: ${t.diaOriginal}`)
                );
            }

            // Definir o primeiro dia com monitorias como selecionado por padrão
            const firstDayWithTutorials =
                DIAS_SEMANA.find(dia => tutorialsByDayMap[dia].length > 0) ||
                DIAS_SEMANA[0];
            setSelectedDay(firstDayWithTutorials);
            setIsLoading(false);
        } catch (err) {
            console.error('Erro ao buscar as monitorias:', err);
            setError(
                'Falha ao carregar as monitorias. Por favor, tente novamente.'
            );
            setDebugInfo([`ERRO: ${err.message}`]);
            setIsLoading(false);
        }
    };

    // Efeito para carregar as monitorias quando o componente é montado
    useEffect(() => {
        fetchTutorials();
    }, [refreshKey]); // Depende de refreshKey para atualizar quando necessário

    // Função para navegar para a página de detalhes da matéria
    const handleTutorialClick = materiaNome => {
        navigate('subject', { materia: materiaNome });
    };

    // Função para forçar um recarregamento dos dados
    const handleRefresh = () => {
        setRefreshKey(oldKey => oldKey + 1);
    };

    // Função para calcular o total de monitorias cadastradas
    const getTotalMonitorias = () => {
        return tutorials.length;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
            <div className="container mx-auto px-4 py-8 pt-16 animate-fadeIn">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-0 flex items-center">
                        <CalendarIcon className="mr-3 text-primary h-8 w-8" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            Calendário de Monitorias
                        </span>
                    </h1>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => setShowDebug(!showDebug)}
                            className="inline-flex items-center px-4 py-2 bg-gray-700/50 text-white hover:bg-gray-600 rounded-lg transition-all duration-300 mr-2"
                            title="Mostrar informações de debug"
                        >
                            <AlertCircle className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() =>
                                setShowDistribution(!showDistribution)
                            }
                            className="inline-flex items-center px-4 py-2 bg-gray-700/50 text-white hover:bg-gray-600 rounded-lg transition-all duration-300 mr-2"
                            title="Ver distribuição de monitorias"
                        >
                            <Info className="h-5 w-5" />
                        </button>
                        <button
                            onClick={handleRefresh}
                            className="inline-flex items-center px-4 py-2 bg-gray-700/50 text-white hover:bg-gray-600 rounded-lg transition-all duration-300 mr-2"
                            title="Atualizar dados"
                        >
                            <RefreshCw className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => navigate('home')}
                            className="inline-flex items-center px-4 py-2 bg-primary/20 text-primary hover:bg-primary hover:text-white rounded-lg transition-all duration-300"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Voltar
                        </button>
                    </div>
                </div>

                {showDebug && debugInfo.length > 0 && (
                    <div className="mb-6 p-4 bg-gray-800/50 rounded-xl border border-yellow-700/30 animate-fadeIn">
                        <h3 className="text-lg font-medium mb-3 text-yellow-500 flex items-center">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            Informações de Debug
                        </h3>
                        <div className="bg-black/30 p-3 rounded-lg">
                            <pre className="text-xs text-yellow-300 overflow-auto max-h-60">
                                {debugInfo.map((line, index) => (
                                    <div key={index}>{line}</div>
                                ))}
                            </pre>
                        </div>
                    </div>
                )}

                {showDistribution && (
                    <div className="mb-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 animate-fadeIn">
                        <h3 className="text-lg font-medium mb-3 text-primary flex items-center">
                            <Info className="h-5 w-5 mr-2" />
                            Distribuição de Monitorias
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                            {DIAS_SEMANA.map(dia => {
                                const count = tutorialsByDay[dia]?.length || 0;
                                const percentage =
                                    getTotalMonitorias() > 0
                                        ? Math.round(
                                              (count / getTotalMonitorias()) *
                                                  100
                                          )
                                        : 0;

                                return (
                                    <div
                                        key={dia}
                                        className={`p-3 rounded-lg ${
                                            selectedDay === dia
                                                ? 'bg-primary/20 border border-primary/40'
                                                : 'bg-gray-800/50 border border-gray-700/30'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium text-white">
                                                {dia}
                                            </span>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${
                                                    count > 0
                                                        ? 'bg-primary/30 text-primary'
                                                        : 'bg-gray-700 text-gray-400'
                                                }`}
                                            >
                                                {percentage}%
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <div
                                                className={`text-3xl font-bold ${
                                                    count > 0
                                                        ? 'text-primary'
                                                        : 'text-gray-600'
                                                }`}
                                            >
                                                {count}
                                            </div>
                                        </div>
                                        <div className="text-xs text-center text-gray-400 mt-1">
                                            {count === 1
                                                ? 'monitoria'
                                                : 'monitorias'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="text-center mt-3 text-sm text-gray-400">
                            Total de monitorias: {getTotalMonitorias()}
                        </div>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="text-center bg-red-500/10 border border-red-500/30 rounded-xl p-8 shadow-lg">
                        <p className="text-xl text-red-500 mb-4">{error}</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleRefresh}
                                className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                            >
                                Tentar Novamente
                            </button>
                            <button
                                onClick={() => navigate('home')}
                                className="inline-block px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Voltar para a Página Inicial
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        {/* Navegação dos dias da semana */}
                        <div className="flex overflow-x-auto space-x-2 mb-8 pb-2">
                            {DIAS_SEMANA.map(dia => {
                                const count = tutorialsByDay[dia]?.length || 0;
                                return (
                                    <button
                                        key={dia}
                                        onClick={() => setSelectedDay(dia)}
                                        className={`flex flex-col items-center px-6 py-3 rounded-lg min-w-[100px] border transition-all ${
                                            selectedDay === dia
                                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                                : 'bg-gray-800/50 text-white border-gray-700 hover:bg-gray-700/50'
                                        }`}
                                    >
                                        <span className="font-medium">
                                            {dia}
                                        </span>
                                        <span
                                            className={`text-2xl font-bold my-1 ${
                                                selectedDay === dia
                                                    ? 'text-white'
                                                    : count > 0
                                                    ? 'text-primary'
                                                    : 'text-gray-500'
                                            }`}
                                        >
                                            {count}
                                        </span>
                                        <span
                                            className={`text-xs py-1 px-2 rounded-full ${
                                                selectedDay === dia
                                                    ? 'bg-white/20'
                                                    : 'bg-primary/20 text-primary'
                                            }`}
                                        >
                                            {count === 1
                                                ? 'monitoria'
                                                : 'monitorias'}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Lista de monitorias do dia selecionado */}
                        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                            <h2 className="text-2xl font-semibold mb-6 text-white">
                                Monitorias de {selectedDay}
                            </h2>

                            {!tutorialsByDay[selectedDay] ||
                            tutorialsByDay[selectedDay]?.length === 0 ? (
                                <div className="text-center py-10 bg-gray-800/50 rounded-lg">
                                    <p className="text-gray-400 text-lg">
                                        Nenhuma monitoria disponível para{' '}
                                        {selectedDay}.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {tutorialsByDay[selectedDay]?.map(
                                        tutorial => (
                                            <div
                                                key={tutorial.id}
                                                onClick={() =>
                                                    handleTutorialClick(
                                                        tutorial.Materia.nome
                                                    )
                                                }
                                                className="bg-gradient-to-br from-[#18181f] to-[#222230] rounded-lg overflow-hidden shadow-lg border border-primary/10 transition-all hover:shadow-xl hover:shadow-primary/20 hover:border-primary/30 cursor-pointer"
                                            >
                                                <div
                                                    className="h-40 bg-cover bg-center border-b-[3px] border-primary"
                                                    style={{
                                                        backgroundImage: `url(${tutorial.imagemUrl})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition:
                                                            'center'
                                                    }}
                                                >
                                                    <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-40">
                                                        <span className="text-2xl font-bold text-white">
                                                            {
                                                                tutorial.Materia
                                                                    .nome
                                                            }
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="p-5">
                                                    <div className="space-y-3 text-gray-300">
                                                        <div className="flex items-center">
                                                            <User className="h-4 w-4 text-primary mr-2" />
                                                            <span className="text-sm">
                                                                <span className="text-primary font-medium">
                                                                    Monitor:
                                                                </span>{' '}
                                                                {tutorial
                                                                    .Monitor
                                                                    ?.nome ||
                                                                    'Não informado'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <GraduationCap className="h-4 w-4 text-primary mr-2" />
                                                            <span className="text-sm">
                                                                <span className="text-primary font-medium">
                                                                    Professor:
                                                                </span>{' '}
                                                                {tutorial
                                                                    .Professor
                                                                    ?.nome ||
                                                                    'Não informado'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Clock className="h-4 w-4 text-primary mr-2" />
                                                            <span className="text-sm">
                                                                <span className="text-primary font-medium">
                                                                    Horário:
                                                                </span>{' '}
                                                                {
                                                                    tutorial.horario
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <MapPin className="h-4 w-4 text-primary mr-2" />
                                                            <span className="text-sm">
                                                                <span className="text-primary font-medium">
                                                                    Local:
                                                                </span>{' '}
                                                                {tutorial.local}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 flex justify-end">
                                                        <button
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                handleTutorialClick(
                                                                    tutorial
                                                                        .Materia
                                                                        .nome
                                                                );
                                                            }}
                                                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-all duration-300 transform hover:-translate-y-1 text-sm"
                                                        >
                                                            Ver detalhes
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Calendar;
