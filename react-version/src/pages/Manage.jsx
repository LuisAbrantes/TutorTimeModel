import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const API_BASE_URL = 'http://localhost:3000/api';
const DEFAULT_IMAGE = '/logo.png';

const Manage = ({ senha, navigate }) => {
    const [subjects, setSubjects] = useState([]);
    const [tutorials, setTutorials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        monitorREQ: '',
        professorREQ: '',
        horarioREQ: '',
        diaREQ: '',
        localREQ: '',
        descricaoREQ: '',
        materiaREQ: ''
    });

    const [newSubject, setNewSubject] = useState({
        materiaREQ: '',
        imagemREQ: ''
    });

    // Check if password is correct, otherwise redirect
    useEffect(() => {
        if (senha !== 'True') {
            navigate('manage');
        }
    }, [senha, navigate]);

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch subjects
                const subjectsResponse = await axios.get(
                    `${API_BASE_URL}/subjects`
                );

                // Ensure all subjects have valid image URLs
                const processedSubjects = subjectsResponse.data.map(
                    subject => ({
                        ...subject,
                        imagemUrl: subject.imagemUrl || DEFAULT_IMAGE
                    })
                );

                setSubjects(processedSubjects);

                // Fetch tutorials
                const tutorialsResponse = await axios.get(
                    `${API_BASE_URL}/tutorials`
                );

                // Process tutorials to ensure all have valid image URLs
                const processedTutorials = tutorialsResponse.data.map(
                    tutorial => ({
                        ...tutorial,
                        imagemUrl: tutorial.imagemUrl || DEFAULT_IMAGE
                    })
                );

                setTutorials(processedTutorials);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data. Please try again.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleNewSubjectChange = e => {
        const { name, value } = e.target;
        setNewSubject({
            ...newSubject,
            [name]: value
        });
    };

    const handleAddTutorial = async e => {
        e.preventDefault();

        try {
            setLoading(true);
            // Send data to the API
            const response = await axios.post(
                `${API_BASE_URL}/tutorials`,
                formData
            );

            // Update local state with the new tutorial
            setTutorials([...tutorials, response.data]);

            // Reset form
            setFormData({
                monitorREQ: '',
                professorREQ: '',
                horarioREQ: '',
                diaREQ: '',
                localREQ: '',
                descricaoREQ: '',
                materiaREQ: ''
            });

            setLoading(false);
        } catch (err) {
            console.error('Error adding tutorial:', err);
            setError('Failed to add tutorial. Please try again.');
            setLoading(false);
        }
    };

    const handleAddSubject = async e => {
        e.preventDefault();

        try {
            setLoading(true);
            // Send data to the API
            const response = await axios.post(
                `${API_BASE_URL}/subjects`,
                newSubject
            );

            // Update local state with the new subject
            setSubjects([...subjects, response.data]);

            // Reset form
            setNewSubject({
                materiaREQ: '',
                imagemREQ: ''
            });

            setLoading(false);
        } catch (err) {
            console.error('Error adding subject:', err);
            setError('Failed to add subject. Please try again.');
            setLoading(false);
        }
    };

    const handleDeleteTutorial = async id => {
        try {
            setLoading(true);
            // Send delete request to the API
            await axios.delete(`${API_BASE_URL}/tutorials/${id}`);

            // Update local state by removing the deleted tutorial
            setTutorials(tutorials.filter(tutorial => tutorial.id !== id));

            setLoading(false);
        } catch (err) {
            console.error('Error deleting tutorial:', err);
            setError('Failed to delete tutorial. Please try again.');
            setLoading(false);
        }
    };

    const handleDeleteSubject = async id => {
        try {
            setLoading(true);
            // Send delete request to the API
            await axios.delete(`${API_BASE_URL}/subjects/${id}`);

            // Update local state by removing the deleted subject and its tutorials
            setTutorials(
                tutorials.filter(tutorial => tutorial.materiaId !== id)
            );
            setSubjects(subjects.filter(subject => subject.id !== id));

            setLoading(false);
        } catch (err) {
            console.error('Error deleting subject:', err);
            setError('Failed to delete subject. Please try again.');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900">
                <Header navigate={navigate} currentPage="manage" />
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900">
                <Header navigate={navigate} currentPage="manage" />
                <div className="flex justify-center items-center h-screen">
                    <div className="bg-red-500/20 text-red-500 p-4 rounded-lg">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <Header navigate={navigate} currentPage="manage" />

            <div className="container mx-auto px-4 py-8 pt-20">
                <h1 className="text-3xl font-bold text-center mb-8 text-white">
                    Painel de Administração
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Add Tutorial */}
                    <div className="bg-gradient-to-br from-[#1c1c24] to-[#2a2a3a] rounded-lg p-6 shadow-lg border border-primary/10">
                        <h2 className="text-2xl font-semibold mb-6 text-center text-white">
                            Adicionar Monitoria
                        </h2>

                        <form
                            onSubmit={handleAddTutorial}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-gray-300 mb-2">
                                    Matéria:
                                </label>
                                <select
                                    name="materiaREQ"
                                    value={formData.materiaREQ}
                                    onChange={handleInputChange}
                                    className="w-full h-[45px] bg-white/5 border border-white/10 rounded-xl px-4 text-white"
                                    required
                                >
                                    <option value="">
                                        Selecione uma matéria
                                    </option>
                                    {subjects.map(subject => (
                                        <option
                                            key={subject.id}
                                            value={subject.id}
                                        >
                                            {subject.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2">
                                    Monitor:
                                </label>
                                <input
                                    type="text"
                                    name="monitorREQ"
                                    value={formData.monitorREQ}
                                    onChange={handleInputChange}
                                    className="w-full h-[45px] bg-white/5 border border-white/10 rounded-xl px-4 text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2">
                                    Professor:
                                </label>
                                <input
                                    type="text"
                                    name="professorREQ"
                                    value={formData.professorREQ}
                                    onChange={handleInputChange}
                                    className="w-full h-[45px] bg-white/5 border border-white/10 rounded-xl px-4 text-white"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        Horário:
                                    </label>
                                    <input
                                        type="text"
                                        name="horarioREQ"
                                        value={formData.horarioREQ}
                                        onChange={handleInputChange}
                                        className="w-full h-[45px] bg-white/5 border border-white/10 rounded-xl px-4 text-white"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        Dia:
                                    </label>
                                    <input
                                        type="text"
                                        name="diaREQ"
                                        value={formData.diaREQ}
                                        onChange={handleInputChange}
                                        className="w-full h-[45px] bg-white/5 border border-white/10 rounded-xl px-4 text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2">
                                    Local:
                                </label>
                                <input
                                    type="text"
                                    name="localREQ"
                                    value={formData.localREQ}
                                    onChange={handleInputChange}
                                    className="w-full h-[45px] bg-white/5 border border-white/10 rounded-xl px-4 text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2">
                                    Descrição:
                                </label>
                                <textarea
                                    name="descricaoREQ"
                                    value={formData.descricaoREQ}
                                    onChange={handleInputChange}
                                    className="w-full min-h-[100px] bg-white/5 border border-white/10 rounded-xl p-4 text-white resize-y"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full h-[50px] bg-gradient-to-r from-primary to-secondary border-none rounded-xl text-white font-medium text-base cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30"
                            >
                                Adicionar Monitoria
                            </button>
                        </form>
                    </div>

                    {/* Right Column - Add Subject */}
                    <div className="space-y-8">
                        <div className="bg-gradient-to-br from-[#1c1c24] to-[#2a2a3a] rounded-lg p-6 shadow-lg border border-primary/10">
                            <h2 className="text-2xl font-semibold mb-6 text-center text-white">
                                Adicionar Matéria
                            </h2>

                            <form
                                onSubmit={handleAddSubject}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        Nome da Matéria:
                                    </label>
                                    <input
                                        type="text"
                                        name="materiaREQ"
                                        value={newSubject.materiaREQ}
                                        onChange={handleNewSubjectChange}
                                        className="w-full h-[45px] bg-white/5 border border-white/10 rounded-xl px-4 text-white"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        URL da Imagem:
                                    </label>
                                    <input
                                        type="text"
                                        name="imagemREQ"
                                        value={newSubject.imagemREQ}
                                        onChange={handleNewSubjectChange}
                                        className="w-full h-[45px] bg-white/5 border border-white/10 rounded-xl px-4 text-white"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full h-[50px] bg-gradient-to-r from-primary to-secondary border-none rounded-xl text-white font-medium text-base cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30"
                                >
                                    Adicionar Matéria
                                </button>
                            </form>
                        </div>

                        {/* Subject List */}
                        <div className="bg-gradient-to-br from-[#1c1c24] to-[#2a2a3a] rounded-lg p-6 shadow-lg border border-primary/10">
                            <h2 className="text-2xl font-semibold mb-6 text-center text-white">
                                Matérias Existentes
                            </h2>

                            <div className="space-y-4 max-h-[300px] overflow-y-auto">
                                {subjects.map(subject => (
                                    <div
                                        key={subject.id}
                                        className="flex items-center justify-between p-3 bg-black/20 rounded-lg"
                                    >
                                        <div className="flex items-center">
                                            <div
                                                className="w-10 h-10 rounded-md mr-3 bg-cover bg-center"
                                                style={{
                                                    backgroundImage: `url(${
                                                        subject.imagemUrl ||
                                                        DEFAULT_IMAGE
                                                    })`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                            ></div>
                                            <span className="text-white">
                                                {subject.nome}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleDeleteSubject(subject.id)
                                            }
                                            className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white transition-colors"
                                        >
                                            Deletar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tutorials List */}
                <div className="mt-12">
                    <h2 className="text-2xl font-semibold mb-6 text-center text-white">
                        Monitorias Cadastradas
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tutorials.map(tutorial => (
                            <div
                                key={tutorial.id}
                                className="bg-gradient-to-br from-[#18181f] to-[#222230] rounded-lg overflow-hidden shadow-lg border border-primary/10 transition-all hover:shadow-xl hover:shadow-primary/20 hover:border-primary/30"
                            >
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-semibold text-white">
                                            {tutorial.Materia.nome}
                                        </h3>
                                        <span className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs font-medium">
                                            {tutorial.inscricoes} inscritos
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-gray-300 text-sm mb-4">
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
                                    </div>

                                    <p className="text-gray-400 text-sm mt-3 border-t border-primary/10 pt-3 line-clamp-3">
                                        {tutorial.descricao}
                                    </p>

                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={() =>
                                                handleDeleteTutorial(
                                                    tutorial.id
                                                )
                                            }
                                            className="px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white transition-colors"
                                        >
                                            Deletar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Manage;
