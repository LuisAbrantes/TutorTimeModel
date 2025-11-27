import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Search, AlertCircle, X, List, Grid, Trash, Check, Pencil } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000/api';
const DEFAULT_IMAGE = '/logo.png';

const Manage = ({ senha, navigate }) => {
    const [subjects, setSubjects] = useState([]);
    const [tutorials, setTutorials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('card');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [filterBy, setFilterBy] = useState('all');
    const [editingTutorial, setEditingTutorial] = useState(null);

    const [formData, setFormData] = useState({
        monitorREQ: '',
        professorREQ: '',
        horarioREQ: '',
        diaREQ: '',
        localREQ: '',
        descricaoREQ: '',
        materiaREQ: ''
    });

    const [editFormData, setEditFormData] = useState({
        monitorREQ: '',
        professorREQ: '',
        horarioREQ: '',
        diaREQ: '',
        localREQ: ''
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

    // Função para iniciar o processo de exclusão
    const confirmDelete = (type, id) => {
        setDeleteConfirm({ type, id });
    };

    // Função para cancelar a exclusão
    const cancelDelete = () => {
        setDeleteConfirm(null);
    };

    const handleDeleteTutorial = async id => {
        try {
            setLoading(true);
            // Send delete request to the API
            await axios.delete(`${API_BASE_URL}/tutorials/${id}`);

            // Update local state by removing the deleted tutorial
            setTutorials(tutorials.filter(tutorial => tutorial.id !== id));

            // Limpar o estado de confirmação
            setDeleteConfirm(null);

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

            // Limpar o estado de confirmação
            setDeleteConfirm(null);

            setLoading(false);
        } catch (err) {
            console.error('Error deleting subject:', err);
            setError('Failed to delete subject. Please try again.');
            setLoading(false);
        }
    };

    // Função para iniciar edição de um tutorial
    const startEditTutorial = (tutorial) => {
        setEditFormData({
            monitorREQ: tutorial.Monitor.nome,
            professorREQ: tutorial.Professor.nome,
            horarioREQ: tutorial.horario,
            diaREQ: tutorial.dia,
            localREQ: tutorial.local
        });
        setEditingTutorial(tutorial);
    };

    // Função para cancelar edição
    const cancelEdit = () => {
        setEditingTutorial(null);
        setEditFormData({
            monitorREQ: '',
            professorREQ: '',
            horarioREQ: '',
            diaREQ: '',
            localREQ: ''
        });
    };

    // Handler para mudanças no formulário de edição
    const handleEditInputChange = e => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    };

    // Função para salvar edição
    const handleEditTutorial = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            
            await axios.put(
                `${API_BASE_URL}/tutorials/${editingTutorial.id}`,
                editFormData
            );

            // Recarregar todos os tutoriais para garantir dados completos com associações
            const tutorialsResponse = await axios.get(`${API_BASE_URL}/tutorials`);
            const processedTutorials = tutorialsResponse.data.map(tutorial => ({
                ...tutorial,
                imagemUrl: tutorial.imagemUrl || DEFAULT_IMAGE
            }));
            setTutorials(processedTutorials);

            // Fechar modal de edição
            cancelEdit();
            setLoading(false);
        } catch (err) {
            console.error('Error updating tutorial:', err);
            setError('Failed to update tutorial. Please try again.');
            setLoading(false);
        }
    };

    // Filtrar e ordenar tutoriais com base nos critérios de pesquisa
    const filteredTutorials = useMemo(() => {
        if (!searchTerm && filterBy === 'all') return tutorials;

        return tutorials.filter(tutorial => {
            // Filtro por texto de pesquisa
            const searchMatch =
                !searchTerm ||
                tutorial.Materia.nome
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                tutorial.Monitor.nome
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                tutorial.Professor.nome
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                tutorial.local
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                tutorial.dia.toLowerCase().includes(searchTerm.toLowerCase());

            // Filtro por matéria
            const filterMatch =
                filterBy === 'all' ||
                tutorial.materiaId.toString() === filterBy;

            return searchMatch && filterMatch;
        });
    }, [tutorials, searchTerm, filterBy]);

    // Filtrar matérias com base no texto de pesquisa
    const filteredSubjects = useMemo(() => {
        if (!searchTerm) return subjects;

        return subjects.filter(subject =>
            subject.nome.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [subjects, searchTerm]);

    if (loading) {
        return (
            <div className="min-h-screen dark:bg-gray-900 bg-light">
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen dark:bg-gray-900 bg-light">
                <div className="flex justify-center items-center h-screen">
                    <div className="bg-red-500/20 text-red-500 p-4 rounded-lg">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen dark:bg-gray-900 bg-light transition-colors duration-300">
            {/* Modal de Edição */}
            {editingTutorial && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br dark:from-[#1c1c24] dark:to-[#2a2a3a] from-white to-gray-100 rounded-xl p-6 w-full max-w-md shadow-2xl border dark:border-primary/20 border-primary/30">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold dark:text-white text-gray-900">
                                Editar Monitoria
                            </h2>
                            <button
                                onClick={cancelEdit}
                                className="dark:text-gray-400 text-gray-600 hover:text-primary transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="mb-4 p-3 dark:bg-primary/10 bg-primary/5 rounded-lg">
                            <p className="dark:text-gray-300 text-gray-700 text-sm">
                                <span className="text-primary font-medium">Matéria:</span>{' '}
                                {editingTutorial.Materia.nome}
                            </p>
                        </div>

                        <form onSubmit={handleEditTutorial} className="space-y-4">
                            <div>
                                <label className="block dark:text-gray-300 text-gray-700 mb-2">
                                    Monitor:
                                </label>
                                <input
                                    type="text"
                                    name="monitorREQ"
                                    value={editFormData.monitorREQ}
                                    onChange={handleEditInputChange}
                                    className="w-full h-[45px] dark:bg-white/5 bg-white border dark:border-white/10 border-gray-300 rounded-xl px-4 dark:text-white text-gray-900"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block dark:text-gray-300 text-gray-700 mb-2">
                                    Professor:
                                </label>
                                <input
                                    type="text"
                                    name="professorREQ"
                                    value={editFormData.professorREQ}
                                    onChange={handleEditInputChange}
                                    className="w-full h-[45px] dark:bg-white/5 bg-white border dark:border-white/10 border-gray-300 rounded-xl px-4 dark:text-white text-gray-900"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block dark:text-gray-300 text-gray-700 mb-2">
                                        Horário:
                                    </label>
                                    <input
                                        type="text"
                                        name="horarioREQ"
                                        value={editFormData.horarioREQ}
                                        onChange={handleEditInputChange}
                                        className="w-full h-[45px] dark:bg-white/5 bg-white border dark:border-white/10 border-gray-300 rounded-xl px-4 dark:text-white text-gray-900"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block dark:text-gray-300 text-gray-700 mb-2">
                                        Dia:
                                    </label>
                                    <input
                                        type="text"
                                        name="diaREQ"
                                        value={editFormData.diaREQ}
                                        onChange={handleEditInputChange}
                                        className="w-full h-[45px] dark:bg-white/5 bg-white border dark:border-white/10 border-gray-300 rounded-xl px-4 dark:text-white text-gray-900"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block dark:text-gray-300 text-gray-700 mb-2">
                                    Local:
                                </label>
                                <input
                                    type="text"
                                    name="localREQ"
                                    value={editFormData.localREQ}
                                    onChange={handleEditInputChange}
                                    className="w-full h-[45px] dark:bg-white/5 bg-white border dark:border-white/10 border-gray-300 rounded-xl px-4 dark:text-white text-gray-900"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="flex-1 h-[50px] bg-gray-500/20 dark:text-gray-300 text-gray-700 border-none rounded-xl font-medium text-base cursor-pointer transition-all hover:bg-gray-500/30"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 h-[50px] bg-gradient-to-r from-primary to-secondary border-none rounded-xl text-white font-medium text-base cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-8 pt-20">
                <h1 className="text-3xl font-bold text-center mb-8 dark:text-white text-gray-900">
                    Painel de Administração
                </h1>

                {/* Barra de pesquisa e filtros */}
                <div className="mb-8 bg-gradient-to-br dark:from-[#1c1c24] dark:to-[#2a2a3a] from-light to-lightAlt rounded-xl p-4 shadow-lg border dark:border-primary/10 border-primary/20 transition-colors duration-300">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Pesquisar monitorias ou matérias..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full h-12 dark:bg-white/5 bg-white/80 border dark:border-white/10 border-gray-300 rounded-xl px-4 pl-10 dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <Search className="h-5 w-5 absolute top-3.5 left-3 dark:text-gray-400 text-gray-500" />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-3.5 dark:text-gray-400 text-gray-500 hover:text-primary transition-colors"
                                    aria-label="Limpar pesquisa"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <select
                                value={filterBy}
                                onChange={e => setFilterBy(e.target.value)}
                                className="dark:bg-white/5 bg-white/80 border dark:border-white/10 border-gray-300 rounded-xl px-4 py-3 dark:text-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary min-w-[180px]"
                            >
                                <option value="all">Todas as matérias</option>
                                {subjects.map(subject => (
                                    <option
                                        key={subject.id}
                                        value={subject.id.toString()}
                                    >
                                        {subject.nome}
                                    </option>
                                ))}
                            </select>

                            <div className="flex rounded-lg overflow-hidden border dark:border-gray-700 border-gray-300">
                                <button
                                    onClick={() => setActiveTab('card')}
                                    className={`px-3 py-2 ${
                                        activeTab === 'card'
                                            ? 'bg-primary text-white'
                                            : 'dark:bg-gray-900/80 dark:text-gray-400 bg-white/80 text-gray-600'
                                    } transition-colors duration-200`}
                                    aria-label="Visualização em cartões"
                                    title="Visualização em cartões"
                                >
                                    <Grid className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={() => setActiveTab('table')}
                                    className={`px-3 py-2 ${
                                        activeTab === 'table'
                                            ? 'bg-primary text-white'
                                            : 'dark:bg-gray-900/80 dark:text-gray-400 bg-white/80 text-gray-600'
                                    } transition-colors duration-200`}
                                    aria-label="Visualização em tabela"
                                    title="Visualização em tabela"
                                >
                                    <List className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Add Tutorial */}
                    <div className="bg-gradient-to-br dark:from-[#1c1c24] dark:to-[#2a2a3a] from-white to-gray-100 rounded-lg p-6 shadow-lg border dark:border-primary/10 border-primary/20 transition-colors duration-300">
                        <h2 className="text-2xl font-semibold mb-6 text-center dark:text-white text-gray-900">
                            Adicionar Monitoria
                        </h2>

                        <form
                            onSubmit={handleAddTutorial}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block dark:text-gray-300 text-gray-700 mb-2">
                                    Matéria:
                                </label>
                                <select
                                    name="materiaREQ"
                                    value={formData.materiaREQ}
                                    onChange={handleInputChange}
                                    className="w-full h-[45px] dark:bg-white/5 bg-white border dark:border-white/10 border-gray-300 rounded-xl px-4 dark:text-white text-gray-900"
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
                                <label className="block dark:text-gray-300 text-gray-700 mb-2">
                                    Monitor:
                                </label>
                                <input
                                    type="text"
                                    name="monitorREQ"
                                    value={formData.monitorREQ}
                                    onChange={handleInputChange}
                                    className="w-full h-[45px] dark:bg-white/5 bg-white border dark:border-white/10 border-gray-300 rounded-xl px-4 dark:text-white text-gray-900"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block dark:text-gray-300 text-gray-700 mb-2">
                                    Professor:
                                </label>
                                <input
                                    type="text"
                                    name="professorREQ"
                                    value={formData.professorREQ}
                                    onChange={handleInputChange}
                                    className="w-full h-[45px] dark:bg-white/5 bg-white border dark:border-white/10 border-gray-300 rounded-xl px-4 dark:text-white text-gray-900"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block dark:text-gray-300 text-gray-700 mb-2">
                                        Horário:
                                    </label>
                                    <input
                                        type="text"
                                        name="horarioREQ"
                                        value={formData.horarioREQ}
                                        onChange={handleInputChange}
                                        className="w-full h-[45px] dark:bg-white/5 bg-white border dark:border-white/10 border-gray-300 rounded-xl px-4 dark:text-white text-gray-900"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block dark:text-gray-300 text-gray-700 mb-2">
                                        Dia:
                                    </label>
                                    <input
                                        type="text"
                                        name="diaREQ"
                                        value={formData.diaREQ}
                                        onChange={handleInputChange}
                                        className="w-full h-[45px] dark:bg-white/5 bg-white border dark:border-white/10 border-gray-300 rounded-xl px-4 dark:text-white text-gray-900"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block dark:text-gray-300 text-gray-700 mb-2">
                                    Local:
                                </label>
                                <input
                                    type="text"
                                    name="localREQ"
                                    value={formData.localREQ}
                                    onChange={handleInputChange}
                                    className="w-full h-[45px] dark:bg-white/5 bg-white border dark:border-white/10 border-gray-300 rounded-xl px-4 dark:text-white text-gray-900"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block dark:text-gray-300 text-gray-700 mb-2">
                                    Descrição:
                                </label>
                                <textarea
                                    name="descricaoREQ"
                                    value={formData.descricaoREQ}
                                    onChange={handleInputChange}
                                    className="w-full min-h-[100px] dark:bg-white/5 bg-white border dark:border-white/10 border-gray-300 rounded-xl p-4 dark:text-white text-gray-900 resize-y"
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
                        <div className="bg-gradient-to-br dark:from-[#1c1c24] dark:to-[#2a2a3a] from-white to-gray-100 rounded-lg p-6 shadow-lg border dark:border-primary/10 border-primary/20 transition-colors duration-300">
                            <h2 className="text-2xl font-semibold mb-6 text-center dark:text-white text-gray-900">
                                Adicionar Matéria
                            </h2>

                            <form
                                onSubmit={handleAddSubject}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block dark:text-gray-300 text-gray-700 mb-2">
                                        Nome da Matéria:
                                    </label>
                                    <input
                                        type="text"
                                        name="materiaREQ"
                                        value={newSubject.materiaREQ}
                                        onChange={handleNewSubjectChange}
                                        className="w-full h-[45px] dark:bg-white/5 bg-white border dark:border-white/10 border-gray-300 rounded-xl px-4 dark:text-white text-gray-900"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block dark:text-gray-300 text-gray-700 mb-2">
                                        URL da Imagem:
                                    </label>
                                    <input
                                        type="text"
                                        name="imagemREQ"
                                        value={newSubject.imagemREQ}
                                        onChange={handleNewSubjectChange}
                                        className="w-full h-[45px] dark:bg-white/5 bg-white border dark:border-white/10 border-gray-300 rounded-xl px-4 dark:text-white text-gray-900"
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
                        <div className="bg-gradient-to-br dark:from-[#1c1c24] dark:to-[#2a2a3a] from-white to-gray-100 rounded-lg p-6 shadow-lg border dark:border-primary/10 border-primary/20 transition-colors duration-300">
                            <h2 className="text-2xl font-semibold mb-6 text-center dark:text-white text-gray-900">
                                Matérias Existentes
                            </h2>

                            <div className="space-y-4 max-h-[300px] overflow-y-auto">
                                {filteredSubjects.length === 0 ? (
                                    <div className="text-center py-6 dark:text-gray-400 text-gray-600">
                                        Nenhuma matéria encontrada com "
                                        {searchTerm}"
                                    </div>
                                ) : (
                                    filteredSubjects.map(subject => (
                                        <div
                                            key={subject.id}
                                            className="flex items-center justify-between p-3 dark:bg-black/20 bg-gray-100 rounded-lg"
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
                                                        backgroundPosition:
                                                            'center'
                                                    }}
                                                ></div>
                                                <span className="dark:text-white text-gray-900">
                                                    {subject.nome}
                                                </span>
                                            </div>
                                            {deleteConfirm &&
                                            deleteConfirm.type === 'subject' &&
                                            deleteConfirm.id === subject.id ? (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteSubject(
                                                                subject.id
                                                            )
                                                        }
                                                        className="px-3 py-1 bg-green-500/20 text-green-500 rounded hover:bg-green-500 hover:text-white transition-colors flex items-center"
                                                    >
                                                        <Check className="w-4 h-4 mr-1" />
                                                        Sim
                                                    </button>
                                                    <button
                                                        onClick={cancelDelete}
                                                        className="px-3 py-1 bg-gray-500/20 dark:text-gray-300 text-gray-700 rounded hover:bg-gray-500 hover:text-white transition-colors"
                                                    >
                                                        Não
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        confirmDelete(
                                                            'subject',
                                                            subject.id
                                                        )
                                                    }
                                                    className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white transition-colors flex items-center"
                                                >
                                                    <Trash className="w-4 h-4 mr-1" />
                                                    Deletar
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tutorials List */}
                <div className="mt-12">
                    <h2 className="text-2xl font-semibold mb-6 text-center dark:text-white text-gray-900">
                        Monitorias Cadastradas{' '}
                        {filteredTutorials.length > 0 && (
                            <span className="text-sm text-primary">
                                ({filteredTutorials.length})
                            </span>
                        )}
                    </h2>

                    {filteredTutorials.length === 0 ? (
                        <div className="text-center py-10 bg-gradient-to-br dark:from-[#1c1c24] dark:to-[#2a2a3a] from-white to-gray-100 rounded-xl border dark:border-gray-700/50 border-gray-200 shadow-lg">
                            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
                            <p className="text-lg dark:text-gray-300 text-gray-700">
                                Nenhuma monitoria encontrada com os filtros
                                atuais.
                            </p>
                        </div>
                    ) : activeTab === 'card' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTutorials.map(tutorial => (
                                <div
                                    key={tutorial.id}
                                    className="bg-gradient-to-br dark:from-[#18181f] dark:to-[#222230] from-white to-gray-100 rounded-lg overflow-hidden shadow-lg border dark:border-primary/10 border-primary/20 transition-all hover:shadow-xl hover:shadow-primary/20 hover:border-primary/30"
                                >
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-xl font-semibold dark:text-white text-gray-900">
                                                {tutorial.Materia.nome}
                                            </h3>
                                            <span className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs font-medium">
                                                {tutorial.inscricoes} inscritos
                                            </span>
                                        </div>

                                        <div className="space-y-2 dark:text-gray-300 text-gray-700 text-sm mb-4">
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
                                                {tutorial.horario} -{' '}
                                                {tutorial.dia}
                                            </p>
                                            <p>
                                                <span className="text-primary font-medium">
                                                    Local:
                                                </span>{' '}
                                                {tutorial.local}
                                            </p>
                                        </div>

                                        <p className="dark:text-gray-400 text-gray-600 text-sm mt-3 border-t dark:border-primary/10 border-primary/20 pt-3 line-clamp-3">
                                            {tutorial.descricao}
                                        </p>

                                        <div className="mt-4 flex justify-end gap-2">
                                            {deleteConfirm &&
                                            deleteConfirm.type === 'tutorial' &&
                                            deleteConfirm.id === tutorial.id ? (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteTutorial(
                                                                tutorial.id
                                                            )
                                                        }
                                                        className="px-3 py-1 bg-green-500/20 text-green-500 rounded hover:bg-green-500 hover:text-white transition-colors flex items-center"
                                                    >
                                                        <Check className="w-4 h-4 mr-1" />
                                                        Sim
                                                    </button>
                                                    <button
                                                        onClick={cancelDelete}
                                                        className="px-3 py-1 bg-gray-500/20 dark:text-gray-300 text-gray-700 rounded hover:bg-gray-500 hover:text-white transition-colors"
                                                    >
                                                        Não
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            startEditTutorial(tutorial)
                                                        }
                                                        className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500 hover:text-white transition-colors flex items-center"
                                                    >
                                                        <Pencil className="w-4 h-4 mr-2" />
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            confirmDelete(
                                                                'tutorial',
                                                                tutorial.id
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white transition-colors flex items-center"
                                                    >
                                                        <Trash className="w-4 h-4 mr-2" />
                                                        Deletar
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gradient-to-br dark:from-[#1c1c24] dark:to-[#2a2a3a] from-white to-gray-100 rounded-lg overflow-hidden shadow-lg border dark:border-primary/10 border-primary/20">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="dark:bg-gray-800 bg-gray-200 border-b dark:border-gray-700 border-gray-300">
                                            <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-gray-700 uppercase tracking-wider">
                                                Matéria
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-gray-700 uppercase tracking-wider">
                                                Monitor
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-gray-700 uppercase tracking-wider">
                                                Professor
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-gray-700 uppercase tracking-wider">
                                                Horário
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-gray-700 uppercase tracking-wider">
                                                Dia
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-gray-700 uppercase tracking-wider">
                                                Local
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-gray-700 uppercase tracking-wider">
                                                Inscritos
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-gray-700 uppercase tracking-wider">
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y dark:divide-gray-700 divide-gray-300">
                                        {filteredTutorials.map(tutorial => (
                                            <tr
                                                key={tutorial.id}
                                                className="hover:dark:bg-gray-800/50 hover:bg-gray-100"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap dark:text-white text-gray-900">
                                                    {tutorial.Materia.nome}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300 text-gray-700">
                                                    {tutorial.Monitor.nome}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300 text-gray-700">
                                                    {tutorial.Professor.nome}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300 text-gray-700">
                                                    {tutorial.horario}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300 text-gray-700">
                                                    {tutorial.dia}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300 text-gray-700">
                                                    {tutorial.local}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/20 text-primary">
                                                        {tutorial.inscricoes}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {deleteConfirm &&
                                                    deleteConfirm.type ===
                                                        'tutorial' &&
                                                    deleteConfirm.id ===
                                                        tutorial.id ? (
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteTutorial(
                                                                        tutorial.id
                                                                    )
                                                                }
                                                                className="px-2 py-1 bg-green-500/20 text-green-500 rounded hover:bg-green-500 hover:text-white transition-colors flex items-center text-xs"
                                                            >
                                                                <Check className="w-3 h-3 mr-1" />
                                                                Sim
                                                            </button>
                                                            <button
                                                                onClick={
                                                                    cancelDelete
                                                                }
                                                                className="px-2 py-1 bg-gray-500/20 dark:text-gray-300 text-gray-700 rounded hover:bg-gray-500 hover:text-white transition-colors text-xs"
                                                            >
                                                                Não
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() =>
                                                                    startEditTutorial(tutorial)
                                                                }
                                                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-blue-400 bg-blue-500/20 hover:bg-blue-500 hover:text-white"
                                                            >
                                                                <Pencil className="w-3 h-3 mr-1" />
                                                                Editar
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    confirmDelete(
                                                                        'tutorial',
                                                                        tutorial.id
                                                                    )
                                                                }
                                                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-red-400 bg-red-500/20 hover:bg-red-500 hover:text-white"
                                                            >
                                                                <Trash className="w-3 h-3 mr-1" />
                                                                Deletar
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Manage;
