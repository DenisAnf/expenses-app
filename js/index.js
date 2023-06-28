//определение поля ввода расходов
const expensesValueNode = document.querySelector('#inputValue');

//определение поля ввода категории
const expensesCategoriesNode = document.querySelector('#inputCategories');

//определение кнопки добавить расходы
const inputAddButton = document.querySelector('#inputButton');

//определение поля вывода ошибки о незаполненных полях расходов
const inputError = document.querySelector('#inputError');

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

//задание регулярного выражения  для проверки на использование только пробелов в поле категории
const reg = /\s/g;


//! ФУНКЦИИ ------------------------------------------------

//функция-конструктор объекта расходов
function Expense (rate, category) {
	this.rate = rate;
	this.category = category;
};

//функция получения значения расхода и категории из полей
const getExpenseFromUser = () => {
	const expenseRate = expensesValueNode.value;
	const expenseCategory = expensesCategoriesNode.value;

	const expense = new Expense(expenseRate, expenseCategory);
	
	return expense;
};

//функция добавления текущих значений в массив расходов
const addExpense = (bill) => expenses.push(bill);

//функция получения массива рассходов
const getExpenses = () => expenses;

//функция вывода суммарного значения и статуса (сразу вызывается в init)
const showStatusExpenses = () => {
	const expensesBill = getExpenses();
	
	let sum = SUM_INIITIAL_VALUE;

	expensesBill.forEach(element => {
		sum += parseFloat(element.rate);
		return sum;
	});

	sumValueNode.textContent = sum.toFixed(2);
	
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
const renderExpenses = () => {
	const expensesBill = getExpenses();

	storyOutputNode.innerHTML = '';

	const expenseContainer = document.createElement('ol');
	expenseContainer.className = 'story__list';
	
	expensesBill.forEach(element => {
		const expenseElement = document.createElement('li');

		expenseElement.className = 'story__list-item';
		expenseElement.textContent = `${element.rate} руб. - ${element.category}`;
		
		expenseContainer.appendChild(expenseElement);
	});
	
	storyOutputNode.appendChild(expenseContainer);
};

//функция очистки поля ввода расходов и категории
const clearExpensesNode = () => {
	expensesValueNode.value = null;
	expensesCategoriesNode.value = null;
};

//функция проверки полей ввода
const validationInputFromUser = () => {
	const valueInput = expensesValueNode.value;
	const numberValueInput = parseFloat(valueInput);

	const categoriesInput = expensesCategoriesNode.value;
	const categoriesInputLength = categoriesInput.length;
	const categoriesInputWithoutSpace = expensesCategoriesNode.value.replace(reg, '');
	const categoriesInputLengthWithoutSpace = categoriesInputWithoutSpace.length;

	if (!valueInput || numberValueInput == 0) {
		inputError.innerText = 'Укажите расход';
		return true;
	};	

	if (numberValueInput < 0) {
		inputError.innerText = 'Значение должно быть больше 0';
		return true;
	};	

	if (!regex.test(valueInput)) {
		inputError.innerText = 'Допускается до 2 знаков после запятой';
		return true;
	};	

	if (!categoriesInput || categoriesInputLengthWithoutSpace == 0) {
		inputError.innerText = 'Укажите категорию';
		return true;
	};	

	if (categoriesInputLength > 20) {
		inputError.innerText = 'Допускается до 20 знаков в категории';
		return true;
	};	
	
	inputError.innerText = '';
	return false;
};

//итоговая функция добавления расходов по клику "Добавить"
const getExpense = () => {

	if (validationInputFromUser()) {
		return;
	};
	
	const expense = getExpenseFromUser();

	addExpense(expense);
	renderExpenses();
	clearExpensesNode();
	showStatusExpenses();
};

//функция сброса списка расходов
const clearExpenses = () => {
	expenses = [];
	renderExpenses();
	showStatusExpenses();
	storyOutputNode.textContent = TEXT_NULL_STORY;
}

//функция изменения лимита
const changeLimitValue = () => {
	const newLimit = limitNewValueNode.value;

	limitValue = parseFloat(newLimit).toFixed(2); //.toFixed(2) для отображения двух знаков после запятой
	
	if (!newLimit || limitValue == 0) {
		limitError.innerText = 'Укажите лимит';
		return
	};

	if (limitValue < 0) {
		limitError.innerText = 'Значение должно быть больше 0';
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

//функция смены фокуса с рахода на категорию по Enter
const changeFocusByEnter = (event) => {
	if (event.keyCode === 13) {
		event.preventDefault();
		expensesCategoriesNode.focus();
	};
};

//функция добавления расходов по Enter в поле категории
const submitExpense = (event) => {
	if (event.keyCode === 13) {
		event.preventDefault();
		getExpense();
		expensesValueNode.focus();
	};
};

//функция изменения лимита по Enter
const changeLimitValueByEnter = (event) => {
	if (event.keyCode === 13) {
		event.preventDefault();
		changeLimitValue();
	};
};

//функция при инициализации для значений по умолчанию (сразу вызывается)
const init = () => {
	expensesValueNode.focus();
	storyOutputNode.textContent = TEXT_NULL_STORY;
	limitValue = LIMIT_INIITIAL_VALUE;
	limitValueNode.innerText = limitValue.toFixed(2);
	showStatusExpenses();
};
init();

//функции открытия и закрытия модального окна
const openDialogLimitWindow = () => dialogLimitWindow.showModal();
const closeDialogLimitWindow = () => dialogLimitWindow.close();



//! ОБРАБОТЧИКИ --------------------------------------------

//добавление расходов
inputAddButton.addEventListener('click', getExpense);

//открытие и закрытие модального окна
limitOpenButton.addEventListener('click', openDialogLimitWindow);
limitCloseButton.addEventListener('click', closeDialogLimitWindow);

//сброс списка расходов
storyClearButton.addEventListener('click', clearExpenses);

//задание нового лимита
limitAddButton.addEventListener('click', changeLimitValue);

//задание нового лимита	по Enter
limitNewValueNode.addEventListener('keydown', changeLimitValueByEnter);

//смена фокуса с поля расходов на поле категори по Enter
expensesValueNode.addEventListener('keydown', changeFocusByEnter);

//добавление расходов по Enter в поле категории
expensesCategoriesNode.addEventListener('keydown', submitExpense);




//? Старые версии написания кода

/*showexpensesBill.forEach(element => {
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

