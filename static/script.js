console.log("JavaScript успешно подключен! 🚀");

const saveBtn = document.getElementById('save-btn');

if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
        console.log("Кнопка нажата, отправляю  запрос...");
        const questionValue = document.getElementById('question').value;
        const answerValue = document.getElementById('answer').value;
        const deckId = document.getElementById('deck-id').value;

        // Данные должны соответствовать вашей модели CardBase
        const cardData = {
            question: questionValue,
            answer: answerValue
        };

        // Мы используем id = 2 для теста (файл 2.json)

        try {
            const response = await fetch(`/${deckId}/cards`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cardData)
            });

            console.log("Статус ответа", response.status);
            const result = await response.json();
            console.log("Тело ответа", result);

            if (response.ok) {
                alert('Карточка добавлена в 2.json! ✅');
                document.getElementById('question').value = '';
                document.getElementById('answer').value = '';
            } else {
                alert('Сервер вернул ошибку ❌');
            }
        } catch (error) {
            console.error('Ошибка при отправке:', error);
        }
    });
}