import React, { useState } from 'react';
import { useCompassStore } from './state/useCompassStore';
import { IntroView } from './components/views/IntroView';
import { QuestionView } from './components/views/QuestionView';
import { ResultView } from './components/views/ResultView';
import { MethodSheet } from './components/modals/MethodSheet';
import { PrivacySheet } from './components/modals/PrivacySheet';
import { QuestionLanguagePrompt } from './components/modals/QuestionLanguagePrompt';
import { ConstellationBackground } from './components/ui/ConstellationBackground';
import type { QuestionLanguage } from './domain/questionTranslations';

export const App: React.FC = () => {
  const store = useCompassStore();

  const [isMethodOpen, setIsMethodOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isLanguagePromptOpen, setIsLanguagePromptOpen] = useState(false);
  const [questionLanguage, setQuestionLanguage] = useState<QuestionLanguage>('en');

  const currentItem = store.presented[store.currentQuestionIndex];
  const totalCoreCount = 18;

  const requestQuizStart = () => setIsLanguagePromptOpen(true);
  const startQuizWithLanguage = () => {
    setIsLanguagePromptOpen(false);
    store.startNewQuiz();
  };

  return (
    <div className="min-h-dvh bg-[#05060A] text-[#F3F4F6] relative isolate selection:bg-[#FF2A54]/30 selection:text-white overflow-x-hidden">
      {/* Living Celestial Constellation Background */}
      <ConstellationBackground />

      {/* Intro View */}
      {store.screen === 'intro' && (
        <IntroView
          onStart={requestQuizStart}
          isStartPromptOpen={isLanguagePromptOpen}
          onOpenHowItWorks={() => setIsMethodOpen(true)}
          onOpenPrivacy={() => setIsPrivacyOpen(true)}
        />
      )}

      {/* Question Screen */}
      {store.screen === 'question' && currentItem && (
        <QuestionView
          key={currentItem.questionId}
          presentedItem={currentItem}
          itemIndex={store.currentQuestionIndex}
          totalCoreCount={totalCoreCount}
          questionLanguage={questionLanguage}
          onQuestionLanguageChange={setQuestionLanguage}
          onRecordAnswer={store.recordAnswer}
          onBack={store.goToPreviousQuestion}
        />
      )}

      {/* Result Screen (Hero Collectible Card & Deep Dive) */}
      {store.screen === 'result' && (
        <ResultView
          scores={store.scores}
          coverage={store.coverage}
          archetypeResult={store.archetypeResult}
          personalRead={store.personalRead}
          strongTraits={store.strongTraits}
          shareLine={store.shareLine}
          tensions={store.tensions}
          heresy={store.heresy}
          foilEval={store.foilEval}
          cardSerial={store.cardSerial}
          shareableUrl={store.shareableUrl}
          includeHeresyOnExport={store.includeHeresyOnExport}
          setIncludeHeresyOnExport={store.setIncludeHeresyOnExport}
          isSharedLink={store.isSharedLink}
          triggerForge={store.triggerForge}
          onFinishForge={() => store.setTriggerForge(false)}
          onReplayForge={store.replayForge}
          onTakeQuizToCompare={store.takeQuizToCompare}
          onOpenHowItWorks={() => setIsMethodOpen(true)}
          onOpenPrivacy={() => setIsPrivacyOpen(true)}
          onStartAgain={store.resetToFresh}
        />
      )}

      {/* Method Sheet Modal */}
      <MethodSheet
        isOpen={isMethodOpen}
        onClose={() => setIsMethodOpen(false)}
      />

      {/* Privacy Sheet Modal */}
      <PrivacySheet
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      <QuestionLanguagePrompt
        isOpen={store.screen === 'intro' && isLanguagePromptOpen}
        language={questionLanguage}
        onLanguageChange={setQuestionLanguage}
        onContinue={startQuizWithLanguage}
        onCancel={() => setIsLanguagePromptOpen(false)}
      />
    </div>
  );
};
