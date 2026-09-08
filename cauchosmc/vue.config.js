const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  /*
  devServer: {
    https: true,
    host: '0.0.0.0',
    port: 8080,
    allowedHosts: 'all',
    client: {
      webSocketURL: {
        protocol: 'wss', // WebSocket seguro
        hostname: 'qx7bz19c-8080.use2.devtunnels.ms', // tu dominio HTTPS
        port: 443,
      }
    }
  }*/
})
