<?php

$action = $_POST['action'];

if ($action == 'retrieve') {
	$messages = explode('\n', file_get_contents('ajax_chat_message_log.txt'));
	unset($messages[count($messages) - 1]);

	if (!empty($messages)) {
		echo json_encode($messages);
	}
} else if ($action == 'fetch') {
	$messages_length = $_POST['length'];

	$log_messages = explode('\n', file_get_contents('ajax_chat_message_log.txt'));
	$log_messages_length = count($log_messages) - 1;

	if ($messages_length < $log_messages_length) {
		$message_difference = array();

		for ($i = $messages_length; $i < $log_messages_length; $i++) {
			$message_difference[] = $log_messages[$i];
		}

		echo json_encode($message_difference);
	}
} else if ($action == 'send') {
	$message = $_POST['message'];

	$log = fopen('ajax_chat_message_log.txt', 'a');
	fwrite($log, $message.'\n');
	fclose($log);

	echo $message;
}
