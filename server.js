import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createSignedContentAccessResponse, fetchMercadoPagoPayment, markPurchaseAsApproved } from './netlify/functions/_shared/private-content.js';

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

app.post('/content/access', async (req, res) => {
  try {
    const result = await createSignedContentAccessResponse({
      request: req,
      publicationId: req.body?.publicationId || req.body?.contentId || '',
      deviceId: req.body?.deviceId || '',
      source: 'express'
    });

    res.status(result.statusCode).send(result.body);
  } catch (error) {
    console.error('Error verificando acceso al contenido:', error);
    res.status(500).json({ error: error.message || 'No se pudo verificar el acceso al contenido.' });
  }
});

app.post('/mp/create-preference', async (req, res) => {
  try {
    const { orderId, title, description, price, items, backUrls, publicationId, buyerId, deviceId } = req.body;

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
          source: 'tuapunte',
          publicationId: String(publicationId || ''),
          buyerId: String(buyerId || ''),
          deviceId: String(deviceId || '')
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
  (async () => {
    try {
      const paymentId = req.body?.data?.id || req.body?.id || req.body?.payment_id || req.query?.id || '';
      if (!paymentId) {
        console.log('Webhook recibido sin paymentId:', JSON.stringify(req.body));
        res.sendStatus(200);
        return;
      }

      const payment = await fetchMercadoPagoPayment(paymentId);
      const externalReference = String(payment?.external_reference || payment?.metadata?.orderId || '').trim();
      const paymentStatus = String(payment?.status || '').toLowerCase();

      if (paymentStatus === 'approved' && externalReference) {
        await markPurchaseAsApproved({
          orderId: externalReference,
          paymentId: String(paymentId),
          paymentStatus: 'approved'
        });
      }

      console.log('Webhook procesado:', { paymentId, paymentStatus, externalReference });
      res.sendStatus(200);
    } catch (error) {
      console.error('Error procesando webhook de pago:', error);
      res.sendStatus(200);
    }
  })();
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor escuchando en http://0.0.0.0:${port}`);
});
