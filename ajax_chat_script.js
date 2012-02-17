function init() {
	if (window.XMLHttpRequest) {
		request = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		request = new ActiveXObject('Microsoft.XMLHTTP');
	}

	messageWindow = document.getElementById('messageWindow');
	messageField = document.getElementById('messageField');
	button = document.getElementById('sendMessageButton');

	prevMessagesLength = 0;
	messagesLength = 0;
	alert('init(): ' + messagesLength);

	messageWindow.setAttribute('disabled', 'disabled');
	button.setAttribute('disabled', 'disabled');

	messageField.addEventListener('keyup', changeButtonState);
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
	if (request.readyState == 4 && request.status == 200 && request.responseText != null) {
		var messagesArray = JSON.parse(request.responseText);
		prevMessagesLength = messagesLength;
		messagesLength = parseInt(messagesLength) + parseInt(--messagesArray.length);
		if (messagesLength != prevMessagesLength) alert('getMessagesRequest(): ' + messagesLength);

		for (var i = 0; i < messagesLength; i++) {
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
		// prevMessagesLength = messagesLength;
		// messagesLength++;
		// if (messagesLength != prevMessagesLength) alert('sendMessageRequest(): ' + messagesLength);
		messageWindow.value += request.responseText + '\n';
		fetchNewMessages();
	}
}

document.addEventListener('DOMContentLoaded', init);
