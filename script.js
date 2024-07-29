let currentQuestion;

document.getElementById('application').addEventListener('change', function() {
    let selectedApp = document.getElementById('application').value;
    document.querySelectorAll('.application').forEach(app => app.style.display = 'none');
    document.getElementById(selectedApp).style.display = 'block';
});

document.getElementById('submit-action').addEventListener('click', function() {
    let action = document.getElementById('action').value;
    let doer = document.getElementById('doer').value;
    let format = document.getElementById('application').value;

    console.log('Submitting action:', action, 'Doer:', doer, 'Format:', format); // Logging for debugging

    fetch('/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: action, doer: doer, format: format })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Received data:', data); // Logging for debugging

        if (!data || !data.presentHindi) {
            throw new Error('Translation not available');
        }

        currentQuestion = data;

        if (format === 'application1') {
            document.getElementById('present-hindi-question').innerText = data.presentHindi;
            document.getElementById('negative-hindi-question').innerText = data.negativeHindi;
            document.getElementById('question-hindi-question').innerText = data.questionHindi;
            document.getElementById('negative-question-hindi-question').innerText = data.negativeQuestionHindi;
        } else {
            document.getElementById('present-hindi-question-app2').innerText = data.presentHindi;
            document.getElementById('negative-hindi-question-app2').innerText = data.negativeHindi;
            document.getElementById('question-hindi-question-app2').innerText = data.questionHindi;
            document.getElementById('negative-question-hindi-question-app2').innerText = data.negativeQuestionHindi;
        }
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('submit-translations').addEventListener('click', function() {
    let format = document.getElementById('application').value;
    let feedback = {};

    if (format === 'application1') {
        let presentTranslation = document.getElementById('present-translation').value;
        let negativeTranslation = document.getElementById('negative-translation').value;
        let questionTranslation = document.getElementById('question-translation').value;
        let negativeQuestionTranslation = document.getElementById('negative-question-translation').value;

        feedback = {
            present: presentTranslation,
            negative: negativeTranslation,
            question: questionTranslation,
            negativeQuestion: negativeQuestionTranslation
        };
    } else {
        let presentTranslationApp2 = document.getElementById('present-translation-app2').value;
        let negativeTranslationApp2 = document.getElementById('negative-translation-app2').value;
        let questionTranslationApp2 = document.getElementById('question-translation-app2').value;
        let negativeQuestionTranslationApp2 = document.getElementById('negative-question-translation-app2').value;

        feedback = {
            present: presentTranslationApp2,
            negative: negativeTranslationApp2,
            question: questionTranslationApp2,
            negativeQuestion: negativeQuestionTranslationApp2
        };
    }

    console.log('Submitting translations:', feedback); // Logging for debugging

    fetch('/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_id: currentQuestion.id, user_translation: feedback, format: format })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Received feedback:', data); // Logging for debugging

        document.getElementById('feedback').innerText = `Feedback for present: ${data.present}\nFeedback for negative: ${data.negative}\nFeedback for question: ${data.question}\nFeedback for negative question: ${data.negativeQuestion}`;
    })
    .catch(error => console.error('Error:', error));
});
