const express = require('express');
const router = express.Router();
const app = require('../next');

router.get('/check-status', (req, res) => {
  res.send('ok');
});

/* GET home page. */
router.get('/', (req, res) => app.render(req, res, '/dimzou-index', req.query));

router.get('/profile/:userId', (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user ? req.user.uid : undefined;
  const pageName =
    currentUserId && String(currentUserId) === String(userId)
      ? 'dashboard'
      : 'user';
  return app.render(req, res, '/dimzou-edit', {
    ...req.query,
    userId: req.params.userId,
    pageName,
  });
});

router.get('/category/:id', (req, res) =>
  app.render(req, res, '/dimzou-category-feed', {
    id: req.params.id,
  }),
);

router.get('/category/:id/dimzou', (req, res) =>
  res.redirect(`/category/${req.params.id}`),
);

/* Dimzou related */
router.get('/dimzou', (req, res) => app.render(req, res, '/dimzou-index'));

router.get('/dimzou/:bundleId/:nodeId?', (req, res) =>
  app.render(req, res, '/dimzou-view', {
    bundleId: req.params.bundleId,
    nodeId: req.params.nodeId,
  }),
);

router.get('/dimzou-publication/:bundleId/:nodeId?', (req, res) =>
  app.render(req, res, '/dimzou-edit', {
    ...req.query,
    bundleId: req.params.bundleId,
    nodeId: req.params.nodeId,
    pageName: 'view',
  }),
);

router.get('/draft/new', (req, res) =>
  app.render(req, res, '/dimzou-edit', {
    ...req.query,
    pageName: 'create',
  }),
);

router.get('/draft/:bundleId/:nodeId?', (req, res) =>
  app.render(req, res, '/dimzou-edit', {
    ...req.query,
    bundleId: req.params.bundleId,
    nodeId: req.params.nodeId,
    pageName: 'draft',
  }),
);

module.exports = router;
