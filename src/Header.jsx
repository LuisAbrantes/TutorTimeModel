function Header({ activePage, setActivePage }) {
    const navItems = [
        { id: 'home', label: 'Home' },
        { id: 'about', label: 'About' },
        { id: 'manage', label: 'Manage' }
    ];

    return (
        <header className="bg-gradient-to-r from-purple-700 to-purple-900 text-white shadow-lg">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center">
                    <svg
                        className="h-8 w-8 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                    </svg>
                    <h1 className="text-xl font-bold tracking-tight">
                        TutorTime IFSP
                    </h1>
                </div>

                <nav>
                    <ul className="flex space-x-6">
                        {navItems.map(item => (
                            <li key={item.id}>
                                <button
                                    onClick={() => setActivePage(item.id)}
                                    className={`px-2 py-1 rounded transition-colors ${
                                        activePage === item.id
                                            ? 'bg-white text-purple-900 font-medium'
                                            : 'text-white hover:bg-purple-600'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
