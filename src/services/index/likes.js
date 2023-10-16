import axios from "axios";

export const likesCount = async ({ slug, token }) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };
    await axios.put(`/api/posts/${slug}/likes`, {}, config);
};
