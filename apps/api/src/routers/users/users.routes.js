import { Router } from "express";
import { 
    getUsers, 
    login, 
    createUser, 
    updateUserData, 
    getPublicUserDataById, 
    getPrivateUserDataById, 
    updateUserRole, requestDeleteUser, deleteUser } from "../../controllers/users/users.controller.js";
import { authentication } from "../../middlewares/authentication.middleware.js";
import { isAdmin, isModeratorOrOwner, isModeratorOrOwnerWithPassword } from "../../middlewares/authorization.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { userDataSchema } from "../../schemas/userData.schema.js";

const router = Router();

router.post("/login", login);
router.post("/register", validate(userDataSchema), createUser);

router.use(authentication)

router.get("/:id/public", getPublicUserDataById);
router.get("/:id/private", isModeratorOrOwner, getPrivateUserDataById);

router.get("/", isAdmin, getUsers);

router.put("/:id", isModeratorOrOwnerWithPassword, updateUserData);
router.put("/role/:id", isAdmin, updateUserRole);

router.post("/requestUserDeletion/:id", isModeratorOrOwnerWithPassword, requestDeleteUser);
router.delete("/confirmUserDeletion", isModeratorOrOwnerWithPassword, deleteUser)
export default router;