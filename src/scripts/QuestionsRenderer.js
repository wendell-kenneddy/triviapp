import { shuffleArray } from "./shuffleArray";

export class QuestionsRenderer {
  #questionTemplate = document.getElementById("question-template");
  #questionsContainer = document.getElementById("questions-container");
  #controlGroupTemplate = document.getElementById("control-group-template");
  #scoreContainer = document.getElementById("score-container");
  #answerValidateFn;
  #onCorrectFn;
  #onRadioGroupInteractionEndFn;

  constructor() {}

  setupRenderer(answerValidateFn, onCorrectFn, onRadioGroupInteractionEndFn) {
    this.#answerValidateFn = answerValidateFn;
    this.#onCorrectFn = onCorrectFn;
    this.#onRadioGroupInteractionEndFn = onRadioGroupInteractionEndFn;
  }

  renderScore(score) {
    if (!this.#scoreContainer.classList.contains("visible")) {
      this.#scoreContainer.classList.add("visible");
    }

    this.#scoreContainer.innerHTML = `<p><span>Score:</span> ${score}/10</p>`;
  }

  renderAllQuestions(questions) {
    this.#questionsContainer.innerHTML = "";

    for (let i = 0; i < questions.length; i++) {
      this.#renderQuestion(questions[i], i + 1);
    }
  }

  #renderQuestion(question, index) {
    const questionTemplateclone =
      this.#questionTemplate.content.cloneNode(true);
    const radioGroup = questionTemplateclone.querySelector(".radio-group");

    const answers = shuffleArray([
      ...question.incorrectAnswers,
      question.correctAnswer,
    ]);

    this.#renderQuestionHeader(
      questionTemplateclone,
      question.question.text,
      index
    );
    this.#appendControlGroupsIntoRadioGroup(answers, radioGroup, index);
    this.#setupRadioGroupInteractivity(radioGroup);
    this.#questionsContainer.appendChild(questionTemplateclone);
  }

  #renderQuestionHeader(questionTemplateclone, title, index) {
    const titleDisplay = questionTemplateclone.getElementById("question-title");
    const indexDisplay = questionTemplateclone.getElementById(
      "question-index-display"
    );

    titleDisplay.innerText = title;
    indexDisplay.innerText = index;
  }

  #appendControlGroupsIntoRadioGroup(answers, radioGroup, index) {
    for (let i = 0; i < answers.length; i++) {
      const currentAnswer = answers[i];

      const controlGroupClone =
        this.#controlGroupTemplate.content.cloneNode(true);
      const input = controlGroupClone.querySelector("input");
      const label = controlGroupClone.querySelector("label");
      const inputId = `question-${index}-option-${i + 1}`;

      input.name = `question-${index}-answer`;
      input.id = inputId;
      input.value = currentAnswer;
      label.htmlFor = inputId;
      label.innerText = currentAnswer;

      radioGroup.dataset.questionIndex = index;
      radioGroup.appendChild(controlGroupClone);
    }
  }

  #setupRadioGroupInteractivity(radioGroup) {
    radioGroup.addEventListener(
      "change",
      (e) => {
        const chosenAnswer = e.target.value;
        const questionIndex = radioGroup.dataset.questionIndex;
        const isCorrect = this.#answerValidateFn(
          chosenAnswer,
          questionIndex - 1
        );

        if (isCorrect) this.#onCorrectFn();

        radioGroup.querySelectorAll(".control-group").forEach((group) => {
          const input = group.querySelector("input");
          const label = group.querySelector("label");

          if (input.value !== chosenAnswer) {
            input.disabled = true;
          }

          if (this.#answerValidateFn(label.innerText, questionIndex - 1)) {
            label.classList.add("correct-answer");
          }
        });

        this.#onRadioGroupInteractionEndFn();
      },
      { once: true }
    );
  }
}
