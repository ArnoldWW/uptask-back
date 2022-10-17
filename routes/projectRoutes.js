import express from "express";
import {
  getProjects,
  createNewProject,
  getProject,
  updateProject,
  deleteProject,
  addCollaborator,
  deleteCollaborator
} from "../controllers/projectController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

//rutas para las acciones en los proyectos
router.route("/").get(checkAuth, getProjects).post(checkAuth, createNewProject);

router
  .route("/:id")
  .get(checkAuth, getProject)
  .put(checkAuth, updateProject)
  .delete(checkAuth, deleteProject);

router.get("/tasks/:id", checkAuth);
router.post("/add-collaborator/:id", checkAuth, addCollaborator);
router.post("/delete-collaborator/:id", checkAuth, deleteCollaborator);

export default router;
