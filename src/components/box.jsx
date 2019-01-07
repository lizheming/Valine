import React from 'react';
import storage from '../utils/storage';

const USER_INFO_COMPONENTS = {
  nick: {
    type: 'text',
    placeholder: '称呼'
  },
  mail: {
    type: 'email',
    placeholder: '邮箱'
  },
  link: {
    type: 'text',
    placeholder: '网址(http://)'
  }
};
const CACHE_KEY = "ValineCache";

export default class extends React.Component {
  state = this.getInitialState();
  getInitialState() {
    const cacheUser = storage.getItem(CACHE_KEY) || {};
    const loginUser = this.props.userInfo || {};

    return {
      userInfo: !this.props.anonymous ? loginUser : cacheUser,
      userComment: ''
    };
  }

  changeUserInfo(name, value) {
    const { userInfo } = this.state;
    userInfo[name] = value;
    this.setState({ userInfo });
  }

  changeUserComment(value) {
    this.setState({ userComment: value });
  }

  submit = async () => {
    const { store, rid } = this.props;
    const { userInfo, userComment } = this.state;
    if (!userComment) {
      return;
    }

    const ret = await store.add({
      rid,
      comment: userComment,
      ...userInfo
    });

    this.setState(this.getInitialState());
    this.props.onSubmit(ret);
  }

  cancelReply = () => {
    this.props.onCancelReply();
  }

  login = () => {
    this.props.login();
  }

  renderUserInfo() {
    const { userInfo } = this.state;
    const { guest_info, anonymous } = this.props;
    if (!anonymous) {
      return null;
    }

    return (
      <div className={`vheader item${guest_info.length}`}>
        {guest_info.map(info => (
          <input
            key={info}
            type={USER_INFO_COMPONENTS[info].type}
            placeholder={USER_INFO_COMPONENTS[info].placeholder}
            className={`v${info} vinput`}
            name={info}
            value={userInfo[info]}
            onChange={e => this.changeUserInfo(info, e.target.value)}
          />
        ))}
      </div>
    );
  }

  renderButton() {
    const { reply, anonymous } = this.props;
    const { userInfo } = this.state;
    const btns = [];

    if (reply.nick) {
      btns.push(
        <button
          key="cancel"
          className="vbtn"
          type="button"
          onClick={this.cancelReply}
        >取消</button>
      );
    }

    if (!anonymous && !userInfo.mail) {
      btns.push(
        <button
          key="login"
          className="vbtn"
          type="button"
          onClick={this.login}
        >登录</button>
      );
      return btns;
    }

    btns.push(
      <button
        key="submit"
        className="vsubmit vbtn"
        type="button"
        onClick={this.submit}
      >回复</button>

    );
    return btns;
  }

  render() {
    let { placeholder, reply } = this.props;
    if (reply.nick) {
      placeholder = '@' + reply.nick;
    }

    return (
      <div className="vwrap">
        {this.renderUserInfo()}
        <div className="vedit">
          <textarea
            className="veditor vinput"
            placeholder={placeholder}
            value={this.state.userComment}
            onChange={e => this.changeUserComment(e.target.value)}
          />
        </div>
        <div className="vcontrol">
          <div className="col col-20" title="MarkDown is Support">
            <a
              href="https://segmentfault.com/markdown"
              target="_blank"
            >
              <svg
                className="markdown"
                viewBox="0 0 16 16"
                version="1.1"
                width="16"
                height="16"
                ariaHidden="true"
              >
                <path fillRule="evenodd" d="M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4 8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z" />
              </svg>
            </a>
          </div>
          <div className="col col-80 text-right">
            {this.renderButton()}
          </div>
        </div>
      </div>
    );
  }
}