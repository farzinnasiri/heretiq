import { describe, it, expect } from 'vitest';
import { computeLedgerState, selectNextOptionalQuestion } from './scoring';
import { LEDGER_FIXTURE_L01, LEDGER_FIXTURE_L02 } from './fixtures';
import { assignArchetype } from './archetypes';
import { evaluateTensions } from './tensions';

describe('Scoring & Psychometric Engine', () => {
  it('correctly scores L01 to 70 / 70 / 70 / 70 / 50 / 70', () => {
    const { scores } = computeLedgerState(LEDGER_FIXTURE_L01.presented);
    expect(scores).toEqual(LEDGER_FIXTURE_L01.expectedScores);
  });

  it('correctly scores L02 to 50 / 50 / 50 / 50 / 50 / 50', () => {
    const { scores } = computeLedgerState(LEDGER_FIXTURE_L02.presented);
    expect(scores).toEqual(LEDGER_FIXTURE_L02.expectedScores);
  });

  it('evaluates earned-not-inherited tension for L01', () => {
    const tensions = evaluateTensions(LEDGER_FIXTURE_L01.presented);
    expect(tensions.length).toBeGreaterThanOrEqual(1);
    expect(tensions[0].tension.id).toBe('earned-not-inherited');
  });

  it('assigns The Mixed Signal for L02', () => {
    const { scores, coverage } = computeLedgerState(LEDGER_FIXTURE_L02.presented);
    const result = assignArchetype(scores, coverage);
    expect(result.archetype.id).toBe('mixed-signal');
  });

  it('selects E4 as the first optional question for L01', () => {
    const nextQ = selectNextOptionalQuestion(LEDGER_FIXTURE_L01.presented, 0);
    // In L01, E is the split dimension (E1 A positive, E2 B negative -> 50 score)
    // with highest entropy / information gain. Since E3 was promoted to core 18, E4 is selected.
    expect(nextQ).toBe('E4');
  });
});
