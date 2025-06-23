import React from "react";

const BASE_REPLY_ROWS = 1;

function CommentTree({
  comment,
  postId,
  replyTarget,
  setReplyTarget,
  addReply,
  deleteComment,
  level = 0,
}) {
  return (
    <div
      className={`my-2 ${
        level === 0
          ? "p-3 bg-gradient-to-r from-[rgba(38,38,38,0.95)] to-[rgba(119,191,199,0.15)] border-l-4 border-[rgba(119,191,199,0.7)] rounded-md shadow-sm"
          : ""
      }`}
      style={level > 0 ? { marginLeft: `${level * 2}rem` } : {}}
    >
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <img
            src={
              comment.user?.image
                ? `https://zing.com/auth/${comment.user.image}`
                : "../public/images/pdp_basique.jpeg"
            }
            alt="Avatar"
            className={`rounded-full border-2 border-white object-cover ${
              level === 0 ? "w-7 h-7" : "w-5 h-5"
            }`}
          />
          <span
            className={`font-semibold ${
              level === 0
                ? "text-[rgba(119,191,199,0.9)]"
                : "text-cyan-300 text-sm"
            }`}
          >
            {comment.user?.username || "Utilisateur"}
          </span>
        </div>
        <span className="text-xs text-gray-400">
          {comment.date ? new Date(comment.date).toLocaleString("fr-FR") : ""}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <p className={`text-gray-100 ${level > 0 ? "text-sm" : ""}`}>
          {comment.content}
        </p>
        <button
          onClick={() => deleteComment(comment._id, postId, comment.parent_id)}
          className="ml-4 text-red-400 hover:text-red-600 transition"
          title="Supprimer le commentaire"
        >
          <img
            src="/icons/delete.png"
            alt="Supprimer"
            className={level === 0 ? "w-5 h-5" : "w-4 h-4"}
          />
        </button>
      </div>
      <button
        className="text-xs text-blue-400 mt-1"
        onClick={() =>
          setReplyTarget({
            commentId: comment._id,
            value: "",
            rows: BASE_REPLY_ROWS,
          })
        }
      >
        Répondre
      </button>
      {replyTarget && replyTarget.commentId === comment._id && (
        <div className="mt-2 flex flex-col gap-1">
          <textarea
            value={replyTarget.value}
            onChange={(e) => {
              const lines = e.target.value.split("\n").length;
              setReplyTarget((rt) => ({
                ...rt,
                value: e.target.value,
                rows: Math.max(BASE_REPLY_ROWS, lines),
              }));
            }}
            placeholder="Votre réponse..."
            className="w-full p-2 rounded border bg-gray-800 text-gray-100"
            rows={replyTarget.rows}
            style={{ resize: "none" }}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => addReply(postId, comment._id)}
              className="px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded text-xs"
            >
              Répondre
            </button>
            <button
              onClick={() => setReplyTarget(null)}
              className="px-2 py-1 text-xs text-gray-400 hover:text-red-400"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
      {comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <CommentTree
              key={reply._id}
              comment={reply}
              postId={postId}
              replyTarget={replyTarget}
              setReplyTarget={setReplyTarget}
              addReply={addReply}
              deleteComment={deleteComment}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentTree;
