import { FormHandler } from "./scripts/FormHandler";
import { QuestionsHandler } from "./scripts/QuestionsHandler";
import { QuestionsRenderer } from "./scripts/QuestionsRenderer";
import { fetchQuestions } from "./scripts/fetchQuestions";

import "./styles/main.scss";

const renderer = new QuestionsRenderer();
const formHandler = new FormHandler();
const questionsHandler = new QuestionsHandler(renderer);

formHandler.watch(async ({ category, difficulty }) => {
  try {
    const questions = await fetchQuestions({ difficulty, category });
    questionsHandler.setupQuestions(questions);
  } catch (error) {
    alert(error.message);
  }
});
