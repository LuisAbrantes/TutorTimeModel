import React, { createContext, useContext, useState, useEffect } from 'react';

// Criando o contexto
export const ThemeContext = createContext();

// Provedor do contexto
export const ThemeProvider = ({ children }) => {
    // Verificar se há uma preferência salva no localStorage, caso contrário usar dark
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? savedTheme === 'dark' : true; // Default para dark se não houver preferência
    });

    // Atualizar o localStorage e a classe no HTML quando o tema mudar
    useEffect(() => {
        const root = window.document.documentElement;
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
        
        if (darkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [darkMode]);

    // Função para alternar o tema
    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Hook para facilitar o uso do contexto
export const useTheme = () => useContext(ThemeContext);