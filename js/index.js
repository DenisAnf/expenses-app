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

//функция проверки полей ввода
let validationInputFromUser = () => {
	const valueInput = expensesValueNode.value;
	const numberValueInput = parseFloat(valueInput);

	const categoriesInput = expensesCategoriesNode.value;
	const categoriesInputLength = categoriesInput.length;
	const categoriesInputWithoutSpace = expensesCategoriesNode.value.replace(reg, '');
	const categoriesInputLengthWithoutSpace = categoriesInputWithoutSpace.length;

	if (!valueInput || numberValueInput == 0) {
		inputError.innerText = 'Не верно задан расход';
		return true;
	};	

	if (!regex.test(valueInput)) {
		inputError.innerText = 'Допускается до 2 знаков после запятой';
		return true;
	};	

	if (!categoriesInput || categoriesInputLengthWithoutSpace == 0) {
		inputError.innerText = 'Не задана категория';
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
let getExpenses = () => {

	if (validationInputFromUser()) {
		return;
	};
	
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

//функция смены фокуса с рахода на категорию по Enter
let changeFocusByEnter = (event) => {
	if (event.keyCode === 13) {
		event.preventDefault();
		expensesCategoriesNode.focus();
	};
};

//функция добавления расходов по Enter в поле категории
let submitExpense = (event) => {
	if (event.keyCode === 13) {
		event.preventDefault();
		getExpenses();
		expensesValueNode.focus();
	};
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

//смена фокуса с поля расходов на поле категори по Enter
expensesValueNode.addEventListener('keydown', changeFocusByEnter);

//добавление расходов по Enter в поле категории
expensesCategoriesNode.addEventListener('keydown', submitExpense);




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

