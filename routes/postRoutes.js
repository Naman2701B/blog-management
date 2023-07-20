const express = require("express");
const router = express.Router();
const { authGuard, adminGuard } = require("../middleware/authMiddleware");
const {
    createPost,
    updatePost,
    deletePost,
    getPost,
} = require("../controllers/postControllers");

router.post("/", authGuard, adminGuard, createPost);
router
    .route("/:slug")
    .delete(authGuard, adminGuard, deletePost)
    .put(authGuard, adminGuard, updatePost)
    .get(getPost);

module.exports = router;
