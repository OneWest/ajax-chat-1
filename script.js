var Chat = function() {
	this.request = this.setRequest();
	this.setAttributesAndEventListeners();
	this.setLogsAndQueries();
	this.setConstants();

	this.messagesLength = 0;
};

Chat.prototype.setRequest = function() {
	if (window.XMLHttpRequest) {
		return new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		return new ActiveXObject('Microsoft.XMLHTTP');
	}
};

Chat.prototype.setAttributesAndEventListeners = function() {
	this.messageWindow = document.getElementById('message-window');
	this.messageField = document.getElementById('message-field');
	this.button = document.getElementById('send-message-button');

	this.messageWindow.setAttribute('disabled', 'disabled');
	this.button.setAttribute('disabled', 'disabled');

	this.messageField.addEventListener('keyup', this.changeButtonState.bind(this));
	this.messageField.addEventListener('keyup', this.checkIfSendMessage.bind(this));
	this.button.addEventListener('click', this.sendMessage.bind(this));
};

Chat.prototype.setLogsAndQueries = function() {
	this.serverScript = 'script.php';
	this.messageLog = 'message_log.txt';
	this.delimiter = '\n';

	this.messageLogQuery = '&message_log=' + encodeURIComponent(this.messageLog);
	this.delimiterQuery = '&delimiter=' + encodeURIComponent(this.delimiter);
	this.actionQuery = 'action=';
	this.usernameQuery = '&username=';
	this.lengthQuery = '&length=';
	this.messageQuery = '&message=';
};

Chat.prototype.setConstants = function() {
	this.fetchIntervalMs = 1000;
	this.enterKey = 13;
	this.responseReady = 4;
	this.ok = 200;
};

Chat.prototype.sendRequest = function(callback, query) {
	if (callback) {
		this.request.onreadystatechange = callback.bind(this);
	}
	this.request.open('post', this.serverScript, true);
	this.request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	this.request.send(query);
};

Chat.prototype.isRequestResponseReady = function() {
	return (this.request.readyState == this.responseReady && this.request.status == this.ok);
};

Chat.prototype.changeButtonState = function() {
	if (this.messageField.value && this.button.hasAttribute('disabled')) {
		this.button.removeAttribute('disabled');
	} else if (!this.messageField.value && !this.button.hasAttribute('disabled')) {
		this.button.setAttribute('disabled', 'disabled');
	}
};

Chat.prototype.checkIfSendMessage = function(event) {
	if (event.keyCode == this.enterKey) {
		this.sendMessage();
	}
};

Chat.prototype.retrieveMessages = function() {
	var query = '';
	query += this.actionQuery + 'retrieve';
	query += this.messageLogQuery;
	query += this.delimiterQuery;

	this.sendRequest(this.getMessagesRequest, query);
};

Chat.prototype.fetchNewMessages = function() {
	var query = '';
	query += this.actionQuery + 'fetch';
	query += this.messageLogQuery;
	query += this.lengthQuery + encodeURIComponent(this.messagesLength);
	query += this.delimiterQuery;

	this.sendRequest(this.getMessagesRequest, query);
};

Chat.prototype.sendMessage = function() {
	var message = this.messageField.value;

	var query = '';
	query += this.actionQuery + 'send';
	query += this.messageLogQuery;
	query += this.usernameQuery + encodeURIComponent(this.username);
	query += this.messageQuery + encodeURIComponent(message);
	query += this.delimiterQuery;

	this.messageField.value = '';
	this.changeButtonState();

	this.sendRequest(this.sendMessageRequest, query);
};

Chat.prototype.getMessagesRequest = function() {
	if (this.isRequestResponseReady() && this.request.responseText) {
		var messages = JSON.parse(this.request.responseText);
		this.messagesLength += messages.length;
		for (var i in messages) {
			this.messageWindow.value += messages[i] + this.delimiter;
		}
	}
};

Chat.prototype.sendMessageRequest = function() {
	if (this.isRequestResponseReady()) {
		this.fetchNewMessages();
	}
};

document.addEventListener('DOMContentLoaded', function() {
	chat = new Chat();
	chat.username = prompt('Enter your username:');
	chat.retrieveMessages();
	setInterval('chat.fetchNewMessages()', chat.fetchIntervalMs);
});
