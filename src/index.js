import React from 'react';
import ReactDOM from 'react-dom';

import * as helper from './utils/helper';
import Model from './model/leancloud';
import App from './app';


module.exports = class {
  init(options) {
    options = helper.parseOptions(options);
    const store = new Model(options);
    ReactDOM.render(<App {...options} store={store} />, options.el);
  }
}