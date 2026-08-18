// REPOSITORY SOURCE: diplomat-bit/Fuckyou | PATH: diplomat-bit-Fuckyou-70f83c5/server/routes/webhooks.ts
================================================================================

import { Router } from 'express';

const router = Router();

router.post('/stripe', (req, res) => {
  res.status(200).send('Webhook received');
});

export default router;