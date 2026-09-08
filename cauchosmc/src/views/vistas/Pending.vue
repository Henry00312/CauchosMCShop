<template>
    <Mensajes titulo="¡En Espera De Pago!" 
    mensaje="Mientras se realiza el pago, el tiempo estimado en el que su pedido será tomado es " 
    color="pending" :action="true"/>
</template>

<script>
import Mensajes from '@/components/Messagues.vue';

export default {
    name: 'Pending',
    components: {
        Mensajes
    }
};
</script>