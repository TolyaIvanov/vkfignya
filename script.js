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
});

const addCol = (point) => {
	let container = document.getElementsByClassName('container')[0];
	let col = createCol();
	let target = point.target ? point.target : point;

	remasterButtons(target);
	container.appendChild(col);

	return col;
};

const createCol = () => {
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

const remasterButtons = (target) => {
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

const swapButtons = (text, wrapper, textNode, button, type, column) => {
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

const prepareForNewCard = () => {
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
	addCardListener(wrapper, textNode, button);
	event.stopPropagation();

	button.removeEventListener('click', backForAdding);
	textNode.removeEventListener('click', prepareForNewCard);
};

const backForAdding = () => {
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

const pasteInputOnEnter = (event) => {
	let column = findAncestor(event.target, '.kanban-col');
	let submit = column.getElementsByClassName('add-item-text')[0];

	if ((event.which === 13 || event.keyCode === 13) && !event.shiftKey) {
		submit.click();
	}

	removeEventListener('keydown', pasteInputOnEnter);
};

const addCardListener = (wrapper, textNode, button) => {
	wrapper.addEventListener('click', function handler() {
		swapButtons('Добавить карточку', wrapper, textNode, button, 'addComment', findAncestor(wrapper, '.kanban-col'));

		wrapper.removeEventListener('click', handler);
	});
};

const removeCol = () => {
	let column = findAncestor(event.target, '.kanban-col');

	column.remove();
	this.removeEventListener('click', removeCol);
};

const addCardItem = (input) => {
	let card = document.createElement('li');
	let removeCardButton = document.createElement('span');
	let content = document.createElement('div');

	content.setAttribute('class', 'card-content');
	removeCardButton.setAttribute('class', 'card-close');
	content.innerHTML = input.value.replace(/<[^>]+>/g, '').trim().replace(/(\r\n|\r|\n)+/g, '$1').replace(/\n/g, '<br />');
	card.classList.add('kanban-card');
	card.draggable = true;
	card.appendChild(content);
	card.appendChild(removeCardButton);
	input.remove();

	removeCardButton.addEventListener('click', deleteCard, false);

	addDragListeners(card);

	return card;
};

const dragStart = (e) => {
	let el = e.target;
	let column = findAncestor(el, '.kanban-col');

	createDropSlots(column);

	el.style.opacity = '0.4';
	dragSrcEl = el;
	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData('text/html', this.innerHTML);
};

const dragEnter = (e) => {
	e.target.classList.add('over');
};

const dragOver = (e) => {
	e.preventDefault();
	e.dataTransfer.dropEffect = 'move';

	return false;
};

const dragLeave = (e) => {
	e.stopPropagation();
	e.target.classList.remove('over');
};

const dragDrop = (e) => {     // tyt
	let el = e.target;
	let data = dragSrcEl.innerHTML;

	if (el.classList.contains('kanban-dragzone')) {
		addCard(dragSrcEl.innerHTML, e.target);
		dragSrcEl.remove();
	} else {
		if (dragSrcEl !== el) {
			dragSrcEl.innerHTML = el.innerHTML;
			el.innerHTML = data;

			event.stopPropagation();
			dragSrcEl.getElementsByClassName('card-close')[0].addEventListener('click', deleteCard, false);
			el.getElementsByClassName('card-close')[0].addEventListener('click', deleteCard, false);
		}
	}

	return false;
};

const dragEnd = (e) => {
	let listItems = document.querySelectorAll('.kanban-card');
	let dragzone = document.querySelectorAll('.kanban-dragzone');

	[].forEach.call(listItems, function (item) {
		item.classList.remove('over');
	});

	[].forEach.call(dragzone, function (item) {
		item.remove();
	});

	e.target ? e.target.style.opacity = '1' : null;
};

const createDropSlots = (current) => {
	let cols = document.getElementsByClassName('kanban-col');

	[].forEach.call(cols, function (col) {
		if (col !== cols[cols.length - 1] && col !== current) {
			createDraggableNode(col);
		}
	});
};

const createDraggableNode = (col) => {
	let zone = document.createElement('li');
	let list = col.getElementsByClassName('kanban-list')[0];

	zone.setAttribute('class', 'kanban-dragzone');
	zone.draggable = true;
	zone.innerHTML = 'Перетащите карточку в эту таблицу или поменяйте карточки местами';

	zone.addEventListener('dragenter', dragEnter, false);
	zone.addEventListener('dragover', dragOver, false);
	zone.addEventListener('dragleave', dragLeave, false);
	zone.addEventListener('drop', dragDrop, false);
	zone.addEventListener('dragend', dragEnd, false);

	list.insertBefore(zone, list.firstChild);
};

const addCard = (data, zone) => {
	let listElement = document.createElement('li');
	let column = findAncestor(zone, '.kanban-col');
	let list = column.getElementsByClassName('kanban-list')[0];

	listElement.setAttribute('class', 'kanban-card');
	listElement.innerHTML = data;
	listElement.draggable = true;

	listElement.getElementsByClassName('card-close')[0].addEventListener('click', deleteCard, false);

	addDragListeners(listElement);

	list.insertBefore(listElement, list.firstChild);
};

const deleteCard = (event) => {
	findAncestor(event.target, '.kanban-card').remove();

	event.target.removeEventListener('click', deleteCard);
};

const addDragListeners = (card) => {
	card.addEventListener('dragstart', dragStart, false);
	card.addEventListener('dragenter', dragEnter, false);
	card.addEventListener('dragover', dragOver, false);
	card.addEventListener('dragleave', dragLeave, false);
	card.addEventListener('drop', dragDrop, false);
	card.addEventListener('dragend', dragEnd, false);
};

const addInput = (type) => {
	let input = document.createElement(`${type}`);

	type === 'input' ? input.type = 'text' : null;
	input.className = type === 'input' ? 'title-input' : 'card-input';
	input.placeholder = type === 'input' ? 'Введите название колонки' : 'Введите название карточки';

	return input;
};

const hiddenDivForTextarea = () => {
	let hiddenDiv = document.createElement('div');

	hiddenDiv.setAttribute('class', 'textarea-hidden-div');

	return hiddenDiv;
};

const resizeTextarea = () => {
	let column = findAncestor(event.target, '.kanban-col');
	let input = column.getElementsByClassName('card-input')[0];
	let textareaResizer = column.getElementsByClassName('textarea-hidden-div')[0];
	let splittedValue = input.value.replace(/[<>]/g, '_').split("\n");
	let text = '';
	let maxHeight = 210;

	splittedValue.map(function (s) {
		text = text + '<div>' + s.replace(/\s\s/g, ' &nbsp;') + '&nbsp;</div>' + "\n";
	});

	textareaResizer.innerHTML = text;

	if (splittedValue.length > 3) {
		input.style.height = Math.min(textareaResizer.clientHeight + 5, maxHeight) + 'px';
	} else {
		input.style.height = '80px';
	}

	if (input.style.height === '210px') {
		input.style.overflow = 'auto';
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
