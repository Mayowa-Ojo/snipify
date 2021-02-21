import { Router } from "express";

import * as authController from "~controllers/auth.controller";
import * as userController from "~controllers/user.controller";
import * as fileController from "~controllers/file.controller";
import * as snipController from "~controllers/snip.controller";
import * as commentController from "~controllers/comment.controller";
import * as searchController from "~controllers/search.controller";
import * as collectionController from "~controllers/collection.controller";
import { authGuard } from "~middleware/index";

const router = Router();
const authRouter = Router();
const userRouter = Router();
const fileRouter = Router();
const snipRouter = Router();
const collectionRouter = Router();
const commentRouter = Router();
const searchRouter = Router();

authRouter.post("/", authController.authenticate);
authRouter.post("/re-authenticate", authController.reAuthenticate);
authRouter.post("/revoke-token", authGuard, authController.revokeToken);

userRouter.get("/:id/collections", authGuard, userController.getCollectionsForUser);
userRouter.get("/:id/snips", authGuard, userController.getSnipsForUser);
userRouter.get("/:id/starred", authGuard, userController.getStarredSnipsForUser);

fileRouter.post("/", authGuard, fileController.create);
fileRouter.get("/:id", authGuard, fileController.getOne)
fileRouter.delete("/:id", authGuard, fileController.deleteOne);

snipRouter.get("/feed", authGuard, snipController.getFeed);
snipRouter.get("/:id", snipController.getOne);
snipRouter.get("/:id/zip", snipController.generateZipFile);
snipRouter.get("/:id/comments", authGuard, snipController.getCommentsForSnip)
snipRouter.post("/", authGuard, snipController.create);
snipRouter.post("/:id/fork", authGuard, snipController.createFork);
snipRouter.patch("/:id", authGuard, snipController.updateOne);
snipRouter.patch("/:id/star", authGuard, snipController.starSnipByUser);
snipRouter.patch("/:id/permission", authGuard, snipController.updatePermission);
snipRouter.delete("/:id", authGuard, snipController.deleteOne);

commentRouter.post("/", authGuard, commentController.create);
commentRouter.post("/:id/reply", authGuard, commentController.createReply);
commentRouter.get("/:id", authGuard, commentController.getOne);
commentRouter.patch("/:id", authGuard, commentController.updateOne)
commentRouter.patch("/:id/like", authGuard, commentController.likeByUser);
commentRouter.delete("/:id", authGuard, commentController.deleteOne);

searchRouter.post("/index", authGuard, searchController.createIndex);
searchRouter.get("/", authGuard, searchController.searchByQuery);
searchRouter.delete("/:id", authGuard, searchController.deleteDocument);


collectionRouter.post("/", authGuard, collectionController.create);
collectionRouter.get("/:id", authGuard, collectionController.getOne);
collectionRouter.patch("/:id/snip/add", authGuard, collectionController.addSnipToCollection);
collectionRouter.patch("/:id/snip/remove", authGuard, collectionController.removeSnipFromCollection);
collectionRouter.patch("/:id", authGuard, collectionController.updateOne);
collectionRouter.delete("/:id", authGuard, collectionController.deleteOne);

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/files", fileRouter);
router.use("/snips", snipRouter);
router.use("/collections", collectionRouter);
router.use("/comments", commentRouter);
router.use("/search", searchRouter);

router.get("/health", (_, res) => {
   res.json({
      ok: true,
      message: "up and running",
      data: null
   })
})

export default router;