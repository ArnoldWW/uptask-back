import Project from "../models/Project.js";
import Task from "../models/Task.js";

//---- Añadir una tarea ----
const addTask = async (req, res) => {
  const { project } = req.body;

  const existProject = await Project.findById(project);

  if (!existProject) {
    const error = new Error("The project doesn't exist");
    return res.status(404).json({ msg: error.message });
  }

  if (existProject.creator.toString() !== req.user._id.toString()) {
    const error = new Error("No tienes los permisos para añadir tareas");
    return res.status(401).json({ msg: error.message });
  }

  try {
    const taskCreated = await Task.create(req.body);
    res.json(taskCreated);
  } catch (error) {
    console.log(error);
  }
};

//---- Obtiene una tarea ----
const getTask = async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id).populate("project");

  if (!task) {
    const error = new Error("Task not found");
    return res.status(404).json({ msg: error.message });
  }

  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Accion no valida");
    return res.status(403).json({ msg: error.message });
  }

  res.json(task);
};

//---- Actualiza una tarea ----
const updateTask = async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id)
    .populate("project")
    .select("-createdAt -updatedAt -__v");

  if (!task) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Accion no valida");
    return res.status(403).json({ msg: error.message });
  }

  //Obtener las llaves del registro de task
  const keys = Object.keys(task._doc);
  keys.forEach((key) => {
    task[key] = req.body[key] || task[key];
  });

  try {
    const createdTask = await task.save();
    res.json(createdTask);
  } catch (error) {
    console.log(error);
  }
};

//---- Elimina una tarea ----
const deleteTask = async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id).populate("project");

  if (!task) {
    const error = new Error("Not found");
    return res.status(404).json({ msg: error.message });
  }

  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Accion no valida");
    return res.status(403).json({ msg: error.message });
  }

  try {
    await task.deleteOne();
    res.json({ msg: "Tarea eliminated" });
  } catch (error) {}
};

//---- Cambiar estado de una tarea ----
const changeState = async (req, res) => {};

export { addTask, getTask, updateTask, deleteTask, changeState };
