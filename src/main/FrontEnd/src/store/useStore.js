import { create } from 'zustand';



const useStore = create((set, get) => ({
  // 기존 상태들 유지
  isLoaded: false,
  startTyping: false,
  isLeaving: false,
  showDemo: false,
  welcomeMessage1: '',
  welcomeMessage2: '',
  showWelcomeMessage1: false,
  showWelcomeMessage2: false,

  // DemoPlay 상태
  progress: 0,
  currentQuestion: 0,
  answers: ['', '', '', '', ''],
  showResult: false,
  isFinishing: false,
  isFinished: false,
  fadeIn: false,
  fadeOut: false,
  showGoodbyeMessage: false,

  // PracticeMenubar 상태
  selectedCard: null,

  setSelectedCard: (index) => set({ selectedCard: index }),

  // 기존 액션들 유지
  setIsLoaded: (value) => set({ isLoaded: value }),
  setStartTyping: (value) => set({ startTyping: value }),
  setIsLeaving: (value) => set({ isLeaving: value }),
  setShowDemo: (value) => set({ showDemo: value }),
  setWelcomeMessage1: (value) => set({ welcomeMessage1: value }),
  setWelcomeMessage2: (value) => set({ welcomeMessage2: value }),
  setShowWelcomeMessage1: (value) => set({ showWelcomeMessage1: value }),
  setShowWelcomeMessage2: (value) => set({ showWelcomeMessage2: value }),

  // DemoPlay 액션들
  setProgress: (value) => set({ progress: value }),
  setCurrentQuestion: (value) => set({ currentQuestion: value }),
  setAnswers: (answers) => set({ answers }),
  setShowResult: (value) => set({ showResult: value }),
  setIsFinishing: (value) => set({ isFinishing: value }),
  setIsFinished: (value) => set({ isFinished: value }),
  setFadeIn: (value) => set({ fadeIn: value }),
  setFadeOut: (value) => set({ fadeOut: value }),
  setShowGoodbyeMessage: (value) => set({ showGoodbyeMessage: value }),

  handleNext: () => set((state) => {
    if (state.currentQuestion < 4) {
      return { 
        currentQuestion: state.currentQuestion + 1, 
        showResult: false,
        progress: ((state.currentQuestion + 1) / 5) * 100
      };
    } else {
      return { isFinishing: true };
    }
  }),

  handleBack: () => set((state) => {
    if (state.currentQuestion > 0) {
      return { 
        currentQuestion: state.currentQuestion - 1, 
        showResult: false,
        progress: ((state.currentQuestion - 1) / 5) * 100
      };
    }
    return state;
  }),

  handleAnswerChange: (answer) => set((state) => {
    const newAnswers = [...state.answers];
    newAnswers[state.currentQuestion] = answer;
    return { answers: newAnswers };
  }),

  handleCheckAnswer: () => set({ showResult: true }),

  handleFinish: () => set({ isFinishing: true }),

  startFinishingProcess: () => set((state) => {
    if (state.isFinishing && state.progress < 100) {
      return { progress: state.progress + 1 };
    } else if (state.isFinishing && state.progress >= 100) {
      return { fadeOut: true };
    }
    return state;
  }),

  // MainContainer 관련 상태 추가
  cards: [],
  loading: false,

  // MainContainer 관련 액션 추가
  setCards: (cards) => set({ cards }),
  setLoading: (loading) => set({ loading }),
  loadMoreCards: () => {
    const state = get();
    if (state.loading) return;
  
    set({ loading: true });
    
    // 실제 API 호출 대신 setTimeout 사용
    setTimeout(() => {
      const newCards = [
        { date: '2024.xx.xx', category: '문법', level: 'Level 4', score: '5/10', rank: 'Bronz 4' },
        { date: '2024.xx.xx', category: '문법', level: 'Level 3', score: '7/10', rank: 'Bronz 3' },
        { date: '2024.xx.xx', category: '문법', level: 'Level 2', score: '8/10', rank: 'Bronz 2' },
      ];
      set((state) => ({ 
        cards: [...state.cards, ...newCards],
        loading: false
      }));
    }, 1000);
  },

  isLoggedIn: false,
  setIsLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),


}));



export default useStore;