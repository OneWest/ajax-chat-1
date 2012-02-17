<?php

if ((isset($_POST['message_log']) && isset($_POST['users_log'])) ||
	!isset($_POST['action']) || !isset($_POST['delimiter']))
	exit;

function ensure_users_log_exists($users_log) {	// untested
	if (!file_exists($users_log)) {
		$log = fopen($users_log, 'w');
		if (!$log) exit;
		if (!fwrite($log, '')) exit;
		if (!fclose($log)) exit;
	}
}

function ensure_message_log_exists($message_log) {	// untested
	if (!file_exists($message_log)) {
		$log = fopen($message_log, 'w');
		if (!$log) exit;
		if (!fwrite($log, '')) exit;
		if (!fclose($log)) exit;
	}
}

function set_identity($users_log, $delimiter) {	// untested
}

function retrieve_messages($message_log, $delimiter) {
	ensure_message_log_exists($message_log);
	$messages = explode($delimiter, file_get_contents($message_log));
	$last_message_index = count($messages) - 1;
	if ($last_message_index < 0) exit;

	unset($messages[$last_message_index]);
	if (!isset($messages)) exit;

	echo json_encode($messages);
}

function fetch_messages($message_log, $delimiter) {
	if (!isset($_POST['length'])) exit;
	$current_messages_length = intval($_POST['length']);

	ensure_message_log_exists($message_log);
	$log_messages = explode($delimiter, file_get_contents($message_log));
	$log_messages_length = count($log_messages) - 1;
	if ($log_messages_length < 0) exit;

	if ($current_messages_length > $log_messages_length) exit;

	$new_messages = array();
	for ($i = $current_messages_length; $i < $log_messages_length; $i++)
		$new_messages[] = $log_messages[$i];
	if (count($new_messages) != $log_messages_length - $current_messages_length) exit;

	echo json_encode($message_difference);
}

function send_message($message_log, $delimiter) {
	if (!isset($_POST['message'])) exit;
	$message = strval($_POST['message']);

	ensure_message_log_exists($message_log);
	$log = fopen($message_log, 'a');
	if (!$log) exit;
	if (!fwrite($log, $message.$delimiter)) exit;
	if (!fclose($log)) exit;

	echo $message;
}

switch($_POST['action']) {
	case 'identify':
		set_identity($_POST['users_log'], $_POST['delimiter']);
		break;
	case 'retrieve':
		retrieve_messages($_POST['message_log'], $_POST['delimiter']);
		break;
	case 'fetch':
		fetch_messages($_POST['message_log'], $_POST['delimiter']);
		break;
	case 'send':
		send_message($_POST['message_log'], $_POST['delimiter']);
		break;
}
