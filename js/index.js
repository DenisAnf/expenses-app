//определение поля ввода расходов
const expensesValueNode = document.querySelector('#inputValue');

//определение поля ввода категории
const expensesCategoriesNode = document.querySelector('#inputCategories');

//определение кнопки добавить расходы
const inputAddButton = document.querySelector('#inputButton');

//определение поля вывода ошибки о незаполненных полях расходов
const outputError = document.querySelector('#inputError');

//определение поля вывода лимита
const limitValueNode = document.querySelector('#limitValue');

//определение поля вывода суммы
const sumValueNode = document.querySelector('#sumValue');

//определение поля вывода статуса
const statusValueNode = document.querySelector('#statusOutput');

//определение кнопок открытия и закрытия модального окна
const limitOpenButton = document.querySelector('#limitOpenButton');
const limitCloseButton = document.querySelector('#limitCloseButton');

//определение тела модального окна
const dialogLimitWindow = document.querySelector('#dialogLimit');

//определение поля получения нового лимита
const limitNewValueNode = document.querySelector('#limitNewValue');

//определение кнопки задания нового лимита
const limitAddButton = document.querySelector('#limitAddButton');

//определение поля вывода ошибки о неправильно заполненном поле ввода новлого лимита
const limitError = document.querySelector('#limitNewError');

//определение кнопки сброса массива
const storyClearButton = document.querySelector('#storyButtonClear');

//определение поля вывода массива расходов
const storyOutputNode = document.querySelector('#storyOutput');

//задание лимита по умолчанию и объявление переменной лимита
const LIMIT_INIITIAL_VALUE = 10000;
let limitValue;

//задание суммы расходов по умолчанию
const SUM_INIITIAL_VALUE = 0;

//задание текста для пустого списка расходов
const TEXT_NULL_STORY = 'Пока расходов нет? Уверен?';

//задание пустого массива расходов
let expenses = [];

//задание регулярного выражения для числа с 2 знаками после запятой
const regex = /^\d+(?:[\.,]\d{1,2})?$/;




//! ФУНКЦИИ ------------------------------------------------


//функция-конструктор объекта расходов
function Expense (rate, category) {
	this.rate = rate;
	this.category = category;
};

//функция получения значения расхода и категории из полей
let getExpenseFromUser = () => {
	const expenseRate = expensesValueNode.value;
	const expenseCategory = expensesCategoriesNode.value;

	const expense = new Expense(expenseRate, expenseCategory);
	
	return expense;
};

//функция добавления текущих значений в массив расходов
let addExpense = (obj) => expenses.push(obj);

//функция получения массива рассходов
let getExpensesList = () => expenses;

//функция вывода суммарного значения и статуса (сразу вызывается в init)
let showStatusExpenses = () => {
	const expensesList = getExpensesList();
	
	let sum = SUM_INIITIAL_VALUE;

	expensesList.forEach(element => {
		sum += parseFloat(element.rate);
		return sum;
	});

	sumValueNode.textContent = sum;
	
	if (sum > limitValue) {
		const overbalance = sum - limitValue
		statusValueNode.innerText = `все плохо \n(перерасход ${overbalance.toFixed(2)} руб.)`;
		statusValueNode.classList.add('status__output-conclusion-warn');
		return;
	};

	statusValueNode.innerText = 'все хорошо';
	statusValueNode.classList.remove('status__output-conclusion-warn');
};

//функция вывода записей расходов из массива
let renderExpensesList = () => {
	const expensesList = getExpensesList();

	storyOutputNode.innerHTML = '';

	const expenseContainer = document.createElement('ol');
	expenseContainer.className = 'story__list';
	
	expensesList.forEach(element => {
		const expenseElement = document.createElement('li');

		expenseElement.className = 'story__list-item';
		expenseElement.textContent = `${element.rate} руб. - ${element.category}`;
		
		expenseContainer.appendChild(expenseElement);
	});
	
	storyOutputNode.appendChild(expenseContainer);
};

//функция очистки поля ввода расходов и категории
let clearExpensesNode = () => {
	expensesValueNode.value = null;
	expensesCategoriesNode.value = null;
};

//итоговая функция добавления расходов по клику "Добавить"
let getExpenses = () => {
	const expense = getExpenseFromUser();

	addExpense(expense);
	renderExpensesList();
	clearExpensesNode();
	showStatusExpenses();
};

//функция сброса списка расходов
let clearExpensesList = () => {
	expenses = [];
	renderExpensesList();
	showStatusExpenses();
	storyOutputNode.textContent = TEXT_NULL_STORY;
}

//функция изменения лимита
let changeLimitValue = () => {
	const newLimit = limitNewValueNode.value;

	limitValue = parseFloat(newLimit); //можно .toFixed(2) вместо проверки на регулярное выражение
	
	if (!newLimit || limitValue == 0) {
		limitError.innerText = 'Не верно задан лимит';
		return
	};	

	if (!regex.test(limitValue)) {
		limitError.innerText = 'Допускается до 2 знаков после запятой';
		return
	};	

	limitError.innerText = '';

	limitValueNode.innerText = limitValue;
	showStatusExpenses();

	limitNewValueNode.value = '';
	dialogLimitWindow.close();
};

