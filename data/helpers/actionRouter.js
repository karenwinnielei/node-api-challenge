const express = require('express');

const router = express.Router();

const Actions = require('./actionModel');
const Projects = require('./projectModel');

router.post('/', validateAction, (req, res) => {
  Actions.insert(req.body)
    .then((action) => {
      res.status(200).json(action);
    })
    .catch((err) => {
      res.status(500).json({ error: 'unable to post action' });
    });
});

router.post(
  '/:id/actions',
  validateActionId,
  validatePost,
  (req, res) => {
    let newAction = req.body;

    newAction.project_id = req.params.id;

    Actions.insert(newAction)
      .then((action) => {
        res.status(200).json(action);
      })
      .catch((err) => {
        res.status(500).json({ error: 'unable to post new action' });
      });
  },
);

router.get('/', (req, res)=>{
  Actions.get().then(action => {
    res.status(200).json(action)
  }).catch(err => {
    res.status(500).json({error: 'unable to get action'})
  })
})

router.get('/:id', validateActionId, (req, res) => {
  res.status(200).json(req.action)
})

router.delete('/:id', validateActionId, (req, res) => {

})

function validateActionId(req, res, next) {
  Projects.getProjectActions(req.params.id)
    .then((project) => {
      if (!project) {
        res.status(404).json({ message: 'invalid project id' });
      } else {
        req.project = project;
        next();
      }
    })
    .catch((err) => {
      res.status(500).json({ error: 'error getting project' });
    });
}

function validateAction(req, res, next) {
  let action = req.body;

  if (!action) {
    res.status(400).json({ message: 'missing action data' });
  } else if (!action.project_id) {
    res
      .status(400)
      .json({ message: 'missing required project id field' });
  } else if (!action.description || action.description.length > 128) {
    res.status(400).json({
      message:
        'description field is required and must be less than 128 characters long',
    });
  } else if (!action.notes) {
    res.status(400).json({ message: 'missing required notes' });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  let post = req.body;
  if (!post) {
    res.status(400).json({ message: 'missing project data' });
  } else if (!post.description) {
    res
      .status(400)
      .json({ message: 'missing required description field' });
  } else if (!post.notes) {
    res.status(400).json({ message: 'missing required notes' });
  } else {
    next();
  }
}

module.exports = router;
