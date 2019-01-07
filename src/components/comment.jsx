import React from 'react';
import detect from '../utils/detect';
import { getLink, timeAgo } from '../utils/helper';

export default function Comment({ comment, onReply }) {
  const nick = comment.get('nick');
  const mail = comment.get('mail');
  const link = comment.get('link');
  const text = comment.get('comment');
  const avatar = comment.get('avatar');
  const createAt = timeAgo(comment.get('createdAt'));

  const url = getLink({ link, mail });
  const sys = detect(comment.get('ua'));
  return (
    <li className="vcard" id={comment.id} key={comment.id}>
      <img src={avatar} alt={nick} className="vimg" />
      <section className="vh">
        <div className="vhead">
          <a className="vnick" href={url} rel="nofollow" target="_blank">{nick}</a>
          <span className="vsys">{sys.browser} {sys.version}</span>
          <span className="vsys">{sys.os} {sys.osVersion}</span>
        </div>
        <div className="vmeta">
          <span className="vtime">{createAt}</span>
          <span className="vat" onClick={() => onReply(comment)}>回复</span>
        </div>
        <div
          className="vcontent"
        // dangerouslySetInnerHTML={{ __html: text }}
        >{text}</div>
        <div className="vquote">
          {!comment.children ? null : comment.children.map(cmt =>
            <Comment
              key={cmt.id}
              comment={cmt}
              onReply={() => onReply(cmt)}
            />
          )}
        </div>
      </section>
    </li>
  );
}