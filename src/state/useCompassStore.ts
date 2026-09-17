import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Scores,
  Coverage,
  Choice,
  PresentedItem,
  Run,
} from '../domain/types';
import { CORE_QUESTION_SEQUENCE } from '../domain/questions';
import { computeLedgerState } from '../domain/scoring';
import { assignArchetype, ArchetypeResult } from '../domain/archetypes';
import { computePersonalRead, computeStrongestTraits, computeShareLine, TraitItem } from '../domain/personalRead';
import { evaluateTensions, evaluateHeresy, EvaluatedTension } from '../domain/tensions';
import { evaluateFoil, FoilEvaluation } from '../domain/foil';
import { generateCardSerial } from '../domain/cardId';
import { parseSharedCard, generateShareUrl, reconstructPresentedFromAnswers } from '../domain/shareUrl';
import { preloadArchetypeAssets } from '../utils/imagePreloader';

const STORAGE_KEY = 'heretiq_run_v0.1';
const LEGACY_STORAGE_KEY = 'tell_run_v0.1';

export type ScreenState = 'intro' | 'question' | 'reveal' | 'result';

export interface CompassStore {
  // Navigation & Flow
  screen: ScreenState;
  setScreen: (s: ScreenState) => void;
  currentQuestionIndex: number;
  run: Run;
  presented: PresentedItem[];
  includeHeresyOnExport: boolean;
  setIncludeHeresyOnExport: (include: boolean) => void;
  isSharedLink: boolean;
  triggerForge: boolean;
  setTriggerForge: (val: boolean) => void;

  // Actions
  startNewQuiz: () => void;
  recordAnswer: (questionId: string, choice: Choice) => void;
  editAnswer: (questionId: string, newChoice: Choice) => void;
  goToPreviousQuestion: () => void;
  resetToFresh: () => void;
  takeQuizToCompare: () => void;
  replayForge: () => void;

  // Derived Evaluations
  scores: Scores;
  coverage: Coverage;
  archetypeResult: ArchetypeResult;
  personalRead: string;
  strongTraits: TraitItem[];
  shareLine: string;
  tensions: EvaluatedTension[];
  heresy: ReturnType<typeof evaluateHeresy>;
  foilEval: FoilEvaluation;
  cardSerial: string;
  shareableUrl: string;
}

