function About() {
    const developers = [
        {
            name: 'Luís Abrantes',
            role: 'Full-stack Developer',
            image: 'https://via.placeholder.com/150',
            description: 'Desenvolvedor principal e idealizador do TutorTime.'
        },
        {
            name: 'Caua Almeida',
            role: 'Front-end Developer',
            image: 'https://via.placeholder.com/150',
            description: 'Especialista em UI/UX e experiência do usuário.'
        },
        {
            name: 'Isaque Estolano',
            role: 'Back-end Developer',
            image: 'https://via.placeholder.com/150',
            description: 'Responsável pela arquitetura e otimização do sistema.'
        }
    ];

    const directors = [
        {
            name: 'Diretor 1',
            title: 'Diretor de Tecnologia',
            image: 'https://via.placeholder.com/150'
        },
        {
            name: 'Diretor 2',
            title: 'Diretor de Ensino',
            image: 'https://via.placeholder.com/150'
        },
        {
            name: 'Diretor 3',
            title: 'Diretor de Inovação',
            image: 'https://via.placeholder.com/150'
        }
    ];

    return (
        <section className="container mx-auto px-4 py-12 text-white">
            <h2 className="text-3xl font-bold text-center mb-12">
                Nossa Equipe
            </h2>

            <div className="mb-16">
                <h3 className="text-2xl font-semibold text-center mb-8">
                    Desenvolvedores
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {developers.map((dev, index) => (
                        <div
                            key={index}
                            className="bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition-transform hover:scale-105"
                        >
                            <img
                                src={dev.image}
                                alt={dev.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <h4 className="text-xl font-semibold">
                                    {dev.name}
                                </h4>
                                <p className="text-purple-400 mb-4">
                                    {dev.role}
                                </p>
                                <p className="text-gray-300">
                                    {dev.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-2xl font-semibold text-center mb-8">
                    Diretores
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {directors.map((director, index) => (
                        <div
                            key={index}
                            className="bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col items-center p-6 transform transition-transform hover:scale-105"
                        >
                            <img
                                src={director.image}
                                alt={director.name}
                                className="w-32 h-32 rounded-full object-cover mb-4"
                            />
                            <h4 className="text-xl font-semibold">
                                {director.name}
                            </h4>
                            <p className="text-purple-400">{director.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default About;
