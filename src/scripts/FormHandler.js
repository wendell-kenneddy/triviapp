export class FormHandler {
  #formElement = document.getElementById("quiz-form");

  constructor() {}

  async watch(callBack) {
    this.#formElement.addEventListener("submit", async (e) => {
      e.preventDefault();

      this.#handleSubmitButtonState(e, true);

      await callBack(this.#getFormData(e));

      this.#handleSubmitButtonState(e, false);
    });
  }

  #handleSubmitButtonState(e, isLoading) {
    const submitButton = e.target[2];

    if (isLoading) {
      submitButton.disabled = true;
      return;
    }

    submitButton.disabled = false;
  }

  #getFormData(e) {
    return { category: e.target[0].value, difficulty: e.target[1].value };
  }
}
