<template>
    <Mensajes titulo="¡El Pago No Se Pudo Procesar!" 
    mensaje="Lo Sentimos El Pedido No Se Pudo Realizar." color="failure" :action="false"/>
</template>

<script>
import Mensajes from '@/components/Messagues.vue';

export default {
    name: 'Failure',
    components: {
        Mensajes
    }
};
</script>