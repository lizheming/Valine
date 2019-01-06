import React from 'react';
import CommentBox from './components/box';
import CommentList from './components/comments';

export default class extends React.Component {
  state = this.getInitialState();
  getInitialState() {
    return {
      loading: false,
      count: 0,
      page: 0,
      list: [],
      reply: {}
    }
  }

  constructor(...args) {
    super(...args);
    this.getCommentList();
  }

  getCommentList = async () => {
    let { list, page } = this.state;
    this.setState({ loading: true });
    const { store } = this.props;
    const { count, currentPage, data } = await store.countSelect({
      page: page + 1,
      pageSize: 100
    });
    this.setState({
      list: [...list, ...data] || list,
      page: currentPage,
      loading: false,
      count
    });
  }

  onReply = comment => {
    this.setState({
      reply: {
        id: comment.id,
        nick: comment.get('nick'),
        mail: comment.get('mail')
      }
    });
    document.querySelector('.vwrap').scrollIntoView({
      behavior: 'smooth'
    });
  }

  onSubmitComment = comment => {
    this.setState({
      list: [comment, ...this.state.list],
      reply: this.getInitialState().reply
    });
  }

  renderCommentInfo() {
    const { count } = this.state;
    return (
      <div className="info">
        <div className="count col">
          {count ? <span><span class="num">867</span> 评论</span> : null}
        </div>
      </div>
    );
  }
  render() {
    const { count, list, loading } = this.state;
    return (
      <div className="valine">
        <CommentBox
          {...this.props}
          reply={this.state.reply}
          onSubmit={this.onSubmitComment}
        />
        {this.renderCommentInfo()}
        <CommentList
          count={count}
          comments={list}
          loading={loading}
          onReply={this.onReply}
          onLoadMore={this.getCommentList}
        />
        {this.renderValineInfo()}
      </div>
    );
  }
  renderValineInfo() {
    return (
      <div className="info">
        <div className="power txt-right">
          Powered By
        <a href="http://valine.js.org" target="_blank">Valine-v</a>
        </div>
      </div>
    );
  }
}