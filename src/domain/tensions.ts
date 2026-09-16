import { PresentedItem, Tension, Heresy } from './types';
import { ArchetypeResult } from './archetypes';
import { QUESTION_BANK, DIMENSION_META } from './questions';

export const AUTHORED_TENSIONS: Tension[] = [
  {
    id: 'earned-not-inherited',
    requiredAnswers: [{ questionId: 'E1', choice: 'A' }, { questionId: 'E2', choice: 'B' }],
    copy: 'Tax the inheritance. Reward the contribution. You draw a line between getting ahead and being born ahead.',
  },
  {
    id: 'public-exception',
    requiredAnswers: [{ questionId: 'M1', choice: 'B' }, { questionId: 'M2', choice: 'B' }],
    copy: 'Public homes. Competing train companies. You change your answer depending on the service.',
  },
  {
    id: 'loud-freedom',
    requiredAnswers: [{ questionId: 'A1', choice: 'B' }, { questionId: 'A4', choice: 'A' }],
    copy: 'Block the road for a protest. Close the bars so neighbours can sleep. Which kind of disruption earns a pass?',
  },
  {
    id: 'speech-exception',
    requiredAnswers: [{ questionId: 'A1', choice: 'B' }, { questionId: 'A2', choice: 'B' }],
    copy: 'You protect a disruptive protest, but cancel an offensive show at a public venue. Where does expression cross your line?',
  },
  {
    id: 'outsider-experts',
    requiredAnswers: [{ questionId: 'I1', choice: 'A' }, { questionId: 'I2', choice: 'A' }],
    copy: 'You trust the official safety checks, but give the political outsider the first look. Your trust depends on the institution.',
  },
  {
    id: 'earned-belonging',
    requiredAnswers: [{ questionId: 'G1', choice: 'B' }, { questionId: 'G2', choice: 'B' }],
    copy: 'Equal access to the job. Citizens first for scarce medicine. Opportunity and obligation get different rules.',
  },
  {
    id: 'borders-and-belonging',
    requiredAnswers: [{ questionId: 'G1', choice: 'A' }, { questionId: 'G2', choice: 'A' }],
    copy: 'Local workers first. Emergency help across borders. Nationality matters differently when the stakes change.',
  },
  {
    id: 'earned-not-given',
    requiredAnswers: [{ questionId: 'E1', choice: 'B' }, { questionId: 'E2', choice: 'B' }],
    copy: 'Reward the biggest contribution, and protect the inheritance. How much should getting ahead depend on what you did?',
  },
  {
    id: 'different-speeds',
    requiredAnswers: [{ questionId: 'T1', choice: 'A' }, { questionId: 'T2', choice: 'A' }],
    copy: "Driverless buses can start a trial. AI tutors should wait. You're open to new technology on different timelines.",
  },
  {
    id: 'public-with-outsiders',
    requiredAnswers: [{ questionId: 'M1', choice: 'B' }, { questionId: 'I3', choice: 'B' }],
    copy: "You want public housing, with outsiders taking charge when the agency fails. Public ownership doesn't mean automatic trust.",
  },
];

export interface EvaluatedTension {
  tension: Tension;
  question1: { id: string; prompt: string; chosenAnswerText: string; choice: 'A' | 'B' };
  question2: { id: string; prompt: string; chosenAnswerText: string; choice: 'A' | 'B' };
}

