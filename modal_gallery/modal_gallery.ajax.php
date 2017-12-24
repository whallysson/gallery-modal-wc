<?php

/** 
 * FUNÇÃO PARA Listar aquivos em um diretório
 */
function Alldiretorios($dir) {
    $result = array();

    $iterator = new RecursiveDirectoryIterator($dir);
    $recursiveIterator = new RecursiveIteratorIterator($iterator);

    foreach ($recursiveIterator as $entry) {
        if (!in_array($entry->getFilename(), array(".", "..", ".DS_Store"))) {
            $result[] = [
                'fileName' => $entry->getFilename(),
                'pathName' => str_replace('\\', '/', $entry->getPathname())
            ];
        }
    }

    ksort($result);
    return $result;
}

// RECUPERA O GET
$ImgActive = filter_input(INPUT_GET, 'imgActive', FILTER_DEFAULT);
$thumbW = filter_input(INPUT_GET, 'thumbW', FILTER_DEFAULT);
$thumbH = filter_input(INPUT_GET, 'thumbH', FILTER_DEFAULT);

$jSON = null;

// Diretorio das imagens
$Dir = '../../../uploads/';
$Images = Alldiretorios($Dir);


if (!empty($Images)):
    $DataHref = null;
    $jSON['gallery'] = '<ul>';
    
    foreach ($Images as $arq):
        $DataHref = str_replace(array('../', 'uploads/'), '', $arq["pathName"]);
        
        $jSON['gallery'] .= "<li class='gal-item" . (!empty($ImgActive) && (stripos($ImgActive, $DataHref) !== false  ||  $ImgActive == $DataHref)? ' active' : null) ."'>";
        $jSON['gallery'] .= "<img src='../tim.php?src=" . str_replace('../', '', $arq["pathName"]) . "&w={$thumbW}&h={$thumbH}' /><br>";
        $jSON['gallery'] .= "<a class='btn btn_green btn_small url' data-href='" . $DataHref . "'>Usar</a>";
        $jSON['gallery'] .= "</li>";
    endforeach;

    $jSON['gallery'] .= '</ul>';
endif;


//RETORNA O CALLBACK
echo json_encode($jSON);
