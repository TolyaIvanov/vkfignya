window.onload = function () {
	let column = document.getElementsByClassName('add-col')[0];

	column.addEventListener('click', function handler() {
		addCol(column);
		column.removeEventListener('click', handler);
	}, false);
};

addCol = (point) => {
	let container = document.getElementsByClassName('container')[0];
	let col = createCol();
	let target = point.target ? point.target : point;

	remasterButtons(target);
	container.appendChild(col);
	return col;
};

createCol = () => {
	let column = document.createElement('div');
	let columnTitle = document.createElement('p');
	let columnList = document.createElement('ul');
	let addItem = document.createElement('div');
	let addColButton = document.createElement('div');
	let addColText = document.createElement('div');

	column.setAttribute('class', 'kanban-col');
	columnTitle.setAttribute('class', 'kanban-title');
	columnList.setAttribute('class', 'kanban-list');
	addItem.setAttribute('class', 'add-col');
	addColButton.setAttribute('class', 'button');
	addColText.setAttribute('class', 'add-item-text');
	addColText.appendChild(document.createTextNode('Добавить еще одну колонку'));

	addItem.appendChild(addColButton);
	addItem.appendChild(addColText);
	addItem.addEventListener('click', function handler() {
		addCol(addItem);
		addItem.removeEventListener('click', handler);
	}, false);

	column.appendChild(columnTitle);
	column.appendChild(columnList);
	column.appendChild(addItem);

	return column;
};

remasterButtons = (target) => {
	let button = target.getElementsByClassName('button')[0];
	let textNode = target.getElementsByClassName('add-item-text')[0];
	let thisColumn = findAncestor(target, '.kanban-col');
	let title = thisColumn.getElementsByClassName('kanban-title')[0];
	let input = addInput('input');

	swapButtons('Добавить колонку', target, textNode, button, 'addingCol');

	textNode.addEventListener('click', function handler() {  // add name for col
		title.innerHTML = input.value;
		title.style.margin = input.value.length > 0 ? '10px' : 0;
		input.remove();

		swapButtons('Добавить еще одну карточку', target, textNode, button);
		event.stopPropagation();

		target.addEventListener('click', function handler() {                  // catch add card moment
			swapButtons('Добавить карточку', target, textNode, button, 'addComment', thisColumn);

			target.removeEventListener('click', handler);
		}, false);

		textNode.removeEventListener('click', handler);
	}, false);

	button.addEventListener('click', removeCol, false);

	thisColumn.insertBefore(input, thisColumn.firstChild);   // insert input
	input.focus();
};

swapButtons = (text, wrapper, textNode, button, type, column) => {
	textNode.innerHTML = text;
	button.classList.add('add-column-button');
	wrapper.style.justifyContent = (type === 'addingCol' || type === 'addComment') ? 'space-between' : 'center';
	wrapper.style.flexDirection = (type === 'addingCol' || type === 'addComment') ? 'row-reverse' : 'row';
	(type === 'addingCol' || type === 'addComment') ? wrapper.classList.add('rendering-col') : wrapper.classList.remove('rendering-col');

	if (type === undefined)
		button.removeEventListener('click', removeCol);

	if (type === 'addComment') {
		let input = addInput('textarea');

		column.insertBefore(input, wrapper);   // insert input
		input.focus();

		button.addEventListener('click', function handler() {
			input.remove();
			swapButtons('Добавить еще одну карточку', wrapper, textNode, button);
			event.stopPropagation();

			wrapper.addEventListener('click', function handler() {
				swapButtons('Добавить карточку', wrapper, textNode, button, 'addComment', findAncestor(wrapper, '.kanban-col'));

				wrapper.removeEventListener('click', handler);
			});

			button.removeEventListener('click', handler);
		});

		textNode.addEventListener('click', function handler() {
			let card = addCardItem(input);
			let list = column.getElementsByClassName('kanban-list')[0];

			list.appendChild(card);

			swapButtons('Добавить еще одну карточку', wrapper, textNode, button);

			textNode.removeEventListener('click', handler);
		})
	}
};

// addCard = (input, column) => {
//
// };

removeCol = () => {
	let column = findAncestor(event.target, '.kanban-col');

	column.remove();
	this.removeEventListener('click', removeCol);
};

addCardItem = (input) => {
	let card = document.createElement('li');

	card.innerHTML = input.value;
	card.classList.add('kanban-card');
	input.remove();

	return card;
};

addInput = (type) => {
	let input = document.createElement(`${type}`);

	type === 'input' ? input.type = 'text' : null;
	input.className = type === 'input' ? 'title-input' : 'card-input';
	input.placeholder = type === 'input' ? 'Введите название колонки' : 'Введите название карточки';

	return input;
};

function findAncestor(el, sel) {
	if (typeof el.closest === 'function') {
		return el.closest(sel) || null;
	}
	while (el) {
		if (el.matches(sel)) {
			return el;
		}
		el = el.parentElement;
	}
	return null;
}


if (!Element.prototype.matches) {
	Element.prototype.matches =
		Element.prototype.matchesSelector ||
		Element.prototype.mozMatchesSelector ||
		Element.prototype.msMatchesSelector ||
		Element.prototype.oMatchesSelector ||
		Element.prototype.webkitMatchesSelector ||
		function (s) {
			let matches = (this.document || this.ownerDocument).querySelectorAll(s),
				i = matches.length;
			while (--i >= 0 && matches.item(i) !== this) {
			}
			return i > -1;
		};
}

if (!('remove' in Element.prototype)) {
	Element.prototype.remove = function () {
		if (this.parentNode) {
			this.parentNode.removeChild(this);
		}
	};
}
