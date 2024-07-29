let questions = [
    { question: "What is the capital of France?", answers: ["Paris", "London", "Berlin", "Madrid"], correct: 0 },
    { question: "What is 2 + 2?", answers: ["3", "4", "5", "6"], correct: 1 },
    {question: "What is the chemical symbol for gold?",
        answers: ["Au", "Ag", "Fe", "Pb"],
        correct: 0
    },
    {
        question: "Which country is known as the Land of the Rising Sun?",
        answers: ["China", "Japan", "Thailand", "South Korea"],
        correct: 1
    },
    {
        question: "Who was the first President of the United States?",
        answers: ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "John Adams"],
        correct: 1
    },
    {
        question: "Who wrote the novel '1984'?",
        answers: ["Aldous Huxley", "George Orwell", "J.K. Rowling", "Ernest Hemingway"],
        correct: 1
    },
    {
        question: "What is the value of π (pi) to two decimal places?",
        answers: ["3.14", "3.16", "3.12", "3.21"],
        correct: 0
    },
    {
        question: "Which band released the album 'Abbey Road'?",
        answers: ["The Rolling Stones", "The Beatles", "Pink Floyd", "Led Zeppelin"],
        correct: 1
    },
    {
        question: "What does HTTP stand for?",
        answers: ["HyperText Transfer Protocol", "HyperText Transmission Protocol", "HyperTransfer Text Protocol", "HyperText Transfer Program"],
        correct: 0
    },
    {
        question: "Who painted the Mona Lisa?",
        answers: ["Vincent van Gogh", "Claude Monet", "Leonardo da Vinci", "Pablo Picasso"],
        correct: 2
    },
    {
        question: "In which sport would you perform a slam dunk?",
        answers: ["Basketball", "Volleyball", "Soccer", "Tennis"],
        correct: 0
    },
    {
        question: "Which planet is known as the Red Planet?",
        answers: ["Earth", "Venus", "Mars", "Jupiter"],
        correct: 2
    }
    // Add more questions here
];

let currentQuestion = 0;
let score = 0;
let alertCount = 0;
const maxAlerts = 3;
let timer;
let timeLeft = 600; // 10 minutes in seconds

function startTimer() {
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            submitQuiz();
        } else {
            timeLeft--;
            document.getElementById('time').textContent = formatTime(timeLeft);
        }
    }, 1000);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function loadQuestion() {
    const questionElement = document.createElement('div');
    const question = questions[currentQuestion];
    questionElement.innerHTML = `
        <h2>${question.question}</h2>
        <ul>
            ${question.answers.map((answer, index) => `<li><input type="radio" name="answer" value="${index}"> ${answer}</li>`).join('')}
        </ul>
    `;
    document.getElementById('quiz-body').innerHTML = '';
    document.getElementById('quiz-body').appendChild(questionElement);
}

function showNextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion();
    }
}

function showPreviousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

function submitQuiz() {
    clearInterval(timer);
    // Calculate score and show result
    alert('Quiz submitted!');
}

document.getElementById('next-btn').addEventListener('click', showNextQuestion);
document.getElementById('prev-btn').addEventListener('click', showPreviousQuestion);
document.getElementById('submit-btn').addEventListener('click', submitQuiz);

loadQuestion();
startTimer();





let model, webcam, labelContainer, maxPredictions;

async function init() {
    const URL = "https://teachablemachine.withgoogle.com/models/LUKHlUUPd/";
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    webcam = new tmImage.Webcam(200, 200, true);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById('quiz-container').appendChild(webcam.canvas);
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

// async function predict() {
//     const prediction = await model.predict(webcam.canvas);
//     const userIsDistracted = prediction.some(p => p.className !== "Looking at screen" && p.probability > 0.9);

//     if (userIsDistracted) {
//         alertCount++;
//         document.getElementById('alert-count').textContent = alertCount;
//         if (alertCount >= maxAlerts) {
//             submitQuiz();
//         } else {
//             alert("Please stay focused on the screen!");
//         }
//     }
// }

async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        let prb = prediction[i].probability.toFixed(2);
        const userIsDistracted = prb>.98?true:false;
        if (userIsDistracted) {
            alertCount++;
            document.getElementById('alert-count').textContent = alertCount;
            if (alertCount >= maxAlerts) {
                submitQuiz();
            } else {
                alert("Please stay focused on the screen!");
            }
        }
    }
}

init();