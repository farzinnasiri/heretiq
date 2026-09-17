import { describe, expect, it } from 'vitest';
import { CORE_QUESTION_SEQUENCE, QUESTION_BANK } from './questions';
import {
  getQuestionCopy,
  isQuestionLanguageRtl,
  QUESTION_LANGUAGE_OPTIONS,
  QUESTION_TRANSLATIONS,
} from './questionTranslations';

describe('question translations', () => {
  it('has copy for every core question in every picker language', () => {
    for (const { value } of QUESTION_LANGUAGE_OPTIONS) {
      if (value === 'en') continue;

      const translations = QUESTION_TRANSLATIONS[value];
      expect(translations).toBeDefined();

      for (const questionId of CORE_QUESTION_SEQUENCE) {
        const copy = translations?.[questionId];
        expect(copy?.prompt).toBeTruthy();
        expect(copy?.choices.A).toBeTruthy();
        expect(copy?.choices.B).toBeTruthy();
      }
    }
  });

  it('falls back to the source copy for English and optional questions', () => {
    const question = QUESTION_BANK.M4;
    expect(getQuestionCopy(question, 'en')).toEqual({
      prompt: question.prompt,
      choices: question.choices,
    });
    expect(getQuestionCopy(question, 'fa')).toEqual({
      prompt: question.prompt,
      choices: question.choices,
    });
  });

  it('marks only Arabic and Farsi as right-to-left', () => {
    expect(isQuestionLanguageRtl('ar')).toBe(true);
    expect(isQuestionLanguageRtl('fa')).toBe(true);
    expect(isQuestionLanguageRtl('en')).toBe(false);
    expect(isQuestionLanguageRtl('es')).toBe(false);
  });
});
