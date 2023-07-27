import axios from "axios";
export const getAllPosts = async (searchKeyword = "", page = 1, limit = 1) => {
    try {
        const { data, headers } = await axios.get(
            `/api/posts?searchKeyword=${searchKeyword}&page=${page}&limit=${limit}`
        );
        return { data, headers };
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error(error.message);
    }
};

export const getSinglePosts = async ({ slug }) => {
    try {
        const { data } = await axios.get(`/api/posts/${slug}`);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error(error.message);
    }
};

export const deletePosts = async ({ slug, token }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const { data } = await axios.delete(`/api/posts/${slug}`, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error(error.message);
    }
};