// Variáveis globais para o teste de visão
let correctAnswers = 0;
let incorrectAnswers = 0;
let currentLetter = '';
let currentColor = '';
let timeLeft = 10;
let timerInterval;
let mode = 'practice'; // Modo padrão
let isTimedMode = false;
let totalQuestions = 10; // Definimos o número de perguntas para o resumo final
let questionsAnswered = 0;
let testEnded = false; // Flag para impedir novas respostas até reiniciar

// Função para compartilhar no Facebook
function shareOnFacebook() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

// Função para compartilhar no Twitter
function shareOnTwitter() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent('Confira este teste de visão!');
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
}

// Função para compartilhar no WhatsApp
function shareOnWhatsApp() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent('Confira este teste de visão!');
  window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, '_blank');
}

// Função para salvar como PDF usando a biblioteca html2pdf
function saveAsPDF() {
  const element = document.querySelector('.container');
  html2pdf(element, {
    margin: 1,
    filename: 'teste_visao.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  });
}

// Função para gerar uma nova letra e cor aleatórias
function nextLetter() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const colors = ['red', 'yellow', 'green'];

  currentLetter = letters.charAt(Math.floor(Math.random() * letters.length));
  currentColor = colors[Math.floor(Math.random() * colors.length)];

  const letterElement = document.getElementById('letter');
  letterElement.textContent = currentLetter;
  letterElement.style.color = currentColor;

  // Exibe a div da letra
  letterElement.style.display = 'block';  // Torna visível a div da letra

  // Reinicia o temporizador no modo cronometrado
  if (isTimedMode) {
    timeLeft = document.getElementById('timeSelect').value;
    document.getElementById('timer').textContent = `Tempo restante: ${timeLeft}s`;
    clearInterval(timerInterval);
    timerInterval = setInterval(countdown, 1000);
  }
}

// Função para verificar a resposta do usuário
function submitAnswer() {
  if (testEnded) return; // Impede a continuação após 10 perguntas

  const userInput = document.getElementById('userInput').value.toUpperCase();
  const feedbackElement = document.getElementById('feedback');

  // Verifica se o usuário escolheu uma cor
  const selectedColor = document.querySelector('input[name="color"]:checked');
  if (!selectedColor) {
    feedbackElement.textContent = 'Por favor, selecione uma cor.';
    feedbackElement.style.color = 'orange';
    return;
  }

  const userColor = selectedColor.value;

  // Verificação da resposta da letra e da cor
  if (userInput === currentLetter && userColor === currentColor) {
    feedbackElement.textContent = 'Correto!';
    feedbackElement.style.color = 'green';
    document.getElementById('correctSound').play();
    correctAnswers++;
  } else {
    feedbackElement.textContent = `Incorreto! A letra era ${currentLetter} e a cor era ${currentColor}.`;
    feedbackElement.style.color = 'red';
    document.getElementById('incorrectSound').play();
    incorrectAnswers++;
  }

  questionsAnswered++;

  // Verifica se o número de perguntas foi atingido
  if (questionsAnswered >= totalQuestions) {
    displaySummary();
    testEnded = true; // Impede novas respostas
  } else {
    // Limpa o campo de input e prepara a próxima letra
    document.getElementById('userInput').value = '';
    clearInterval(timerInterval); // Para o temporizador
    nextLetter(); // Gera a próxima letra e cor
  }

  // Atualiza a pontuação
  document.getElementById('score').textContent = `Pontuação: ${correctAnswers} corretas, ${incorrectAnswers} incorretas`;
}

// Função para exibir o resumo final
function displaySummary() {
  document.querySelector('.summary').style.display = 'block';
  document.getElementById('correctAnswers').textContent = `Respostas Corretas: ${correctAnswers}`;
  document.getElementById('incorrectAnswers').textContent = `Respostas Incorretas: ${incorrectAnswers}`;
  document.getElementById('feedback').textContent = '';
  clearInterval(timerInterval); // Para o temporizador
}

// Função para definir a dificuldade
function setDifficulty() {
  const difficulty = document.getElementById('difficulty').value;
  const letterElement = document.getElementById('letter');
  
  // Ajusta o tamanho da letra e o desfoque com base na dificuldade
  switch (difficulty) {
    case 'easy':
      letterElement.style.fontSize = '100px';
      letterElement.style.filter = 'blur(0px)';
      break;
    case 'medium':
      letterElement.style.fontSize = '70px';
      letterElement.style.filter = 'blur(2px)';
      break;
    case 'hard':
      letterElement.style.fontSize = '50px';
      letterElement.style.filter = 'blur(4px)';
      break;
    case 'veryHard':
      letterElement.style.fontSize = '40px';
      letterElement.style.filter = 'blur(6px)';
      break;
  }
}

// Função para definir o modo de jogo
function setMode() {
  mode = document.getElementById('mode').value;
  isTimedMode = mode === 'timed'; // Verifica se o modo é cronometrado

  if (!isTimedMode) {
    clearInterval(timerInterval); // Para o temporizador no modo de treinamento
    document.getElementById('timer').textContent = 'Modo de Treinamento';
  } else {
    nextLetter(); // Reinicia a letra e o temporizador no modo cronometrado
  }
}

// Função para atualizar o display do tempo por letra
function updateTimeDisplay() {
  const time = document.getElementById('timeSelect').value;
  document.getElementById('timeDisplay').textContent = `${time}s`;
}

// Função para contar o tempo no modo cronometrado
function countdown() {
  timeLeft--;
  document.getElementById('timer').textContent = `Tempo restante: ${timeLeft}s`;

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    submitAnswer(); // Submete a resposta automaticamente quando o tempo acaba
  }
}

// Função para reiniciar o teste
function restartTest() {
  correctAnswers = 0;
  incorrectAnswers = 0;
  questionsAnswered = 0;
  testEnded = false; // Permite que o teste continue após reiniciar
  document.getElementById('score').textContent = 'Pontuação: 0 corretas, 0 incorretas';
  document.getElementById('feedback').textContent = '';
  document.querySelector('.summary').style.display = 'none';
  nextLetter(); // Reinicia o teste com uma nova letra e cor
}

// Inicializa o teste assim que a página carrega, gerando a primeira letra e cor aleatórias sem atraso
window.onload = function() {
  nextLetter(); // Chama a função nextLetter() ao carregar a página
};
