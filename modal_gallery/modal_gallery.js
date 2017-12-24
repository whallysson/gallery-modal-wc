$(function () {

    var BASE = $('link[rel="base"]').attr('href');

    // MODAL
    // ABRIR
    $('[data-toggle="wc_modal"]').on('click', function () {
        var _this = $(this);
        var _target = _this.data('target');
        var modal = $(_target);
        var modal_acao = $(_target + ' .wc_modal-dialog');

        modal.fadeIn().css('display', 'block');
        modal_acao.animate({"top": "0"}, 250);

        return false;
    });

    //FECHAR MODAL
    $('.wc_modal').on('click', function (e) {
        var modal = $(this);
        var target = $(e.target);

        if (!target.closest('.wc_modal-dialog').length) {
            var modal_acao = $('#' + target[0].id + ' .wc_modal-dialog');


            modal_acao.animate({"top": "-100%"}, 250);
            modal.fadeOut('fast');

            // Limpa DIV com Uploads
            var modal_uploads = $('#' + target[0].id + ' .wc_modal-dialog .arquivos-uploads');
            if (modal_uploads.length) {
                $('.arquivos-uploads').html('');
            }
        }
    });

    //FECHAR MODAL - BOTÃO
    $('[data-close="wc_modal"]').on('click', function () {
        var _this = $(this);
        var modal = _this.closest('.wc_modal');
        var modal_acao = $('#' + modal[0].id + ' .wc_modal-dialog');

        modal_acao.animate({"top": "-100%"}, 250);
        modal.fadeOut('fast');

        // Limpa DIV com Uploads
        var modal_uploads = $('#' + modal[0].id + ' .wc_modal-dialog .arquivos-uploads');
        if (modal_uploads.length) {
            $('.arquivos-uploads').html('');
        }
        return false;
    });


    // ABRE BIBLIOTECA DE IMAGENS
    $('.arquivos').on('click', function () {
        var modal = $(this).data('id');
        var iframe = $(modal + ' .arquivos-uploads');
        var inputCoverFile = $('input[name="capa_cover_file"]');
        var imgCover = $('img.capa_cover').attr('src');
        var imgActive = (inputCoverFile.val() ? inputCoverFile.val() : imgCover);
        var w = 800, h = 400, thumbW = 120, thumbH = 120; // Define o tamanho da thumb

        $.get(BASE + "../_cdn/widgets/modal_gallery/modal_gallery.ajax.php", {imgActive: imgActive, thumbW: thumbW, thumbH: thumbH}, function (data) {
            if (data.gallery) {
                iframe.html(data.gallery);

                // GET URL DA IMAGEM
                $('li .url').on('click', function () {
                    var _this = $(this);
                    var _href = _this.data('href');

                    inputCoverFile.val(_href);
                    $('input[type="file"]').val('');

                    $('img.capa_cover').attr('src', '../tim.php?src=uploads/' + _href + '&w=' + w + '&h=' + h + '&zc=2');

                    CloseModal(modal);
                    return false;
                });

            }
            OpenModal(modal);
            modalDinamico();
        }, 'json');
    });

    // FECHA BIBLIOTECA DE IMAGENS
    $('.arquivos_close').on('click', function () {
        $('.arquivos-uploads').html('');
    });

    // LIMPA INPUT DE IMAGEM
    $('.arquivos_clear').on('click', function () {
        $('input[name="capa_cover_file"]').val('');
    });

});



$(window).resize(function () {
    var WcModalHeigth = $('div.wc_modal').height();
    var newHeight = WcModalHeigth - 200;
    $('.arquivos-uploads').css('height', newHeight + "px");
});

function modalDinamico() {
    var WcModalHeigth = $('div.wc_modal').height();
    var newHeight = WcModalHeigth - 200;
    $('.arquivos-uploads').css('height', newHeight + "px");
}


function OpenModal(modal) {
    $(modal).fadeIn().css('display', 'block');
    $(modal + ' .wc_modal-dialog').animate({"top": "0"}, 250);
}

function CloseModal(modal) {
    $(modal + ' .wc_modal-dialog').animate({"top": "-100%"}, 250);
    $(modal).fadeOut('fast');
}