//функция изменения лимита по Enter
let changeLimitValueByEnter = (event) => {
	if (event.keyCode === 13) {
		event.preventDefault();
		changeLimitValue();
	};
};

//функция при инициализации для значений по умолчанию (сразу вызывается)
let init = () => {
	expensesValueNode.focus();
	storyOutputNode.textContent = TEXT_NULL_STORY;
	limitValue = LIMIT_INIITIAL_VALUE;
	limitValueNode.innerText = limitValue;
	showStatusExpenses();
};
init();



//! ОБРАБОТЧИКИ --------------------------------------------

//добавление расходов
inputAddButton.addEventListener('click', getExpenses);

//открытие и закрытие модального окна
limitOpenButton.onclick = () => dialogLimitWindow.showModal();
limitCloseButton.onclick = () => dialogLimitWindow.close();

//сброс списка расходов
storyClearButton.addEventListener('click', clearExpensesList);

//задание нового лимита
limitAddButton.addEventListener('click', changeLimitValue);

//задание нового лимита	по Enter
limitNewValueNode.addEventListener('keydown', changeLimitValueByEnter);






//? Старые версии написания кода

/*showExpensesList.forEach(element => {
	showExpensesHTML += `
	<li class="story__list-item">${element.rate} руб. - ${element.category}</li>
	`;
}); 


//функция ограницения до копеек в полях ввода расходов и лимита
let formatInputLimitNode = () => {
	const newLimit = limitNewValueNode.value;

	// Разделяем значение на целую и десятичную части
	let parts = newLimit.split('.');
	let integerPart = parts[0];
	let decimalPart = parts[1];
	
	// Ограничиваем десятичную часть до двух знаков
	if (decimalPart && decimalPart.length > 2) {
		decimalPart = decimalPart.slice(0, 2);
	};

	// Обновляем значение поля ввода
	limitNewValueNode.innerText = integerPart + (decimalPart ? '.' + decimalPart : '');

};*/












