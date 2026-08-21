const prisma = require('../utils/prismaClient');

async function createTask(req, res) {
  try {
    const { title, description, status, priority, dueDate, projectId } = req.body;
    if (!title || !projectId) {
      return res.status(400).json({ error: 'title and projectId are required' });
    }

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: req.userId },
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        userId: req.userId,
      },
    });

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create task' });
  }
}

async function getTasks(req, res) {
  try {
    const { status, priority, projectId } = req.query;

    const where = {
      userId: req.userId,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(projectId && { projectId }),
    };

    const tasks = await prisma.task.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch tasks' });
  }
}

async function getTaskById(req, res) {
  try {
    const task = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch task' });
  }
}

async function updateTask(req, res) {
  try {
    const existing = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!existing) return res.status(404).json({ error: 'Task not found' });

    const { title, description, status, priority, dueDate, projectId } = req.body;

    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(projectId !== undefined && { projectId }),
      },
    });

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update task' });
  }
}

async function deleteTask(req, res) {
  try {
    const existing = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!existing) return res.status(404).json({ error: 'Task not found' });

    await prisma.task.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete task' });
  }
}

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
