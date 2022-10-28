import Project from "../models/Project.js";
import Task from "../models/Task.js";

//---- Obtiene todos los proyectos ----
const getProjects = async (req, res) => {
  const projects = await Project.find().where("creator").equals(req.user);

  res.json(projects);
};

//---- Crea un proyecto ----
const createNewProject = async (req, res) => {
  const project = new Project(req.body);
  project.creator = req.user._id;

  try {
    const projectCreated = await project.save();

    res.json(projectCreated);
  } catch (error) {
    console.log(error);
  }
};

//---- Obtiene un proyecto ----
const getProject = async (req, res) => {
  const { id } = req.params;
  let project;

  if (id.length === 12 || id.length === 24) {
    project = await Project.findById(id);
  } else {
    const error = new Error("Project not found for indvalid id");
    return res.status(404).json({ msg: error.message });
  }

  if (!project) {
    const error = new Error("Project not found");
    return res.status(404).json({ msg: error.message });
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Accion no valida");
    return res.status(404).json({ msg: error.message });
  }

  res.json(project);
};

//---- Actualiza un proyecto ----
const updateProject = async (req, res) => {
  const { id } = req.params;

  const project = await Project.findById(id).select(
    "-createdAt -updatedAt -__v"
  );

  if (!project) {
    const error = new Error("Project not found");
    return res.status(404).json({ msg: error.message });
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Accion no valida");
    return res.status(404).json({ msg: error.message });
  }

  //Obtener las llaves del objeto de proyecto
  const keys = Object.keys(project._doc);
  keys.forEach((key) => {
    project[key] = req.body[key] || project[key];
  });

  try {
    const projectUpdated = await project.save();
    res.json(projectUpdated);
  } catch (error) {
    console.log(error);
  }
};

//---- Elimina un proyecto ----
const deleteProject = async (req, res) => {
  const { id } = req.params;

  const project = await Project.findById(id);

  if (!project) {
    const error = new Error("No encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Accion no valida");
    return res.status(404).json({ msg: error.message });
  }

  try {
    await project.deleteOne();
    res.json({ msg: "Proyecto eliminado" });
  } catch (error) {
    console.log(error);
  }
};

//---- Añade un colaborador ----
const addCollaborator = async (req, res) => {};

//---- Elimina un colaborador ----
const deleteCollaborator = async (req, res) => {};

export {
  getProjects,
  createNewProject,
  getProject,
  updateProject,
  deleteProject,
  addCollaborator,
  deleteCollaborator
};
