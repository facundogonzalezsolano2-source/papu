import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MercadoPagoConfig, Preference } from 'mercadopago';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const accessToken = process.env.MP_ACCESS_TOKEN || '';
const appBaseUrl = process.env.APP_BASE_URL || process.env.MP_REDIRECT_URI || 'https://frolicking-sorbet-935acd.netlify.app';
const publicKey = process.env.MP_PUBLIC_KEY || '';

app.get('/health', (_req, res) => {
  res.json({ ok: true, mpConfigured: Boolean(accessToken) });
});

app.get('/mp/config', (_req, res) => {
  res.json({ publicKey });
});

app.post('/mp/create-preference', async (req, res) => {
  try {
    const { orderId, title, description, price, items, backUrls } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'orderId es requerido' });
    }

    if (!accessToken) {
      return res.status(400).json({ error: 'MP_ACCESS_TOKEN no configurado' });
    }

    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    const normalizedItems = (items || [{ title: title || 'Compra', description: description || 'Pago en Tuapunte', quantity: 1, unit_price: Number(price || 0) }]).map((item) => ({
      title: item.title || 'Producto',
      description: item.description || 'Pago en Tuapunte',
      quantity: Number(item.quantity || 1),
      unit_price: Number(item.unit_price ?? item.price ?? 0),
      currency_id: 'ARS'
    }));

    const preferenceBody = {
      body: {
        external_reference: String(orderId),
        items: normalizedItems,
        payment_methods: {
          excluded_payment_types: [{ id: 'ticket' }]
        },
        auto_return: 'approved',
        back_urls: backUrls || {
          success: `${appBaseUrl}/payment/success?order=${encodeURIComponent(String(orderId))}`,
          failure: `${appBaseUrl}/payment/failure?order=${encodeURIComponent(String(orderId))}`,
          pending: `${appBaseUrl}/payment/pending?order=${encodeURIComponent(String(orderId))}`
        },
        notification_url: `${appBaseUrl}/mp/webhook`,
        metadata: {
          orderId: String(orderId),
          source: 'tuapunte'
        }
      }
    };

    const response = await preference.create(preferenceBody);

    res.json({
      ok: true,
      preferenceId: response.id,
      initPoint: response.init_point,
      sandboxInitPoint: response.sandbox_init_point
    });
  } catch (error) {
    console.error('Error creando preferencia:', error);
    res.status(500).json({ error: error.message || 'No se pudo crear la preferencia' });
  }
});

app.post('/mp/webhook', (req, res) => {
  console.log('Webhook recibido:', JSON.stringify(req.body));
  res.sendStatus(200);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor escuchando en http://0.0.0.0:${port}`);
});
