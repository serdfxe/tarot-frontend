import { useState, useCallback } from 'react'
import type { Screen, SelectedCard, ReadingRecord } from './types'
import { useDailyLimit } from './hooks/useDailyLimit'
import { LandingScreen } from './screens/LandingScreen'
import { QuestionScreen } from './screens/QuestionScreen'
import { CardSelectionScreen } from './screens/CardSelectionScreen'
import { ReadingScreen } from './screens/ReadingScreen'
import { PaywallScreen } from './screens/PaywallScreen'
import { CardOfTheDayScreen } from './screens/CardOfTheDayScreen'
import { HistorySidebar } from './components/HistorySidebar'
import { useHistory } from './hooks/useHistory'

function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [prevScreen, setPrevScreen] = useState<Screen>('landing')
  const [question, setQuestion] = useState('')
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([])
  const [savedInterpretation, setSavedInterpretation] = useState('')
  const [historyOpen, setHistoryOpen] = useState(false)
  const { history, addReading } = useHistory()
  const { markReadingDone } = useDailyLimit()

  const navigate = useCallback((s: Screen) => {
    setPrevScreen(screen)
    setScreen(s)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [screen])

  const handleQuestionSet = useCallback((q: string) => {
    setQuestion(q)
    // Reset reading state when starting a new question
    setSavedInterpretation('')
    setSelectedCards([])
  }, [])

  const handleCardsSelected = useCallback((cards: SelectedCard[]) => {
    setSelectedCards(cards)
  }, [])

  const handleReadingSaved = useCallback((interpretation: string) => {
    setSavedInterpretation(interpretation)
    markReadingDone()
    const record: ReadingRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      question,
      cards: selectedCards,
      interpretation,
    }
    addReading(record)
  }, [question, selectedCards, addReading])

  return (
    <div style={{ background: '#0d0d1a', minHeight: '100dvh' }}>
      {/* History button — visible on all screens except card-of-the-day */}
      {screen !== 'card-of-the-day' && (
        <button
          onClick={() => setHistoryOpen(true)}
          className="fixed top-4 right-4 z-30 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{
            background: '#1a1635',
            border: '1px solid #2d2a4a',
            color: '#7c6fa8',
          }}
          title="История раскладов"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Screens */}
      {screen === 'landing' && (
        <LandingScreen onNavigate={navigate} />
      )}

      {screen === 'question' && (
        <QuestionScreen
          onNavigate={navigate}
          onQuestionSet={handleQuestionSet}
        />
      )}

      {screen === 'card-selection' && (
        <CardSelectionScreen
          onNavigate={navigate}
          onCardsSelected={handleCardsSelected}
        />
      )}

      {screen === 'reading' && (
        <ReadingScreen
          question={question}
          cards={selectedCards}
          initialInterpretation={savedInterpretation}
          onNavigate={navigate}
          onReadingSaved={handleReadingSaved}
        />
      )}

      {screen === 'paywall' && (
        <PaywallScreen onNavigate={navigate} backTo={prevScreen} />
      )}

      {screen === 'card-of-the-day' && (
        <CardOfTheDayScreen onNavigate={navigate} />
      )}

      {/* History sidebar */}
      <HistorySidebar
        history={history}
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
    </div>
  )
}

export default App
