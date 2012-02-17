function init() {
	if (window.XMLHttpRequest) {
		request = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		request = new ActiveXObject('Microsoft.XMLHTTP');
	}

	messageWindow = document.getElementById('messageWindow');
	messageField = document.getElementById('messageField');
	button = document.getElementById('sendMessageButton');

	messagesLength = 0;

	messageWindow.setAttribute('disabled', 'disabled');
	button.setAttribute('disabled', 'disabled');

	messageField.addEventListener('keyup', changeButtonState);
	messageField.addEventListener('keyup', checkIfSendMessage);
	button.addEventListener('click', sendMessage);

	retrieveMessages();

	setInterval("fetchNewMessages()", 1000);
}

function setAjaxRequest() {
	request.open('post', 'ajax_chat_server_script.php', true);
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
}

function changeButtonState() {
	if (messageField.value && button.hasAttribute('disabled')) {
		button.removeAttribute('disabled');
	} else if (!messageField.value && !button.hasAttribute('disabled')) {
		button.setAttribute('disabled', 'disabled');
	}
}

function checkIfSendMessage(event) {
	if (event.keyCode == 13) {
		sendMessage();
	}
}

function retrieveMessages() {
	setAjaxRequest();
	request.onreadystatechange = getMessagesRequest;
	request.send('action=retrieve');
}

function fetchNewMessages() {
	setAjaxRequest();
	request.onreadystatechange = getMessagesRequest;
	request.send('action=fetch&length=' + encodeURIComponent(messagesLength));
}

function getMessagesRequest() {
	if (request.readyState == 4 && request.status == 200) {
		var messagesArray = JSON.parse(request.responseText);
		messagesLength += messagesArray.length;

		for (var i = 0; i < messagesArray.length; i++) {
			messageWindow.value += messagesArray[i] + '\n';
		}
	}
}

function sendMessage() {
	var message = messageField.value;

	messageField.value = '';
	changeButtonState();

	setAjaxRequest();
	request.onreadystatechange = sendMessageRequest;
	request.send('action=send&message=' + encodeURIComponent(message));
}

function sendMessageRequest() {
	if (request.readyState == 4 && request.status == 200) {
		fetchNewMessages();
	}
}

document.addEventListener('DOMContentLoaded', init);
