import User from "../models/User.js";
import generateId from "../helpers/generateId.js";
import generateJWT from "../helpers/generateJWT.js";
import {
  sendEmailForgetPassword,
  sendEmailToConfirm
} from "../helpers/emails.js";

//---- Registra a un usuario ----
const registerUser = async (req, res) => {
  //Evitar registros duplicados
  const { email } = req.body;
  const isDuplicateUser = await User.findOne({ email });

  if (isDuplicateUser) {
    const error = new Error("There is already an account with this email");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const user = new User(req.body);
    user.token = generateId();
    await user.save();

    //Enviar email de confirmacion
    sendEmailToConfirm({
      email: user.email,
      name: user.name,
      token: user.token
    });

    res.json({
      msg: "User created success, please check your email to confirm your account"
    });
  } catch (error) {
    console.log(error);
  }
};

//---- Autentica a un usuario ----
const logIn = async (req, res) => {
  const { email, password } = req.body;

  //Comprobar si el usuario existe
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("The user doesn't exist.");
    return res.status(404).json({ msg: error.message });
  }

  //Comprobar si esta confirmado
  if (!user.confirmed) {
    const error = new Error("Your account isn't confirmed.");
    return res.status(403).json({ msg: error.message });
  }

  //Comprobar contraseña
  if (await user.checkPassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateJWT(user._id)
    });
  } else {
    const error = new Error("El password es incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};

//---- Confirma a un usuario ----
const confirmAccount = async (req, res) => {
  const { token } = req.params;
  const userToConfirm = await User.findOne({ token });

  if (!userToConfirm) {
    const error = new Error("Account already confirmed");
    return res.status(403).json({ msg: error.message });
  }

  try {
    userToConfirm.confirmed = true;
    userToConfirm.token = "";
    await userToConfirm.save();
    res.json({ msg: "Account confirmed successfully" });
  } catch (error) {
    console.log(error);
  }
};

//---- Envia email para cambiar contraseña ----
const RequestPasswordChange = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("The user with this email doesn't exist.");
    return res.status(404).json({ msg: error.message });
  }

  try {
    user.token = generateId();
    await user.save();

    //Enviar email
    sendEmailForgetPassword({
      email: user.email,
      name: user.name,
      token: user.token
    });

    res.json({ msg: "We have sent an email with the instructions" });
  } catch (error) {
    console.log(error);
  }
};

//---- Comprobar token ----
const checkToken = async (req, res) => {
  const { token } = req.params;

  const validToken = await User.findOne({ token });

  if (!validToken) {
    const error = new Error("Invalid token");
    return res.status(404).json({ msg: error.message });
  }

  res.json({ msg: "Valid token" });
};

//---- Cambiar contraseña ----
const changePassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ token });

  if (!user) {
    const error = new Error("Invalid token");
    return res.status(404).json({ msg: error.message });
  }

  try {
    user.password = password;
    user.token = "";
    await user.save();
    res.json({ msg: "Your new password have created successfully." });
  } catch (error) {
    console.log(error);
  }
};

const profile = (req, res) => {
  const { user } = req;

  res.json(user);
};

export {
  registerUser,
  logIn,
  confirmAccount,
  RequestPasswordChange,
  checkToken,
  changePassword,
  profile
};