export function useCompassStore(): CompassStore {
  // Check if hash or path contains shared card
  const initialHash = typeof window !== 'undefined'
    ? (window.location.hash || (window.location.pathname.length > 1 ? window.location.pathname : ''))
    : '';
  const parsedCard = initialHash ? parseSharedCard(initialHash) : null;

  // Read saved session
  let savedRun: Run | null = null;
  if (typeof window !== 'undefined') {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.modelVersion === '0.1' && Array.isArray(parsed.presented)) {
          savedRun = parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read sessionStorage', e);
    }
  }

  // Determine if hash represents a shared link from someone else
  const isFromSharedUrl = Boolean(
    parsedCard?.valid &&
    parsedCard.card &&
    (!savedRun || savedRun.visualSeed !== parsedCard.card.visualSeed)
  );

  const [isSharedLink, setIsSharedLink] = useState<boolean>(isFromSharedUrl);
  const [triggerForge, setTriggerForge] = useState<boolean>(false);

  // If valid shared URL was provided, show reproduced result page directly
  const initialScreen: ScreenState = (parsedCard?.valid && parsedCard.card)
    ? 'result'
    : 'intro';

  const [screen, setScreen] = useState<ScreenState>(initialScreen);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [includeHeresyOnExport, setIncludeHeresyOnExport] = useState<boolean>(false);

  // Initialize Run from hash or sessionStorage or fresh
  const [run, setRun] = useState<Run>(() => {
    if (parsedCard?.valid && parsedCard.card) {
      const reconstructed = reconstructPresentedFromAnswers(parsedCard.card.answers);
      if (reconstructed.length > 0) {
        return {
          modelVersion: '0.1',
          renderVersion: '1',
          visualSeed: parsedCard.card.visualSeed,
          presented: reconstructed,
        };
      }
    }

    if (savedRun) {
      return savedRun;
    }

    // Default fresh run
    const randomSeed = Math.floor(Math.random() * 0xffffffff);
    return {
      modelVersion: '0.1',
      renderVersion: '1',
      visualSeed: randomSeed,
      presented: [],
    };
  });

  // Save to sessionStorage on updates
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(run));
      } catch (e) {
        console.warn('Could not save to sessionStorage', e);
      }
    }
  }, [run]);

  // Derived calculations from presented items
  const { scores, coverage } = useMemo(() => {
    return computeLedgerState(run.presented);
  }, [run.presented]);

  const archetypeResult = useMemo(() => {
    return assignArchetype(scores, coverage);
  }, [scores, coverage]);

  const personalRead = useMemo(() => {
    return computePersonalRead(scores, coverage);
  }, [scores, coverage]);

  const strongTraits = useMemo(() => {
    return computeStrongestTraits(scores, coverage);
  }, [scores, coverage]);

  const shareLine = useMemo(() => {
    return computeShareLine(scores, coverage);
  }, [scores, coverage]);

  const tensions = useMemo(() => {
    return evaluateTensions(run.presented);
  }, [run.presented]);

  const heresy = useMemo(() => {
    return evaluateHeresy(run.presented, archetypeResult, tensions[0]);
  }, [run.presented, archetypeResult, tensions]);

  const foilEval = useMemo(() => {
    return evaluateFoil(scores, coverage, archetypeResult.archetype.id);
  }, [scores, coverage, archetypeResult]);

  const cardSerial = useMemo(() => {
    return generateCardSerial(archetypeResult.archetype.code, scores, coverage, run.visualSeed);
  }, [archetypeResult.archetype.code, scores, coverage, run.visualSeed]);

  const shareableUrl = useMemo(() => {
    const answers: Record<string, Choice> = {};
    for (const item of run.presented) {
      if (item.choice) {
        answers[item.questionId] = item.choice;
      }
    }
    return generateShareUrl({
      archetypeSlug: archetypeResult.archetype.id,
      answers,
      visualSeed: run.visualSeed,
    });
  }, [archetypeResult.archetype.id, run.visualSeed, run.presented]);

  // Sync shareable URL hash into browser address bar when viewing own result
  useEffect(() => {
    if (screen === 'result' && shareableUrl && typeof window !== 'undefined' && !isSharedLink) {
      try {
        const hash = shareableUrl.slice(shareableUrl.indexOf('#'));
        if (window.location.hash !== hash) {
          window.history.replaceState(null, '', hash);
        }
      } catch (e) {
        console.warn('Could not update url hash', e);
      }
    }
  }, [screen, shareableUrl, isSharedLink]);

  // Proactively preload the full-resolution artwork for the leading archetype
  // when approaching the end of the quiz (or on the result screen)
  useEffect(() => {
    const fullImg = archetypeResult?.archetype?.fullCardImagePath;
    if (fullImg) {
      if (currentQuestionIndex >= 14 || screen === 'result') {
        preloadArchetypeAssets(fullImg);
      }
    }
  }, [currentQuestionIndex, screen, archetypeResult]);

  // Handle incoming hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || window.location.pathname;
      if (hash) {
        const res = parseSharedCard(hash);
        if (res.valid && res.card) {
          const reconstructed = reconstructPresentedFromAnswers(res.card.answers);
          if (reconstructed.length > 0) {
            setRun({
              modelVersion: '0.1',
              renderVersion: '1',
              visualSeed: res.card.visualSeed,
              presented: reconstructed,
            });
            setIsSharedLink(true);
            setScreen('result');
          }
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // Action: start new quiz from intro
  const startNewQuiz = useCallback(() => {
    const randomSeed = Math.floor(Math.random() * 0xffffffff);
    const firstQId = CORE_QUESTION_SEQUENCE[0];
    const initialOrder: ['A', 'B'] | ['B', 'A'] = Math.random() > 0.5 ? ['A', 'B'] : ['B', 'A'];

    const initialPresented: PresentedItem[] = [{
      questionId: firstQId,
      choice: null,
      displayOrder: initialOrder,
    }];

    setRun({
      modelVersion: '0.1',
      renderVersion: '1',
      visualSeed: randomSeed,
      presented: initialPresented,
    });
    setCurrentQuestionIndex(0);
    setScreen('question');
  }, []);

  // Action: record answer for current question
  const recordAnswer = useCallback((questionId: string, choice: Choice) => {
    const isLast = currentQuestionIndex >= CORE_QUESTION_SEQUENCE.length - 1;
    const nextIdx = currentQuestionIndex + 1;

    setRun(prev => {
      const updatedPresented = [...prev.presented];
      const existingIdx = updatedPresented.findIndex(p => p.questionId === questionId);

      if (existingIdx !== -1) {
        updatedPresented[existingIdx] = {
          ...updatedPresented[existingIdx],
          choice,
        };
      } else {
        updatedPresented.push({
          questionId,
          choice,
          displayOrder: ['A', 'B'],
        });
      }

      // Pre-seed next question if advancing
      if (!isLast && nextIdx < CORE_QUESTION_SEQUENCE.length) {
        const nextQId = CORE_QUESTION_SEQUENCE[nextIdx];
        const nextExists = updatedPresented.some(p => p.questionId === nextQId);
        if (!nextExists) {
          const nextOrder: ['A', 'B'] | ['B', 'A'] = Math.random() > 0.5 ? ['A', 'B'] : ['B', 'A'];
          updatedPresented.push({
            questionId: nextQId,
            choice: null,
            displayOrder: nextOrder,
          });
        }
      }

      return {
        ...prev,
        presented: updatedPresented,
      };
    });

    setTimeout(() => {
      if (!isLast) {
        setCurrentQuestionIndex(nextIdx);
      } else {
        setTriggerForge(true);
        setScreen('result');
      }
    }, 220);
  }, [currentQuestionIndex]);

  // Action: go back to previous presented item
  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      setScreen('intro');
    }
  }, [currentQuestionIndex]);

  // Action: edit an existing answer (from result or Why sheet)
  const editAnswer = useCallback((questionId: string, newChoice: Choice) => {
    setRun(prev => {
      const idx = prev.presented.findIndex(p => p.questionId === questionId);
      if (idx === -1) return prev;
      const updated = [...prev.presented];
      updated[idx] = {
        ...updated[idx],
        choice: newChoice,
      };
      return {
        ...prev,
        presented: updated,
      };
    });
  }, []);

  // Action: reset all to fresh
  const resetToFresh = useCallback(() => {
    const randomSeed = Math.floor(Math.random() * 0xffffffff);
    const freshRun: Run = {
      modelVersion: '0.1',
      renderVersion: '1',
      visualSeed: randomSeed,
      presented: [],
    };
    setRun(freshRun);
    setIsSharedLink(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY);
      window.location.hash = '';
    }
    setCurrentQuestionIndex(0);
    setScreen('intro');
  }, []);

  // Action: visitor on shared result takes quiz to compare
  const takeQuizToCompare = useCallback(() => {
    setIsSharedLink(false);
    const randomSeed = Math.floor(Math.random() * 0xffffffff);
    const firstQId = CORE_QUESTION_SEQUENCE[0];
    const initialOrder: ['A', 'B'] | ['B', 'A'] = Math.random() > 0.5 ? ['A', 'B'] : ['B', 'A'];
    setRun({
      modelVersion: '0.1',
      renderVersion: '1',
      visualSeed: randomSeed,
      presented: [{
        questionId: firstQId,
        choice: null,
        displayOrder: initialOrder,
      }],
    });
    setCurrentQuestionIndex(0);
    setScreen('question');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY);
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  // Action: replay card forging animation
  const replayForge = useCallback(() => {
    // Replay presentation is handled directly within ResultView lifecycle
  }, []);

  return {
    screen,
    setScreen,
    currentQuestionIndex,
    run,
    presented: run.presented,
    includeHeresyOnExport,
    setIncludeHeresyOnExport,
    isSharedLink,
    triggerForge,
    setTriggerForge,
    startNewQuiz,
    recordAnswer,
    editAnswer,
    goToPreviousQuestion,
    resetToFresh,
    takeQuizToCompare,
    replayForge,
    scores,
    coverage,
    archetypeResult,
    personalRead,
    strongTraits,
    shareLine,
    tensions,
    heresy,
    foilEval,
    cardSerial,
    shareableUrl,
  };
}
