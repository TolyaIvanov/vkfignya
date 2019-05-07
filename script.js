window.onload = function () {
	let column = document.getElementsByClassName('add-col')[0];

	column.addEventListener('click', function () {

		addCol(column);
	}, false);
};

addCol = (point) => {
	let container = document.getElementsByClassName('container')[0];
	let col = createCol();
	let target = point.target ? point.target : point;

	remasterCol(target);
	container.appendChild(col);
	return col;
};

createCol = (title) => {
	let column = document.createElement('div');
	let columnTitle = document.createElement('p');
	let columnList = document.createElement('ul');
	let addItem = document.createElement('div');
	let addColButton = document.createElement('div');
	let addColText = document.createElement('p');

	column.setAttribute('class', 'kanban-col');
	columnTitle.setAttribute('class', 'kanban-title');
	columnList.setAttribute('class', 'kanban-list');
	addItem.setAttribute('class', 'add-col');
	addColButton.setAttribute('class', 'button');
	addColText.setAttribute('class', 'add-item-text');
	addColText.appendChild(document.createTextNode('Добавить колонку'));

	addItem.appendChild(addColButton);
	addItem.appendChild(addColText);
	addItem.addEventListener('click', () => {
		addCol(addItem);
	}, false);

	column.appendChild(columnTitle);
	column.appendChild(columnList);
	column.appendChild(addItem);

	return column;
};

remasterCol = (target) => {
	target.getElementsByClassName('add-item-text');

	console.log(target);
};

