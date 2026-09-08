<template>
    <div class="centrar fondo">
        <div class="centrarCol campoLog">
            <div id="loader" v-if="Cloader"></div>
            <div style="padding:2vh; width:95%; margin-top:12px;">

                <div class="centrarCol">
                    <div class="centrar CubimgLogPro">
                        <img src="../../assets/logprofile2.png" alt="LogProfile" class="imgLogPerfil">
                    </div>
                    <h3 class="NombrePerfil">Admin Cauchos MC</h3>
                    <div class="formSS centrarCol">

                        <label for="correo" class="labelForm">Correo electrónico</label>
                        <input type="text" id="correo" name="correo" required class="inputForm" v-model="logUser.correoIn" placeholder="Digita tu correo electrónico...">
                        <span class="errorIn">{{ errores.correo }}</span>

                        <label for="password" class="labelForm">Contraseña</label>
                        <input type="password" id="password" name="password" required class="inputForm" v-model="logUser.jtgd" placeholder="Digita tu contraseña...">
                        <span class="errorIn">{{ errores.jtgd }}</span>

                        <button class="buttonForm" @click="validarFormInLog()">Iniciar Sesión</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import router from '@/router';
export default {
    name: 'LogIn',
    components: {},
    data() {
        return {
            Cloader: false,
            logUser: { correoIn: '', jtgd: '' },
            errores: { correo: '', jtgd: ''},
        }
    },
    computed: {},
    methods: {
        ...mapActions(['login']),
        async validarFormInLog(){
            try {
                this.Cloader = true;
                const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                this.errores.correo = (this.logUser.correoIn.length > 170 || !correoRegex.test(this.logUser.correoIn)) ? 'Por favor, ingresa un correo electrónico válido.' : '';
                this.errores.jtgd = (this.logUser.jtgd.length > 60) ? "Tienes un Problema con la Contraseña." : '';
                if(this.errores.correo || this.errores.jtgd){
                    this.Cloader = false;
                    return false;
                }
                await this.login(this.logUser);
                this.Cloader = false;
                router.push('/manage'); // redirige desde el componente
                return true;
                
            } catch (error) {
                console.log(error)
            }
        },


    },
    created() { }

};
</script>
<style lang="css" scoped>
.fondo{
    width: 100vw; 
    height: 100vh; 
    background-color: rgb(205, 250, 253);
}
.centrar{
    display: flex; 
    justify-content: center; 
    align-items: center;
}
.centrarCol{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.campoLog{
    max-width: 370px;
    padding: 30px; 
    background-color: rgba(252, 69, 69, 0.97); 
    border-radius: 10px;
    box-shadow: 0 0 20px black;
}
.CubimgLogPro{
    width: 80px;
    height: 80px;
    border-radius: 50%;
    filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.64));
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 25%, rgba(255, 255, 255, 0.12) 50%, rgba(255, 255, 255, 0) 80%);
}
.imgLogPerfil{
    width: 70px;
    height: 70px;
    border-radius: 40%;
}
.NombrePerfil{
    box-sizing: border-box;
    padding: 10px;
    margin: 0;
    font-size: 23px;
    font-weight: bold;
    text-align: center;
    text-wrap: balance;
    color: white;
    filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.64));
}
.formSS {
    width: 100%;
    margin-top: 7px;
    background-color: #ffffffa5;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.labelForm {
    width: 100%;
    text-align: left;
    margin: 0;
    margin-bottom: 5px;
    color: black;
    font-size: 15px;
}
.inputForm {
    width: 100%;
    padding: 8px;
    margin-bottom: 8px;
    box-sizing: border-box;
    background-color: rgb(233, 233, 233);
    border-radius: 8px;
    font-size: 14px;
}
.errorIn{
    margin: 0;
    padding: 0;
    font-size: 10px;
    color: red;
}
.buttonForm {
    background-color:  rgb(0, 0, 0);
    color: #fff;
    padding: 8px 13px;
    margin-top: 10px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
}
.buttonForm:hover{
    background-color:  rgb(238, 4, 4);
}
#loader {
    border: 10px solid rgba(255, 255, 255, 0.3);
    border-top: 10px solid #3498db;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 2s linear infinite;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 7;
}
@keyframes spin {
    0% {
        transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}
</style>