import React from 'react';

const About = ({ navigate }) => {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-8">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            Sobre o TutorTime
                        </span>
                    </h1>
                    <div className="h-1 w-24 bg-primary mx-auto rounded-full mb-8"></div>

                    {/* Visão geral com design de cartões */}
                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        <div className="bg-gradient-to-br from-darkAlt to-[#2a2a2a] rounded-xl p-6 shadow-xl border border-primary/10 hover:border-primary/30 transition-all transform hover:-translate-y-1 hover:shadow-primary/20">
                            <div className="flex items-center mb-4">
                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-4">
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
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-semibold text-primary">
                                    Nossa Missão
                                </h2>
                            </div>

                            <p className="text-gray-300">
                                O TutorTime foi criado com o objetivo de
                                facilitar o acesso dos estudantes às monitorias
                                disponíveis no Instituto Federal de São Paulo
                                (IFSP). Nossa plataforma conecta estudantes com
                                monitores qualificados para auxiliar no processo
                                de aprendizagem.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-darkAlt to-[#2a2a2a] rounded-xl p-6 shadow-xl border border-primary/10 hover:border-primary/30 transition-all transform hover:-translate-y-1 hover:shadow-primary/20">
                            <div className="flex items-center mb-4">
                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-4">
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
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-semibold text-primary">
                                    Como Funciona
                                </h2>
                            </div>

                            <p className="text-gray-300 mb-4">
                                Os professores e coordenadores podem cadastrar
                                monitorias para diferentes disciplinas através
                                do painel administrativo. Os alunos podem
                                navegar pelas disciplinas disponíveis e se
                                inscrever nas monitorias.
                            </p>

                            <p className="text-gray-300">
                                Cada monitoria conta com informações detalhadas
                                sobre horários, localização, monitor responsável
                                e professor orientador, facilitando a escolha e
                                o acesso dos estudantes.
                            </p>
                        </div>
                    </div>

                    {/* Seção de benefícios com timeline visual */}
                    <div className="bg-gradient-to-br from-darkAlt to-[#2a2a2a] rounded-xl p-8 shadow-xl border border-primary/10 mb-12">
                        <div className="flex items-center mb-6">
                            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-7 w-7"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-semibold text-primary">
                                Benefícios
                            </h2>
                        </div>

                        <div className="space-y-4 pl-6 border-l-2 border-primary/30">
                            {[
                                'Acesso fácil a informações sobre monitorias disponíveis',
                                'Processo simplificado de inscrição',
                                'Visibilidade para o trabalho dos monitores',
                                'Maior alcance das monitorias entre os estudantes',
                                'Gestão eficiente para coordenadores e professores'
                            ].map((item, index) => (
                                <div key={index} className="relative pl-8 py-2">
                                    <div className="absolute left-0 -translate-x-[17px] top-1/2 transform -translate-y-1/2 h-4 w-4 bg-primary rounded-full"></div>
                                    <div className="bg-dark/30 backdrop-blur-sm rounded-lg p-3 border-l-4 border-primary hover:shadow-lg transition-shadow">
                                        <p className="text-gray-200">{item}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Seção de contato com design moderno */}
                    <div className="bg-gradient-to-br from-darkAlt to-[#2a2a2a] rounded-xl p-8 shadow-xl border border-primary/10">
                        <div className="flex flex-col md:flex-row md:items-center">
                            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                                <div className="flex items-center mb-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mr-4">
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
                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-semibold text-primary">
                                        Contato
                                    </h2>
                                </div>
                                <p className="text-gray-300 mb-4">
                                    Para mais informações ou sugestões, entre em
                                    contato com a coordenação do programa de
                                    monitorias do IFSP.
                                </p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <div className="bg-dark rounded-md px-3 py-1 text-primary border border-primary/20">
                                        <span className="opacity-70 mr-1">
                                            Email:
                                        </span>{' '}
                                        monitorias@ifsp.edu.br
                                    </div>
                                    <div className="bg-dark rounded-md px-3 py-1 text-primary border border-primary/20">
                                        <span className="opacity-70 mr-1">
                                            Tel:
                                        </span>{' '}
                                        (11) 9999-8888
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-1/2 md:border-l md:border-primary/20 md:pl-8">
                                <div className="bg-dark/50 rounded-xl p-4 backdrop-blur-sm">
                                    <h3 className="text-lg font-medium mb-3 text-primary">
                                        Horário de Disponibilidade
                                    </h3>
                                    <ul className="space-y-2">
                                        <li className="flex justify-between">
                                            <span className="text-gray-400">
                                                Segunda à Sexta:
                                            </span>
                                            <span>08:00 - 18:00</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-gray-400">
                                                Sábado:
                                            </span>
                                            <span>08:00 - 12:00</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <button
                                onClick={() => navigate('home')}
                                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-1"
                            >
                                Voltar para a Página Inicial
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
