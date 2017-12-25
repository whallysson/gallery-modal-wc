# gallery-modal-wc
Modal e gerenciador de imagens 


### CONFIGURANDO O WIDGETS MODAL E PEQUENO GERENCIADOR DE IMAGENS

#### OBS: Caso o input file seja preenchido o mesmo terá maior privilegio na hora de cadastrar a imagem, mesmo que o campo da biblioteca também esteja preenchido. A prioridade será sempre do campo "input file".


#### 1 - Cole a pasta "modal_gallery" para dentro de "_cdn/widgets/"

#### 2 - Abra o "dashboard.php" e logo acima da tag "\</head>" cole o código abaixo:
```php
    <!-- Modal e Bliblioteca de imagens -->
    <script src="../_cdn/widgets/modal_gallery/modal_gallery.js"></script>
    <link rel="stylesheet" href="../_cdn/widgets/modal_gallery/modal_gallery.css"/>
```

#### 3 - Ainda na "dashboard.php" e logo abaixo da tag "\<body>" cole o código abaixo:
```php
    <!-- Modal Uploads -->
    <div class="wc_modal" id="modal-arquivos">
        <div class="wc_modal-dialog wc_modal-lg">

            <div class="wc_modal-content">
                <div class="wc_modal-header">
                    <button type="button" class="wc_close" data-close="wc_modal">
                        <span>×</span>
                    </button>
                    <h4 class="modal-title" id="mySmallModalLabel">Biblioteca de Imagens</h4>
                </div>

                <div  class="wc_modal-body">
                    <div class="arquivos-uploads iframe embed-responsive">
                        <p>Biblioteca de Imagens Vázia</p>
                    </div>
                </div>

                <div class="wc_modal-footer">
                    <button class='btn btn_red arquivos_close fl_right' data-close="wc_modal">Fechar</button>
                    <div class="clear"></div>
                </div>
            </div>

        </div>
    </div>
```

#### 4 - No arquivo "create.php" que você for usar o "gerenciador de imagens", no post por exemplo, faça:

##### 4.1 - Cole o código abaixo, no lugar de sua preferencia. Ele irá mostrar o botão que dispara a ação que abre a modal:
        
        OBS: o "data-dir" define a pasta dentro da uploads (courses, images, pages ou properties). Default é 'images'
 ```php       
        <!-- arquivo "post/create.php" -->
        <label class="label">
            <a class='btn btn_blue m_top arquivos' data-id="#modal-arquivos" data-dir="images" style="margin-left: 0;">Biblioteca de Imagens</a>
            <input type="text" name="capa_cover_file" readonly="readonly" class="input-upload" />
            <a class='btn btn_red arquivos_clear' title="Limpar Seleção">x</a>
        </label>

        <!-- arquivo "pages/create.php" -->
        <label class="label">
            <a class='btn btn_blue m_top arquivos' data-id="#modal-arquivos" data-dir="pages" style="margin-left: 0;">Biblioteca de Imagens</a>
            <input type="text" name="capa_cover_file" readonly="readonly" class="input-upload" />
            <a class='btn btn_red arquivos_clear' title="Limpar Seleção">x</a>
        </label>

        <!-- arquivo "imobe/create.php" -->
        <label class="label">
            <a class='btn btn_blue m_top arquivos' data-id="#modal-arquivos" data-dir="properties" style="margin-left: 0;">Biblioteca de Imagens</a>
            <input type="text" name="capa_cover_file" readonly="readonly" class="input-upload" />
            <a class='btn btn_red arquivos_clear' title="Limpar Seleção">x</a>
        </label>
```
##### 4.2 - Cole a classe "capa_cover" na tag "\<img>" que mostra a thumb da capa.


#### 5 - Validações para deletar a imagem:

##### 5.1 - A partir desse ponto estou usando o arquivo "Posts.ajax.php" para fazer as validações e de envio e delete.
    
