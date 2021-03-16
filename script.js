"use strict"

let root = document.getElementById("root");
let gameBlock = document.getElementById("gameBlock");
let userNumber = "";
let randNumber = "";
let step = 0;
let stepMax = 3;


function createRandNum() {
	let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	let randNum = "";

	for (let i = 0; i < 4; i++) {
		//		получаем случайный число равное длине массива
		let randInd = Math.floor(Math.random() * arr.length)

		randNum += String(arr[randInd]);

		arr.splice(randInd, 1)
	}

	return randNum;
}


function createElement(tag, class_, text = "", id = "", attr = {}) {
	let el = document.createElement(tag);

	if (class_)
		el.classList.add(class_);

	for (let key in attr) {
		el.setAttribute(key, attr[key])
	}

	el.id = id;
	el.innerHTML = text;
	return el;
}


function slowDown(elem, height, delay) {
	let indent, top;

	indent = -height;
	top = ++indent + "px";
	elem.style.position = "relative";
	elem.style.top = top;
	window.scrollBy(0, 1);

	let down = setInterval(function () {
		if (indent == 0) {
			clearInterval(down);
		} else {
			let top = ++indent + "px";
			elem.style.top = top;
			window.scrollBy(0, 1);
		}
	}, delay / height - 1);
}


function upHideElement(elem) {
	elem.disabled = true;
	elem.classList.add("fade--out");

	let elemHeight = elem.scrollHeight;
	let iter = 0;

	let hide = setInterval(function () {
		if (elemHeight == 0) {
			elem.parentNode.removeChild(elem);
			clearInterval(hide);
		} else {
			let hpx = --elemHeight + "px";
			elem.style.height = hpx;
			elem.style.transform = "translate(0, " + iter + "px)";
			iter--;
		}
	}, 1000 / elem.scrollHeight, true)
}


function checkForFourNumbers(num) {
	for (let i = 0; i < num.length; i++) {
		for (let j = i + 1; j < num.length; j++)
			if (num[i] === num[j])
				return false;
	}
	
	return true;
}


function checkNumbers(num1, num2) {
	let str = "";
	let bull = 0;
	let cow = 0;

	for (let i = 0; i < num1.length; i++) {
		if (num1[i] === num2[i]) {
			bull++;
		} else {
			for (let j = 0; j < num2; j++) {
				if (num1[i] === num2[j])
					cow++;
			}
		}
	}
	
	if (!bull && !cow) 
		return "Ничего!";

	if (bull) {
		if (bull == 1)
			str = bull + " бык";
		else str = bull + " быка";

		if (cow)
			if (cow == 1)
				str += " - " + cow + " коровa";
			else str += " - " + cow + " коровы";
	} else {
		if (cow == 1)
			str += cow + " коровa";
		else str += cow + " коровы";
	}

	return str;
}


function isEndGame(res) {
	if (step === stepMax) {
		alert("Вы проиграли");
		return true;
	} 
	
	if (res === "4 быка") {
		alert("Вы выиграли");
		return true;
	} 
	
	return false;
}


function documentListener(e) {
	if (e.key >= 0 && e.key <= 9) {
		if (userNumber.length < 4) {
			userNumber += e.key
			input.value = userNumber;
		}
	}

	if (e.key == "Backspace") {
		userNumber = userNumber.slice(0, userNumber.length - 1)
		input.value = userNumber;
	}

	if (e.key == "Enter") {

		if (userNumber.length < 4) {
			alert("Только четырёхзначные числа");
			return;
		}
		
		if (!checkForFourNumbers(userNumber)){
			alert("Цифры не должны повторятся");
			return;
		}
		
	 	let response = checkNumbers(randNumber, userNumber);
		
		let list = document.querySelector("ol")
		let newli;
		setTimeout(() => {
			newli = createElement("li", "fade--in");
			newli.innerHTML = userNumber;
			userNumber = "";
			
			let span = document.createElement("span");
			span.innerHTML = response;
			span.style.paddingLeft = "50px";
			newli.appendChild(span);
			
			list.appendChild(newli);
			slowDown(input, newli.scrollHeight, 500);
			
			step++;
		
			if (isEndGame(response)) {
				if (confirm("Ещё разок?")) {
					input.removeEventListener("click", documentListener);
					restart();
					return;
				}
			}
		}, 500);

		input.value = "";
	}
}


function restart() {
	userNumber = "";
	randNumber = "";
	gameBlock.innerHTML = "";
	step = 0;
	start()
}


function start() {
	let btn = document.querySelector(".btn--start");
	// Если первый запуск скрываем кнопку
	if (btn)
		upHideElement(btn);

	// Загадываем число
	randNumber = createRandNum();
	console.log(randNumber);
	let p = createElement("p", "fade--in", "Я загадал число, теперь попробуй отгадать.");
	gameBlock.appendChild(p);

	//	создаём список ответов пользователя
	let list = createElement("ol", "fade--in");
	gameBlock.appendChild(list);

	//	добавляем поле ввода
	let input;
	setTimeout(() => {
		input = createElement("input",
			"fade--in",
			"",
			"input", {
				type: "text",
				maxlength: 4,
				disabled: true,
			});

		document.addEventListener("keydown", documentListener);

		gameBlock.appendChild(input);
	}, 1000);
}


function main() {
	let btnStart = createElement("button", "btn--start", "Готов(а) начать?");
	gameBlock.append(btnStart);

	btnStart.addEventListener("click", start)
}

main();
