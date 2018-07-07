"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scopePerRequest = scopePerRequest;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function scopePerRequest(container) {
  return (() => {
    var _ref = _asyncToGenerator(function* (ctx, next) {
      if (!ctx.state) {
        ctx.state = {};
      }
      ctx.state.container = container.createScope();
      try {
        return yield next();
      } finally {
        ctx.state.container.dispose();
      }
    });

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })();
};