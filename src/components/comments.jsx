import React from 'react';
import Comment from './comment';
import Loading from './loading';

export default function Comments({
  comments,
  loading,
  count,
  onReply,
  onLoadMore
}) {
  if (!comments.length) {
    return <div className="vempty">还没有评论哦，快来抢沙发吧!</div>
  }

  let MoreBtn;
  if (!loading && comments.length < count) {
    MoreBtn = (
      <button
        type="button"
        className="vmore vbtn"
        onClick={onLoadMore}
      >查看更多...</button>
    );
  }

  return (
    <div>
      <ul className="vlist">
        {comments.map(comment =>
          <Comment key={comment.id} comment={comment} onReply={onReply} />
        )}
      </ul>
      <div className="vpage txt-center">
        <Loading show={loading} />
        {MoreBtn}
      </div>
    </div>
  );
}