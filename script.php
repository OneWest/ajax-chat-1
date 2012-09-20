<?php

class Chat {

	function __construct( $log, $delimiter ) {
		$this->log = $log;
		$this->delimiter = $delimiter;
	}

	function ensure_log_exists() {
		if ( !file_exists( $this->log ) ) {
			$log = fopen( $this->log, 'w' );
			fclose( $log );
		}
	}

	function login_user( $username ) {
		$this->ensure_log_exists();
		$users = explode( $this->delimiter, file_get_contents( $this->log ) );
		$empty_user_index = count( $users ) - 1;
		unset( $users[$empty_user_index] );

		if ( in_array( $username, $users ) && array_search( $username, $users ) % 2 == 0 ) {
			$user_password_index = array_search( $username, $users ) + 1;
			echo $users[$user_password_index];
		} else {
			echo '';
		}
	}

	function register_user( $username, $password ) {
		$this->ensure_log_exists();
		$log = fopen( $this->log, 'a' );
		fwrite( $log, $username . $this->delimiter . $password . $this->delimiter );
		fclose( $log );
	}

	function retrieve_messages() {
		$this->ensure_log_exists();
		$messages = explode( $this->delimiter, file_get_contents( $this->log ) );
		$empty_message_index = count( $messages ) - 1;
		unset( $messages[$empty_message_index] );

		if ( !empty( $messages ) ) {
			echo json_encode( $messages );
		}
	}

	function fetch_messages( $length ) {
		$this->ensure_log_exists();
		$log_messages = explode( $this->delimiter, file_get_contents( $this->log ) );
		$log_length = count( $log_messages ) - 1;

		$new_messages = array();
		for ( $i = $length; $i < $log_length; $i++ ) {
			$new_messages[] = $log_messages[$i];
		}

		if ( !empty( $new_messages ) ) {
			echo json_encode( $new_messages );
		}
	}

	function send_message( $username, $message ) {
		$this->ensure_log_exists();
		$log = fopen( $this->log, 'a' );
		fwrite( $log, '[' . $username . '] ' . $message . $this->delimiter );
		fclose( $log );
	}

}

$chat = new Chat( isset( $_POST['users_log'] ) ? $_POST['users_log'] : $_POST['message_log'], $_POST['delimiter'] );

switch ( $_POST['action'] ) {
	case 'login':
		$chat->login_user( $_POST['username'] );
		break;
	case 'register':
		$chat->register_user( $_POST['username'], $_POST['password'] );
		break;
	case 'retrieve':
		$chat->retrieve_messages();
		break;
	case 'fetch':
		$chat->fetch_messages( intval( $_POST['length'] ) );
		break;
	case 'send':
		$chat->send_message( $_POST['username'], $_POST['message'] );
		break;
}

?>
