<?php

class Chat {

	function ensure_log_exists( $log_file ) {
		if ( !file_exists( $log_file ) ) {
			$log = fopen( $log_file, 'w' );
			fclose( $log );
		}
	}

	function login_user( $users_log, $username, $delimiter ) {
		$this->ensure_log_exists( $users_log );
		$users = explode( $delimiter, file_get_contents( $users_log ) );
		$empty_user_index = count( $users ) - 1;
		unset( $users[$empty_user_index] );

		if ( in_array( $username, $users ) && array_search( $username, $users ) % 2 == 0 ) {
			$user_password_index = array_search( $username, $users ) + 1;
			echo $users[$user_password_index];
		} else {
			echo '';
		}
	}

	function register_user( $users_log, $username, $password, $delimiter ) {
		$this->ensure_log_exists( $users_log );
		$log = fopen( $users_log, 'a' );
		fwrite( $log, $username . $delimiter . $password . $delimiter );
		fclose( $log );
	}

	function retrieve_messages( $message_log, $delimiter ) {
		$this->ensure_log_exists( $message_log );
		$messages = explode( $delimiter, file_get_contents( $message_log ) );
		$empty_message_index = count( $messages ) - 1;
		unset( $messages[$empty_message_index] );

		if ( !empty( $messages ) ) {
			echo json_encode( $messages );
		}
	}

	function fetch_messages( $message_log, $length, $delimiter ) {
		$this->ensure_log_exists( $message_log );
		$log_messages = explode( $delimiter, file_get_contents( $message_log ) );
		$log_length = count( $log_messages ) - 1;

		$new_messages = array();
		for ( $i = $length; $i < $log_length; $i++ ) {
			$new_messages[] = $log_messages[$i];
		}

		if ( !empty( $new_messages ) ) {
			echo json_encode( $new_messages );
		}
	}

	function send_message( $message_log, $username, $message, $delimiter ) {
		$this->ensure_log_exists( $message_log );
		$log = fopen( $message_log, 'a' );
		fwrite( $log, '[' . $username . '] ' . $message . $delimiter );
		fclose( $log );
	}

}

$chat = new Chat();

switch ( $_POST['action'] ) {
	case 'login':
		$chat->login_user( $_POST['users_log'], $_POST['username'], $_POST['delimiter'] );
		break;
	case 'register':
		$chat->register_user( $_POST['users_log'], $_POST['username'], $_POST['password'], $_POST['delimiter'] );
		break;
	case 'retrieve':
		$chat->retrieve_messages( $_POST['message_log'], $_POST['delimiter'] );
		break;
	case 'fetch':
		$chat->fetch_messages( $_POST['message_log'], intval( $_POST['length'] ), $_POST['delimiter'] );
		break;
	case 'send':
		$chat->send_message( $_POST['message_log'], $_POST['username'], $_POST['message'], $_POST['delimiter'] );
		break;
}

?>