export function evaluateTensions(presented: PresentedItem[]): EvaluatedTension[] {
  // Build map of questionId -> choice
  const answerMap = new Map<string, 'A' | 'B'>();
  for (const item of presented) {
    if (item.choice === 'A' || item.choice === 'B') {
      answerMap.set(item.questionId, item.choice);
    }
  }

  const matches: EvaluatedTension[] = [];

  for (const t of AUTHORED_TENSIONS) {
    const req1 = t.requiredAnswers[0];
    const req2 = t.requiredAnswers[1];

    if (answerMap.get(req1.questionId) === req1.choice &&
        answerMap.get(req2.questionId) === req2.choice) {
      const q1 = QUESTION_BANK[req1.questionId];
      const q2 = QUESTION_BANK[req2.questionId];

      matches.push({
        tension: t,
        question1: {
          id: q1.id,
          prompt: q1.prompt,
          chosenAnswerText: q1.choices[req1.choice],
          choice: req1.choice,
        },
        question2: {
          id: q2.id,
          prompt: q2.prompt,
          chosenAnswerText: q2.choices[req2.choice],
          choice: req2.choice,
        },
      });

      if (matches.length === 2) {
        break; // Show at most two
      }
    }
  }

  return matches;
}

export function evaluateHeresy(
  presented: PresentedItem[],
  archetypeResult: ArchetypeResult,
  firstTension: EvaluatedTension | undefined
): Heresy | null {
  if (
    !archetypeResult.isComplete ||
    archetypeResult.isFallback ||
    archetypeResult.distance === null ||
    archetypeResult.distance > 0.18
  ) {
    return null;
  }

  // Must have a runner-up margin >= 0.025 (which means runnerUpTitle is null according to assignArchetype)
  if (archetypeResult.runnerUpTitle !== null) {
    return null;
  }

  const proto = archetypeResult.archetype.prototype;
  const answerMap = new Map<string, { choice: 'A' | 'B'; index: number }>();
  presented.forEach((item, index) => {
    if (item.choice === 'A' || item.choice === 'B') {
      answerMap.set(item.questionId, { choice: item.choice, index });
    }
  });

  // Candidate questions where user's choice cuts against archetype's extreme pole (<= 35 or >= 65)
  interface HeresyCandidate {
    questionId: string;
    chosenChoice: 'A' | 'B';
    chosenAnswerText: string;
    poleStrength: number;
    poleLabel: string;
    answerIndex: number;
  }

  const candidates: HeresyCandidate[] = [];

  for (const [qid, ans] of answerMap.entries()) {
    const q = QUESTION_BANK[qid];
    if (!q) continue;

    const dim = q.dimension;
    const protoVal = proto[dim];
    const isPositiveChoice = ans.choice === q.positiveChoice;

    let qualifies = false;
    let poleLabel = '';

    if (protoVal <= 35 && isPositiveChoice) {
      // Archetype has low-pole preference, user made high-pole choice
      qualifies = true;
      poleLabel = DIMENSION_META[dim].score0End.toLowerCase();
    } else if (protoVal >= 65 && !isPositiveChoice) {
      // Archetype has high-pole preference, user made low-pole choice
      qualifies = true;
      poleLabel = DIMENSION_META[dim].score100End.toLowerCase();
    }

    if (qualifies) {
      candidates.push({
        questionId: qid,
        chosenChoice: ans.choice,
        chosenAnswerText: q.choices[ans.choice],
        poleStrength: Math.abs(protoVal - 50),
        poleLabel,
        answerIndex: ans.index,
      });
    }
  }

  if (candidates.length === 0) {
    return null;
  }

  // Sort candidates by strongest prototype pole descending, then earliest answered question ID
  candidates.sort((a, b) => {
    if (b.poleStrength !== a.poleStrength) {
      return b.poleStrength - a.poleStrength;
    }
    return a.questionId.localeCompare(b.questionId);
  });

  const bestHeresy = candidates[0];

  // Avoid duplicate accusation: If same answer already appears in first tension, omit heresy
  if (
    firstTension &&
    (firstTension.question1.id === bestHeresy.questionId ||
     firstTension.question2.id === bestHeresy.questionId)
  ) {
    return null;
  }

  // Clean chosen answer text (remove final punctuation)
  const cleanAnswerText = bestHeresy.chosenAnswerText.replace(/[.!?]+$/, '');

  return {
    questionId: bestHeresy.questionId,
    chosenAnswerText: cleanAnswerText,
    poleLabel: bestHeresy.poleLabel,
    copy: `Your heresy: ${cleanAnswerText}.`,
  };
}
