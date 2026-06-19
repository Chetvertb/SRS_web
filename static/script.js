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
    return localStorage.getItem('userId');
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
    const promoPage = document.getElementById('promo-page');
    const mainAppPage = document.getElementById('main-app-page');
    const guestNav = document.getElementById('guest-nav');
    const userNav = document.getElementById('user-nav');
    const welcomeText = document.getElementById('welcome-texr');
    const LogoutButton = document.getElementById('logout-button');

    const modal = document.getElementById('authModal');
    const authForm = document.getElementById('auth-form');
    const usernameInput = document.getElementById('username-input');
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const submitBtn = document.getElementById('submit-auth-btn');
    const authError = document.getElementById('auth-error');

    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');

    const navLoginBtn = document.getElementById('nav-login-btn');
    const navRegisterBtn = document.getElementById('nav-register-btn');
    const closeModalBtn = document.getElementById('closeModalBtn');

    let authMode = 'login';

    function checkAuth() {
        const savedUserId = localStorage.getItem('userId');
        const savedUsername = localStorage.getItem('username');

        if (savedUserId && mainAppPage && promoPage) {
            if (modal) modal.classList.add('hidden');
            promoPage.classList.add('hidden');
            mainAppPage.classList.remove('hidden');
            if (guestNav) guestNav.classList.add('hidden');
            if (userNav) userNav.classList.remove('hidden');
            if (welcomeText) welcomeText.innerText = `Добро пожаловать, ${savedUsername}!`;
        } else if (promoPage && mainAppPage) {
            promoPage.classList.remove('hidden');
            mainAppPage.classList.add('hidden');
            if (guestNav) guestNav.classList.remove('hidden');
            if (userNav) userNav.classList.add('hidden');
        }
    }

    function openModal(mode = 'login') {
        if (!modal) return;
        modal.classList.remove('hidden');
        if (modal == 'register' && tabRegister) {
            tabRegister.click();
        } else if (tabLogin) {
            tabLogin.click();
        }
    }

    if (navLoginBtn) navLoginBtn.addEventListener('click', () => openModal('login'));
    if (navRegisterBtn) navRegisterBtn.addEventListener('click', () => openModal('register'));
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target == modal) modal.classList.add('hidden');
        });
    }

    if (tabRegister && tabLogin && emailInput && submitBtn) {
        tabRegister.addEventListener('click', () => {
            authMode = 'register';
            emailInput.classList.remove('hidden');
            emailInput.required = true;
            submitBtn.innerText = 'Зарегистрироваться';
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            authError.innerText = '';
        });

        tabLogin.addEventListener('click', () => {
            authMode = 'login';
            emailInput.classList.add('hidden');
            emailInput.required = false;
            submitBtn.innerText = 'Войти';
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            authError.innerText = '';

        });
    }
    if (authForm) {
        authForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            authError.innerText = '';

            let url = '/login';
            let bodyData = { username: usernameInput.value, password: passwordInput.value};

            if (authMode == 'register') {
                url = '/registration';
                bodyData.usermail = emailInput.value;
            }

            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {"Content-Type": 'application/json'},
                    body: JSON.stringify(bodyData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Ошибка авторизации');
                }

                if (authMode == 'login') {
                    const result = await response.json()
                    localStorage.setItem('userId', result.user_id);
                    localStorage.setItem('username', result.username);
                    checkAuth();
                } else {
                    alert('Регистрация прошла успешно! Теперь войдите в аккаунт.')
                    tabLogin.click();
                }
            } catch (error) {
                authError.innerText = error.message;
            }
        });
    }
    
    if (LogoutButton) {
        LogoutButton.addEventListener('click', () => {
            localStorage.clear();
            checkAuth();
        });
    }

    checkAuth();
    const saveBtnAdd = document.getElementById('saveBtnAdd');

    const nextCardBtnRpt = document.getElementById('nextCardBtnRpt');
    const showAnswerRpt = document.getElementById('showAnswerRpt');
    
    const nextCardBtnLk = document.getElementById('nextCardBtnLk');
    const showAnswerLk = document.getElementById('showAnswerLk');

    
// Creating a new card
    if (saveBtnAdd) {
        console.log("Мы на странице Добавить карточку")
        saveBtnAdd.addEventListener('click', async () => {
            const answer = document.getElementById("answer");
            const question = document.getElementById("question");
            if (answer&&question)  {
                const ID = localStorage.getItem('userId')      
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
            const ID = localStorage.getItem('userId')
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
        const ID = localStorage.getItem('userId')
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
            const ID = localStorage.getItem('userId')
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
            const ID = localStorage.getItem('userId')
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
            const userId = localStorage.getItem('userId');

            if (userId) {   
                console.log("Load data for user: ", userId);
            } else {
                alert("userId not found. Come back to main page.")
            }
        }
    });