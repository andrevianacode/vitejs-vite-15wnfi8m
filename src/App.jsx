import React, { useState } from 'react';
import { Volume2, BookOpen, Star, Sparkles, ChevronRight, RotateCcw, Award, MessageCircle, Mic, Loader, Wand2, GraduationCap, AlertTriangle } from 'lucide-react';

const PronunciationGuide = () => {
  const [activeTab, setActiveTab] = useState('guide');
  const [filter, setFilter] = useState('all');
  const [quizIndex, setQuizIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [speaking, setSpeaking] = useState(null);

  // AI States
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [challengeType, setChallengeType] = useState('U vs OU');

  // API Key (injected by environment)
  const apiKey = ""; 

  // Phonetic Data Categorized - COMPLETO
  const phoneticCategories = [
    {
      title: 'Voyelles Orales (Vogais Orais)',
      color: 'bg-blue-50 text-blue-700',
      iconColor: 'text-blue-600',
      items: [
        // Aiguës
        { symbol: 'i', name: 'i', sound: 'I', desc: 'Sorriso esticado (Igreja)', example: 'Livre', ipa: '/livʁ/' },
        { symbol: 'e', name: 'e fermé', sound: 'Ê', desc: 'Fechado (Você)', example: 'Chez', ipa: '/ʃe/' },
        { symbol: 'ɛ', name: 'e ouvert', sound: 'É', desc: 'Aberto (Café)', example: 'Très', ipa: '/tʁɛ/' },
        { symbol: 'a', name: 'a', sound: 'A', desc: 'Aberto normal (Pata)', example: 'Mardi', ipa: '/maʁdi/' },
        // Aiguës et Labiales
        { symbol: 'y', name: 'u', sound: 'Ü', desc: 'Boca de U, som de I', example: 'Tu', ipa: '/ty/' },
        { symbol: 'ø', name: 'eu fermé', sound: 'Ê (Bico)', desc: 'Boca de U, som de Ê', example: 'Vœu', ipa: '/vø/' },
        { symbol: 'œ', name: 'eu ouvert', sound: 'É (Bico)', desc: 'Boca de U, som de É', example: 'Cœur', ipa: '/kœʁ/' },
        { symbol: 'ə', name: 'schwa', sound: 'E (Fraco)', desc: 'Biquinho relaxado (Menino)', example: 'Regarde', ipa: '/ʁəgaʁd/' },
        // Graves et Labiales
        { symbol: 'u', name: 'ou', sound: 'U', desc: 'Nosso U de Uva', example: 'Vous', ipa: '/vu/' },
        { symbol: 'o', name: 'o fermé', sound: 'Ô', desc: 'Fechado (Vovô)', example: 'Beau', ipa: '/bo/' },
        { symbol: 'ɔ', name: 'o ouvert', sound: 'Ó', desc: 'Aberto (Porta)', example: 'Sport', ipa: '/spɔʁ/' },
        { symbol: 'ɑ', name: 'a postérieur', sound: 'A (Fundo)', desc: 'A profundo (quase Ó), raro hoje', example: 'Pâte', ipa: '/pɑt/' },
      ]
    },
    {
      title: 'Voyelles Nasales (Vogais Nasais)',
      color: 'bg-orange-50 text-orange-700',
      iconColor: 'text-orange-600',
      items: [
        { symbol: 'ɛ̃', name: 'in', sound: 'ÉIN', desc: 'Sorriso largo nasal', example: 'Matin', ipa: '/matɛ̃/' },
        { symbol: 'œ̃', name: 'un', sound: 'AN (Bico)', desc: 'Boca de U nasal (Raro hoje)', example: 'Un', ipa: '/œ̃/' },
        { symbol: 'ɔ̃', name: 'on', sound: 'ÔN', desc: 'Boca redonda fechada', example: 'Bon', ipa: '/bɔ̃/' },
        { symbol: 'ɑ̃', name: 'an', sound: 'AN', desc: 'Boca bem aberta', example: 'Temps', ipa: '/tɑ̃/' },
      ]
    },
    {
      title: 'Consonnes (Consoantes)',
      color: 'bg-slate-50 text-slate-700',
      iconColor: 'text-slate-600',
      items: [
        // Aiguës
        { symbol: 's', name: 's', sound: 'S', desc: 'Sempre som de S (nunca Z)', example: 'Si', ipa: '/si/' },
        { symbol: 'z', name: 'z', sound: 'Z', desc: 'Zebra', example: 'Cuisine', ipa: '/kɥizin/' },
        { symbol: 't', name: 't', sound: 'T', desc: 'T seco (não faça Tchi)', example: 'Tête', ipa: '/tɛt/' },
        { symbol: 'd', name: 'd', sound: 'D', desc: 'D seco (não faça Dji)', example: 'Deux', ipa: '/dø/' },
        { symbol: 'n', name: 'n', sound: 'N', desc: 'Navio', example: 'Nous', ipa: '/nu/' },
        { symbol: 'ɲ', name: 'gn', sound: 'NH', desc: 'Ninho', example: 'Baigner', ipa: '/beɲe/' },
        { symbol: 'l', name: 'l', sound: 'L', desc: 'Língua no céu da boca', example: 'Île', ipa: '/il/' },
        // Aiguës et Labiales
        { symbol: 'ʃ', name: 'ch', sound: 'X / CH', desc: 'Chave', example: 'Chat', ipa: '/ʃa/' },
        { symbol: 'ʒ', name: 'j', sound: 'J', desc: 'Janela', example: 'Jour', ipa: '/ʒuʁ/' },
        // Graves et Labiales
        { symbol: 'f', name: 'f', sound: 'F', desc: 'Faca', example: 'Femme', ipa: '/fam/' },
        { symbol: 'v', name: 'v', sound: 'V', desc: 'Vida', example: 'Vivre', ipa: '/vivʁ/' },
        { symbol: 'p', name: 'p', sound: 'P', desc: 'Pato', example: 'Porte', ipa: '/pɔʁt/' },
        { symbol: 'b', name: 'b', sound: 'B', desc: 'Bola', example: 'Bouche', ipa: '/buʃ/' },
        { symbol: 'm', name: 'm', sound: 'M', desc: 'Maria', example: 'Musique', ipa: '/myzik/' },
        // Neutres
        { symbol: 'k', name: 'k', sound: 'K', desc: 'Casa', example: 'Qui', ipa: '/ki/' },
        { symbol: 'g', name: 'g', sound: 'G', desc: 'Gato', example: 'Guide', ipa: '/gid/' },
        { symbol: 'ʁ', name: 'r', sound: 'R', desc: 'Gutural (Carioca)', example: 'Rire', ipa: '/ʁiʁ/' },
      ]
    },
    {
      title: 'Semi-consonnes (Semi-consoantes)',
      color: 'bg-purple-50 text-purple-700',
      iconColor: 'text-purple-600',
      items: [
        { symbol: 'j', name: 'yod', sound: 'I (Rápido)', desc: 'Iogurte (sem pausa)', example: 'Fille', ipa: '/fij/' },
        { symbol: 'ɥ', name: 'u', sound: 'UI', desc: 'Bico de U + I rápido', example: 'Nuit', ipa: '/nɥi/' },
        { symbol: 'w', name: 'ou', sound: 'U (Rápido)', desc: 'Água (U rápido)', example: 'Oui', ipa: '/wi/' },
      ]
    }
  ];

  // Data: Rules and Examples
  const rules = [
    // --- VOGAIS SIMPLES ---
    {
      id: 101,
      category: 'vogais',
      symbol: 'A',
      soundPT: 'A (Aberto)',
      desc: 'Sempre bem aberto! Nunca fale "ã" a menos que tenha N ou M depois.',
      example: 'Morgane',
      ipa: '/mɔʁ.gan/',
      approx: 'Mor-ga-ne',
      meaning: 'Morgane (Nome)',
      tips: 'Abra bem a boca: "MorgAne".'
    },
    {
      id: 102,
      category: 'vogais',
      symbol: 'E',
      soundPT: 'Ê (Fechado)',
      desc: 'Principalmente em palavras curtas (me, te, se, le), tem um som fechado, quase um biquinho relaxado.',
      example: 'Le',
      ipa: '/lə/',
      approx: 'Lê',
      meaning: 'O (artigo)',
      tips: 'Faça biquinho fraco e diga "Ê".'
    },
    {
      id: 103,
      category: 'vogais',
      symbol: 'I',
      soundPT: 'I',
      desc: 'Igual ao nosso I de "Igreja". Sorria e fale I.',
      example: 'Midi',
      ipa: '/mi.di/',
      approx: 'Mi-di',
      meaning: 'Meio-dia',
      tips: ''
    },
    {
      id: 104,
      category: 'vogais',
      symbol: 'O',
      soundPT: 'O / Ô',
      desc: 'Geralmente aberto como em "Porta" (Porte), mas também pode ser fechado como em "Vovô" (Rose).',
      example: 'Porte / Rose',
      examples: [
        { text: 'Porte', ipa: '/pɔʁt/', approx: 'Pór-te', meaning: 'Porta (Aberto)' },
        { text: 'Rose', ipa: '/ʁoz/', approx: 'Rô-ze', meaning: 'Rosa (Fechado)' }
      ],
      meaning: 'Porta / Rosa',
      tips: 'Ouça a diferença: Aberto vs Fechado.'
    },
    {
      id: 2,
      category: 'vogais',
      symbol: 'U',
      soundPT: 'Ü (Biquinho)',
      desc: 'O famoso biquinho! Faça a forma de "U" com a boca, mas tente produzir o som de "I".',
      example: 'Tu',
      ipa: '/ty/',
      approx: 'Tü',
      meaning: 'Tu/Você',
      tips: 'É um som que não existe no português.'
    },

    // --- COMBINAÇÕES ---
    {
      id: 1,
      category: 'combinacoes',
      symbol: 'OU',
      soundPT: 'U',
      desc: 'Igualzinho ao nosso "U" de "Uva". Sem mistério!',
      example: 'Bonjour',
      ipa: '/bɔ̃.ʒuʁ/',
      approx: 'Bon-jur',
      meaning: 'Olá/Bom dia',
      tips: 'Duas letras, um som só: U.'
    },
    {
      id: 111,
      category: 'combinacoes',
      symbol: 'EU (Final)',
      soundPT: 'Ê (Fechado)',
      desc: 'Boca de "O", mas som de "Ê" fechado. Acontece quando está no final da sílaba.',
      example: 'Deux',
      ipa: '/dø/',
      approx: 'Dê (biquinho)',
      meaning: 'Dois',
      tips: 'Use biquinho fechado.'
    },
    {
      id: 112,
      category: 'combinacoes',
      symbol: 'ŒU / EU (+R)',
      soundPT: 'É (Aberto)',
      desc: 'Quando seguido de consoante (principalmente R), o som abre! Vira um "É" feito com biquinho.',
      example: 'Cœur',
      ipa: '/kœʁ/',
      approx: 'Kérr (biquinho)',
      meaning: 'Coração',
      tips: 'Boca aberta arredondada.'
    },
    {
      id: 3,
      category: 'combinacoes',
      symbol: 'OI',
      soundPT: 'UÁ',
      desc: 'Sempre que ver "OI", leia como se fosse um mineiro surpreso: "Uai" (mas mais curto, "Uá").',
      example: 'Moi',
      ipa: '/mwa/',
      approx: 'Mu-á',
      meaning: 'Eu',
      tips: 'Croissant (Cru-a-ssan).'
    },
    {
      id: 4,
      category: 'combinacoes',
      symbol: 'EAU / AU',
      soundPT: 'Ô',
      desc: 'Muitas letras para um som só. Tudo isso vira um "O" fechado.',
      example: 'Eau',
      ipa: '/o/',
      approx: 'Ô',
      meaning: 'Água',
      tips: 'Beaucoup (Bô-cu) = Muito.'
    },
    {
      id: 5,
      category: 'combinacoes',
      symbol: 'CH',
      soundPT: 'X',
      desc: 'Na maioria das vezes, tem som de "X" (Chá), não de "Tch" (Tchau).',
      example: 'Chat',
      ipa: '/ʃa/',
      approx: 'Xá',
      meaning: 'Gato',
      tips: 'O "T" final é mudo!'
    },
    {
      id: 6,
      category: 'combinacoes',
      symbol: 'GN',
      soundPT: 'NH',
      desc: 'Equivale ao nosso "NH" de "Ninho".',
      example: 'Champagne',
      ipa: '/ʃɑ̃.paɲ/',
      approx: 'Xam-pa-nhe',
      meaning: 'Champanhe',
      tips: ''
    },
    {
      id: 14,
      category: 'combinacoes',
      symbol: 'ILL / IL',
      soundPT: 'I (Sem L)',
      desc: 'Na maioria das vezes, o "LL" vira um som de "I" esticado (como em "Iogurte"). Mas atenção às exceções: Ville, Mille, Tranquille (fala-se o L).',
      example: 'Famille',
      ipa: '/famij/',
      approx: 'Fa-mi-ye',
      meaning: 'Família',
      tips: 'Não fale o L! É "Fami-ye", não "Fami-lha".'
    },
    {
      id: 7,
      category: 'combinacoes',
      symbol: 'AI / EI',
      soundPT: 'É',
      desc: 'Geralmente tem som de "É" aberto.',
      example: 'Lait',
      ipa: '/lɛ/',
      approx: 'Lé',
      meaning: 'Leite',
      tips: ''
    },
    {
      id: 10,
      category: 'combinacoes',
      symbol: 'EN / AN',
      soundPT: 'Ã',
      desc: 'Um som nasal bem aberto, como em "Tanto".',
      example: 'Enchanté',
      ipa: '/ɑ̃.ʃɑ̃.te/',
      approx: 'Ã-xan-tê',
      meaning: 'Prazer (em conhecer)',
      tips: ''
    },
    {
      id: 12,
      category: 'combinacoes',
      symbol: 'IN / AIN',
      soundPT: 'ÉIN (Sorriso)',
      desc: 'O segredo é SORRIR. Estique a boca num sorriso e solte o som pelo nariz.',
      example: 'Vin',
      ipa: '/vɛ̃/',
      approx: 'Véin',
      meaning: 'Vinho',
      tips: 'Diferente do AN (boca aberta).'
    },
    {
      id: 13,
      category: 'combinacoes',
      symbol: 'UN',
      soundPT: 'UN / AN',
      desc: 'Faça bico de "U" e tente falar "ÉIN". Hoje em dia, muitos franceses já pronunciam igual ao "IN" (sorrindo).',
      example: 'Un',
      ipa: '/œ̃/',
      approx: 'Ãn (bico)',
      meaning: 'Um',
      tips: 'Na dúvida, o "IN" serve.'
    },
    {
      id: 110,
      category: 'combinacoes',
      symbol: 'AY',
      soundPT: 'ÉI',
      desc: 'Essa combinação rara costuma ter som de "ÉI".',
      example: 'Pays',
      ipa: '/pe.i/',
      approx: 'Pé-i',
      meaning: 'País',
      tips: 'Separa as sílabas.'
    },

    // --- CONSOANTES ---
    {
      id: 8,
      category: 'consoantes',
      symbol: 'R',
      soundPT: 'R (Guttural)',
      desc: 'Aquele "R" que arranha a garganta, tipo carioca falando "Rato", "Rio" ou "Rua".',
      example: 'Rouge',
      ipa: '/ʁuʒ/',
      approx: 'Rru-j',
      meaning: 'Vermelho',
      tips: 'Vem lá do fundo da garganta.'
    },

    // --- MUDOS ---
    {
      id: 9,
      category: 'mudos',
      symbol: 'Final',
      soundPT: 'Mudo',
      desc: 'Em francês, geralmente NÃO se pronuncia a última letra (D, P, S, T, X, Z).',
      example: 'Paris',
      ipa: '/pa.ʁi/',
      approx: 'Pa-rrí',
      meaning: 'Paris',
      tips: 'O "S" sumiu!'
    },

    // --- EXCEÇÕES ---
    {
      id: 201,
      category: 'excecoes',
      symbol: 'FEMME',
      soundPT: 'FAM',
      desc: 'Cuidado! Aqui o "E" se disfarça de "A". Não fale "Fêm".',
      example: 'Femme',
      ipa: '/fam/',
      approx: 'Fam',
      meaning: 'Mulher',
      tips: 'Exceção clássica e importante!'
    },
    {
      id: 202,
      category: 'excecoes',
      symbol: 'MONSIEUR',
      soundPT: 'ME-SIÊ',
      desc: 'Aqui o "ON" perde a força nasal e soa como "E" fechado (ou EU).',
      example: 'Monsieur',
      ipa: '/mə.sjø/',
      approx: 'Me-siê',
      meaning: 'Senhor',
      tips: 'Não pronuncie o "R" final também.'
    }
  ];

  // TTS Function
  const speak = (text, id) => {
    if ('speechSynthesis' in window) {
      setSpeaking(id);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9; // Slightly slower for learning
      utterance.onend = () => setSpeaking(null);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Seu navegador não suporta áudio :(");
    }
  };

  // Gemini API Handler
  const callGemini = async (promptType) => {
    setAiLoading(true);
    setAiError(null);
    setAiResult(null);

    let systemInstruction = `Você é o assistente virtual do Professor André, do curso de Francês do SENAC Aclimação.
    Sua missão é explicar a pronúncia de forma divertida e comparativa com o português do Brasil.
    Sempre retorne APENAS um objeto JSON válido.`;

    let userPrompt = "";

    if (promptType === 'analyze') {
      userPrompt = `Analise a frase francesa: "${aiInput}".
      Retorne um JSON com este formato:
      {
        "original": "${aiInput}",
        "brazilianPhonetic": "Escreva como um brasileiro leria (ex: 'Crru-a-ssan')",
        "translation": "Tradução para português",
        "tips": ["Dica 1 focada em sons difíceis", "Dica 2 sobre letras mudas ou biquinho"]
      }`;
    } else if (promptType === 'challenge') {
      userPrompt = `Crie um trava-línguas curto ou frase desafiadora em francês focada no som: ${challengeType}.
      Retorne um JSON com este formato:
      {
        "original": "Frase em francês",
        "brazilianPhonetic": "Fonética para BR",
        "translation": "Tradução",
        "tips": ["Explique por que é difícil (ex: alternância entre U e OU)"]
      }`;
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
            generationConfig: {
                responseMimeType: "application/json"
            }
          }),
        }
      );

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const jsonResponse = JSON.parse(textResponse);
      setAiResult(jsonResponse);

    } catch (error) {
      console.error("Erro na API:", error);
      setAiError("Oups! A IA ficou confusa. Tente novamente.");
    } finally {
      setAiLoading(false);
    }
  };

  // Quiz Logic
  const handleQuizNext = (correct) => {
    if (correct) setScore(score + 1);
    
    if (quizIndex < 4) { // Only 5 questions per round
      setQuizIndex(quizIndex + 1);
      setShowAnswer(false);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setQuizIndex(0);
    setScore(0);
    setQuizFinished(false);
    setShowAnswer(false);
  };

  // Generate random quiz questions based on rules
  const currentQuizRule = rules[quizIndex % rules.length]; // Simple rotation for demo

  const filteredRules = filter === 'all' 
    ? rules 
    : rules.filter(r => r.category === filter);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header Personalizado SENAC */}
      <header className="bg-white border-b border-slate-200 pb-1 sticky top-0 z-10 shadow-sm">
        <div className="bg-white/95 backdrop-blur-sm p-4 md:p-6">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0 w-full md:w-auto">
              
              {/* Logo Conceitual SENAC */}
              <div className="flex flex-col items-center justify-center bg-blue-600 text-white w-14 h-14 md:w-16 md:h-16 rounded-lg shadow-md shrink-0 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-8 h-8 bg-orange-400 rounded-bl-full transform translate-x-2 -translate-y-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></div>
                <span className="font-black text-[10px] md:text-xs tracking-widest relative z-10 mt-2">SENAC</span>
                <span className="text-[8px] font-light text-blue-100">Aclimação</span>
              </div>
              
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-bold text-slate-800 leading-tight">
                  Le Guia do Biquinho
                </h1>
                <div className="flex flex-col text-xs md:text-sm text-slate-500 mt-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      Prof. André
                    </span>
                    <span className="hidden md:inline text-slate-300">•</span>
                    <span className="text-orange-600 font-medium">Curso Básico</span>
                  </div>
                  <span className="text-slate-400 mt-0.5">Janeiro 2026</span>
                </div>
              </div>
            </div>
            
            <nav className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto max-w-full w-full md:w-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('guide')}
                className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-1 md:flex-none ${
                  activeTab === 'guide' 
                    ? 'bg-white text-blue-700 shadow-md' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <BookOpen size={16} className="mr-2" />
                Guia
              </button>
              <button
                onClick={() => setActiveTab('phonetic')}
                className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-1 md:flex-none ${
                  activeTab === 'phonetic' 
                    ? 'bg-white text-orange-600 shadow-md' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <GraduationCap size={16} className="mr-2" />
                Alfabeto
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-1 md:flex-none ${
                  activeTab === 'quiz' 
                    ? 'bg-white text-red-600 shadow-md' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Star size={16} className="mr-2" />
                Desafio
              </button>
              <button
                onClick={() => setActiveTab('coach')}
                className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-1 md:flex-none ${
                  activeTab === 'coach' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Wand2 size={16} className="mr-2" />
                Coach IA
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 md:p-6 pb-20">
        
        {/* --- GUIDE TAB --- */}
        {activeTab === 'guide' && (
          <div className="space-y-6 animate-fade-in">
            {/* Intro Card */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-orange-400 opacity-10 rounded-bl-full"></div>
              <h2 className="text-lg font-semibold text-blue-900 mb-2">Bem-vindo à aula, turma de Janeiro/26!</h2>
              <p className="text-blue-700 text-sm md:text-base">
                O Prof. André separou aqui os principais desafios de pronúncia.
                Clique nos ícones <Volume2 size={14} className="inline mx-1"/> para ouvir e praticar.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {['all', 'vogais', 'combinacoes', 'consoantes', 'mudos', 'excecoes'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-sm capitalize border transition-colors ${
                    filter === f 
                      ? 'bg-blue-800 text-white border-blue-800' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {f === 'all' ? 'Todas' : f === 'combinacoes' ? 'Combinações' : f === 'excecoes' ? 'Exceções' : f}
                </button>
              ))}
            </div>

            {/* Grid of Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRules.map((rule) => (
                <div key={rule.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                  {/* Card Header */}
                  <div className={`px-4 py-3 border-b flex justify-between items-center ${rule.category === 'excecoes' ? 'bg-orange-50 border-orange-100' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-blue-700">{rule.symbol}</span>
                      <ChevronRight size={16} className="text-slate-400" />
                      <span className="text-xl font-bold text-orange-500">{rule.soundPT}</span>
                    </div>
                    {rule.category === 'excecoes' ? (
                       <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                         <AlertTriangle size={10} /> {rule.category}
                       </span>
                    ) : (
                      <span className="text-xs font-mono text-slate-500 bg-slate-200 px-2 py-0.5 rounded uppercase tracking-wider">
                        {rule.category}
                      </span>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-4">
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {rule.desc}
                    </p>
                    
                    {/* Interactive Example Area */}
                    {rule.examples ? (
                       <div className="space-y-2">
                         <p className="text-[10px] uppercase tracking-wider text-blue-400 font-bold">EXEMPLOS</p>
                         {rule.examples.map((ex, idx) => (
                           <div key={idx} className="bg-blue-50 rounded-lg p-2 flex items-center justify-between border border-blue-100">
                             <div>
                               <div className="flex items-baseline space-x-2">
                                 <span className="text-md font-medium text-slate-900">{ex.text}</span>
                                 <span className="text-xs text-slate-500 italic">({ex.meaning})</span>
                               </div>
                               <div className="flex items-center space-x-2">
                                  <span className="text-[10px] bg-white px-1.5 rounded border border-blue-100 font-mono text-slate-500">
                                    {ex.ipa}
                                  </span>
                                  <span className="text-xs font-bold text-blue-600">"{ex.approx}"</span>
                               </div>
                             </div>
                             <button 
                               onClick={() => speak(ex.text, `${rule.id}-${idx}`)}
                               className={`p-2 rounded-full transition-all active:scale-95 ${
                                 speaking === `${rule.id}-${idx}` 
                                   ? 'bg-orange-500 text-white shadow-inner' 
                                   : 'bg-white text-blue-600 shadow-sm hover:shadow hover:bg-blue-50'
                               }`}
                             >
                               <Volume2 size={20} className={speaking === `${rule.id}-${idx}` ? "animate-pulse" : ""} />
                             </button>
                           </div>
                         ))}
                       </div>
                    ) : (
                      <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-between border border-blue-100">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-blue-400 font-bold mb-1">EXEMPLO</p>
                          <div className="flex items-baseline space-x-2">
                            <span className="text-lg font-medium text-slate-900">{rule.example}</span>
                            <span className="text-sm text-slate-500 italic">({rule.meaning})</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs bg-white px-2 py-0.5 rounded border border-blue-100 font-mono text-slate-500">
                              {rule.ipa}
                            </span>
                            <span className="text-sm font-bold text-blue-600">
                              "{rule.approx}"
                            </span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => speak(rule.example, rule.id)}
                          className={`p-3 rounded-full transition-all active:scale-95 ${
                            speaking === rule.id 
                              ? 'bg-orange-500 text-white shadow-inner' 
                              : 'bg-white text-blue-600 shadow-sm hover:shadow hover:bg-blue-50'
                          }`}
                          title="Ouvir pronúncia"
                        >
                          <Volume2 size={24} className={speaking === rule.id ? "animate-pulse" : ""} />
                        </button>
                      </div>
                    )}

                    {rule.tips && (
                      <div className="text-xs text-slate-500 flex items-start">
                        <span className="mr-1">💡</span> {rule.tips}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- PHONETIC ALPHABET TAB --- */}
        {activeTab === 'phonetic' && (
           <div className="space-y-8 animate-fade-in">
             <div className="text-center mb-6">
               <div className="inline-block p-3 rounded-full bg-orange-100 text-orange-600 mb-4">
                 <GraduationCap size={32} />
               </div>
               <h2 className="text-2xl font-bold text-slate-800">Alfabeto Fonético (IPA)</h2>
               <p className="text-slate-600 mt-2 max-w-2xl mx-auto text-sm">
                 Entenda o "código secreto" dos dicionários.
               </p>
             </div>

             {phoneticCategories.map((category, catIndex) => (
               <div key={catIndex} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className={`px-4 py-3 border-b border-slate-100 flex items-center space-x-2 ${category.color}`}>
                    <GraduationCap size={18} className={category.iconColor} />
                    <h3 className="font-bold text-sm uppercase tracking-wide">{category.title}</h3>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.items.map((item, index) => (
                        <div key={index} className="bg-white rounded-xl border border-slate-100 p-3 hover:shadow-md transition-all group hover:border-orange-200">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-2xl font-mono text-slate-700 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                              /{item.symbol}/
                            </span>
                            <button
                              onClick={() => speak(item.example, `phonetic-${catIndex}-${index}`)}
                              className={`p-1.5 rounded-full transition-colors ${
                                speaking === `phonetic-${catIndex}-${index}`
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-slate-50 text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500'
                              }`}
                            >
                              <Volume2 size={16} />
                            </button>
                          </div>
                          
                          <h3 className="font-bold text-sm text-slate-800 mb-1">{item.name}</h3>
                          <div className="flex items-center text-xs text-slate-500 mb-2">
                            <span className="font-semibold text-slate-600 mr-1.5">BR:</span>
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">{item.sound}</span>
                          </div>
                          
                          <p className="text-[10px] text-slate-500 mb-2 italic border-l-2 border-orange-200 pl-2 leading-tight">
                            "{item.desc}"
                          </p>

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                            <span className="text-sm font-medium text-slate-800">{item.example}</span>
                            <span className="text-[10px] font-mono text-slate-400">{item.ipa}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
             ))}
           </div>
        )}

        {/* --- QUIZ TAB --- */}
        {activeTab === 'quiz' && (
          <div className="max-w-md mx-auto animate-fade-in">
            {!quizFinished ? (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="bg-blue-900 p-6 text-center text-white relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-blue-800">
                    <div 
                      className="h-full bg-orange-500 transition-all duration-500"
                      style={{ width: `${((quizIndex + 1) / 5) * 100}%` }}
                    ></div>
                  </div>
                  <h3 className="text-sm font-medium opacity-70 mb-1">DESAFIO {quizIndex + 1}/5</h3>
                  <div className="text-4xl font-bold mb-2">{currentQuizRule.example}</div>
                  <p className="text-blue-200 text-sm">Como se pronuncia isso?</p>
                </div>

                <div className="p-6">
                  {!showAnswer ? (
                    <div className="space-y-4">
                      <div className="text-center py-8">
                        <p className="text-slate-600 mb-6">Tente falar em voz alta antes de revelar!</p>
                        <button 
                          onClick={() => speak(currentQuizRule.example, 'quiz')}
                          className="inline-flex items-center justify-center space-x-2 bg-blue-50 text-blue-700 px-6 py-3 rounded-xl hover:bg-blue-100 transition-colors w-full mb-4 font-medium"
                        >
                          <Volume2 size={20} />
                          <span>Ouvir a resposta</span>
                        </button>
                        <button 
                          onClick={() => setShowAnswer(true)}
                          className="w-full bg-blue-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-200"
                        >
                          Revelar Segredo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-fade-in">
                      <div className="text-center border-b pb-6 border-slate-100">
                        <p className="text-sm text-slate-400 uppercase tracking-wide mb-2">A REGRA ERA:</p>
                        <div className="flex items-center justify-center space-x-3 text-2xl font-bold text-slate-800">
                          <span className="text-blue-600">{currentQuizRule.symbol}</span>
                          <span>=</span>
                          <span className="text-orange-500">{currentQuizRule.soundPT}</span>
                        </div>
                        <p className="mt-2 text-lg text-blue-600 font-medium">"{currentQuizRule.approx}"</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => handleQuizNext(false)}
                          className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-slate-100 text-slate-500 hover:border-slate-300 hover:bg-slate-50 transition-all"
                        >
                          <span className="text-2xl mb-1">😅</span>
                          <span className="text-sm font-medium">Errei</span>
                        </button>
                        <button 
                          onClick={() => handleQuizNext(true)}
                          className="flex flex-col items-center justify-center p-4 rounded-xl bg-green-50 text-green-700 border-2 border-green-100 hover:bg-green-100 hover:border-green-200 transition-all shadow-sm"
                        >
                          <span className="text-2xl mb-1">😎</span>
                          <span className="text-sm font-bold">Acertei</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-block p-4 rounded-full bg-yellow-100 text-yellow-600 mb-6 animate-bounce">
                  <Award size={48} />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Fim do Treino!</h2>
                <p className="text-slate-600 mb-8">
                  Você acertou <strong className="text-blue-600 text-xl">{score}</strong> de 5.
                  {score === 5 ? ' C’est magnifique!' : score > 2 ? ' Pas mal!' : ' Cata a baguette e tenta de novo!'}
                </p>
                <button 
                  onClick={restartQuiz}
                  className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  <RotateCcw size={20} className="mr-2" />
                  Jogar Novamente
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- AI COACH TAB --- */}
        {activeTab === 'coach' && (
          <div className="max-w-xl mx-auto space-y-8 animate-fade-in">
            
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Monitor de Francês IA
              </h2>
              <p className="text-slate-500">
                Assistente virtual do <strong className="text-blue-700">Prof. André</strong> para tirar suas dúvidas.
              </p>
            </div>

            {/* Feature 1: Analyze Text */}
            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
              <div className="bg-blue-50 p-4 border-b border-blue-100 flex items-center space-x-2">
                <MessageCircle size={20} className="text-blue-600" />
                <span className="font-semibold text-blue-800">Tradutor de Sotaque</span>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600">
                  Digite uma palavra ou frase em francês e a IA vai "abrasileirar" a fonética para você.
                </p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Ex: Je ne regrette rien"
                    className="flex-1 p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    onClick={() => callGemini('analyze')}
                    disabled={aiLoading || !aiInput.trim()}
                    className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {aiLoading ? <Loader className="animate-spin" /> : <Sparkles />}
                  </button>
                </div>
              </div>
            </div>

            {/* Feature 2: Challenge Generator */}
            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
              <div className="bg-orange-50 p-4 border-b border-orange-100 flex items-center space-x-2">
                <Mic size={20} className="text-orange-600" />
                <span className="font-semibold text-orange-800">Gerador de Trava-Línguas</span>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600">
                  Escolha um som difícil e a IA vai criar um desafio sob medida.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['U vs OU', 'R Gutural', 'Nasais (AN/EN/ON)', 'CH vs J', 'Biquinho Ü'].map(type => (
                    <button
                      key={type}
                      onClick={() => setChallengeType(type)}
                      className={`px-3 py-1 rounded-full text-sm border ${
                        challengeType === type 
                          ? 'bg-orange-100 border-orange-300 text-orange-800' 
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => callGemini('challenge')}
                  disabled={aiLoading}
                  className="w-full py-3 bg-white border-2 border-orange-500 text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
                >
                  {aiLoading ? <Loader className="animate-spin" size={18} /> : <Wand2 size={18} />}
                  Gerar Desafio com IA
                </button>
              </div>
            </div>

            {/* AI Result Display */}
            {aiError && (
               <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center text-sm">
                 {aiError}
               </div>
            )}

            {aiResult && !aiLoading && (
              <div className="animate-slide-up bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles size={100} />
                </div>
                
                <div className="relative z-10 space-y-6">
                  <div className="text-center">
                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">
                      {aiResult.original.length > 30 ? 'FRASE' : 'PALAVRA'}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                      "{aiResult.original}"
                    </h3>
                    <p className="text-slate-400 italic mt-1">{aiResult.translation}</p>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm text-center">
                    <p className="text-xs text-blue-300 mb-2 font-mono">COMO LER (BR):</p>
                    <p className="text-2xl font-bold text-yellow-300 tracking-wide">
                      {aiResult.brazilianPhonetic}
                    </p>
                    <button 
                      onClick={() => speak(aiResult.original, 'ai-result')}
                      className="mt-3 text-sm flex items-center justify-center space-x-2 mx-auto text-white/80 hover:text-white transition-colors"
                    >
                      <Volume2 size={16} /> <span>Ouvir Original</span>
                    </button>
                  </div>

                  {aiResult.tips && aiResult.tips.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-400 uppercase font-semibold">Dicas do Prof:</p>
                      <ul className="text-sm space-y-2 text-slate-300">
                        {aiResult.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2 text-blue-400">⚡</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer SENAC */}
      <footer className="bg-slate-100 border-t border-slate-200 mt-auto">
        <div className="max-w-4xl mx-auto p-6 text-center">
          <p className="text-slate-500 text-sm font-medium">SENAC Aclimação • Curso Básico de Francês</p>
          <p className="text-slate-400 text-xs mt-1">Desenvolvido para as turmas de Janeiro/2026 do Prof. André</p>
          <p className="text-slate-300 text-[10px] mt-4">Feito com ❤️, 🥐 e magia Gemini ✨</p>
        </div>
      </footer>
    </div>
  );
};

export default PronunciationGuide;