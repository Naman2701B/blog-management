const express = require("express");
const router = express.Router();
const { authGuard, adminGuard } = require("../middleware/authMiddleware");
const {
    createPost,
    updatePost,
    deletePost,
    getPost,
    getAllPost,
} = require("../controllers/postControllers");

router.route("/").post(authGuard, adminGuard, createPost).get(getAllPost);
router
    .route("/:slug")
    .delete(authGuard, adminGuard, deletePost)
    .put(authGuard, adminGuard, updatePost)
    .get(getPost);

module.exports = router;
