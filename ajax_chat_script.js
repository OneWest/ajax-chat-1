SERVER_SCRIPT = 'ajax_chat_server_script.php';
MESSAGE_LOG = 'ajax_chat_message_log.php';
USERS_LOG = 'ajax_chat_users_log.php';
DELIMITER = '\n';

FETCH_INTERVAL_MS = 1000;
ENTER_KEY = 13;

RESPONSE_READY = 4;
OK = 200;

function init() {
	if (window.XMLHttpRequest) {
		request = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		request = new ActiveXObject('Microsoft.XMLHTTP');
	}

	messageWindow = document.getElementById('messageWindow');
	messageField = document.getElementById('messageField');
	button = document.getElementById('sendMessageButton');

	messageWindow.setAttribute('disabled', 'disabled');
	button.setAttribute('disabled', 'disabled');

	messageField.addEventListener('keyup', changeButtonState);
	messageField.addEventListener('keyup', checkIfSendMessage);
	button.addEventListener('click', sendMessage);

	messageLogQuery = 'message_log=' + encodeURIComponent(MESSAGE_LOG);
	usersLogQuery = 'users_log=' + encodeURIComponent(USERS_LOG);
	delimiterQuery = '&delimiter=' + encodeURIComponent(DELIMITER);

	messagesLength = 0;

	uniqueIdentity = false;
	while (!uniqueIdentity) {
		askForIdentity();
	}

	retrieveMessages();

	setInterval("fetchNewMessages()", FETCH_INTERVAL_MS);
}

function setAjaxRequest() {
	request.open('post', SERVER_SCRIPT, true);
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
	if (event.keyCode == ENTER_KEY) {
		sendMessage();
	}
}

function askForIdentity() {
	username = prompt('Enter your username: ');

	setAjaxRequest();
	request.onreadystatechange = setIdentityRequest;
	request.send(usersLogQuery + '&action=identify&username=' + encodeURIComponent(username) + delimiterQuery);
}

function retrieveMessages() {
	setAjaxRequest();
	request.onreadystatechange = getMessagesRequest;
	request.send(messageLogQuery + '&action=retrieve' + delimiterQuery);
}

function fetchNewMessages() {
	setAjaxRequest();
	request.onreadystatechange = getMessagesRequest;
	request.send(messageLogQuery + '&action=fetch&length=' + encodeURIComponent(messagesLength) + delimiterQuery);
}

function sendMessage() {
	var message = messageField.value;

	messageField.value = '';
	changeButtonState();

	setAjaxRequest();
	request.onreadystatechange = sendMessageRequest;
	request.send(messageLogQuery + '&action=send&message=' + encodeURIComponent(message) + delimiterQuery);
}

function setIdentityRequest() {
	if (request.readyState == RESPONSE_READY && request.status == OK) {
		if (request.responseText == 'false') {
			alert('That username has already been taken.');
		}
		uniqueIdentity = true;
	}
}

function getMessagesRequest() {
	if (request.readyState == RESPONSE_READY && request.status == OK) {
		var messagesArray = JSON.parse(request.responseText);
		messagesLength += messagesArray.length;

		for (var i = 0; i < messagesArray.length; i++) {
			messageWindow.value += messagesArray[i] + DELIMITER;
		}
	}
}

function sendMessageRequest() {
	if (request.readyState == RESPONSE_READY && request.status == OK) {
		fetchNewMessages();
	}
}

document.addEventListener('DOMContentLoaded', init);
