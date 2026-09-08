<template>
    <Mensajes titulo="¡Pago Realizado Con Exito!" 
    mensaje="Felicidades su pedido se ha añadido a la orden de producción y estará listo " 
    color="success" :action="true"/>
</template>

<script>
import Mensajes from '@/components/Messagues.vue';

export default {
    name: 'Success',
    components: {
        Mensajes
    }
};
</script>