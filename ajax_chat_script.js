SERVER_SCRIPT = 'ajax_chat_server_script.php';
USERS_LOG = 'ajax_chat_users_log.txt';
MESSAGE_LOG = 'ajax_chat_message_log.txt';
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

	messageWindow = document.getElementById('message-window');
	messageField = document.getElementById('message-field');
	button = document.getElementById('send-message-button');

	messageWindow.setAttribute('disabled', 'disabled');
	button.setAttribute('disabled', 'disabled');

	messageField.addEventListener('keyup', changeButtonState);
	messageField.addEventListener('keyup', checkIfSendMessage);
	button.addEventListener('click', sendMessage);

	usersLogQuery = '&users_log=' + encodeURIComponent(USERS_LOG);
	messageLogQuery = '&message_log=' + encodeURIComponent(MESSAGE_LOG);
	delimiterQuery = '&delimiter=' + encodeURIComponent(DELIMITER);

	actionQuery = 'action=';
	usernameQuery = '&username=';
	passwordQuery = '&password=';
	lengthQuery = '&length=';
	messageQuery = '&message=';

	messagesLength = 0;

	username = prompt('Enter your username:');
	// loginUser();
	retrieveMessages();

	setInterval('fetchNewMessages()', FETCH_INTERVAL_MS);
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

function loginUser() {
	successfulLogin = false;

	username = prompt('Enter your username:');

	var query = '';
	query += actionQuery + 'login';
	query += usersLogQuery;
	query += usernameQuery + encodeURIComponent(username);
	query += delimiterQuery;

	setAjaxRequest();
	request.onreadystatechange = loginUserRequest;
	request.send(query);

	while (!successfulLogin);
}

function registerUser() {
	var query = '';
	query += actionQuery + 'register';
	query += usersLogQuery;
	query += usernameQuery + encodeURIComponent(username);
	query += passwordQuery + encodeURIComponent(password);
	query += delimiterQuery;

	setAjaxRequest();
	request.send(query);
}

function retrieveMessages() {
	var query = '';
	query += actionQuery + 'retrieve';
	query += messageLogQuery;
	query += delimiterQuery;

	setAjaxRequest();
	request.onreadystatechange = getMessagesRequest;
	request.send(query);
}

function fetchNewMessages() {
	var query = '';
	query += actionQuery + 'fetch';
	query += messageLogQuery;
	query += lengthQuery + encodeURIComponent(messagesLength);
	query += delimiterQuery;

	setAjaxRequest();
	request.onreadystatechange = getMessagesRequest;
	request.send(query);
}

function sendMessage() {
	var message = messageField.value;

	var query = '';
	query += actionQuery + 'send';
	query += messageLogQuery;
	query += usernameQuery + encodeURIComponent(username);
	query += messageQuery + encodeURIComponent(message);
	query += delimiterQuery;

	messageField.value = '';
	changeButtonState();

	setAjaxRequest();
	request.onreadystatechange = sendMessageRequest;
	request.send(query);
}

function loginUserRequest() {
	if (request.readyState == RESPONSE_READY && request.status == OK) {
		if (request.responseText != '') {
			password = prompt('Username found.\n\nEnter your password:');
			if (password == request.responseText) {
				successfulLogin = true;
				alert('Welcome back.');
			} else {
				alert('Wrong password.');
			}
		} else {
			password = prompt('Username not found. Creating new account.\n\nEnter your password:');
			registerUser();
			alert('Enjoy.');
		}
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
