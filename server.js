const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const translations = {
    application1: {
        present: 'मैं {action} रहा हूँ',
        negative: 'मैं {action} नहीं रहा हूँ',
        question: 'क्या मैं {action} रहा हूँ?',
        negativeQuestion: 'क्या मैं {action} नहीं रहा हूँ?'
    },
    application2: {
        present: 'मैंने {action} किया है',
        negative: 'मैंने {action} नहीं किया है',
        question: 'क्या मैंने {action} किया है?',
        negativeQuestion: 'क्या मैंने {action} नहीं किया है?'
    }
};

const doerMapping = {
    I: {
        मैं: 'मैं',
        am: 'रहा हूँ',
        have: 'किया है',
        not: 'नहीं'
    },
    You: {
        मैं: 'तुम',
        am: 'रहे हो',
        have: 'किया है',
        not: 'नहीं'
    },
    He: {
        मैं: 'वह',
        am: 'रहा है',
        have: 'किया है',
        not: 'नहीं'
    },
    She: {
        मैं: 'वह',
        am: 'रही है',
        have: 'किया है',
        not: 'नहीं'
    },
    We: {
        मैं: 'हम',
        am: 'रहे हैं',
        have: 'किया है',
        not: 'नहीं'
    },
    They: {
        मैं: 'वे',
        am: 'रहे हैं',
        have: 'किया है',
        not: 'नहीं'
    }
};

app.post('/generate-question', (req, res) => {
    const { action, doer, application } = req.body;

    if (!action || !doer || !application) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    const doerTranslation = doerMapping[doer];
    const formatTranslations = translations[application];

    if (!doerTranslation || !formatTranslations) {
        return res.status(400).json({ error: 'Invalid doer or application' });
    }

    const presentHindi = formatTranslations.present.replace('{action}', action).replace('मैं', doerTranslation['मैं']).replace('रहा हूँ', doerTranslation['am']);
    const negativeHindi = formatTranslations.negative.replace('{action}', action).replace('मैं', doerTranslation['मैं']).replace('नहीं', doerTranslation['not']).replace('रहा हूँ', doerTranslation['am']);
    const questionHindi = formatTranslations.question.replace('{action}', action).replace('मैं', doerTranslation['मैं']).replace('रहा हूँ', doerTranslation['am']);
    const negativeQuestionHindi = formatTranslations.negativeQuestion.replace('{action}', action).replace('मैं', doerTranslation['मैं']).replace('नहीं', doerTranslation['not']).replace('रहा हूँ', doerTranslation['am']);

    res.json({
        presentHindi,
        negativeHindi,
        questionHindi,
        negativeQuestionHindi
    });
});

app.post('/translate', (req, res) => {
    const { user_translation, format, application, action } = req.body;

    const correctTranslationTemplate = translations[application][format];
    if (!correctTranslationTemplate) {
        return res.status(400).json({ error: 'Invalid format or application' });
    }

    const correctTranslation = correctTranslationTemplate.replace('{action}', action);
    const userTranslation = user_translation.trim();

    const isCorrect = userTranslation === correctTranslation;
    const feedback = isCorrect ? 'Correct!' : `Incorrect. The correct translation is: ${correctTranslation}`;

    res.json({ feedback });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
