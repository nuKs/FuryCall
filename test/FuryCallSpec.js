describe("FuryCall", function() {

  beforeEach(function() {
    FuryCall.setResolveFn(when.resolve.bind(when));
  });

  describe("constructor", function() {

    it("may specify a method call prototype", function() {
      function _fn() {}
      function _resolveFn() {}
      function _rejectFn() {}
      function _callbackFn() {}

      var call = new FuryCall({
        object: this,
        fn: _fn,
        args: arguments,
        $then: _resolveFn, // @optional
        $catch: _rejectFn, // @optional
        $3: _callbackFn // @optional
      });

      // @todo check the after state
    });

  });

  describe("#exec", function() {

    it("should execute the method with the same args", function() {
      var fn = jasmine.createSpy('someFn');
      var someObj = {};

      var call = new FuryCall({
        object: someObj,
        fn: fn,
        args: ['gracia', 34]
      });

      call.exec();
      expect(fn.calls.mostRecent().object).toBe(someObj);
      expect(fn).toHaveBeenCalledWith('gracia', 34);
    });

    it("may override properties", function() {
      var fn = jasmine.createSpy('someFn');
      var someObj = {};

      var call = new FuryCall({
        object: someObj,
        fn: fn,
        args: ['gracia', 34]
      });

      call.exec({
        object: null,
        args: ['hehe']
      });

      expect(fn.calls.mostRecent().object).not.toBe(someObj);
      expect(fn).toHaveBeenCalledWith('hehe');
    });

    xit("may override param", function() {

      var call = new FuryCall({
        object: someObj,
        fn: fn,
        args: ['gracia', 34]
      });

      call.exec(['overriding', 'args', ':/']);

      // @todo test
    });

    it("should redefine callbacks", function() {
      var fn = jasmine.createSpy('someFn');
      var cbFn = function() {};

      var call = new FuryCall({
        fn: fn
      });

      call.exec({
        $1: cbFn
      });

      expect(fn).toHaveBeenCalledWith(undefined, cbFn);
    });

    it("should insert promise", function(done) {
      var fn = sinon.spy(),
          nextFn = sinon.spy(),
          errorFn = sinon.stub().throws(),
          fn2,
          nextFn2,
          errorFn2;

      var call = new FuryCall({
        fn: fn
      });

      call
      .exec({
        $then: nextFn,
        $catch: errorFn
      })
      .then(function() {
        expect(fn.calledOnce).toBe(true);
        expect(nextFn.calledOnce).toBe(true);
        expect(nextFn.calledAfter(fn)).toBe(true);
        expect(errorFn.called).toBe(false);
      })
      .then(function() {
        fn2 = sinon.stub().returns(when.reject("my bad"));
        nextFn2 = sinon.spy();
        errorFn2 = sinon.stub().throws();

        return call.exec({
          fn: fn2,
          $then: nextFn2,
          $catch: errorFn2
        });
      })
      .ensure(function() {
        expect(fn2.calledOnce).toBe(true);
        expect(nextFn2.called).toBe(false);
        expect(errorFn2.calledOnce).toBe(true);
        expect(errorFn2.calledAfter(fn2)).toBe(true);
        done();
      });
    });

  });

  xdescribe("#_parseOptions", function() {
    // may be overriden
  });

  xdescribe("FuryCall.createParser", function() {
    // @todo
  });

});