import React, { memo } from 'react';
import LazyImage from './LazyImage';

const TutorialCard = ({ tutorial, onClick, onInscricao }) => {
    const handleInscricaoClick = (e) => {
        e.stopPropagation();
        onInscricao(tutorial.id);
    };
    
    return (
        <div
            className="bg-gradient-to-br dark:from-[#18181f] dark:to-[#222230] from-white to-gray-100 rounded-lg overflow-hidden shadow-lg border dark:border-primary/10 border-primary/20 transition-all hover:shadow-xl hover:shadow-primary/20 hover:border-primary/30 animate-fadeIn cursor-pointer"
            onClick={() => onClick(tutorial)}
            tabIndex="0"
            role="button"
            aria-label={`Ver detalhes da monitoria de ${tutorial.Materia.nome}`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick(tutorial);
                }
            }}
        >
            <div className="relative h-40">
                <LazyImage 
                    src={tutorial.imagemUrl}
                    alt={`Imagem da monitoria de ${tutorial.Materia.nome}`}
                    className="h-40 border-b-[3px] border-primary"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                        {tutorial.Materia.nome}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <h2 className="text-xl font-semibold mb-4 pb-2.5 relative dark:text-white text-gray-900">
                    {tutorial.Materia.nome}
                    <span className="absolute bottom-0 left-0 w-10 h-[3px] bg-primary rounded"></span>
                </h2>

                <div className="space-y-3 dark:text-gray-300 text-gray-700 text-sm mb-4">
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
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                            {tutorial.inscricoes}
                        </span>
                    </p>
                </div>

                <p className="dark:text-gray-400 text-gray-600 mt-4 text-sm border-t dark:border-primary/20 border-primary/30 pt-4 line-clamp-3">
                    {tutorial.descricao}
                </p>

                <div className="mt-6 flex justify-center">
                    <button
                        onClick={handleInscricaoClick}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-all duration-300 transform hover:-translate-y-1"
                    >
                        Inscrever-se
                    </button>
                </div>
            </div>
        </div>
    );
};

// Memoize o componente para evitar re-renders desnecessários
export default memo(TutorialCard);