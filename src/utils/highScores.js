const HIGH_SCORES_KEY = 'space_invaders_high_scores';

export function getHighScores() {
  const scores = JSON.parse(localStorage.getItem(HIGH_SCORES_KEY) || '[]');
  return scores;
}

export function saveHighScore(initials, score) {
  const scores = getHighScores();
  scores.push({ initials, score });
  scores.sort((a, b) => b.score - a.score);
  const topScores = scores.slice(0, 10);
  localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(topScores));
  return topScores;
} 