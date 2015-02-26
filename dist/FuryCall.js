(function() {
  'use strict';

  function FuryCall(opts) {
    opts = opts || {};
    this._object = opts.object;
    this._fn = opts.fn;
    this._args = opts.args;

    this._$then = opts.$then;
    this._$catch = opts.$catch;
    this._$args = {};

    for (var i in opts) {
      if (opts.hasOwnProperty(i) && i.charAt(0) === '$' && i !== '$then' && i !== '$catch') {
        var argNb = i.substr(1);
        this._$args[argNb] = opts[i];
      }
    }
  }
  FuryCall.resolveFn = null;

  FuryCall.setResolveFn = function(resolveFn) {
    FuryCall.resolveFn = resolveFn;
  };

  FuryCall.prototype.exec = function(opts) {
    opts = opts || {};

    var fn = (typeof opts.fn !== 'undefined') ? opts.fn : this._fn;
    var object = (typeof opts.object !== 'undefined') ? opts.object : (this._object || undefined);
    var $then = (typeof opts.$then !== 'undefined') ? opts.$then : (this._$then || null);
    var $catch = (typeof opts.$catch !== 'undefined') ? opts.$catch : (this._$catch || null);

    var args = (typeof opts.args !== 'undefined') ? (opts.args || []) : (this._args || []);
    for (var i in opts) {
      if (opts.hasOwnProperty(i) && i.charAt(0) === '$' && i !== '$then' && i !== '$catch') {
        var argNb = i.substr(1);
        args[argNb] = opts[i];
      }
    }
    for (var j in this._$args) {
      if (!(j in args) && this._$args.hasOwnProperty(j)) {
        args[j] = this._$args[j];
      }
    }

    if ($then === null && $catch === null) {
      return fn.apply(object, args);
    }
    else if (typeof FuryCall.resolveFn === 'function') {
      return FuryCall
      .resolveFn(fn.apply(object, args))
      .then($then, $catch);
    }
    else {
      return fn
      .apply(object, args)
      .then($then, $catch);
    }

  };

  if (typeof exports !== 'undefined') {
    exports.module = FuryCall;
  }
  else {
    window.FuryCall = FuryCall;
  }

})();
//# sourceMappingURL=FuryCall.js.map