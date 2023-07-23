import React, { useState } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewComment, updateComment } from "../../services/index/comments";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const CommentContainer = ({
    className,
    logginedUserId,
    comments,
    postSlug,
}) => {
    const queryClient = useQueryClient();
    const userState = useSelector((state) => state.user);
    const [affectedComment, setAffectedComment] = useState(null);
    const { mutate: mutateNewComment, isLoading: isLoadingNewComment } =
        useMutation({
            mutationFn: ({ token, desc, slug, parent, replyOnUser }) => {
                return createNewComment({
                    token,
                    desc,
                    slug,
                    parent,
                    replyOnUser,
                });
            },
            onSuccess: () => {
                toast.success(
                    "Your comment is sent successfully, it will be visible after confirmation from the Admin."
                );
            },
            onError: (error) => {
                toast.error(error.message);
                console.log(error);
            },
        });

    const { mutate: mutateUpdateComment } = useMutation({
        mutationFn: ({ token, desc, commentId }) => {
            return updateComment({
                token,
                desc,
                commentId,
            });
        },
        onSuccess: () => {
            toast.success("Your comment is updated successfully.");
            queryClient.invalidateQueries(["blog", postSlug]);
        },
        onError: (error) => {
            toast.error(error.message);
            console.log(error);
        },
    });
    const addCommentHandler = (value, parent = null, replyonUser = null) => {
        mutateNewComment({
            desc: value,
            parent,
            replyonUser,
            token: userState.userInfo.token,
            slug: postSlug,
        });
        setAffectedComment(null);
    };

    const updateCommentHandler = (value, commentId) => {
        mutateUpdateComment({
            token: userState.userInfo.token,
            desc: value,
            commentId,
        });
        setAffectedComment(null);
    };

    const deleteCommentHandler = (commentId) => {};

    return (
        <div className={`${className}`}>
            <CommentForm
                btnLabel="Send"
                formSubmitHandler={(value) => addCommentHandler(value)}
                loading={isLoadingNewComment}
            />
            <div className="space-y-4 mt-8">
                {comments.map((comment) => (
                    <Comment
                        key={comment._id}
                        comment={comment}
                        logginedUserId={logginedUserId}
                        affectedComment={affectedComment}
                        setAffectedComment={setAffectedComment}
                        addComment={addCommentHandler}
                        updateComment={updateCommentHandler}
                        deleteComment={deleteCommentHandler}
                        replies={comment.replies}
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentContainer;
