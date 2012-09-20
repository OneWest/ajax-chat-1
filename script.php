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

$chat = new Chat( $_POST['message_log'], $_POST['delimiter'] );

switch ( $_POST['action'] ) {
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
