import React from 'react';

const Header = ({ navigate, currentPage }) => {
    // Função para determinar a classe ativa
    const getLinkClass = page => {
        const baseClass =
            'no-underline text-white px-4 py-2.5 font-medium transition-colors hover:bg-secondary hover:text-white hover:rounded hover:scale-105 transform';

        if (
            (page === 'home' &&
                (currentPage === 'home' || currentPage === '')) ||
            page === currentPage
        ) {
            return `${baseClass} text-primary font-semibold relative`;
        }
        return baseClass;
    };

    return (
        <header className="flex items-center justify-between flex-wrap w-full max-w-7xl mx-auto px-5 py-3 box-border relative z-50">
            <div className="flex items-center">
                <div className="mr-2.5">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                        <img
                            src="/assets/logos/versao_icone.png"
                            alt="TutorTime Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                <span className="text-white">TutorTime - IFSP</span>
            </div>

            <ul className="flex list-none p-0 m-0 justify-center flex-grow flex-wrap">
                <li className="mx-2.5">
                    <a
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            navigate('home');
                        }}
                        className={getLinkClass('home')}
                    >
                        Home
                        {(currentPage === 'home' || currentPage === '') && (
                            <span className="absolute bottom-1.5 left-4 w-[calc(100%-30px)] h-0.5 bg-primary rounded-sm"></span>
                        )}
                    </a>
                </li>
                <li className="mx-2.5">
                    <a
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            navigate('about');
                        }}
                        className={getLinkClass('about')}
                    >
                        About
                        {currentPage === 'about' && (
                            <span className="absolute bottom-1.5 left-4 w-[calc(100%-30px)] h-0.5 bg-primary rounded-sm"></span>
                        )}
                    </a>
                </li>
                <li className="mx-2.5">
                    <a
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            navigate('manage');
                        }}
                        className={getLinkClass('manage')}
                    >
                        Manage
                        {currentPage === 'manage' && (
                            <span className="absolute bottom-1.5 left-4 w-[calc(100%-30px)] h-0.5 bg-primary rounded-sm"></span>
                        )}
                    </a>
                </li>
                <li className="mx-2.5">
                    <a
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            navigate('tutor');
                        }}
                        className={getLinkClass('tutor')}
                    >
                        TutorTime IA
                        {currentPage === 'tutor' && (
                            <span className="absolute bottom-1.5 left-4 w-[calc(100%-30px)] h-0.5 bg-primary rounded-sm"></span>
                        )}
                    </a>
                </li>
            </ul>
        </header>
    );
};

export default Header;
