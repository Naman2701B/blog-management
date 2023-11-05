import axios from "axios";
export const createNewComment = async ({
    token,
    desc,
    slug,
    parent,
    replyOnUser,
}) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const { data } = await axios.post(
            "/api/comments",
            {
                desc,
                slug,
                parent,
                replyOnUser,
            },
            config
        );
        return data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error(error.message);
    }
};

export const updateComment = async ({ token, desc, commentId }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const { data } = await axios.put(
            `/api/comments/${commentId}`,
            {
                desc,
            },
            config
        );
        return data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error(error.message);
    }
};

export const deleteComment = async ({ token, commentId }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const { data } = await axios.delete(
            `/api/comments/${commentId}`,
            config
        );
        return data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error(error.message);
    }
};

export const getAllCommentsofUser = async (token, email) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const { data } = await axios.get(`/api/comments/${email}`, config);
        console.log(data);
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};
