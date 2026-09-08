<template>
    <Mensajes titulo="¡Mensaje Recivido!" 
    mensaje="En Poco Tiempo Atenderemos Tu Requerimiento" color="contact" :action="false"/>
</template>

<script>
import Mensajes from '@/components/Messagues.vue';

export default {
    name: 'Contact',
    components: {
        Mensajes
    }
};
</script>