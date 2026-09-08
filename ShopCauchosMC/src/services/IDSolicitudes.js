export function AsignarIDSolicitudes() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let resultado = '';
    var caracterAleatorio = '';

    for (let i = 0; i < 10; i++) {
        caracterAleatorio = caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        resultado += caracterAleatorio;
    }

    return resultado;
}