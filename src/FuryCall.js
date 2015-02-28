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

  FuryCall.createParser = function(tokens) {
    var FuryCallParser = function(opts) {
      FuryCall.call(this, opts);
    };
    FuryCallParser.prototype = Object.create(FuryCall.prototype);
    FuryCallParser.prototype.constructor = FuryCallParser;
    FuryCallParser.prototype._parseOptions = function(opts) {
      opts = FuryCall.prototype._parseOptions.call(this, opts);

      for (var i in opts) {
        if (opts.hasOwnProperty(i) && tokens.hasOwnProperty(opts[i])) {
          opts[i] = tokens[opts[i]].call(this);
        }
      }

      return opts;
    };

    return FuryCallParser;
  };

  FuryCall.prototype.exec = function(opts) {
    opts = this._parseOptions(opts);

    if (opts.$then === null && opts.$catch === null) {
      return opts.fn.apply(opts.object, opts.args);
    }
    else if (typeof FuryCall.resolveFn === 'function') {
      return FuryCall
      .resolveFn(opts.fn.apply(opts.object, opts.args))
      .then(opts.$then, opts.$catch);
    }
    else {
      return opts.fn
      .apply(opts.object, opts.args)
      .then(opts.$then, opts.$catch);
    }
  };

  FuryCall.prototype._parseOptions = function(opts) {
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

    return {
      fn: fn,
      object: object,
      args: args,
      $then: $then,
      $catch: $catch
    };
  };

  if (typeof exports !== 'undefined') {
    exports.module = FuryCall;
  }
  else {
    window.FuryCall = FuryCall;
  }

})();