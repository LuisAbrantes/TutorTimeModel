import React from 'react';

const About = ({ navigate }) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8">
                Sobre o TutorTime
            </h1>

            <div className="max-w-3xl mx-auto bg-gradient-to-br from-darkAlt to-[#2a2a2a] rounded-xl p-8 shadow-xl border border-primary/10">
                <h2 className="text-2xl font-semibold mb-4 text-primary">
                    Nossa Missão
                </h2>

                <p className="text-gray-300 mb-6">
                    O TutorTime foi criado com o objetivo de facilitar o acesso
                    dos estudantes às monitorias disponíveis no Instituto
                    Federal de São Paulo (IFSP). Nossa plataforma conecta
                    estudantes com monitores qualificados para auxiliar no
                    processo de aprendizagem.
                </p>

                <h2 className="text-2xl font-semibold mb-4 text-primary">
                    Como Funciona
                </h2>

                <p className="text-gray-300 mb-4">
                    Os professores e coordenadores podem cadastrar monitorias
                    para diferentes disciplinas através do painel
                    administrativo. Os alunos podem navegar pelas disciplinas
                    disponíveis e se inscrever nas monitorias que atendam às
                    suas necessidades.
                </p>

                <p className="text-gray-300 mb-6">
                    Cada monitoria conta com informações detalhadas sobre
                    horários, localização, monitor responsável e professor
                    orientador, facilitando a escolha e o acesso dos estudantes.
                </p>

                <h2 className="text-2xl font-semibold mb-4 text-primary">
                    Benefícios
                </h2>

                <ul className="list-disc pl-5 text-gray-300 mb-6 space-y-2">
                    <li>
                        Acesso fácil a informações sobre monitorias disponíveis
                    </li>
                    <li>Processo simplificado de inscrição</li>
                    <li>Visibilidade para o trabalho dos monitores</li>
                    <li>Maior alcance das monitorias entre os estudantes</li>
                    <li>Gestão eficiente para coordenadores e professores</li>
                </ul>

                <h2 className="text-2xl font-semibold mb-4 text-primary">
                    Contato
                </h2>

                <p className="text-gray-300">
                    Para mais informações ou sugestões, entre em contato com a
                    coordenação do programa de monitorias do IFSP.
                </p>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('home')}
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                    >
                        Voltar para a Página Inicial
                    </button>
                </div>
            </div>
        </div>
    );
};

export default About;
