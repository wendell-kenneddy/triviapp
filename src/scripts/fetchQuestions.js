export async function fetchQuestions({ difficulty, category }) {
  const url = `https://the-trivia-api.com/v2/questions?&difficulties=${difficulty}&categories=${category}&limit=10`;
  const response = await fetch(url);
  const quiz = await response.json();
  return quiz;
}
