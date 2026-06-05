console.log("JavaScript успешно подключен! 🚀");

let sessionCards = [];
let currentCardIndex = 0;
const questionRpt = document.getElementById('questionRpt')
const answerRpt = document.getElementById('answerRpt')
const answerLk = document.getElementById('answerLk')
const questionLk = document.getElementById('questionLk')
const nextCardBtnRpt = document.getElementById('nextCardBtnRpt')
const startRpt = document.getElementById('startRpt')
const startLk = document.getElementById('startLk')

// ID aviable check function
function checkId() {
    return sessionStorage.getItem('userId');
}

// page jump function
function navigateTo(url){
        if (checkId()) {
            window.location.href = url;
        } else {
            alert("Укажите свой ID")
        }
    }

function displayCurrantCard(cards, index) {
    const card = cards[index]
    if (card) {
        if (questionLk) {
            questionLk.textContent = card.question
            answerLk.textContent = "Здесь появится ответ"
        } 
        if (questionRpt) {
            questionRpt.textContent = card.question
            answerRpt.textContent = "Здесь появится ответ"
        }
    } else {
        alert("Карточки закончились или отсутствуют! 🎉")
    }
}


document.addEventListener('DOMContentLoaded', () =>{
    const loginBtn = document.getElementById('login-button');
    const inputId = document.getElementById('user-id-input');
    const saveBtnAdd = document.getElementById('saveBtnAdd');

    const nextCardBtnRpt = document.getElementById('nextCardBtnRpt');
    const showAnswerRpt = document.getElementById('showAnswerRpt');
    
    const nextCardBtnLk = document.getElementById('nextCardBtnLk');
    const showAnswerLk = document.getElementById('showAnswerLk');

//identification
    if (loginBtn&&inputId) {
        console.log("Мы на главной странице");
        const savedId = sessionStorage.getItem('userId')
            if (savedId) {
                inputId.placeholder = `Ваш ID: ${savedId}`
            };
        loginBtn.addEventListener('click', () =>{
            const idValue = inputId.value;
            if (idValue) {
                sessionStorage.setItem('userId', idValue);
                alert("ID saved: " + idValue);
                window.location.reload()
            }
        });
    }
    
// Creating a new card
    if (saveBtnAdd) {
        console.log("Мы на странице Добавить карточку")
        saveBtnAdd.addEventListener('click', async () => {
            const answer = document.getElementById("answer");
            const question = document.getElementById("question");
            if (answer&&question)  {
                const ID = sessionStorage.getItem('userId')      
                if (ID) {
                    try {
                        const response = await fetch(`/${ID}/cards`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8'
                            },
                            body: JSON.stringify(
                                {'question': question.value, 
                                'answer': answer.value}
                            )
                        });
                        if (response.ok) {
                            const result = await response.json();
                            console.log("Card saved", result);
                            alert("Карточка успешно добавлена")
                            answer.value = ""
                            question.value = ""
                        }
                    } catch (error) {
                        console.error("Card not saved");
                    }
                } else {
                    alert("Укажите свой ID")
                }
            } else {
                alert("Поля вопрос и ответ должны быть заполнены")
            }
        });
    }   

    // repeat page
    if (startRpt) {
        console.log("Мы на странице Повторить карточки")
        currentCardIndex = 0
        startRpt.addEventListener('click', async () => {
            const ID = sessionStorage.getItem('userId')
            if (ID) {
                try {
                const response = await fetch(`/${ID}/cards`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    }
                });
                console.log(response);
                if (response.ok) {
                    sessionCards = await response.json();
                    displayCurrantCard(sessionCards, currentCardIndex);
                }
                } catch (error) {
                    console.error("Cards not found")
                }

            } else {
                alert("Укажите свой ID")
            }
        });
    }
    if (nextCardBtnRpt) {
    nextCardBtnRpt.addEventListener('click', async () => {
        if (currentCardIndex + 1 >= sessionCards.length) {
            alert("Это была последняя карточка для повторения!");
            return;
        }
        const mark = document.querySelector('input[name="mark"]:checked').id
        const ID = sessionStorage.getItem('userId')
        try {
            const responseMark = await fetch(`/${ID}/cards/${sessionCards[currentCardIndex].index_card}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(
                    {'Score': mark, 
                })
            });
            if (responseMark.ok) {
                document.getElementById('4').checked = true
                ++currentCardIndex;
                displayCurrantCard(sessionCards, currentCardIndex);
            }
        } catch (error) {
            console.error("Mark not sended")
            }
    });
    }
    if (showAnswerRpt) {
        showAnswerRpt.addEventListener('click', () => {
            console.log(sessionCards[currentCardIndex])
            answerRpt.textContent = sessionCards[currentCardIndex].answer
        })
    }
// lookAll page
    if (startLk) {
        console.log("Мы на странице Посмотреть все карточки")
        currentCardIndex = 0;
        startLk.addEventListener('click', async () => {
            const ID = sessionStorage.getItem('userId')
            if (ID) {
                try {
                const response = await fetch(`/${ID}/all_cards`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    }
                });
                console.log(response);
                if (response.ok) {
                    sessionCards = await response.json();
                    displayCurrantCard(sessionCards, currentCardIndex);
                    console.log(currentCardIndex)
                }
                } catch (error) {
                    console.error("Cards not found")
                }

            } else {
                alert("Укажите свой ID")
            }
        });
    }
    if (nextCardBtnLk) {

        nextCardBtnLk.addEventListener('click', () => {
            if (currentCardIndex + 1 >= sessionCards.length) {
                alert("Это была последняя карточка для повторения!");
                return;
            }
            const ID = sessionStorage.getItem('userId')
            if (ID) {
                    ++currentCardIndex;
                    displayCurrantCard(sessionCards, currentCardIndex);
                }
            }
        );   
    }
    
    if (showAnswerLk) {
        showAnswerLk.addEventListener('click', () => {
            console.log(sessionCards[currentCardIndex])
            answerLk.textContent = sessionCards[currentCardIndex].answer
        })
    }
                

        const cardsBody = document.getElementById('cards-body');

        if (cardsBody) {
            console.log("We in the looks cards page");
            const userId = sessionStorage.getItem('userId');

            if (userId) {   
                console.log("Load data for user: ", userId);
            } else {
                alert("userId not found. Come back to main page.")
            }
        }
    });