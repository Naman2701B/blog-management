const uploadPicture = require("../middleware/uploadPictureMiddleware");
const Post = require("../models/Posts");
const fileRemover = require("../utils/fileRemover");
const { v4: uuidv4 } = require("uuid");
const Comment = require("../models/Comment");

const createPost = async (req, res, next) => {
    try {
        const upload = uploadPicture.single("postPicture");

        const handleUpdatePostData = async (data, photo) => {
            const { title, caption, body, tags = [] } = JSON.parse(data);

            const post = new Post({
                title,
                caption,
                slug: uuidv4(),
                body: {
                    type: body.type,
                    content: body.content,
                },
                photo,
                tags,
                user: req.user._id,
            });

            const createdPost = await post.save();
            return res.json(createdPost);
        };

        upload(req, res, async function (err) {
            if (err) {
                const error = new Error(
                    "An unknown error occurred while uploading." + err.message
                );
                next(error);
            } else {
                let filename;
                if (req.file) {
                    filename = req.file.filename;
                } else {
                    filename = "";
                }
                handleUpdatePostData(req.body.document, filename);
            }
        });

    } catch (error) {
        next(error);
    }
};

const updatePost = async (req, res, next) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug });
        if (!post) {
            const error = new Error("Post was not found!");
            next(error);
            return;
        }
        const upload = uploadPicture.single("postPicture");
        const handleUpdatePostData = async (data) => {
            const { title, caption, slug, body, tags, categories } =
                JSON.parse(data);
            post.title = title || post.title;
            post.caption = caption || post.caption;
            post.slug = slug || post.slug;
            post.body = body || post.body;
            post.tags = tags || post.tags;
            post.categories = categories || post.categories;
            const updatedPost = await post.save();
            return res.json(updatedPost);
        };
        upload(req, res, async function (err) {
            if (err) {
                const error = new Error(
                    "An unknown error occurred while uploading!" + err.message
                );
                next(error);
            } else {
                // everything went well
                if (req.file) {
                    let filename;
                    filename = post.photo;
                    if (filename) {
                        fileRemover(filename);
                    }
                    post.photo = req.file.filename;
                    handleUpdatePostData(req.body.document);
                } else {
                    let filename;
                    filename = post.photo;
                    post.photo = "";
                    fileRemover(filename);
                    handleUpdatePostData(req.body.document);
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findOneAndDelete({ slug: req.params.slug });
        if (!post) {
            const error = new Error("Post was not found!");
            return next(error);
        }
        const comments = await Comment.deleteMany({ post: post._id });
        return res.json({
            message: "Post is successfully deleted.",
        });
    } catch (error) {
        next(error);
    }
};

const getPost = async (req, res, next) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug }).populate([
            { path: "user", select: ["avatar", "name"] },
            {
                path: "comments",
                match: { check: true, parent: null },
                populate: [
                    { path: "user", select: ["avatar", "name"] },
                    {
                        path: "replies",
                        match: { check: true },
                        populate: [
                            { path: "user", select: ["avatar", "name"] },
                        ],
                    },
                ],
            },
        ]);
        if (!post) {
            const error = new Error("Post was not found!");
            next(error);
        }
        return res.json(post);
    } catch (error) {
        next(error);
    }
};

const getAllPost = async (req, res, next) => {
    try {
        const filter = req.query.searchKeyword;
        let where = {};
        if (filter) {
            where.title = { $regex: filter, $options: "i" };
        }
        let query = Post.find(where);
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * pageSize;
        const total = await Post.find(where).countDocuments();
        const pages = Math.ceil(total / pageSize);
        res.header({
            "x-filter": filter,
            "x-totalCount": JSON.stringify(total),
            "x-currentPage": JSON.stringify(page),
            "x-pageSize": JSON.stringify(pageSize),
            "x-totalPageCount": JSON.stringify(pages),
        });
        if (page > pages) {
            return res.json([]);
        }
        const result = await query
            .skip(skip)
            .limit(pageSize)
            .populate([
                { path: "user", select: ["avatar", "name", "verified"] },
            ])
            .sort({ updatedAt: "descending" });
        return res.json(result);
    } catch (error) {
        next(error);
    }
};
module.exports = {
    createPost,
    updatePost,
    deletePost,
    getPost,
    getAllPost,
};
