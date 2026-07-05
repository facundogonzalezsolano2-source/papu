# Mercado Pago Marketplace - TuApunte

## Variables de entorno requeridas

Crea o ajusta el archivo .env con:

```env
PORT=3000
MP_CLIENT_ID=7685708579680165
MP_CLIENT_SECRET=t5lOw4yLLhaENUSLZN61P21C88d2HwQ8
MP_REDIRECT_URI=https://frolicking-sorbet-935acd.netlify.app/mp/oauth/callback
MARKETPLACE_COMMISSION=0.15
```

## Flujo de OAuth para vendedores

1. Abrir la URL:
   https://frolicking-sorbet-935acd.netlify.app/
2. Hacer clic en "Conectar vendedor".
3. Autorizar la app en Mercado Pago.
4. Mercado Pago redirigirá a:
   https://frolicking-sorbet-935acd.netlify.app/mp/oauth/callback
5. El backend recibirá el code y guardará el access_token y refresh_token del vendedor.

## Importante

Para que esto funcione en producción, el backend debe estar desplegado en una URL pública real y accesible desde Mercado Pago.
