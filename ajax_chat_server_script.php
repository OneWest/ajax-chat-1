<?php

if (!isset($_POST['action'])) exit;

function ensure_message_log_exists() {	// untested
	if (!file_exists($message_log)) {
		$log = fopen($message_log, 'w');
		if (!$log) exit;
		if (!fwrite($log, '')) exit;
		if (!fclose($log)) exit;
	}
}

function retrieve_messages() {
	$messages = explode($delimiter, file_get_contents($message_log));
	$last_message_index = count($messages) - 1;
	if ($last_message_index < 0) exit;

	unset($messages[$last_message_index]);
	if (!isset($messages)) exit;

	echo json_encode($messages);
}

function fetch_messages() {
	if (!isset($_POST['length'])) exit;
	$current_messages_length = intval($_POST['length']);

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

function send_message() {
	if (!isset($_POST['message'])) exit;
	$message = strval($_POST['message']);

	$log = fopen($message_log, 'a');
	if (!$log) exit;
	if (!fwrite($log, $message.$delimiter)) exit;
	if (!fclose($log)) exit;

	echo $message;
}

$message_log = 'ajax_chat_message_log.txt';
$delimiter = '\n';

ensure_message_log_exists();

switch($_POST['action']) {
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
