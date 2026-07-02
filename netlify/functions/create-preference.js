const { MercadoPagoConfig, Preference } from "mercadopago";

export async function handler(event) {
  const accessToken = process.env.MP_ACCESS_TOKEN;

  if (!accessToken) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Falta MP_ACCESS_TOKEN" })
    };
  }

  const client = new MercadoPagoConfig({ accessToken });
  const preference = new Preference(client);

  const body = JSON.parse(event.body);

  const result = await preference.create({
    body: {
      items: [
        {
          title: body.title,
          unit_price: Number(body.price),
          quantity: 1
        }
      ]
    }
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      init_point: result.init_point
    })
  };
}


