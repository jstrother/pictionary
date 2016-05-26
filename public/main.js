const $ = require('jquery');
const HB = require('handlebars');
const io = require('socket.io-client');
const socket = io();

$(document).ready(function() {
	pictionary();
});

function pictionary() {
	let canvas, context, drawing;

	canvas = $('canvas');
	context = canvas[0].getContext('2d');
	canvas[0].width = canvas[0].offsetWidth;
	canvas[0].height = canvas[0].offsetHeight;

	canvas.on('mousedown', function(event) {
		drawing = true;
	});

	canvas.on('mouseup', function(event) {
		drawing = false;
	});

	canvas.on('mousemove', function(event) {
		if (!drawing) return;

		let offset = canvas.offset();
		var position = {x: event.pageX - offset.left,
										y: event.pageY - offset.top};
		draw(position);
		socket.emit('draw', position);
	});

	socket.on('draw', function(position) {
		draw(position);
	});

	socket.on('guess', function(guess) {
		guessing(guess);
	});

	socket.on('value', function(value) {
		if (value === 'correct') {
			$('#answer').text('Yes! That\'s correct!');
		} else {
			$('#answer').text('Sorry.  That\'s incorrect.');
		}
	});

	var guessBox = $('#guess input');
	guessBox.on('keydown', onKeyDown);

	function draw(position) {
		context.beginPath();
		context.arc(position.x, position.y, 6, 0, 2 * Math.PI);
		context.fill();
	}

	function onKeyDown(event) {
		if (event.keyCode != 13) {
			return;
		}
		guessBox.val();
		socket.emit('guess', guessBox.val());
		guessBox.val('');
	}

	function guessing(guess) {
		$('#guesses').remove();
		const message = `<div id="guesses">${guess}<br>
											<form id="guessForm">
												<label><input type="radio" name="guess" value="correct">Correct</label>
												<label><input type="radio" name="guess" value="incorrect">Incorrect</label>
												<button type="button" id="respond">Respond</button>
											</form>
										</div>`;
		$('#answer').append(message);
		$('#respond').on('click', function() {
			var value = $('input[name="guess"]:checked').val();
			socket.emit('value', value);
		});
	}
}