##### 5.2 - Validação de Envio e delete da imagem: antes de apagar uma imagem vc deve verificar se a mesma está sendo usada por outro post, para dai remover a mesma. 
##### 5.2.1 - Ainda dentro do "Posts.ajax.php" dê um Ctrl+F (comando para procurar uma palavra), procure por "unlink" que é a função para apagar a imagem da pasta "uploads". 
    Substitua o case "delete" por:
```php
        case 'delete':
            $PostData['post_id'] = $PostData['del_id'];
            $Read->FullRead("SELECT post_cover FROM " . DB_POSTS . " WHERE post_id = :ps", "ps={$PostData['post_id']}");
            if ($Read->getResult() && file_exists("../../uploads/{$Read->getResult()[0]['post_cover']}") && !is_dir("../../uploads/{$Read->getResult()[0]['post_cover']}")):

                $Read->FullRead("SELECT post_cover FROM " . DB_POSTS . " WHERE post_id != :ps AND post_cover = :pc", "ps={$PostData['post_id']}&pc={$Read->getResult()[0]['post_cover']}");
                if (!$Read->getResult()):
                    unlink("../../uploads/{$Read->getResult()[0]['post_cover']}");
                endif;
            endif;

            $Read->FullRead("SELECT image FROM " . DB_POSTS_IMAGE . " WHERE post_id = :ps", "ps={$PostData['post_id']}");
            if ($Read->getResult()):
                foreach ($Read->getResult() as $PostImage):
                    $ImageRemove = "../../uploads/{$PostImage['image']}";
                    if (file_exists($ImageRemove) && !is_dir($ImageRemove)):

                        $Read->FullRead("SELECT image FROM " . DB_POSTS . " WHERE post_id != :ps AND post_cover = :pc", "ps={$PostData['post_id']}&pc={$PostImage['image']}"); // Verificação se a imagem está sendo usada por outro post
                        if (!$Read->getResult()):
                            unlink($ImageRemove);
                        endif;
                    endif;
                endforeach;
            endif;

            $Delete->ExeDelete(DB_POSTS, "WHERE post_id = :id", "id={$PostData['post_id']}");
            $Delete->ExeDelete(DB_POSTS_IMAGE, "WHERE post_id = :id", "id={$PostData['post_id']}");
            $Delete->ExeDelete(DB_COMMENTS, "WHERE post_id = :id", "id={$PostData['post_id']}");
            $jSON['success'] = true;
            break;
```

##### 5.2.2 - Dentro do case "manager" procure a verificação "if (!empty($_FILES['post_cover'])):" e substitua todo esse if por:
```php
        if (!empty($_FILES['post_cover'])):
            $File = $_FILES['post_cover'];

            if ($ThisPost['post_cover'] && file_exists("../../uploads/{$ThisPost['post_cover']}") && !is_dir("../../uploads/{$ThisPost['post_cover']}")):

                $Read->FullRead("SELECT post_cover FROM " . DB_POSTS . " WHERE post_id != :ps AND post_cover = :pc", "ps={$PostId}&pc={$ThisPost['post_cover']}");
                if (!$Read->getResult()):
                    unlink("../../uploads/{$ThisPost['post_cover']}");
                endif;
            endif;

            $Upload = new Upload('../../uploads/');
            $Upload->Image($File, $PostData['post_name'] . '-' . time(), IMAGE_W);
            if ($Upload->getResult()):
                $PostData['post_cover'] = $Upload->getResult();
            else:
                $jSON['trigger'] = AjaxErro("<b class='icon-image'>ERRO AO ENVIAR CAPA:</b> Olá {$_SESSION['userLogin']['user_name']}, selecione uma imagem JPG ou PNG para enviar como capa!", E_USER_WARNING);
                echo json_encode($jSON);
                return;
            endif;
        else:
            // Adiciona a url ao post_cover
            if (!empty($PostData['capa_cover_file'])):
                $PostData['post_cover'] = $PostData['capa_cover_file'];
                unset($PostData['capa_cover_file']);
            else:
                unset($PostData['post_cover'], $PostData['capa_cover_file']);
            endif;
        endif;
```


## Para usar nos demais Arquivos.ajax basta seguir a mesma lógica, verificar se a imagem está sendo usada em outro lugar, para dai remover a mesma.
