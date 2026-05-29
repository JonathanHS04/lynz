import { Router } from "express";
import { 
    getUsers, 
    login, 
    createUser, 
    updateUserData, 
    getPublicUserDataById, 
    updateUserRole, requestDeleteUser, deleteUser } from "../../modules/users/users.controller";
import { authentication } from "../../middlewares/authentication.middleware";
import { isAdmin, isModeratorOrOwner, isModeratorOrOwnerWithPassword } from "../../middlewares/authorization.middleware";
import { validate } from "../../middlewares/validation.middleware";
import { userDataSchema } from "../../schemas/userData.schema";

const router = Router();

router.post("/login", login);
router.post("/register", validate(userDataSchema), createUser);

router.use(authentication)

router.get("/:id/public", getPublicUserDataById);
router.get("/:id/private", isModeratorOrOwner );

router.get("/", isAdmin, getUsers);

router.put("/:id", isModeratorOrOwnerWithPassword, updateUserData);
router.put("/role/:id", isAdmin, updateUserRole);

router.post("/requestUserDeletion/:id", isModeratorOrOwnerWithPassword, requestDeleteUser);
router.delete("/confirmUserDeletion", isModeratorOrOwnerWithPassword, deleteUser)
export default router;