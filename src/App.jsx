import { useState } from 'react';
import Header from './Header';
import Home from './Home';
import About from './About';
import Manage from './Manage';

function App() {
    const [activePage, setActivePage] = useState('home');

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            <Header activePage={activePage} setActivePage={setActivePage} />
            <main className="flex-1">
                {activePage === 'home' && <Home />}
                {activePage === 'about' && <About />}
                {activePage === 'manage' && <Manage />}
            </main>
        </div>
    );
}

export default App;
