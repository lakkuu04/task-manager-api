const prisma = require('../utils/prismaClient');

async function createProject(req, res) {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });

    const project = await prisma.project.create({
      data: { name, description, userId: req.userId },
    });

    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create project' });
  }
}

async function getProjects(req, res) {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.userId },
      include: { tasks: true },
    });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch projects' });
  }
}

async function getProjectById(req, res) {
  try {
    const project = await prisma.project.findFirst({
      where: { id: req.params.id, userId: req.userId },
      include: { tasks: true },
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch project' });
  }
}

async function updateProject(req, res) {
  try {
    const { name, description } = req.body;

    const existing = await prisma.project.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!existing) return res.status(404).json({ error: 'Project not found' });

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: { name, description },
    });
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update project' });
  }
}

async function deleteProject(req, res) {
  try {
    const existing = await prisma.project.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!existing) return res.status(404).json({ error: 'Project not found' });

    await prisma.task.deleteMany({ where: { projectId: req.params.id } });
    await prisma.project.delete({ where: { id: req.params.id } });

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete project' });
  }
}

module.exports = { createProject, getProjects, getProjectById, updateProject, deleteProject };
