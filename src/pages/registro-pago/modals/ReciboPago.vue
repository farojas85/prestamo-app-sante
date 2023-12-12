<script setup>
import { ref, toRefs } from 'vue';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

const props = defineProps({
    registro_pago: Object
});

const { registro_pago } = toRefs(props);

const reciboBody = ref("");

const descargar = async () => {
    htmlToImage.toJpeg(document.getElementById('recibo-body'), { quality: 0.95,style: { backgroundColor: "FFFFFF"} })
    .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'recibo-pago.jpeg';
        link.href = dataUrl;
        link.click();
    });
}
</script>
<style>
hr.new2 {
  border-top: 1px dashed red;
}
</style>
<template>
    <div id="mdl-recibo-pago" class="modal fade">
        <div class="modal-dialog" style="width: 303px;">
            <div class="modal-content">
                <div class="modal-header py-1">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">
                            <i class="fas fa-times"></i>
                        </span>
                    </button>
                </div>
                <div class="modal-body"  :ref="reciboBody" style="">
                    <div style="background-color:white; font-family: Arial, Helvetica, sans-serif;" id="recibo-body">
                        <table style="width:302.36;margin-left: auto;margin-right: auto;">
                            <tr>
                                <td style="text-align: center; width: 80%;">
                                    <img  :src="'/img/logos/logo-100.webp'" class="img-fluid" />
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: center;">
                                    <hr style="border-top: 2px dashed black; margin-bottom: 0.05rem; width: 95%;"  />
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: center; font-size: 12pt; font-weight: bold">
                                    <span>RECIBO DE PAGO</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: center">
                                    <hr style="border-top: 2px dashed black;width: 95%;margin-top: 1px;"  />
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size: 10pt;">
                                    <span style="margin-left: 4px;">C&oacute;digo Recibo: <b>{{ registro_pago.serie_numero }}</b> </span><br>
                                    <span style="margin-left: 4px;">L&iacute;der: <b>{{ registro_pago.user_name }}</b></span><br>
                                    <span style="margin-left: 4px;">Fecha: <b>{{ registro_pago.fecha }}</b></span><br>
                                    <span style="margin-left: 4px;">Cliente: <b style="font-size: 9pt;">{{ registro_pago.cliente }}</b></span><br>
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: center;">
                                    <hr style="border-top: 2px dashed black; margin-top: 0.07rem; width: 95%;"  />
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size: 10pt;">
                                    <span style="margin-left: 4px;">Abonado: <b>{{ registro_pago.total }}</b> </span><br>
                                    <span style="margin-left: 4px;">Interes/Mora: <b>{{ registro_pago.mora ?? parseFloat(0.00).toFixed(2) }}</b></span><br>
                                    <span style="margin-left: 4px;">Fecha: <b>{{ registro_pago.fecha }}</b></span><br>
                                    <span style="margin-left: 4px;">Cliente: <b style="font-size: 9pt;">{{ registro_pago.cliente }}</b></span><br>
                                </td>
                            </tr>
                        </table>                        
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-sm btn-success" @click.prevent="descargar">
                        <span class="fa-fa-save"> Descargar</span>
                    </button>
                    <button class="btn btn-sm btn-secondary" data-dismiss="modal">
                        <span class="fa-fa-ban"> Cerrar</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>