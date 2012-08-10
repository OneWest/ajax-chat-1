<?php

function ensure_log_exists($log_file) {
	if (!file_exists($log_file)) {
		$log = fopen($log_file, 'w');
		fclose($log);
	}
}

function login_user() {
	$users_log = $_POST['users_log'];
	$username = $_POST['username'];
	$delimiter = $_POST['delimiter'];

	// ensure_log_exists($users_log);
	$users = explode($delimiter, file_get_contents($users_log));
	$empty_user_index = count($users) - 1;
	if ($empty_user_index < 0) exit;

	unset($users[$empty_user_index]);

	if (in_array($username, $users) && array_search($username, $users) % 2 == 0) {
		$user_password_index = array_search($username, $users) + 1;
		if ($user_password_index < 1 || $user_password_index >= count($users)) exit;
		echo $users[$user_password_index];
	} else {
		echo '';
	}
}

function register_user() {
	$users_log = $_POST['users_log'];
	$username = $_POST['username'];
	$password = $_POST['password'];
	$delimiter = $_POST['delimiter'];

	// ensure_log_exists($users_log);
	$log = fopen($users_log, 'a');
	if (!$log) exit;
	if (!fwrite($log, $username.$delimiter.$password.$delimiter)) exit;
	if (!fclose($log)) exit;
}

function retrieve_messages() {
	$message_log = $_POST['message_log'];
	$delimiter = $_POST['delimiter'];

	ensure_log_exists($message_log);
	$messages = explode($delimiter, file_get_contents($message_log));
	$empty_message_index = count($messages) - 1;
	unset($messages[$empty_message_index]);

	if (!empty($messages)) {
		echo json_encode($messages);
	}
}

function fetch_messages() {
	$message_log = $_POST['message_log'];
	$length = intval($_POST['length']);
	$delimiter = $_POST['delimiter'];

	ensure_log_exists($message_log);
	$log_messages = explode($delimiter, file_get_contents($message_log));
	$log_length = count($log_messages) - 1;
	$new_messages = array();
	for ($i = $length; $i < $log_length; $i++) {
		$new_messages[] = $log_messages[$i];
	}

	if (!empty($new_messages)) {
		echo json_encode($new_messages);
	}
}

function send_message() {
	$message_log = $_POST['message_log'];
	$username = $_POST['username'];
	$message = $_POST['message'];
	$delimiter = $_POST['delimiter'];

	ensure_log_exists($message_log);
	$log = fopen($message_log, 'a');
	fwrite($log, '['.$username.'] '.$message.$delimiter);
	fclose($log);
}

switch ($_POST['action']) {
	case 'login':
		login_user();
		break;
	case 'register':
		register_user();
		break;
	case 'retrieve':
		retrieve_messages();
		break;
	case 'fetch':
		fetch_messages();
		break;
	case 'send':
		send_message();
		break;
}
