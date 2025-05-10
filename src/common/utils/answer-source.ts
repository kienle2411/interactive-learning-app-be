export enum AnswerSourceType {
  SLIDE = 'slide',
  QUIZ = 'quiz',
  SUBMISSION = 'submission',
}

export class AnswerSource {
  type: AnswerSourceType;
  contextId: string;
}
