const { MercadoPagoConfig, Preference } = require("mercadopago");

exports.handler = async (event) => {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    return { statusCode: 500, body: JSON.stringify({ error: "Falta MP_ACCESS_TOKEN" }) };
  }

  let payload;
  try {
    payload = event?.body ? JSON.parse(event.body) : {};
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "El body no es JSON válido" }) };
  }

  const title = String(payload?.title ?? "").trim();
  const unit_price = Number(payload?.price);
  const quantity = Number.isInteger(payload?.quantity) ? payload.quantity : 1;

  if (!title) {
    return { statusCode: 400, body: JSON.stringify({ error: "Falta title" }) };
  }
  if (!Number.isFinite(unit_price) || unit_price <= 0) {
    return { statusCode: 400, body: JSON.stringify({ error: "price inválido" }) };
  }
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return { statusCode: 400, body: JSON.stringify({ error: "quantity inválida" }) };
  }

  const client = new MercadoPagoConfig({ accessToken });
  const preference = new Preference(client);

  try {
    const result = await preference.create({
      body: {
        items: [{ title, unit_price, quantity }],
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ init_point: result.init_point }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "No se pudo crear la preferencia",
      }),
    };
  }
};
