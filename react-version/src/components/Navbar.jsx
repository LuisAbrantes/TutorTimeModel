import React from 'react';

const Navbar = ({ navigate, currentPage }) => {
    const navItems = [
        { name: 'Home', path: 'home' },
        { name: 'About', path: 'about' },
        { name: 'Manage', path: 'manage' }
    ];

    return (
        <nav className="bg-darkAlt text-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div
                    className="text-2xl font-bold cursor-pointer"
                    onClick={() => navigate('home')}
                >
                    TutorTime - IFSP
                </div>
                <ul className="flex space-x-6">
                    {navItems.map(item => (
                        <li
                            key={item.name}
                            className={`cursor-pointer hover:text-primary transition-colors ${
                                currentPage === item.path
                                    ? 'text-primary underline'
                                    : ''
                            }`}
                            onClick={() => navigate(item.path)}
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
