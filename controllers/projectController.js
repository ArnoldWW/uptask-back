import Project from "../models/Project.js";
import Task from "../models/Task.js";

//---- Obtiene todos los proyectos ----
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().where("creator").equals(req.user);

    res.json(projects);
  } catch (error) {
    return res.status(400).json({ msg: "Error getting projects." });
  }
};

//---- Crea un proyecto ----
const createNewProject = async (req, res) => {
  //validar por nombre del proyecto
  const projectByName = await Project.findOne(
    { name: req.body.name },
    "name _id"
  );

  if (
    projectByName?.name.toLowerCase() === req.body.name.toLowerCase().trim()
  ) {
    const error = new Error("You already haveproject with the same name");
    return res.status(404).json({ msg: error.message });
  }

  //instanciar el proyecto
  const project = new Project(req.body);
  project.creator = req.user._id;

  try {
    const projectCreated = await project.save();

    res.json(projectCreated);
  } catch (error) {
    return res.status(400).json({ msg: "Error creating project." });
  }
};

//---- Obtiene un proyecto ----
const getProject = async (req, res) => {
  const { id } = req.params;
  let project;

  if (id.length === 12 || id.length === 24) {
    try {
      project = await Project.findById(id);
    } catch (error) {
      return res.status(404).json({ msg: "Project not found." });
    }
  } else {
    const error = new Error("Project not found for indvalid id");
    return res.status(404).json({ msg: error.message });
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("invalid action");
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
