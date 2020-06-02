const express = require('express');
const router = express.Router();
const app = require('../next');
const isAuthenticated = require('../middlewares/isAuthenticated');

router.get('/check-status', (req, res) => {
  res.send('ok');
});

/* GET home page. */
router.get('/', (req, res) => app.render(req, res, '/dimzou-index', req.query));
// router.use('/settings', isAuthenticated);
router.get('/settings', isAuthenticated, (req, res) =>
  app.render(req, res, '/settings', req.query),
);

router.get('/profile/:userId', (req, res) => app.render(req, res, '/dimzou-edit', {
  userId: req.params.userId,
}))

router.get('/category/:id', (req, res) =>
  app.render(req, res, '/dimzou-category-feed', {
    id: req.params.id,
  }),
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
    bundleId: req.params.bundleId,
    nodeId: req.params.nodeId,
    isPublicationView: true,
    ...req.query,
  })
)


router.get('/draft/new', (req, res) =>
  app.render(req, res, '/dimzou-edit', {
    isCreate: true,
  }),
);

router.get('/draft/:bundleId/:nodeId?', (req, res) =>
  app.render(req, res, '/dimzou-edit', {
    bundleId: req.params.bundleId,
    nodeId: req.params.nodeId,
    ...req.query,
  }),
);

module.exports = router;
