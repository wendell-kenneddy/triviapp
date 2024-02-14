export class QuestionsHandler {
  #questions = [];
  #answeredQuestionsCount = 0;
  #score = 0;
  #renderer;

  constructor(renderer) {
    this.#renderer = renderer;
  }

  setupQuestions(questions) {
    this.#reset(questions);
    this.#renderer.setupRenderer(
      (answer, questionIndex) => this.#validateAnswer(answer, questionIndex),
      () => this.#onCorrectScore(),
      () => this.#onRadioGroupInteractionEnd()
    );
    this.#renderer.renderAllQuestions(questions);
  }

  #reset(questions) {
    this.#validateCompletion();
    this.#updateScore(0);
    this.#answeredQuestionsCount = 0;
    this.#questions = questions;
    this.#renderer.renderScore(0);
  }

  #validateCompletion() {
    if (this.#answeredQuestionsCount < this.#questions.length) {
      throw new Error("Please, answer all questions before loading more.");
    }
  }

  #validateAnswer(answer, questionIndex) {
    return answer === this.#questions[questionIndex].correctAnswer;
  }

  #onRadioGroupInteractionEnd() {
    this.#answeredQuestionsCount++;
  }

  #onCorrectScore() {
    this.#updateScore(this.#score + 1);
    this.#renderer.renderScore(this.#score);
  }

  #updateScore(newScore) {
    this.#score = newScore;
  }
}
