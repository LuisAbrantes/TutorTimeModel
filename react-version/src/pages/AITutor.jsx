import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader, Brain } from 'lucide-react';

const AITutor = ({ navigate }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'ai',
            content:
                'Olá! Eu sou a TutorTimeAI, treinada para te ajudar a estudar. Como posso te ajudar com seus estudos hoje? 📚'
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: inputMessage
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${
                    import.meta.env.VITE_GEMINI_API_KEY
                }`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: `Você é um tutor educacional especializado. Sua função é ajudar estudantes com dúvidas acadêmicas de forma clara, didática e encorajadora. 

                                        Contexto: Esta é uma plataforma de tutoria educacional chamada TutorTime do IFSP (Instituto Federal de São Paulo).

                                        Pergunta do estudante: ${inputMessage}

                                        Instruções:
                                        - Responda de forma clara e didática
                                        - Use exemplos quando apropriado
                                        - Seja encorajador e positivo
                                        - Se for uma pergunta técnica/acadêmica, explique passo a passo
                                        - Mantenha um tom amigável e educativo
                                        - Use emojis ocasionalmente para tornar a resposta mais amigável
                                        - Se não souber algo específico, seja honesto mas ofereça alternativas`
                                    }
                                ]
                            }
                        ],
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 1024
                        },
                        safetySettings: [
                            {
                                category: 'HARM_CATEGORY_HARASSMENT',
                                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                            },
                            {
                                category: 'HARM_CATEGORY_HATE_SPEECH',
                                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                            },
                            {
                                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                            },
                            {
                                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                            }
                        ]
                    })
                }
            );

            const data = await response.json();

            if (
                data.candidates &&
                data.candidates[0] &&
                data.candidates[0].content
            ) {
                const aiResponse = {
                    id: Date.now() + 1,
                    type: 'ai',
                    content: data.candidates[0].content.parts[0].text
                };
                setMessages(prev => [...prev, aiResponse]);
            } else {
                throw new Error('Resposta inválida da API');
            }
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            const errorMessage = {
                id: Date.now() + 1,
                type: 'ai',
                content:
                    'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente em alguns instantes. 😔'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([
            {
                id: 1,
                type: 'ai',
                content:
                    'Olá! Eu sou a TutorTimeAI. Como posso te ajudar com seus estudos hoje? 📚'
            }
        ]);
    };

    return (
        <div className="min-h-screen bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="bg-gray-800 rounded-t-lg p-6 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary rounded-full">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    TutorTimeAI
                                </h1>
                                <p className="text-gray-400">
                                    Tire suas dúvidas com a nossa inteligência
                                    artificial
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={clearChat}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                        >
                            Limpar Chat
                        </button>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="bg-gray-800 h-96 overflow-y-auto p-4 space-y-4">
                    {messages.map(message => (
                        <div
                            key={message.id}
                            className={`flex ${
                                message.type === 'user'
                                    ? 'justify-end'
                                    : 'justify-start'
                            }`}
                        >
                            <div
                                className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                                    message.type === 'user'
                                        ? 'flex-row-reverse space-x-reverse'
                                        : ''
                                }`}
                            >
                                <div
                                    className={`p-2 rounded-full ${
                                        message.type === 'user'
                                            ? 'bg-primary'
                                            : 'bg-gray-600'
                                    }`}
                                >
                                    {message.type === 'user' ? (
                                        <User className="w-4 h-4 text-white" />
                                    ) : (
                                        <Bot className="w-4 h-4 text-white" />
                                    )}
                                </div>
                                <div
                                    className={`px-4 py-2 rounded-lg ${
                                        message.type === 'user'
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-700 text-white'
                                    }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">
                                        {message.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex items-start space-x-2">
                                <div className="p-2 rounded-full bg-gray-600">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="px-4 py-2 rounded-lg bg-gray-700 text-white">
                                    <div className="flex items-center space-x-2">
                                        <Loader className="w-4 h-4 animate-spin" />
                                        <span className="text-sm">
                                            Pensando...
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-gray-800 rounded-b-lg p-4 border-t border-gray-700">
                    <div className="flex space-x-2">
                        <textarea
                            value={inputMessage}
                            onChange={e => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Digite sua dúvida aqui..."
                            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                            rows="2"
                            disabled={isLoading}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!inputMessage.trim() || isLoading}
                            className="px-4 py-2 bg-primary hover:bg-primary-dark disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white transition-colors flex items-center justify-center"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Examples */}
                <div className="mt-6 bg-gray-800 rounded-lg p-6">
                    <h3 className="text-white font-semibold mb-4">
                        💡 Exemplos de perguntas:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                            'Como resolver equações de segundo grau?',
                            'Explique o que é fotossíntese',
                            'Como funciona a programação orientada a objetos?',
                            'Quais são as leis de Newton?',
                            'Como calcular derivadas básicas?',
                            'O que é a Segunda Guerra Mundial?'
                        ].map((example, index) => (
                            <button
                                key={index}
                                onClick={() => setInputMessage(example)}
                                className="text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 hover:text-white transition-colors text-sm"
                                disabled={isLoading}
                            >
                                {example}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AITutor;
