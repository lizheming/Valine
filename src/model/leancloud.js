import md5 from 'blueimp-md5';
export default class {
  constructor({ av, app_id, app_key, path, gravatar } = {}) {
    if (!app_id || !app_key) {
      // _root.loading.hide();
      throw '初始化失败，请检查你的appid或者appkey.';
    }

    av = av || global.AV;
    av.applicationId = null;
    av.init({
      appId: app_id,
      appKey: app_key
    });
    this.db = av;
    this.path = path;
    this.gravatar = gravatar;
  }

  buildAvatar(cmt) {
    const { gravatar } = this;
    const mail = cmt.get('mail');
    const nick = cmt.get('nick');
    return gravatar.cdn + md5(mail || nick) + gravatar.params;
  }

  async add(comment) {
    const { db } = this;
    const cmt = new (db.Object.extend('Comment'));

    const acl = new db.ACL();
    acl.setPublicReadAccess(true);
    acl.setPublicWriteAccess(false);
    cmt.setACL(acl);

    comment = Object.assign({
      comment: '',
      rid: '',
      nick: 'Guest',
      mail: '',
      link: '',
      ua: navigator.userAgent,
      url: this.path,
      pin: 0,
      like: 0
    }, comment);
    for (const k in comment) {
      cmt.set(k, comment[k]);
    }

    return cmt.save();
  }

  async count() {
    const { db } = this;
    const query = db.Query.or(
      (new db.Query('Comment')).doesNotExist('rid'),
      (new db.Query('Comment')).equalTo('rid', '')
    );
    query.equalTo('url', this.path);
    return query.count();
  }

  async countSelect({ page = 1, pageSize = 10 }) {
    const { db } = this;
    const count = await this.count();

    const query = db.Query.or(
      (new db.Query('Comment')).doesNotExist('rid'),
      (new db.Query('Comment')).equalTo('rid', '')
    );
    query.equalTo('url', this.path);
    query.addDescending('createdAt');
    query.addDescending('insertedAt');
    query.limit(pageSize);
    query.skip((page - 1) * pageSize);
    const ret = await query.find();

    const rids = ret.map(cmt => cmt.id);
    const childrenObj = {};

    if (rids.length) {
      const childQuery = new db.Query('Comment');
      const children = await childQuery.containedIn('rid', rids)
        .addDescending('createdAt')
        .addDescending('insertdAt')
        .find();
      children.forEach(child => {
        const avatar = child.get('avatar');
        if (!avatar) {
          child.set('avatar', this.buildAvatar(child));
        }
        const rid = child.get('rid');
        if (!childrenObj[rid]) {
          childrenObj[rid] = [];
        }
        childrenObj[rid].push(child);
      });
    }

    return {
      count,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
      data: ret.map(cmt => {
        const avatar = cmt.get('avatar');
        if (!avatar) {
          cmt.set('avatar', this.buildAvatar(cmt));
        }
        if (Array.isArray(childrenObj[cmt.id])) {
          cmt.children = childrenObj[cmt.id];
        }
        return cmt;
      })
    };
  }
}