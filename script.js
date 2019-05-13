window.onload = function () {
	let column = document.getElementsByClassName('kanban-col')[0];
	let addingColumnButton = document.getElementsByClassName('add-col')[0];
	let deleteColumn = document.getElementsByClassName('close-column')[0];

	addingColumnButton.addEventListener('click', function handler() {
		addCol(addingColumnButton);

		addingColumnButton.removeEventListener('click', handler);
	}, false);

	deleteColumn.addEventListener('click', function handler() {
		column.remove();

		deleteColumn.removeEventListener('click', handler);
	})
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
	let columnHeader = document.createElement('div');
	let columnTitle = document.createElement('p');
	let deleteColumn = document.createElement('div');
	let columnList = document.createElement('ul');
	let addColumn = document.createElement('div');
	let addColButton = document.createElement('div');
	let addColText = document.createElement('div');

	column.setAttribute('class', 'kanban-col');
	columnHeader.setAttribute('class', 'kanban-header');
	columnTitle.setAttribute('class', 'kanban-title');
	deleteColumn.setAttribute('class', 'close-column');
	columnList.setAttribute('class', 'kanban-list');
	addColumn.setAttribute('class', 'add-col');
	addColButton.setAttribute('class', 'button');
	addColText.setAttribute('class', 'add-item-text');
	addColText.appendChild(document.createTextNode('Добавить еще одну колонку'));

	addColumn.appendChild(addColButton);
	addColumn.appendChild(addColText);

	addColumn.addEventListener('click', function handler() {
		addCol(addColumn);
		addColumn.removeEventListener('click', handler);
	}, false);

	deleteColumn.addEventListener('click', function handler() {
		column.remove();

		deleteColumn.removeEventListener('click', handler);
	}, false);

	columnHeader.appendChild(columnTitle);
	columnHeader.appendChild(deleteColumn);
	column.appendChild(columnHeader);
	column.appendChild(columnList);
	column.appendChild(addColumn);

	return column;
};