/*//определение кнопок
const submitButton = document.querySelector('#buttonSubmit');
const resetButton = document.querySelector('#buttonReset');

//определение места вывода постов
const postsFeedPlace = document.querySelector('#feed');

//определение места вывода счетчиков символов и предупреждений "напиши..."
const postTitleError = document.querySelector('#inputTitleError');
const postDescriptionError = document.querySelector('#inputDescriptionError');
const postTitleLengthCounter = document.querySelector('#inputTitleLengthCounter');
const postDescriptionLengthCounter = document.querySelector('#inputDescriptionLengthCounter');

//определение места вывода собщения о превышении лимита символов
const postLengthError = document.querySelector('#error');

//указание лимитов на количество символов в посте
const TITLE_LENGTH_MAX_VALUE = 50;
const DISCRIPRION_LENGTH_MAX_VALUE = 200;

//указание текстов предупреждений
const TITLE_ERROR_TEXT = 'Напиши заголовок';
const DISCRIPRION_ERROR_TEXT = 'Напиши текст поста';

//указание пустого массива для ленты постов
let feedPosts = [];


//! ФУНКЦИИ -------------------------------------------------------

//функция получения текущей даты и времени
function getCurrentDate() {
	const date = new Date();
	
	return date.toLocaleString('ru-RU', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		}) + ' ' +
		date.toLocaleString('ru-RU', {
			hour: 'numeric',
			minute: 'numeric',
		});
}

//функция-конструктор поста
function Post(time, title, description) {
	this.time = time;
	this.title = title;
	this.description = description;
}

//функция получения поста
function getPostFromUser() {
	const timePost = getCurrentDate();
	const titlePost = postTitleNode.value;
	const descriptionPost = postDescriptionNode.value;

	const post = new Post(timePost, titlePost, descriptionPost);

	return post;
}

//функция добавления поста в массив
function addPost(post) {
	feedPosts.push(post);
}

//функция получения массива постов
function getPostsFeed() {
	return feedPosts;
}

//функция показа ленты постов из массива
function renderPosts() {
	const showPostsFeed = getPostsFeed();

	let showPostsHTML = '';

	for (let i = 0; i < showPostsFeed.length; i++) {
		showPostsHTML += `
		<div class="post">
			<p class="post__date">${showPostsFeed[i].time}</p> 
			<h3 class="post__title">${showPostsFeed[i].title}</h3>
			<p class="post__description">${showPostsFeed[i].description}</p>
		</div>
		`;
	}

	postsFeedPlace.innerHTML = showPostsHTML;
}

//функция очистки полей
function clearPost() {
	postTitleNode.value = null;
	postDescriptionNode.value = null;
	postTitleLengthCounter.innerText = null;
	postDescriptionLengthCounter.innerText = null;
	postLengthError.innerText = null;
	disabledSubmitButton();
	postTitleError.innerText = '';
	postDescriptionError.innerText = '';
}

//функция выключения кнопки отправить
function disabledSubmitButton() {
	submitButton.disabled = true;
	submitButton.classList.add('button__disabled');
}

//функция включения кнопки отправить
function unDisabledSubmitButton() {
	submitButton.disabled = false;
	submitButton.classList.remove('button__disabled');
}

//функции вывода счетчиков символов
function showPostTitleLengthCounter() {
	postTitleLengthCounter.innerText = `${postTitleNode.value.length} / ${TITLE_LENGTH_MAX_VALUE}`;
}

function showPostDescriptionLengthCounter() {
	postDescriptionLengthCounter.innerText = `${postDescriptionNode.value.length} / ${DISCRIPRION_LENGTH_MAX_VALUE}`;
}

//функция проверки пустого поста (сразу вызывается, чтобы по умолчанию заблокировать кнопку)
function checkLengthNull() {
	const titleLength = postTitleNode.value.length;
	const descriptionLength = postDescriptionNode.value.length;

	if (titleLength === 0 || descriptionLength === 0) {
		disabledSubmitButton();
		postTitleNode.focus(); //фокус на поле заголовка при старте
		return;
	}
	unDisabledSubmitButton();
};
checkLengthNull();

//функция проверки количества символов на превышение лимита
function validation() {
	const titleLength = postTitleNode.value.length;
	const descriptionLength = postDescriptionNode.value.length;

	//константы для проверки на использование только пробелов
	const reg = /\s/g;
	const titleWithoutSpace = postTitleNode.value.replace(reg, '');
	const titleLengthWithoutSpace = titleWithoutSpace.length;
	const descriptionWithoutSpace = postDescriptionNode.value.replace(reg, '');
	const descriptionLengthWithoutSpace = descriptionWithoutSpace.length;

	//часть проверки на превышение лимита заголовка поста
	if (titleLength > TITLE_LENGTH_MAX_VALUE) {
		disabledSubmitButton();
		////postTitleLengthCounter.classList.add('input__title-length_error');
		postLengthError.innerText = `Длина заголовка не должна превышать ${TITLE_LENGTH_MAX_VALUE} символов`;
		return;
	};

	//часть проверки на превышение лимита текста поста
	if (descriptionLength > DISCRIPRION_LENGTH_MAX_VALUE) {
		disabledSubmitButton();
		////postDescriptionLengthCounter.classList.add('input__description-length_error');
		postLengthError.innerText = `Длина поста не должна превышать ${DISCRIPRION_LENGTH_MAX_VALUE} символов`;
		return;
	};

	postLengthError.innerText = null;

	if (titleLength === 0 || titleLengthWithoutSpace === 0) {
		postTitleError.innerText = TITLE_ERROR_TEXT;
		disabledSubmitButton();
		return;
	}
	
	postTitleError.innerText = '';

	if (descriptionLength === 0 || descriptionLengthWithoutSpace === 0) {
		postDescriptionError.innerText = DISCRIPRION_ERROR_TEXT;
		disabledSubmitButton();
		return;
	}
	
	postDescriptionError.innerText = '';

	//включение кнопки если все условия пройдены
	unDisabledSubmitButton();
	////postTitleLengthCounter.classList.remove('input__title-length_error');
	////postDescriptionLengthCounter.classList.remove('input__description-length_error');
}

//итоговая функция добавления поста
function getPost() {
	//основное тело функции добавления поста
	const postFromUser = getPostFromUser();

	addPost(postFromUser)
	renderPosts();
	clearPost();

	//отключение кнопки после добавления поста
	disabledSubmitButton();
};

//функция смены фокуса по Enter
function transitionFocusByEnter(event) {
	if (event.keyCode === 13) {
		event.preventDefault();

		const inputs = document.querySelectorAll("input, textarea, button");

		let inputsElement = Array.from(inputs).filter(function(element) {
			return element.getAttribute("tabindex") !== null;
		});
		let currentInput = event.target;
		let currentIndex = inputsElement.findIndex(function(element) {
			return element === currentInput;
		});

		let nextIndex = ++currentIndex;
		if (nextIndex < inputsElement.length) {
			inputsElement[nextIndex].focus();
		}
  }
};

//функция отправки по Enter (обходит валидацию)
/*function renderByEnter(event) {
	if (event.keyCode === 13) {
		event.preventDefault();

		getPost();
  }
};



//! ОБРАБОТЧИКИ ---------------------------------------------------

//Обработка кнопки добавления поста
submitButton.addEventListener('click', getPost);

//Обработка кнопки очистки полей поста
resetButton.addEventListener('click', clearPost);

//Вывод счетчиков сиволов
postTitleNode.addEventListener('input', showPostTitleLengthCounter);
postDescriptionNode.addEventListener('input', showPostDescriptionLengthCounter);

//Вывод предупреждения о длине поста + запрет на отправку слишком длинного и пустого поста
postTitleNode.addEventListener('input', validation);
postDescriptionNode.addEventListener('input', validation);

//Переход по Enter с заголовка на поле теста поста
postTitleNode.addEventListener("keydown", transitionFocusByEnter);
////postDescriptionNode.addEventListener("keydown", renderByEnter);*/