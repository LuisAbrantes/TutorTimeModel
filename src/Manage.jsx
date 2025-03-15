import { useState } from 'react';

function Manage() {
    const [tutoringSessions, setTutoringSessions] = useState([
        {
            id: 1,
            subject: 'Cálculo Avançado',
            tutor: 'Profª Camila Santos',
            time: 'Segunda-feira, 14:00 - 16:00',
            location: 'Laboratório 7',
            status: 'active'
        },
        {
            id: 2,
            subject: 'Programação em Python',
            tutor: 'Prof. Rafael Oliveira',
            time: 'Terça-feira, 15:30 - 17:30',
            location: 'Sala de Computação A3',
            status: 'active'
        },
        {
            id: 3,
            subject: 'Física Quântica',
            tutor: 'Prof. Eduardo Martins',
            time: 'Quarta-feira, 13:00 - 15:00',
            location: 'Laboratório de Física',
            status: 'active'
        },
        {
            id: 4,
            subject: 'Eletrônica Digital',
            tutor: 'Profª Luiza Costa',
            time: 'Quinta-feira, 16:00 - 18:00',
            location: 'Laboratório de Eletrônica',
            status: 'active'
        }
    ]);

    const [formData, setFormData] = useState({
        subject: '',
        tutor: '',
        time: '',
        location: ''
    });

    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        setTutoringSessions(prev => [
            ...prev,
            {
                id: prev.length + 1,
                ...formData,
                status: 'active'
            }
        ]);
        setFormData({
            subject: '',
            tutor: '',
            time: '',
            location: ''
        });
    };

    const toggleStatus = id => {
        setTutoringSessions(prev =>
            prev.map(session =>
                session.id === id
                    ? {
                          ...session,
                          status:
                              session.status === 'active'
                                  ? 'inactive'
                                  : 'active'
                      }
                    : session
            )
        );
    };

    return (
        <section className="container mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Gerenciar Monitorias
            </h2>

            <div className="bg-white rounded-xl shadow-md p-6 mb-10">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Adicionar Nova Monitoria
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label
                                className="block text-gray-700 mb-2"
                                htmlFor="subject"
                            >
                                Disciplina
                            </label>
                            <input
                                id="subject"
                                name="subject"
                                type="text"
                                value={formData.subject}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label
                                className="block text-gray-700 mb-2"
                                htmlFor="tutor"
                            >
                                Tutor
                            </label>
                            <input
                                id="tutor"
                                name="tutor"
                                type="text"
                                value={formData.tutor}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label
                                className="block text-gray-700 mb-2"
                                htmlFor="time"
                            >
                                Horário
                            </label>
                            <input
                                id="time"
                                name="time"
                                type="text"
                                value={formData.time}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label
                                className="block text-gray-700 mb-2"
                                htmlFor="location"
                            >
                                Local
                            </label>
                            <input
                                id="location"
                                name="location"
                                type="text"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        Adicionar Monitoria
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Disciplina
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tutor
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Horário
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Local
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tutoringSessions.map(session => (
                            <tr key={session.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {session.subject}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {session.tutor}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {session.time}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {session.location}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            session.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {session.status === 'active'
                                            ? 'Ativa'
                                            : 'Inativa'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => toggleStatus(session.id)}
                                        className={`text-indigo-600 hover:text-indigo-900 mr-4 ${
                                            session.status === 'active'
                                                ? 'hover:text-red-600'
                                                : 'hover:text-green-600'
                                        }`}
                                    >
                                        {session.status === 'active'
                                            ? 'Desativar'
                                            : 'Ativar'}
                                    </button>
                                    <button className="text-gray-600 hover:text-gray-900">
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default Manage;