remasterButtons = (target) => {
	let button = target.getElementsByClassName('button')[0];
	let textNode = target.getElementsByClassName('add-item-text')[0];
	let thisColumn = findAncestor(target, '.kanban-col');
	let title = thisColumn.getElementsByClassName('kanban-title')[0];
	let input = addInput('input');
	let deleteColumn = thisColumn.getElementsByClassName('close-column')[0];

	swapButtons('Добавить колонку', target, textNode, button, 'addingCol');

	input.addEventListener('keydown', pasteInputOnEnter, false);

	textNode.addEventListener('click', function handler() {  // add name for col
		title.innerHTML = input.value.replace(/<[^>]+>/g, '');
		title.style.margin = input.value.length > 0 ? '10px' : 0;
		deleteColumn.style.display = 'block';

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
		let textareaSizer = hiddenDivForTextarea();

		column.insertBefore(input, wrapper);   // insert input
		column.insertBefore(textareaSizer, wrapper);   // insert input
		input.focus();

		input.addEventListener('keydown', pasteInputOnEnter, false);
		input.addEventListener('input', resizeTextarea, false);   // resize textarea
		button.addEventListener('click', backForAdding, false);                // cancel add comment
		textNode.addEventListener('click', prepareForNewCard, false)           // add comment button
	}
};

prepareForNewCard = () => {
	let textNode = event.target;
	let wrapper = findAncestor(textNode, '.add-col');
	let column = findAncestor(textNode, '.kanban-col');
	let button = column.getElementsByClassName('button')[0];
	let input = column.getElementsByClassName('card-input')[0];
	let card = input.value.trim().length > 0 && addCardItem(input);
	let list = column.getElementsByClassName('kanban-list')[0];
	let textareaSizer = column.getElementsByClassName('textarea-hidden-div')[0];

	card ? list.appendChild(card) : input.remove();
	textareaSizer && textareaSizer.remove();

	swapButtons('Добавить еще одну карточку', wrapper, textNode, button);
	event.stopPropagation();

	addCardListener(wrapper, textNode, button);

	button.removeEventListener('click', backForAdding);
	textNode.removeEventListener('click', prepareForNewCard);
};

backForAdding = () => {
	let button = event.target;
	let column = findAncestor(button, '.kanban-col');
	let textNode = column.getElementsByClassName('add-item-text')[0];
	let wrapper = findAncestor(textNode, '.add-col');
	let input = column.getElementsByClassName('card-input')[0];
	let textareaSizer = column.getElementsByClassName('textarea-hidden-div')[0];

	input.remove();
	textareaSizer.remove();
	swapButtons('Добавить еще одну карточку', wrapper, textNode, button);
	event.stopPropagation();

	addCardListener(wrapper, textNode, button);

	button.removeEventListener('click', backForAdding);
	textNode.removeEventListener('click', prepareForNewCard);
};

pasteInputOnEnter = (event) => {
	let column = findAncestor(event.target, '.kanban-col');
	let submit = column.getElementsByClassName('add-item-text')[0];

	if ((event.which === 13 || event.keyCode === 13) && !event.shiftKey) {
		submit.click();
	}

	removeEventListener('keydown', pasteInputOnEnter);
};

addCardListener = (wrapper, textNode, button) => {
	wrapper.addEventListener('click', function handler() {
		swapButtons('Добавить карточку', wrapper, textNode, button, 'addComment', findAncestor(wrapper, '.kanban-col'));

		wrapper.removeEventListener('click', handler);
	});
};

removeCol = () => {
	let column = findAncestor(event.target, '.kanban-col');

	column.remove();
	this.removeEventListener('click', removeCol);
};

addCardItem = (input) => {
	let card = document.createElement('li');
	let deleteCard = document.createElement('span');
	let content = document.createElement('div');

	content.setAttribute('class', 'card-content');
	deleteCard.setAttribute('class', 'card-close');
	content.innerHTML = input.value.replace(/<[^>]+>/g, '').trim().replace(/(\r\n|\r|\n)+/g, '$1').replace(/\n/g, '<br />');
	card.classList.add('kanban-card');
	card.appendChild(content);
	card.appendChild(deleteCard);
	input.remove();

	deleteCard.addEventListener('click', function handler() {
		findAncestor(content, '.kanban-card').remove();

		deleteCard.removeEventListener('click', handler);
	});

	return card;
};

addInput = (type) => {
	let input = document.createElement(`${type}`);

	type === 'input' ? input.type = 'text' : null;
	input.className = type === 'input' ? 'title-input' : 'card-input';
	input.placeholder = type === 'input' ? 'Введите название колонки' : 'Введите название карточки';

	return input;
};

hiddenDivForTextarea = () => {
	let hiddenDiv = document.createElement('div');

	hiddenDiv.setAttribute('class', 'textarea-hidden-div');

	return hiddenDiv;
};

resizeTextarea = () => {
	let column = findAncestor(event.target, '.kanban-col');
	let input = column.getElementsByClassName('card-input')[0];
	let textareaResizer = column.getElementsByClassName('textarea-hidden-div')[0];
	let splittedValue = input.value.replace(/[<>]/g, '_').split("\n");
	let text = '';
	let maxHeight = 210;

	splittedValue.map(function (s) {
		text = text + '<div>' + s.replace(/\s\s/g, ' &nbsp;') + '&nbsp;</div>' + "\n";
	});

	textareaResizer.innerHTML = text; // zalupa s size
	if (splittedValue.length > 3) {
		input.style.height = Math.min(textareaResizer.clientHeight + 5, maxHeight) + 'px';
	} else {
		input.style.height = '80px';
	}

	if (input.clientHeight === 210) {
		input.style.overflow = 'auto';
	} else {
		input.style.overflow = 'hidden';
	}
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
