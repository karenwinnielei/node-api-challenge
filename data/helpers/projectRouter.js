const express = require('express');

const router = express.Router();

const Projects = require('./projectModel');

router.post('/', validateProject, (req, res) => {
  Projects.insert(req.body)
    .then((project) => {
      res.status(200).json(project);
    })
    .catch((err) => {
      res.status(500).json({ error: 'unable to post project' });
    });
});

router.post(
  '/:id/projects',
  validateProjectId,
  validatePost,
  (req, res) => {
    let newProject = req.body;

    newProject.project_id = req.params.id;
    console.log({ newProject });

    Projects.insert(newProject)
      .then((project) => {
        res.status(200).json(project);
      })
      .catch((err) => {
        res.status(500).json({ error: 'unable to post new project' });
      });
  },
);

router.get('/', (req, res) => {
  Projects.get()
    .then((project) => {
      res.status(200).json(project);
    })
    .catch((err) => {
      res.status(500).json({ error: 'unable to get project' });
    });
});

router.get('/:id', validateProjectId, (req, res) => {
  res.status(200).json(req.project);
});

router.delete('/:id', validateProjectId, (req, res) => {
  Projects.remove(req.project.id)
    .then((deleted) => {
      Projects.get()
        .then((project) => {
          res.status(200).json(project);
        })
        .catch((err) => {
          res.status(500).json({ error: 'unable to get project' });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: 'unable to delete project' });
    });
});

router.put('/:id', validateProjectId, (req, res) => {
  Projects.update(req.project.id, req.body).then(updated => {
    Projects.get(req.project.id).then(project => {
      res.status(201).json(project)
    }).catch(err => {
      res.status(500).json({error: 'unable to get project'})
    })
  }).catch(err => {
    res.status(500).json({error: 'unable to update project'})
  })
})

function validateProjectId(req, res, next) {
  const id = req.params.id;
  Projects.get(id)
    .then((project) => {
      if (!project) {
        res.status(400).json({ message: 'invalid project id' });
      } else {
        req.project = project;
        next();
      }
    })
    .catch((err) => {
      res.status(500).json({ error: 'error getting project id' });
    });
}

function validateProject(req, res, next) {
  let project = req.body;

  if (!project) {
    res.status(400).json({ message: 'missing project data' });
  } else if (!project.name) {
    res.status(400).json({ message: 'missing required name field' });
  } else if (!project.description) {
    res.status(400).json({ message: 'missing required description field' });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  let post = req.body;
  if (!post) {
    res.status(400).json({ message: 'missing project data' });
  } else if (!post.name) {
    res.status(400).json({ message: 'missing required name field' });
  } else {
    next();
  }
}

module.exports = router;
