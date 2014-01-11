<?php 

if ( isset( $_GET['baches'] ) ) {

    $baches = $_GET['baches'];
    $saveTo = realpath( "../data" ) . '/data.json';

    if ( file_put_contents( $saveTo, $baches ) ) {

        echo 'Se ha guardado!';

    } else {

        echo 'Error. No se ha guardado';

    }

}

?>