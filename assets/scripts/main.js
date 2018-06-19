let notes = window.localStorage.getItem('notes') || '{"data": []}';
	notes = JSON.parse(notes);

let createNote = function() {
	let input = document.querySelector('#form-add-note input[type="text"]');
	let value = input.value;

	notes.data.push(value);

	input.value = "";
}

let updateList = function() {
	console.log('[Application] start watch');

	Array.observe(notes.data, function(changes){
		let index = null;
		let value = '';
		let status = null;

		if (changes[0].type === 'splice') {
			index = changes[0].index;
			value = changes[0].object[index];
			status = (changes[0].addedCount > 0) ? 'created' : 'removed';
		}

		if (changes[0].type === 'update') {
			index = changes[0].name;
			value = changes[0].object[index];
			status = 'updated';
		}

		if (!value && status === 'created' || status === 'updated') {
			return;
		}

		let notesTag = document.getElementById('notes');

		if (status == 'created') {
			let newNote = document.createElement('li');
			newNote.innerHTML = value;
			notesTag.appendChild(newNote);
		}

		if (status == 'removed') {
			let listOfNotes = document.querySelectorAll('#notes li');
			notesTag.removeChild(listOfNotes[index]);
		}

		if (status == 'updated') {
			console.log('Implementar')
		}

		window.localStorage.setItem('notes', JSON.stringify(notes));
	});
}

updateList();

document.addEventListener('DOMContentLoaded', function(event) {
	let listOfNotes = document.getElementById('notes');
	let listHtml = '';

	for (let i=0; i < notes.data.length; i++) {
		listHtml += '<li>' + notes.data[i] + '</li>';
	}

	listOfNotes.innerHTML = listHtml;

	let formAddNotes = document.getElementById('form-add-note');
	formAddNotes.addEventListener('submit', function(e) {
		e.preventDefault();
		createNote();
	});
});

document.addEventListener('click', function(e) {
	let notesTag = document.getElementById('notes');

	if (e.target.parentElement === notesTag) {
		if(confirm('remover esta nota?')) {
			let listOfNotes = document.querySelectorAll('#notes li');

			listOfNotes.forEach(function(item, index) {
				if(e.target === item) {
					notes.data.splice(index, 1);
				}
			});
		}
	}
});

if ('serviceWorker' in navigator) {
	window.addEventListener('load', function() {
		navigator.serviceWorker.register('service-worker.js').then(function(registration) {
			console.log('[ServiceWorker] Registration successful');
		}).catch(function(error) {
			console.log('[ServiceWorker] Registration failed: '. error);
		});
	});
}