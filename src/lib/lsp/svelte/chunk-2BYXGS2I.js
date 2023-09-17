import { c, j, h, t, f, s, i, H, G, K, J, M, L, O, N, g, d, b } from './chunk-2LDABZU6.js';

new URL(import.meta.url).pathname;
var rt = c((te) => {
	j();
	h();
	Object.defineProperty(te, '__esModule', { value: !0 });
	te.stringArray = te.array = te.func = te.error = te.number = te.string = te.boolean = void 0;
	function ma(e) {
		return e === !0 || e === !1;
	}
	te.boolean = ma;
	function ho(e) {
		return typeof e == 'string' || e instanceof String;
	}
	te.string = ho;
	function ya(e) {
		return typeof e == 'number' || e instanceof Number;
	}
	te.number = ya;
	function va(e) {
		return e instanceof Error;
	}
	te.error = va;
	function ba(e) {
		return typeof e == 'function';
	}
	te.func = ba;
	function go(e) {
		return Array.isArray(e);
	}
	te.array = go;
	function Ra(e) {
		return go(e) && e.every((t) => ho(t));
	}
	te.stringArray = Ra;
});
var Zr = c((b) => {
	j();
	h();
	Object.defineProperty(b, '__esModule', { value: !0 });
	b.Message =
		b.NotificationType9 =
		b.NotificationType8 =
		b.NotificationType7 =
		b.NotificationType6 =
		b.NotificationType5 =
		b.NotificationType4 =
		b.NotificationType3 =
		b.NotificationType2 =
		b.NotificationType1 =
		b.NotificationType0 =
		b.NotificationType =
		b.RequestType9 =
		b.RequestType8 =
		b.RequestType7 =
		b.RequestType6 =
		b.RequestType5 =
		b.RequestType4 =
		b.RequestType3 =
		b.RequestType2 =
		b.RequestType1 =
		b.RequestType =
		b.RequestType0 =
		b.AbstractMessageSignature =
		b.ParameterStructures =
		b.ResponseError =
		b.ErrorCodes =
			void 0;
	var ze = rt(),
		mo;
	(function (e) {
		(e.ParseError = -32700),
			(e.InvalidRequest = -32600),
			(e.MethodNotFound = -32601),
			(e.InvalidParams = -32602),
			(e.InternalError = -32603),
			(e.jsonrpcReservedErrorRangeStart = -32099),
			(e.serverErrorStart = -32099),
			(e.MessageWriteError = -32099),
			(e.MessageReadError = -32098),
			(e.PendingResponseRejected = -32097),
			(e.ConnectionInactive = -32096),
			(e.ServerNotInitialized = -32002),
			(e.UnknownErrorCode = -32001),
			(e.jsonrpcReservedErrorRangeEnd = -32e3),
			(e.serverErrorEnd = -32e3);
	})((mo = b.ErrorCodes || (b.ErrorCodes = {})));
	var kr = class e extends Error {
		constructor(t, n, i) {
			super(n),
				(this.code = ze.number(t) ? t : mo.UnknownErrorCode),
				(this.data = i),
				Object.setPrototypeOf(this, e.prototype);
		}
		toJson() {
			let t = { code: this.code, message: this.message };
			return this.data !== void 0 && (t.data = this.data), t;
		}
	};
	b.ResponseError = kr;
	var se = class e {
		constructor(t) {
			this.kind = t;
		}
		static is(t) {
			return t === e.auto || t === e.byName || t === e.byPosition;
		}
		toString() {
			return this.kind;
		}
	};
	b.ParameterStructures = se;
	se.auto = new se('auto');
	se.byPosition = new se('byPosition');
	se.byName = new se('byName');
	var I = class {
		constructor(t, n) {
			(this.method = t), (this.numberOfParams = n);
		}
		get parameterStructures() {
			return se.auto;
		}
	};
	b.AbstractMessageSignature = I;
	var xr = class extends I {
		constructor(t) {
			super(t, 0);
		}
	};
	b.RequestType0 = xr;
	var Mr = class extends I {
		constructor(t, n = se.auto) {
			super(t, 1), (this._parameterStructures = n);
		}
		get parameterStructures() {
			return this._parameterStructures;
		}
	};
	b.RequestType = Mr;
	var Er = class extends I {
		constructor(t, n = se.auto) {
			super(t, 1), (this._parameterStructures = n);
		}
		get parameterStructures() {
			return this._parameterStructures;
		}
	};
	b.RequestType1 = Er;
	var Nr = class extends I {
		constructor(t) {
			super(t, 2);
		}
	};
	b.RequestType2 = Nr;
	var Or = class extends I {
		constructor(t) {
			super(t, 3);
		}
	};
	b.RequestType3 = Or;
	var jr = class extends I {
		constructor(t) {
			super(t, 4);
		}
	};
	b.RequestType4 = jr;
	var Lr = class extends I {
		constructor(t) {
			super(t, 5);
		}
	};
	b.RequestType5 = Lr;
	var Ar = class extends I {
		constructor(t) {
			super(t, 6);
		}
	};
	b.RequestType6 = Ar;
	var Ir = class extends I {
		constructor(t) {
			super(t, 7);
		}
	};
	b.RequestType7 = Ir;
	var Fr = class extends I {
		constructor(t) {
			super(t, 8);
		}
	};
	b.RequestType8 = Fr;
	var Wr = class extends I {
		constructor(t) {
			super(t, 9);
		}
	};
	b.RequestType9 = Wr;
	var $r = class extends I {
		constructor(t, n = se.auto) {
			super(t, 1), (this._parameterStructures = n);
		}
		get parameterStructures() {
			return this._parameterStructures;
		}
	};
	b.NotificationType = $r;
	var Hr = class extends I {
		constructor(t) {
			super(t, 0);
		}
	};
	b.NotificationType0 = Hr;
	var Ur = class extends I {
		constructor(t, n = se.auto) {
			super(t, 1), (this._parameterStructures = n);
		}
		get parameterStructures() {
			return this._parameterStructures;
		}
	};
	b.NotificationType1 = Ur;
	var zr = class extends I {
		constructor(t) {
			super(t, 2);
		}
	};
	b.NotificationType2 = zr;
	var Vr = class extends I {
		constructor(t) {
			super(t, 3);
		}
	};
	b.NotificationType3 = Vr;
	var Br = class extends I {
		constructor(t) {
			super(t, 4);
		}
	};
	b.NotificationType4 = Br;
	var Jr = class extends I {
		constructor(t) {
			super(t, 5);
		}
	};
	b.NotificationType5 = Jr;
	var Xr = class extends I {
		constructor(t) {
			super(t, 6);
		}
	};
	b.NotificationType6 = Xr;
	var Qr = class extends I {
		constructor(t) {
			super(t, 7);
		}
	};
	b.NotificationType7 = Qr;
	var Gr = class extends I {
		constructor(t) {
			super(t, 8);
		}
	};
	b.NotificationType8 = Gr;
	var Yr = class extends I {
		constructor(t) {
			super(t, 9);
		}
	};
	b.NotificationType9 = Yr;
	(function (e) {
		function t(r) {
			let s = r;
			return s && ze.string(s.method) && (ze.string(s.id) || ze.number(s.id));
		}
		e.isRequest = t;
		function n(r) {
			let s = r;
			return s && ze.string(s.method) && r.id === void 0;
		}
		e.isNotification = n;
		function i(r) {
			let s = r;
			return (
				s &&
				(s.result !== void 0 || !!s.error) &&
				(ze.string(s.id) || ze.number(s.id) || s.id === null)
			);
		}
		e.isResponse = i;
	})(b.Message || (b.Message = {}));
});
var en = c((ke) => {
	j();
	h();
	var yo;
	Object.defineProperty(ke, '__esModule', { value: !0 });
	ke.LRUCache = ke.LinkedMap = ke.Touch = void 0;
	var ne;
	(function (e) {
		(e.None = 0), (e.First = 1), (e.AsOld = e.First), (e.Last = 2), (e.AsNew = e.Last);
	})((ne = ke.Touch || (ke.Touch = {})));
	var Xt = class {
		constructor() {
			(this[yo] = 'LinkedMap'),
				(this._map = new Map()),
				(this._head = void 0),
				(this._tail = void 0),
				(this._size = 0),
				(this._state = 0);
		}
		clear() {
			this._map.clear(),
				(this._head = void 0),
				(this._tail = void 0),
				(this._size = 0),
				this._state++;
		}
		isEmpty() {
			return !this._head && !this._tail;
		}
		get size() {
			return this._size;
		}
		get first() {
			return this._head?.value;
		}
		get last() {
			return this._tail?.value;
		}
		has(t) {
			return this._map.has(t);
		}
		get(t, n = ne.None) {
			let i = this._map.get(t);
			if (i) return n !== ne.None && this.touch(i, n), i.value;
		}
		set(t, n, i = ne.None) {
			let r = this._map.get(t);
			if (r) (r.value = n), i !== ne.None && this.touch(r, i);
			else {
				switch (((r = { key: t, value: n, next: void 0, previous: void 0 }), i)) {
					case ne.None:
						this.addItemLast(r);
						break;
					case ne.First:
						this.addItemFirst(r);
						break;
					case ne.Last:
						this.addItemLast(r);
						break;
					default:
						this.addItemLast(r);
						break;
				}
				this._map.set(t, r), this._size++;
			}
			return this;
		}
		delete(t) {
			return !!this.remove(t);
		}
		remove(t) {
			let n = this._map.get(t);
			if (n) return this._map.delete(t), this.removeItem(n), this._size--, n.value;
		}
		shift() {
			if (!this._head && !this._tail) return;
			if (!this._head || !this._tail) throw new Error('Invalid list');
			let t = this._head;
			return this._map.delete(t.key), this.removeItem(t), this._size--, t.value;
		}
		forEach(t, n) {
			let i = this._state,
				r = this._head;
			for (; r; ) {
				if ((n ? t.bind(n)(r.value, r.key, this) : t(r.value, r.key, this), this._state !== i))
					throw new Error('LinkedMap got modified during iteration.');
				r = r.next;
			}
		}
		keys() {
			let t = this._state,
				n = this._head,
				i = {
					[Symbol.iterator]: () => i,
					next: () => {
						if (this._state !== t) throw new Error('LinkedMap got modified during iteration.');
						if (n) {
							let r = { value: n.key, done: !1 };
							return (n = n.next), r;
						} else return { value: void 0, done: !0 };
					},
				};
			return i;
		}
		values() {
			let t = this._state,
				n = this._head,
				i = {
					[Symbol.iterator]: () => i,
					next: () => {
						if (this._state !== t) throw new Error('LinkedMap got modified during iteration.');
						if (n) {
							let r = { value: n.value, done: !1 };
							return (n = n.next), r;
						} else return { value: void 0, done: !0 };
					},
				};
			return i;
		}
		entries() {
			let t = this._state,
				n = this._head,
				i = {
					[Symbol.iterator]: () => i,
					next: () => {
						if (this._state !== t) throw new Error('LinkedMap got modified during iteration.');
						if (n) {
							let r = { value: [n.key, n.value], done: !1 };
							return (n = n.next), r;
						} else return { value: void 0, done: !0 };
					},
				};
			return i;
		}
		[((yo = Symbol.toStringTag), Symbol.iterator)]() {
			return this.entries();
		}
		trimOld(t) {
			if (t >= this.size) return;
			if (t === 0) {
				this.clear();
				return;
			}
			let n = this._head,
				i = this.size;
			for (; n && i > t; ) this._map.delete(n.key), (n = n.next), i--;
			(this._head = n), (this._size = i), n && (n.previous = void 0), this._state++;
		}
		addItemFirst(t) {
			if (!this._head && !this._tail) this._tail = t;
			else if (this._head) (t.next = this._head), (this._head.previous = t);
			else throw new Error('Invalid list');
			(this._head = t), this._state++;
		}
		addItemLast(t) {
			if (!this._head && !this._tail) this._head = t;
			else if (this._tail) (t.previous = this._tail), (this._tail.next = t);
			else throw new Error('Invalid list');
			(this._tail = t), this._state++;
		}
		removeItem(t) {
			if (t === this._head && t === this._tail) (this._head = void 0), (this._tail = void 0);
			else if (t === this._head) {
				if (!t.next) throw new Error('Invalid list');
				(t.next.previous = void 0), (this._head = t.next);
			} else if (t === this._tail) {
				if (!t.previous) throw new Error('Invalid list');
				(t.previous.next = void 0), (this._tail = t.previous);
			} else {
				let n = t.next,
					i = t.previous;
				if (!n || !i) throw new Error('Invalid list');
				(n.previous = i), (i.next = n);
			}
			(t.next = void 0), (t.previous = void 0), this._state++;
		}
		touch(t, n) {
			if (!this._head || !this._tail) throw new Error('Invalid list');
			if (!(n !== ne.First && n !== ne.Last)) {
				if (n === ne.First) {
					if (t === this._head) return;
					let i = t.next,
						r = t.previous;
					t === this._tail
						? ((r.next = void 0), (this._tail = r))
						: ((i.previous = r), (r.next = i)),
						(t.previous = void 0),
						(t.next = this._head),
						(this._head.previous = t),
						(this._head = t),
						this._state++;
				} else if (n === ne.Last) {
					if (t === this._tail) return;
					let i = t.next,
						r = t.previous;
					t === this._head
						? ((i.previous = void 0), (this._head = i))
						: ((i.previous = r), (r.next = i)),
						(t.next = void 0),
						(t.previous = this._tail),
						(this._tail.next = t),
						(this._tail = t),
						this._state++;
				}
			}
		}
		toJSON() {
			let t = [];
			return (
				this.forEach((n, i) => {
					t.push([i, n]);
				}),
				t
			);
		}
		fromJSON(t) {
			this.clear();
			for (let [n, i] of t) this.set(n, i);
		}
	};
	ke.LinkedMap = Xt;
	var Kr = class extends Xt {
		constructor(t, n = 1) {
			super(), (this._limit = t), (this._ratio = Math.min(Math.max(0, n), 1));
		}
		get limit() {
			return this._limit;
		}
		set limit(t) {
			(this._limit = t), this.checkTrim();
		}
		get ratio() {
			return this._ratio;
		}
		set ratio(t) {
			(this._ratio = Math.min(Math.max(0, t), 1)), this.checkTrim();
		}
		get(t, n = ne.AsNew) {
			return super.get(t, n);
		}
		peek(t) {
			return super.get(t, ne.None);
		}
		set(t, n) {
			return super.set(t, n, ne.Last), this.checkTrim(), this;
		}
		checkTrim() {
			this.size > this._limit && this.trimOld(Math.round(this._limit * this._ratio));
		}
	};
	ke.LRUCache = Kr;
});
var vo = c((Dt) => {
	j();
	h();
	Object.defineProperty(Dt, '__esModule', { value: !0 });
	Dt.Disposable = void 0;
	(function (e) {
		function t(n) {
			return { dispose: n };
		}
		e.create = t;
	})(Dt.Disposable || (Dt.Disposable = {}));
});
var Fe = c((nn) => {
	j();
	h();
	Object.defineProperty(nn, '__esModule', { value: !0 });
	var tn;
	function rn() {
		if (tn === void 0) throw new Error('No runtime abstraction layer installed');
		return tn;
	}
	(function (e) {
		function t(n) {
			if (n === void 0) throw new Error('No runtime abstraction layer provided');
			tn = n;
		}
		e.install = t;
	})(rn || (rn = {}));
	nn.default = rn;
});
var nt = c((Ve) => {
	j();
	h();
	Object.defineProperty(Ve, '__esModule', { value: !0 });
	Ve.Emitter = Ve.Event = void 0;
	var wa = Fe();
	(function (e) {
		let t = { dispose() {} };
		e.None = function () {
			return t;
		};
	})(Ve.Event || (Ve.Event = {}));
	var on = class {
			add(t, n = null, i) {
				this._callbacks || ((this._callbacks = []), (this._contexts = [])),
					this._callbacks.push(t),
					this._contexts.push(n),
					Array.isArray(i) && i.push({ dispose: () => this.remove(t, n) });
			}
			remove(t, n = null) {
				if (!this._callbacks) return;
				let i = !1;
				for (let r = 0, s = this._callbacks.length; r < s; r++)
					if (this._callbacks[r] === t)
						if (this._contexts[r] === n) {
							this._callbacks.splice(r, 1), this._contexts.splice(r, 1);
							return;
						} else i = !0;
				if (i)
					throw new Error(
						'When adding a listener with a context, you should remove it with the same context',
					);
			}
			invoke(...t) {
				if (!this._callbacks) return [];
				let n = [],
					i = this._callbacks.slice(0),
					r = this._contexts.slice(0);
				for (let s = 0, c = i.length; s < c; s++)
					try {
						n.push(i[s].apply(r[s], t));
					} catch (m) {
						(0, wa.default)().console.error(m);
					}
				return n;
			}
			isEmpty() {
				return !this._callbacks || this._callbacks.length === 0;
			}
			dispose() {
				(this._callbacks = void 0), (this._contexts = void 0);
			}
		},
		Qt = class e {
			constructor(t) {
				this._options = t;
			}
			get event() {
				return (
					this._event ||
						(this._event = (t, n, i) => {
							this._callbacks || (this._callbacks = new on()),
								this._options &&
									this._options.onFirstListenerAdd &&
									this._callbacks.isEmpty() &&
									this._options.onFirstListenerAdd(this),
								this._callbacks.add(t, n);
							let r = {
								dispose: () => {
									this._callbacks &&
										(this._callbacks.remove(t, n),
										(r.dispose = e._noop),
										this._options &&
											this._options.onLastListenerRemove &&
											this._callbacks.isEmpty() &&
											this._options.onLastListenerRemove(this));
								},
							};
							return Array.isArray(i) && i.push(r), r;
						}),
					this._event
				);
			}
			fire(t) {
				this._callbacks && this._callbacks.invoke.call(this._callbacks, t);
			}
			dispose() {
				this._callbacks && (this._callbacks.dispose(), (this._callbacks = void 0));
			}
		};
	Ve.Emitter = Qt;
	Qt._noop = function () {};
});
var Yt = c((Be) => {
	j();
	h();
	Object.defineProperty(Be, '__esModule', { value: !0 });
	Be.CancellationTokenSource = Be.CancellationToken = void 0;
	var Pa = Fe(),
		qa = rt(),
		sn = nt(),
		an;
	(function (e) {
		(e.None = Object.freeze({
			isCancellationRequested: !1,
			onCancellationRequested: sn.Event.None,
		})),
			(e.Cancelled = Object.freeze({
				isCancellationRequested: !0,
				onCancellationRequested: sn.Event.None,
			}));
		function t(n) {
			let i = n;
			return (
				i &&
				(i === e.None ||
					i === e.Cancelled ||
					(qa.boolean(i.isCancellationRequested) && !!i.onCancellationRequested))
			);
		}
		e.is = t;
	})((an = Be.CancellationToken || (Be.CancellationToken = {})));
	var Ca = Object.freeze(function (e, t) {
			let n = (0, Pa.default)().timer.setTimeout(e.bind(t), 0);
			return {
				dispose() {
					n.dispose();
				},
			};
		}),
		Gt = class {
			constructor() {
				this._isCancelled = !1;
			}
			cancel() {
				this._isCancelled ||
					((this._isCancelled = !0), this._emitter && (this._emitter.fire(void 0), this.dispose()));
			}
			get isCancellationRequested() {
				return this._isCancelled;
			}
			get onCancellationRequested() {
				return this._isCancelled
					? Ca
					: (this._emitter || (this._emitter = new sn.Emitter()), this._emitter.event);
			}
			dispose() {
				this._emitter && (this._emitter.dispose(), (this._emitter = void 0));
			}
		},
		cn = class {
			get token() {
				return this._token || (this._token = new Gt()), this._token;
			}
			cancel() {
				this._token ? this._token.cancel() : (this._token = an.Cancelled);
			}
			dispose() {
				this._token ? this._token instanceof Gt && this._token.dispose() : (this._token = an.None);
			}
		};
	Be.CancellationTokenSource = cn;
});
var bo = c((it) => {
	j();
	h();
	Object.defineProperty(it, '__esModule', { value: !0 });
	it.SharedArrayReceiverStrategy = it.SharedArraySenderStrategy = void 0;
	var Sa = Yt(),
		wt;
	(function (e) {
		(e.Continue = 0), (e.Cancelled = 1);
	})(wt || (wt = {}));
	var un = class {
		constructor() {
			this.buffers = new Map();
		}
		enableCancellation(t) {
			if (t.id === null) return;
			let n = new SharedArrayBuffer(4),
				i = new Int32Array(n, 0, 1);
			(i[0] = wt.Continue), this.buffers.set(t.id, n), (t.$cancellationData = n);
		}
		async sendCancellation(t, n) {
			let i = this.buffers.get(n);
			if (i === void 0) return;
			let r = new Int32Array(i, 0, 1);
			Atomics.store(r, 0, wt.Cancelled);
		}
		cleanup(t) {
			this.buffers.delete(t);
		}
		dispose() {
			this.buffers.clear();
		}
	};
	it.SharedArraySenderStrategy = un;
	var dn = class {
			constructor(t) {
				this.data = new Int32Array(t, 0, 1);
			}
			get isCancellationRequested() {
				return Atomics.load(this.data, 0) === wt.Cancelled;
			}
			get onCancellationRequested() {
				throw new Error("Cancellation over SharedArrayBuffer doesn't support cancellation events");
			}
		},
		ln = class {
			constructor(t) {
				this.token = new dn(t);
			}
			cancel() {}
			dispose() {}
		},
		fn = class {
			constructor() {
				this.kind = 'request';
			}
			createCancellationTokenSource(t) {
				let n = t.$cancellationData;
				return n === void 0 ? new Sa.CancellationTokenSource() : new ln(n);
			}
		};
	it.SharedArrayReceiverStrategy = fn;
});
var hn = c((Zt) => {
	j();
	h();
	Object.defineProperty(Zt, '__esModule', { value: !0 });
	Zt.Semaphore = void 0;
	var ka = Fe(),
		pn = class {
			constructor(t = 1) {
				if (t <= 0) throw new Error('Capacity must be greater than 0');
				(this._capacity = t), (this._active = 0), (this._waiting = []);
			}
			lock(t) {
				return new Promise((n, i) => {
					this._waiting.push({ thunk: t, resolve: n, reject: i }), this.runNext();
				});
			}
			get active() {
				return this._active;
			}
			runNext() {
				this._waiting.length === 0 ||
					this._active === this._capacity ||
					(0, ka.default)().timer.setImmediate(() => this.doRunNext());
			}
			doRunNext() {
				if (this._waiting.length === 0 || this._active === this._capacity) return;
				let t = this._waiting.shift();
				if ((this._active++, this._active > this._capacity))
					throw new Error('To many thunks active');
				try {
					let n = t.thunk();
					n instanceof Promise
						? n.then(
								(i) => {
									this._active--, t.resolve(i), this.runNext();
								},
								(i) => {
									this._active--, t.reject(i), this.runNext();
								},
						  )
						: (this._active--, t.resolve(n), this.runNext());
				} catch (n) {
					this._active--, t.reject(n), this.runNext();
				}
			}
		};
	Zt.Semaphore = pn;
});
var Ro = c((xe) => {
	j();
	h();
	Object.defineProperty(xe, '__esModule', { value: !0 });
	xe.ReadableStreamMessageReader = xe.AbstractMessageReader = xe.MessageReader = void 0;
	var mn = Fe(),
		ot = rt(),
		gn = nt(),
		xa = hn();
	(function (e) {
		function t(n) {
			let i = n;
			return (
				i &&
				ot.func(i.listen) &&
				ot.func(i.dispose) &&
				ot.func(i.onError) &&
				ot.func(i.onClose) &&
				ot.func(i.onPartialMessage)
			);
		}
		e.is = t;
	})(xe.MessageReader || (xe.MessageReader = {}));
	var Kt = class {
		constructor() {
			(this.errorEmitter = new gn.Emitter()),
				(this.closeEmitter = new gn.Emitter()),
				(this.partialMessageEmitter = new gn.Emitter());
		}
		dispose() {
			this.errorEmitter.dispose(), this.closeEmitter.dispose();
		}
		get onError() {
			return this.errorEmitter.event;
		}
		fireError(t) {
			this.errorEmitter.fire(this.asError(t));
		}
		get onClose() {
			return this.closeEmitter.event;
		}
		fireClose() {
			this.closeEmitter.fire(void 0);
		}
		get onPartialMessage() {
			return this.partialMessageEmitter.event;
		}
		firePartialMessage(t) {
			this.partialMessageEmitter.fire(t);
		}
		asError(t) {
			return t instanceof Error
				? t
				: new Error(
						`Reader received error. Reason: ${ot.string(t.message) ? t.message : 'unknown'}`,
				  );
		}
	};
	xe.AbstractMessageReader = Kt;
	var yn;
	(function (e) {
		function t(n) {
			let i,
				s,
				c = new Map(),
				m,
				q = new Map();
			if (n === void 0 || typeof n == 'string') i = n ?? 'utf-8';
			else {
				if (
					((i = n.charset ?? 'utf-8'),
					n.contentDecoder !== void 0 && ((s = n.contentDecoder), c.set(s.name, s)),
					n.contentDecoders !== void 0)
				)
					for (let R of n.contentDecoders) c.set(R.name, R);
				if (
					(n.contentTypeDecoder !== void 0 && ((m = n.contentTypeDecoder), q.set(m.name, m)),
					n.contentTypeDecoders !== void 0)
				)
					for (let R of n.contentTypeDecoders) q.set(R.name, R);
			}
			return (
				m === void 0 && ((m = (0, mn.default)().applicationJson.decoder), q.set(m.name, m)),
				{
					charset: i,
					contentDecoder: s,
					contentDecoders: c,
					contentTypeDecoder: m,
					contentTypeDecoders: q,
				}
			);
		}
		e.fromOptions = t;
	})(yn || (yn = {}));
	var vn = class extends Kt {
		constructor(t, n) {
			super(),
				(this.readable = t),
				(this.options = yn.fromOptions(n)),
				(this.buffer = (0, mn.default)().messageBuffer.create(this.options.charset)),
				(this._partialMessageTimeout = 1e4),
				(this.nextMessageLength = -1),
				(this.messageToken = 0),
				(this.readSemaphore = new xa.Semaphore(1));
		}
		set partialMessageTimeout(t) {
			this._partialMessageTimeout = t;
		}
		get partialMessageTimeout() {
			return this._partialMessageTimeout;
		}
		listen(t) {
			(this.nextMessageLength = -1),
				(this.messageToken = 0),
				(this.partialMessageTimer = void 0),
				(this.callback = t);
			let n = this.readable.onData((i) => {
				this.onData(i);
			});
			return (
				this.readable.onError((i) => this.fireError(i)),
				this.readable.onClose(() => this.fireClose()),
				n
			);
		}
		onData(t) {
			for (this.buffer.append(t); ; ) {
				if (this.nextMessageLength === -1) {
					let i = this.buffer.tryReadHeaders(!0);
					if (!i) return;
					let r = i.get('content-length');
					if (!r) {
						this.fireError(new Error('Header must provide a Content-Length property.'));
						return;
					}
					let s = parseInt(r);
					if (isNaN(s)) {
						this.fireError(new Error('Content-Length value must be a number.'));
						return;
					}
					this.nextMessageLength = s;
				}
				let n = this.buffer.tryReadBody(this.nextMessageLength);
				if (n === void 0) {
					this.setPartialMessageTimer();
					return;
				}
				this.clearPartialMessageTimer(),
					(this.nextMessageLength = -1),
					this.readSemaphore
						.lock(async () => {
							let i =
									this.options.contentDecoder !== void 0
										? await this.options.contentDecoder.decode(n)
										: n,
								r = await this.options.contentTypeDecoder.decode(i, this.options);
							this.callback(r);
						})
						.catch((i) => {
							this.fireError(i);
						});
			}
		}
		clearPartialMessageTimer() {
			this.partialMessageTimer &&
				(this.partialMessageTimer.dispose(), (this.partialMessageTimer = void 0));
		}
		setPartialMessageTimer() {
			this.clearPartialMessageTimer(),
				!(this._partialMessageTimeout <= 0) &&
					(this.partialMessageTimer = (0, mn.default)().timer.setTimeout(
						(t, n) => {
							(this.partialMessageTimer = void 0),
								t === this.messageToken &&
									(this.firePartialMessage({ messageToken: t, waitingTime: n }),
									this.setPartialMessageTimer());
						},
						this._partialMessageTimeout,
						this.messageToken,
						this._partialMessageTimeout,
					));
		}
	};
	xe.ReadableStreamMessageReader = vn;
});
var To = c((Me) => {
	j();
	h();
	Object.defineProperty(Me, '__esModule', { value: !0 });
	Me.WriteableStreamMessageWriter = Me.AbstractMessageWriter = Me.MessageWriter = void 0;
	var _o = Fe(),
		Tt = rt(),
		Ea = hn(),
		Do = nt(),
		Na = 'Content-Length: ',
		wo = `\r
`;
	(function (e) {
		function t(n) {
			let i = n;
			return (
				i && Tt.func(i.dispose) && Tt.func(i.onClose) && Tt.func(i.onError) && Tt.func(i.write)
			);
		}
		e.is = t;
	})(Me.MessageWriter || (Me.MessageWriter = {}));
	var er = class {
		constructor() {
			(this.errorEmitter = new Do.Emitter()), (this.closeEmitter = new Do.Emitter());
		}
		dispose() {
			this.errorEmitter.dispose(), this.closeEmitter.dispose();
		}
		get onError() {
			return this.errorEmitter.event;
		}
		fireError(t, n, i) {
			this.errorEmitter.fire([this.asError(t), n, i]);
		}
		get onClose() {
			return this.closeEmitter.event;
		}
		fireClose() {
			this.closeEmitter.fire(void 0);
		}
		asError(t) {
			return t instanceof Error
				? t
				: new Error(
						`Writer received error. Reason: ${Tt.string(t.message) ? t.message : 'unknown'}`,
				  );
		}
	};
	Me.AbstractMessageWriter = er;
	var bn;
	(function (e) {
		function t(n) {
			return n === void 0 || typeof n == 'string'
				? { charset: n ?? 'utf-8', contentTypeEncoder: (0, _o.default)().applicationJson.encoder }
				: {
						charset: n.charset ?? 'utf-8',
						contentEncoder: n.contentEncoder,
						contentTypeEncoder: n.contentTypeEncoder ?? (0, _o.default)().applicationJson.encoder,
				  };
		}
		e.fromOptions = t;
	})(bn || (bn = {}));
	var Rn = class extends er {
		constructor(t, n) {
			super(),
				(this.writable = t),
				(this.options = bn.fromOptions(n)),
				(this.errorCount = 0),
				(this.writeSemaphore = new Ea.Semaphore(1)),
				this.writable.onError((i) => this.fireError(i)),
				this.writable.onClose(() => this.fireClose());
		}
		async write(t) {
			return this.writeSemaphore.lock(async () =>
				this.options.contentTypeEncoder
					.encode(t, this.options)
					.then((i) =>
						this.options.contentEncoder !== void 0 ? this.options.contentEncoder.encode(i) : i,
					)
					.then(
						(i) => {
							let r = [];
							return r.push(Na, i.byteLength.toString(), wo), r.push(wo), this.doWrite(t, r, i);
						},
						(i) => {
							throw (this.fireError(i), i);
						},
					),
			);
		}
		async doWrite(t, n, i) {
			try {
				return await this.writable.write(n.join(''), 'ascii'), this.writable.write(i);
			} catch (r) {
				return this.handleError(r, t), Promise.reject(r);
			}
		}
		handleError(t, n) {
			this.errorCount++, this.fireError(t, n, this.errorCount);
		}
		end() {
			this.writable.end();
		}
	};
	Me.WriteableStreamMessageWriter = Rn;
});
var Po = c((tr) => {
	j();
	h();
	Object.defineProperty(tr, '__esModule', { value: !0 });
	tr.AbstractMessageBuffer = void 0;
	var ja = 13,
		La = 10,
		Aa = `\r
`,
		_n = class {
			constructor(t = 'utf-8') {
				(this._encoding = t), (this._chunks = []), (this._totalLength = 0);
			}
			get encoding() {
				return this._encoding;
			}
			append(t) {
				let n = typeof t == 'string' ? this.fromString(t, this._encoding) : t;
				this._chunks.push(n), (this._totalLength += n.byteLength);
			}
			tryReadHeaders(t = !1) {
				if (this._chunks.length === 0) return;
				let n = 0,
					i = 0,
					r = 0,
					s = 0;
				e: for (; i < this._chunks.length; ) {
					let R = this._chunks[i];
					for (r = 0; r < R.length; ) {
						switch (R[r]) {
							case ja:
								switch (n) {
									case 0:
										n = 1;
										break;
									case 2:
										n = 3;
										break;
									default:
										n = 0;
								}
								break;
							case La:
								switch (n) {
									case 1:
										n = 2;
										break;
									case 3:
										(n = 4), r++;
										break e;
									default:
										n = 0;
								}
								break;
							default:
								n = 0;
						}
						r++;
					}
					(s += R.byteLength), i++;
				}
				if (n !== 4) return;
				let c = this._read(s + r),
					m = new Map(),
					q = this.toString(c, 'ascii').split(Aa);
				if (q.length < 2) return m;
				for (let R = 0; R < q.length - 2; R++) {
					let O = q[R],
						j = O.indexOf(':');
					if (j === -1) throw new Error('Message header must separate key and value using :');
					let B = O.substr(0, j),
						P = O.substr(j + 1).trim();
					m.set(t ? B.toLowerCase() : B, P);
				}
				return m;
			}
			tryReadBody(t) {
				if (!(this._totalLength < t)) return this._read(t);
			}
			get numberOfBytes() {
				return this._totalLength;
			}
			_read(t) {
				if (t === 0) return this.emptyBuffer();
				if (t > this._totalLength) throw new Error('Cannot read so many bytes!');
				if (this._chunks[0].byteLength === t) {
					let s = this._chunks[0];
					return this._chunks.shift(), (this._totalLength -= t), this.asNative(s);
				}
				if (this._chunks[0].byteLength > t) {
					let s = this._chunks[0],
						c = this.asNative(s, t);
					return (this._chunks[0] = s.slice(t)), (this._totalLength -= t), c;
				}
				let n = this.allocNative(t),
					i = 0,
					r = 0;
				for (; t > 0; ) {
					let s = this._chunks[r];
					if (s.byteLength > t) {
						let c = s.slice(0, t);
						n.set(c, i),
							(i += t),
							(this._chunks[r] = s.slice(t)),
							(this._totalLength -= t),
							(t -= t);
					} else
						n.set(s, i),
							(i += s.byteLength),
							this._chunks.shift(),
							(this._totalLength -= s.byteLength),
							(t -= s.byteLength);
				}
				return n;
			}
		};
	tr.AbstractMessageBuffer = _n;
});
var Eo = c((v) => {
	j();
	h();
	Object.defineProperty(v, '__esModule', { value: !0 });
	v.createMessageConnection =
		v.ConnectionOptions =
		v.MessageStrategy =
		v.CancellationStrategy =
		v.CancellationSenderStrategy =
		v.CancellationReceiverStrategy =
		v.RequestCancellationReceiverStrategy =
		v.IdCancellationReceiverStrategy =
		v.ConnectionStrategy =
		v.ConnectionError =
		v.ConnectionErrors =
		v.LogTraceNotification =
		v.SetTraceNotification =
		v.TraceFormat =
		v.TraceValues =
		v.Trace =
		v.NullLogger =
		v.ProgressType =
		v.ProgressToken =
			void 0;
	var qo = Fe(),
		W = rt(),
		w = Zr(),
		Co = en(),
		Pt = nt(),
		Dn = Yt(),
		Ct;
	(function (e) {
		e.type = new w.NotificationType('$/cancelRequest');
	})(Ct || (Ct = {}));
	var So;
	(function (e) {
		function t(n) {
			return typeof n == 'string' || typeof n == 'number';
		}
		e.is = t;
	})((So = v.ProgressToken || (v.ProgressToken = {})));
	var qt;
	(function (e) {
		e.type = new w.NotificationType('$/progress');
	})(qt || (qt = {}));
	var wn = class {
		constructor() {}
	};
	v.ProgressType = wn;
	var Tn;
	(function (e) {
		function t(n) {
			return W.func(n);
		}
		e.is = t;
	})(Tn || (Tn = {}));
	v.NullLogger = Object.freeze({ error: () => {}, warn: () => {}, info: () => {}, log: () => {} });
	var M;
	(function (e) {
		(e[(e.Off = 0)] = 'Off'),
			(e[(e.Messages = 1)] = 'Messages'),
			(e[(e.Compact = 2)] = 'Compact'),
			(e[(e.Verbose = 3)] = 'Verbose');
	})((M = v.Trace || (v.Trace = {})));
	(function (e) {
		(e.Off = 'off'), (e.Messages = 'messages'), (e.Compact = 'compact'), (e.Verbose = 'verbose');
	})(v.TraceValues || (v.TraceValues = {}));
	(function (e) {
		function t(i) {
			if (!W.string(i)) return e.Off;
			switch (((i = i.toLowerCase()), i)) {
				case 'off':
					return e.Off;
				case 'messages':
					return e.Messages;
				case 'compact':
					return e.Compact;
				case 'verbose':
					return e.Verbose;
				default:
					return e.Off;
			}
		}
		e.fromString = t;
		function n(i) {
			switch (i) {
				case e.Off:
					return 'off';
				case e.Messages:
					return 'messages';
				case e.Compact:
					return 'compact';
				case e.Verbose:
					return 'verbose';
				default:
					return 'off';
			}
		}
		e.toString = n;
	})((M = v.Trace || (v.Trace = {})));
	var fe;
	(function (e) {
		(e.Text = 'text'), (e.JSON = 'json');
	})((fe = v.TraceFormat || (v.TraceFormat = {})));
	(function (e) {
		function t(n) {
			return W.string(n) ? ((n = n.toLowerCase()), n === 'json' ? e.JSON : e.Text) : e.Text;
		}
		e.fromString = t;
	})((fe = v.TraceFormat || (v.TraceFormat = {})));
	var ko;
	(function (e) {
		e.type = new w.NotificationType('$/setTrace');
	})((ko = v.SetTraceNotification || (v.SetTraceNotification = {})));
	var Pn;
	(function (e) {
		e.type = new w.NotificationType('$/logTrace');
	})((Pn = v.LogTraceNotification || (v.LogTraceNotification = {})));
	var rr;
	(function (e) {
		(e[(e.Closed = 1)] = 'Closed'),
			(e[(e.Disposed = 2)] = 'Disposed'),
			(e[(e.AlreadyListening = 3)] = 'AlreadyListening');
	})((rr = v.ConnectionErrors || (v.ConnectionErrors = {})));
	var st = class e extends Error {
		constructor(t, n) {
			super(n), (this.code = t), Object.setPrototypeOf(this, e.prototype);
		}
	};
	v.ConnectionError = st;
	var xo;
	(function (e) {
		function t(n) {
			let i = n;
			return i && W.func(i.cancelUndispatched);
		}
		e.is = t;
	})((xo = v.ConnectionStrategy || (v.ConnectionStrategy = {})));
	var Sn;
	(function (e) {
		function t(n) {
			let i = n;
			return (
				i &&
				(i.kind === void 0 || i.kind === 'id') &&
				W.func(i.createCancellationTokenSource) &&
				(i.dispose === void 0 || W.func(i.dispose))
			);
		}
		e.is = t;
	})((Sn = v.IdCancellationReceiverStrategy || (v.IdCancellationReceiverStrategy = {})));
	var Mo;
	(function (e) {
		function t(n) {
			let i = n;
			return (
				i &&
				i.kind === 'request' &&
				W.func(i.createCancellationTokenSource) &&
				(i.dispose === void 0 || W.func(i.dispose))
			);
		}
		e.is = t;
	})((Mo = v.RequestCancellationReceiverStrategy || (v.RequestCancellationReceiverStrategy = {})));
	var qn;
	(function (e) {
		e.Message = Object.freeze({
			createCancellationTokenSource(n) {
				return new Dn.CancellationTokenSource();
			},
		});
		function t(n) {
			return Sn.is(n) || Mo.is(n);
		}
		e.is = t;
	})((qn = v.CancellationReceiverStrategy || (v.CancellationReceiverStrategy = {})));
	var Cn;
	(function (e) {
		e.Message = Object.freeze({
			sendCancellation(n, i) {
				return n.sendNotification(Ct.type, { id: i });
			},
			cleanup(n) {},
		});
		function t(n) {
			let i = n;
			return i && W.func(i.sendCancellation) && W.func(i.cleanup);
		}
		e.is = t;
	})((Cn = v.CancellationSenderStrategy || (v.CancellationSenderStrategy = {})));
	var kn;
	(function (e) {
		e.Message = Object.freeze({ receiver: qn.Message, sender: Cn.Message });
		function t(n) {
			let i = n;
			return i && qn.is(i.receiver) && Cn.is(i.sender);
		}
		e.is = t;
	})((kn = v.CancellationStrategy || (v.CancellationStrategy = {})));
	var xn;
	(function (e) {
		function t(n) {
			let i = n;
			return i && W.func(i.handleMessage);
		}
		e.is = t;
	})((xn = v.MessageStrategy || (v.MessageStrategy = {})));
	(function (e) {
		function t(n) {
			let i = n;
			return (
				i &&
				(kn.is(i.cancellationStrategy) || xo.is(i.connectionStrategy) || xn.is(i.messageStrategy))
			);
		}
		e.is = t;
	})(v.ConnectionOptions || (v.ConnectionOptions = {}));
	var pe;
	(function (e) {
		(e[(e.New = 1)] = 'New'),
			(e[(e.Listening = 2)] = 'Listening'),
			(e[(e.Closed = 3)] = 'Closed'),
			(e[(e.Disposed = 4)] = 'Disposed');
	})(pe || (pe = {}));
	function Wa(e, t, n, i) {
		let r = n !== void 0 ? n : v.NullLogger,
			s = 0,
			c = 0,
			m = 0,
			q = '2.0',
			R,
			O = new Map(),
			j,
			B = new Map(),
			P = new Map(),
			Re,
			ue = new Co.LinkedMap(),
			_e = new Map(),
			Bt = new Set(),
			Se = new Map(),
			L = M.Off,
			Ue = fe.Text,
			Q,
			je = pe.New,
			qr = new Pt.Emitter(),
			eo = new Pt.Emitter(),
			to = new Pt.Emitter(),
			ro = new Pt.Emitter(),
			no = new Pt.Emitter(),
			Le = i && i.cancellationStrategy ? i.cancellationStrategy : kn.Message;
		function io(a) {
			if (a === null)
				throw new Error("Can't send requests with id null since the response can't be correlated.");
			return 'req-' + a.toString();
		}
		function Fs(a) {
			return a === null ? 'res-unknown-' + (++m).toString() : 'res-' + a.toString();
		}
		function Ws() {
			return 'not-' + (++c).toString();
		}
		function $s(a, l) {
			w.Message.isRequest(l)
				? a.set(io(l.id), l)
				: w.Message.isResponse(l)
				? a.set(Fs(l.id), l)
				: a.set(Ws(), l);
		}
		function Hs(a) {}
		function oo() {
			return je === pe.Listening;
		}
		function so() {
			return je === pe.Closed;
		}
		function Ke() {
			return je === pe.Disposed;
		}
		function ao() {
			(je === pe.New || je === pe.Listening) && ((je = pe.Closed), eo.fire(void 0));
		}
		function Us(a) {
			qr.fire([a, void 0, void 0]);
		}
		function zs(a) {
			qr.fire(a);
		}
		e.onClose(ao), e.onError(Us), t.onClose(ao), t.onError(zs);
		function co() {
			Re ||
				ue.size === 0 ||
				(Re = (0, qo.default)().timer.setImmediate(() => {
					(Re = void 0), Vs();
				}));
		}
		function uo(a) {
			w.Message.isRequest(a)
				? Js(a)
				: w.Message.isNotification(a)
				? Qs(a)
				: w.Message.isResponse(a)
				? Xs(a)
				: Gs(a);
		}
		function Vs() {
			if (ue.size === 0) return;
			let a = ue.shift();
			try {
				let l = i?.messageStrategy;
				xn.is(l) ? l.handleMessage(a, uo) : uo(a);
			} finally {
				co();
			}
		}
		let Bs = (a) => {
			try {
				if (w.Message.isNotification(a) && a.method === Ct.type.method) {
					let l = a.params.id,
						g = io(l),
						y = ue.get(g);
					if (w.Message.isRequest(y)) {
						let E = i?.connectionStrategy,
							U = E && E.cancelUndispatched ? E.cancelUndispatched(y, Hs) : void 0;
						if (U && (U.error !== void 0 || U.result !== void 0)) {
							ue.delete(g),
								Se.delete(l),
								(U.id = y.id),
								Jt(U, a.method, Date.now()),
								t.write(U).catch(() => r.error('Sending response for canceled message failed.'));
							return;
						}
					}
					let A = Se.get(l);
					if (A !== void 0) {
						A.cancel(), Cr(a);
						return;
					} else Bt.add(l);
				}
				$s(ue, a);
			} finally {
				co();
			}
		};
		function Js(a) {
			if (Ke()) return;
			function l(S, F, x) {
				let G = { jsonrpc: q, id: a.id };
				S instanceof w.ResponseError
					? (G.error = S.toJson())
					: (G.result = S === void 0 ? null : S),
					Jt(G, F, x),
					t.write(G).catch(() => r.error('Sending response failed.'));
			}
			function g(S, F, x) {
				let G = { jsonrpc: q, id: a.id, error: S.toJson() };
				Jt(G, F, x), t.write(G).catch(() => r.error('Sending response failed.'));
			}
			function y(S, F, x) {
				S === void 0 && (S = null);
				let G = { jsonrpc: q, id: a.id, result: S };
				Jt(G, F, x), t.write(G).catch(() => r.error('Sending response failed.'));
			}
			Ks(a);
			let A = O.get(a.method),
				E,
				U;
			A && ((E = A.type), (U = A.handler));
			let V = Date.now();
			if (U || R) {
				let S = a.id ?? String(Date.now()),
					F = Sn.is(Le.receiver)
						? Le.receiver.createCancellationTokenSource(S)
						: Le.receiver.createCancellationTokenSource(a);
				a.id !== null && Bt.has(a.id) && F.cancel(), a.id !== null && Se.set(S, F);
				try {
					let x;
					if (U)
						if (a.params === void 0) {
							if (E !== void 0 && E.numberOfParams !== 0) {
								g(
									new w.ResponseError(
										w.ErrorCodes.InvalidParams,
										`Request ${a.method} defines ${E.numberOfParams} params but received none.`,
									),
									a.method,
									V,
								);
								return;
							}
							x = U(F.token);
						} else if (Array.isArray(a.params)) {
							if (E !== void 0 && E.parameterStructures === w.ParameterStructures.byName) {
								g(
									new w.ResponseError(
										w.ErrorCodes.InvalidParams,
										`Request ${a.method} defines parameters by name but received parameters by position`,
									),
									a.method,
									V,
								);
								return;
							}
							x = U(...a.params, F.token);
						} else {
							if (E !== void 0 && E.parameterStructures === w.ParameterStructures.byPosition) {
								g(
									new w.ResponseError(
										w.ErrorCodes.InvalidParams,
										`Request ${a.method} defines parameters by position but received parameters by name`,
									),
									a.method,
									V,
								);
								return;
							}
							x = U(a.params, F.token);
						}
					else R && (x = R(a.method, a.params, F.token));
					let G = x;
					x
						? G.then
							? G.then(
									(re) => {
										Se.delete(S), l(re, a.method, V);
									},
									(re) => {
										Se.delete(S),
											re instanceof w.ResponseError
												? g(re, a.method, V)
												: re && W.string(re.message)
												? g(
														new w.ResponseError(
															w.ErrorCodes.InternalError,
															`Request ${a.method} failed with message: ${re.message}`,
														),
														a.method,
														V,
												  )
												: g(
														new w.ResponseError(
															w.ErrorCodes.InternalError,
															`Request ${a.method} failed unexpectedly without providing any details.`,
														),
														a.method,
														V,
												  );
									},
							  )
							: (Se.delete(S), l(x, a.method, V))
						: (Se.delete(S), y(x, a.method, V));
				} catch (x) {
					Se.delete(S),
						x instanceof w.ResponseError
							? l(x, a.method, V)
							: x && W.string(x.message)
							? g(
									new w.ResponseError(
										w.ErrorCodes.InternalError,
										`Request ${a.method} failed with message: ${x.message}`,
									),
									a.method,
									V,
							  )
							: g(
									new w.ResponseError(
										w.ErrorCodes.InternalError,
										`Request ${a.method} failed unexpectedly without providing any details.`,
									),
									a.method,
									V,
							  );
				}
			} else
				g(
					new w.ResponseError(w.ErrorCodes.MethodNotFound, `Unhandled method ${a.method}`),
					a.method,
					V,
				);
		}
		function Xs(a) {
			if (!Ke())
				if (a.id === null)
					a.error
						? r.error(`Received response message without id: Error is: 
${JSON.stringify(a.error, void 0, 4)}`)
						: r.error(
								'Received response message without id. No further error information provided.',
						  );
				else {
					let l = a.id,
						g = _e.get(l);
					if ((ea(a, g), g !== void 0)) {
						_e.delete(l);
						try {
							if (a.error) {
								let y = a.error;
								g.reject(new w.ResponseError(y.code, y.message, y.data));
							} else if (a.result !== void 0) g.resolve(a.result);
							else throw new Error('Should never happen.');
						} catch (y) {
							y.message
								? r.error(`Response handler '${g.method}' failed with message: ${y.message}`)
								: r.error(`Response handler '${g.method}' failed unexpectedly.`);
						}
					}
				}
		}
		function Qs(a) {
			if (Ke()) return;
			let l, g;
			if (a.method === Ct.type.method) {
				let y = a.params.id;
				Bt.delete(y), Cr(a);
				return;
			} else {
				let y = B.get(a.method);
				y && ((g = y.handler), (l = y.type));
			}
			if (g || j)
				try {
					if ((Cr(a), g))
						if (a.params === void 0)
							l !== void 0 &&
								l.numberOfParams !== 0 &&
								l.parameterStructures !== w.ParameterStructures.byName &&
								r.error(
									`Notification ${a.method} defines ${l.numberOfParams} params but received none.`,
								),
								g();
						else if (Array.isArray(a.params)) {
							let y = a.params;
							a.method === qt.type.method && y.length === 2 && So.is(y[0])
								? g({ token: y[0], value: y[1] })
								: (l !== void 0 &&
										(l.parameterStructures === w.ParameterStructures.byName &&
											r.error(
												`Notification ${a.method} defines parameters by name but received parameters by position`,
											),
										l.numberOfParams !== a.params.length &&
											r.error(
												`Notification ${a.method} defines ${l.numberOfParams} params but received ${y.length} arguments`,
											)),
								  g(...y));
						} else
							l !== void 0 &&
								l.parameterStructures === w.ParameterStructures.byPosition &&
								r.error(
									`Notification ${a.method} defines parameters by position but received parameters by name`,
								),
								g(a.params);
					else j && j(a.method, a.params);
				} catch (y) {
					y.message
						? r.error(`Notification handler '${a.method}' failed with message: ${y.message}`)
						: r.error(`Notification handler '${a.method}' failed unexpectedly.`);
				}
			else to.fire(a);
		}
		function Gs(a) {
			if (!a) {
				r.error('Received empty message.');
				return;
			}
			r.error(`Received message which is neither a response nor a notification message:
${JSON.stringify(a, null, 4)}`);
			let l = a;
			if (W.string(l.id) || W.number(l.id)) {
				let g = l.id,
					y = _e.get(g);
				y &&
					y.reject(new Error('The received response has neither a result nor an error property.'));
			}
		}
		function Ae(a) {
			if (a != null)
				switch (L) {
					case M.Verbose:
						return JSON.stringify(a, null, 4);
					case M.Compact:
						return JSON.stringify(a);
					default:
						return;
				}
		}
		function Ys(a) {
			if (!(L === M.Off || !Q))
				if (Ue === fe.Text) {
					let l;
					(L === M.Verbose || L === M.Compact) &&
						a.params &&
						(l = `Params: ${Ae(a.params)}

`),
						Q.log(`Sending request '${a.method} - (${a.id})'.`, l);
				} else et('send-request', a);
		}
		function Zs(a) {
			if (!(L === M.Off || !Q))
				if (Ue === fe.Text) {
					let l;
					(L === M.Verbose || L === M.Compact) &&
						(a.params
							? (l = `Params: ${Ae(a.params)}

`)
							: (l = `No parameters provided.

`)),
						Q.log(`Sending notification '${a.method}'.`, l);
				} else et('send-notification', a);
		}
		function Jt(a, l, g) {
			if (!(L === M.Off || !Q))
				if (Ue === fe.Text) {
					let y;
					(L === M.Verbose || L === M.Compact) &&
						(a.error && a.error.data
							? (y = `Error data: ${Ae(a.error.data)}

`)
							: a.result
							? (y = `Result: ${Ae(a.result)}

`)
							: a.error === void 0 &&
							  (y = `No result returned.

`)),
						Q.log(
							`Sending response '${l} - (${a.id})'. Processing request took ${Date.now() - g}ms`,
							y,
						);
				} else et('send-response', a);
		}
		function Ks(a) {
			if (!(L === M.Off || !Q))
				if (Ue === fe.Text) {
					let l;
					(L === M.Verbose || L === M.Compact) &&
						a.params &&
						(l = `Params: ${Ae(a.params)}

`),
						Q.log(`Received request '${a.method} - (${a.id})'.`, l);
				} else et('receive-request', a);
		}
		function Cr(a) {
			if (!(L === M.Off || !Q || a.method === Pn.type.method))
				if (Ue === fe.Text) {
					let l;
					(L === M.Verbose || L === M.Compact) &&
						(a.params
							? (l = `Params: ${Ae(a.params)}

`)
							: (l = `No parameters provided.

`)),
						Q.log(`Received notification '${a.method}'.`, l);
				} else et('receive-notification', a);
		}
		function ea(a, l) {
			if (!(L === M.Off || !Q))
				if (Ue === fe.Text) {
					let g;
					if (
						((L === M.Verbose || L === M.Compact) &&
							(a.error && a.error.data
								? (g = `Error data: ${Ae(a.error.data)}

`)
								: a.result
								? (g = `Result: ${Ae(a.result)}

`)
								: a.error === void 0 &&
								  (g = `No result returned.

`)),
						l)
					) {
						let y = a.error ? ` Request failed: ${a.error.message} (${a.error.code}).` : '';
						Q.log(
							`Received response '${l.method} - (${a.id})' in ${Date.now() - l.timerStart}ms.${y}`,
							g,
						);
					} else Q.log(`Received response ${a.id} without active response promise.`, g);
				} else et('receive-response', a);
		}
		function et(a, l) {
			if (!Q || L === M.Off) return;
			let g = { isLSPMessage: !0, type: a, message: l, timestamp: Date.now() };
			Q.log(g);
		}
		function Rt() {
			if (so()) throw new st(rr.Closed, 'Connection is closed.');
			if (Ke()) throw new st(rr.Disposed, 'Connection is disposed.');
		}
		function ta() {
			if (oo()) throw new st(rr.AlreadyListening, 'Connection is already listening');
		}
		function ra() {
			if (!oo()) throw new Error('Call listen() first.');
		}
		function _t(a) {
			return a === void 0 ? null : a;
		}
		function lo(a) {
			if (a !== null) return a;
		}
		function fo(a) {
			return a != null && !Array.isArray(a) && typeof a == 'object';
		}
		function Sr(a, l) {
			switch (a) {
				case w.ParameterStructures.auto:
					return fo(l) ? lo(l) : [_t(l)];
				case w.ParameterStructures.byName:
					if (!fo(l))
						throw new Error('Received parameters by name but param is not an object literal.');
					return lo(l);
				case w.ParameterStructures.byPosition:
					return [_t(l)];
				default:
					throw new Error(`Unknown parameter structure ${a.toString()}`);
			}
		}
		function po(a, l) {
			let g,
				y = a.numberOfParams;
			switch (y) {
				case 0:
					g = void 0;
					break;
				case 1:
					g = Sr(a.parameterStructures, l[0]);
					break;
				default:
					g = [];
					for (let A = 0; A < l.length && A < y; A++) g.push(_t(l[A]));
					if (l.length < y) for (let A = l.length; A < y; A++) g.push(null);
					break;
			}
			return g;
		}
		let tt = {
			sendNotification: (a, ...l) => {
				Rt();
				let g, y;
				if (W.string(a)) {
					g = a;
					let E = l[0],
						U = 0,
						V = w.ParameterStructures.auto;
					w.ParameterStructures.is(E) && ((U = 1), (V = E));
					let S = l.length,
						F = S - U;
					switch (F) {
						case 0:
							y = void 0;
							break;
						case 1:
							y = Sr(V, l[U]);
							break;
						default:
							if (V === w.ParameterStructures.byName)
								throw new Error(
									`Received ${F} parameters for 'by Name' notification parameter structure.`,
								);
							y = l.slice(U, S).map((x) => _t(x));
							break;
					}
				} else {
					let E = l;
					(g = a.method), (y = po(a, E));
				}
				let A = { jsonrpc: q, method: g, params: y };
				return (
					Zs(A),
					t.write(A).catch((E) => {
						throw (r.error('Sending notification failed.'), E);
					})
				);
			},
			onNotification: (a, l) => {
				Rt();
				let g;
				return (
					W.func(a)
						? (j = a)
						: l &&
						  (W.string(a)
								? ((g = a), B.set(a, { type: void 0, handler: l }))
								: ((g = a.method), B.set(a.method, { type: a, handler: l }))),
					{
						dispose: () => {
							g !== void 0 ? B.delete(g) : (j = void 0);
						},
					}
				);
			},
			onProgress: (a, l, g) => {
				if (P.has(l)) throw new Error(`Progress handler for token ${l} already registered`);
				return (
					P.set(l, g),
					{
						dispose: () => {
							P.delete(l);
						},
					}
				);
			},
			sendProgress: (a, l, g) => tt.sendNotification(qt.type, { token: l, value: g }),
			onUnhandledProgress: ro.event,
			sendRequest: (a, ...l) => {
				Rt(), ra();
				let g, y, A;
				if (W.string(a)) {
					g = a;
					let S = l[0],
						F = l[l.length - 1],
						x = 0,
						G = w.ParameterStructures.auto;
					w.ParameterStructures.is(S) && ((x = 1), (G = S));
					let re = l.length;
					Dn.CancellationToken.is(F) && ((re = re - 1), (A = F));
					let De = re - x;
					switch (De) {
						case 0:
							y = void 0;
							break;
						case 1:
							y = Sr(G, l[x]);
							break;
						default:
							if (G === w.ParameterStructures.byName)
								throw new Error(
									`Received ${De} parameters for 'by Name' request parameter structure.`,
								);
							y = l.slice(x, re).map((na) => _t(na));
							break;
					}
				} else {
					let S = l;
					(g = a.method), (y = po(a, S));
					let F = a.numberOfParams;
					A = Dn.CancellationToken.is(S[F]) ? S[F] : void 0;
				}
				let E = s++,
					U;
				A &&
					(U = A.onCancellationRequested(() => {
						let S = Le.sender.sendCancellation(tt, E);
						return S === void 0
							? (r.log(`Received no promise from cancellation strategy when cancelling id ${E}`),
							  Promise.resolve())
							: S.catch(() => {
									r.log(`Sending cancellation messages for id ${E} failed`);
							  });
					}));
				let V = { jsonrpc: q, id: E, method: g, params: y };
				return (
					Ys(V),
					typeof Le.sender.enableCancellation == 'function' && Le.sender.enableCancellation(V),
					new Promise(async (S, F) => {
						let x = (De) => {
								S(De), Le.sender.cleanup(E), U?.dispose();
							},
							G = (De) => {
								F(De), Le.sender.cleanup(E), U?.dispose();
							},
							re = { method: g, timerStart: Date.now(), resolve: x, reject: G };
						try {
							await t.write(V), _e.set(E, re);
						} catch (De) {
							throw (
								(r.error('Sending request failed.'),
								re.reject(
									new w.ResponseError(
										w.ErrorCodes.MessageWriteError,
										De.message ? De.message : 'Unknown reason',
									),
								),
								De)
							);
						}
					})
				);
			},
			onRequest: (a, l) => {
				Rt();
				let g = null;
				return (
					Tn.is(a)
						? ((g = void 0), (R = a))
						: W.string(a)
						? ((g = null), l !== void 0 && ((g = a), O.set(a, { handler: l, type: void 0 })))
						: l !== void 0 && ((g = a.method), O.set(a.method, { type: a, handler: l })),
					{
						dispose: () => {
							g !== null && (g !== void 0 ? O.delete(g) : (R = void 0));
						},
					}
				);
			},
			hasPendingResponse: () => _e.size > 0,
			trace: async (a, l, g) => {
				let y = !1,
					A = fe.Text;
				g !== void 0 &&
					(W.boolean(g)
						? (y = g)
						: ((y = g.sendNotification || !1), (A = g.traceFormat || fe.Text))),
					(L = a),
					(Ue = A),
					L === M.Off ? (Q = void 0) : (Q = l),
					y && !so() && !Ke() && (await tt.sendNotification(ko.type, { value: M.toString(a) }));
			},
			onError: qr.event,
			onClose: eo.event,
			onUnhandledNotification: to.event,
			onDispose: no.event,
			end: () => {
				t.end();
			},
			dispose: () => {
				if (Ke()) return;
				(je = pe.Disposed), no.fire(void 0);
				let a = new w.ResponseError(
					w.ErrorCodes.PendingResponseRejected,
					'Pending response rejected since connection got disposed',
				);
				for (let l of _e.values()) l.reject(a);
				(_e = new Map()),
					(Se = new Map()),
					(Bt = new Set()),
					(ue = new Co.LinkedMap()),
					W.func(t.dispose) && t.dispose(),
					W.func(e.dispose) && e.dispose();
			},
			listen: () => {
				Rt(), ta(), (je = pe.Listening), e.listen(Bs);
			},
			inspect: () => {
				(0, qo.default)().console.log('inspect');
			},
		};
		return (
			tt.onNotification(Pn.type, (a) => {
				if (L === M.Off || !Q) return;
				let l = L === M.Verbose || L === M.Compact;
				Q.log(a.message, l ? a.verbose : void 0);
			}),
			tt.onNotification(qt.type, (a) => {
				let l = P.get(a.token);
				l ? l(a.value) : ro.fire(a);
			}),
			tt
		);
	}
	v.createMessageConnection = Wa;
});
var Je = c((d) => {
	j();
	h();
	Object.defineProperty(d, '__esModule', { value: !0 });
	d.ProgressType =
		d.ProgressToken =
		d.createMessageConnection =
		d.NullLogger =
		d.ConnectionOptions =
		d.ConnectionStrategy =
		d.AbstractMessageBuffer =
		d.WriteableStreamMessageWriter =
		d.AbstractMessageWriter =
		d.MessageWriter =
		d.ReadableStreamMessageReader =
		d.AbstractMessageReader =
		d.MessageReader =
		d.SharedArrayReceiverStrategy =
		d.SharedArraySenderStrategy =
		d.CancellationToken =
		d.CancellationTokenSource =
		d.Emitter =
		d.Event =
		d.Disposable =
		d.LRUCache =
		d.Touch =
		d.LinkedMap =
		d.ParameterStructures =
		d.NotificationType9 =
		d.NotificationType8 =
		d.NotificationType7 =
		d.NotificationType6 =
		d.NotificationType5 =
		d.NotificationType4 =
		d.NotificationType3 =
		d.NotificationType2 =
		d.NotificationType1 =
		d.NotificationType0 =
		d.NotificationType =
		d.ErrorCodes =
		d.ResponseError =
		d.RequestType9 =
		d.RequestType8 =
		d.RequestType7 =
		d.RequestType6 =
		d.RequestType5 =
		d.RequestType4 =
		d.RequestType3 =
		d.RequestType2 =
		d.RequestType1 =
		d.RequestType0 =
		d.RequestType =
		d.Message =
		d.RAL =
			void 0;
	d.MessageStrategy =
		d.CancellationStrategy =
		d.CancellationSenderStrategy =
		d.CancellationReceiverStrategy =
		d.ConnectionError =
		d.ConnectionErrors =
		d.LogTraceNotification =
		d.SetTraceNotification =
		d.TraceFormat =
		d.TraceValues =
		d.Trace =
			void 0;
	var N = Zr();
	Object.defineProperty(d, 'Message', {
		enumerable: !0,
		get: function () {
			return N.Message;
		},
	});
	Object.defineProperty(d, 'RequestType', {
		enumerable: !0,
		get: function () {
			return N.RequestType;
		},
	});
	Object.defineProperty(d, 'RequestType0', {
		enumerable: !0,
		get: function () {
			return N.RequestType0;
		},
	});
	Object.defineProperty(d, 'RequestType1', {
		enumerable: !0,
		get: function () {
			return N.RequestType1;
		},
	});
	Object.defineProperty(d, 'RequestType2', {
		enumerable: !0,
		get: function () {
			return N.RequestType2;
		},
	});
	Object.defineProperty(d, 'RequestType3', {
		enumerable: !0,
		get: function () {
			return N.RequestType3;
		},
	});
	Object.defineProperty(d, 'RequestType4', {
		enumerable: !0,
		get: function () {
			return N.RequestType4;
		},
	});
	Object.defineProperty(d, 'RequestType5', {
		enumerable: !0,
		get: function () {
			return N.RequestType5;
		},
	});
	Object.defineProperty(d, 'RequestType6', {
		enumerable: !0,
		get: function () {
			return N.RequestType6;
		},
	});
	Object.defineProperty(d, 'RequestType7', {
		enumerable: !0,
		get: function () {
			return N.RequestType7;
		},
	});
	Object.defineProperty(d, 'RequestType8', {
		enumerable: !0,
		get: function () {
			return N.RequestType8;
		},
	});
	Object.defineProperty(d, 'RequestType9', {
		enumerable: !0,
		get: function () {
			return N.RequestType9;
		},
	});
	Object.defineProperty(d, 'ResponseError', {
		enumerable: !0,
		get: function () {
			return N.ResponseError;
		},
	});
	Object.defineProperty(d, 'ErrorCodes', {
		enumerable: !0,
		get: function () {
			return N.ErrorCodes;
		},
	});
	Object.defineProperty(d, 'NotificationType', {
		enumerable: !0,
		get: function () {
			return N.NotificationType;
		},
	});
	Object.defineProperty(d, 'NotificationType0', {
		enumerable: !0,
		get: function () {
			return N.NotificationType0;
		},
	});
	Object.defineProperty(d, 'NotificationType1', {
		enumerable: !0,
		get: function () {
			return N.NotificationType1;
		},
	});
	Object.defineProperty(d, 'NotificationType2', {
		enumerable: !0,
		get: function () {
			return N.NotificationType2;
		},
	});
	Object.defineProperty(d, 'NotificationType3', {
		enumerable: !0,
		get: function () {
			return N.NotificationType3;
		},
	});
	Object.defineProperty(d, 'NotificationType4', {
		enumerable: !0,
		get: function () {
			return N.NotificationType4;
		},
	});
	Object.defineProperty(d, 'NotificationType5', {
		enumerable: !0,
		get: function () {
			return N.NotificationType5;
		},
	});
	Object.defineProperty(d, 'NotificationType6', {
		enumerable: !0,
		get: function () {
			return N.NotificationType6;
		},
	});
	Object.defineProperty(d, 'NotificationType7', {
		enumerable: !0,
		get: function () {
			return N.NotificationType7;
		},
	});
	Object.defineProperty(d, 'NotificationType8', {
		enumerable: !0,
		get: function () {
			return N.NotificationType8;
		},
	});
	Object.defineProperty(d, 'NotificationType9', {
		enumerable: !0,
		get: function () {
			return N.NotificationType9;
		},
	});
	Object.defineProperty(d, 'ParameterStructures', {
		enumerable: !0,
		get: function () {
			return N.ParameterStructures;
		},
	});
	var Mn = en();
	Object.defineProperty(d, 'LinkedMap', {
		enumerable: !0,
		get: function () {
			return Mn.LinkedMap;
		},
	});
	Object.defineProperty(d, 'LRUCache', {
		enumerable: !0,
		get: function () {
			return Mn.LRUCache;
		},
	});
	Object.defineProperty(d, 'Touch', {
		enumerable: !0,
		get: function () {
			return Mn.Touch;
		},
	});
	var $a = vo();
	Object.defineProperty(d, 'Disposable', {
		enumerable: !0,
		get: function () {
			return $a.Disposable;
		},
	});
	var No = nt();
	Object.defineProperty(d, 'Event', {
		enumerable: !0,
		get: function () {
			return No.Event;
		},
	});
	Object.defineProperty(d, 'Emitter', {
		enumerable: !0,
		get: function () {
			return No.Emitter;
		},
	});
	var Oo = Yt();
	Object.defineProperty(d, 'CancellationTokenSource', {
		enumerable: !0,
		get: function () {
			return Oo.CancellationTokenSource;
		},
	});
	Object.defineProperty(d, 'CancellationToken', {
		enumerable: !0,
		get: function () {
			return Oo.CancellationToken;
		},
	});
	var jo = bo();
	Object.defineProperty(d, 'SharedArraySenderStrategy', {
		enumerable: !0,
		get: function () {
			return jo.SharedArraySenderStrategy;
		},
	});
	Object.defineProperty(d, 'SharedArrayReceiverStrategy', {
		enumerable: !0,
		get: function () {
			return jo.SharedArrayReceiverStrategy;
		},
	});
	var En = Ro();
	Object.defineProperty(d, 'MessageReader', {
		enumerable: !0,
		get: function () {
			return En.MessageReader;
		},
	});
	Object.defineProperty(d, 'AbstractMessageReader', {
		enumerable: !0,
		get: function () {
			return En.AbstractMessageReader;
		},
	});
	Object.defineProperty(d, 'ReadableStreamMessageReader', {
		enumerable: !0,
		get: function () {
			return En.ReadableStreamMessageReader;
		},
	});
	var Nn = To();
	Object.defineProperty(d, 'MessageWriter', {
		enumerable: !0,
		get: function () {
			return Nn.MessageWriter;
		},
	});
	Object.defineProperty(d, 'AbstractMessageWriter', {
		enumerable: !0,
		get: function () {
			return Nn.AbstractMessageWriter;
		},
	});
	Object.defineProperty(d, 'WriteableStreamMessageWriter', {
		enumerable: !0,
		get: function () {
			return Nn.WriteableStreamMessageWriter;
		},
	});
	var Ha = Po();
	Object.defineProperty(d, 'AbstractMessageBuffer', {
		enumerable: !0,
		get: function () {
			return Ha.AbstractMessageBuffer;
		},
	});
	var Y = Eo();
	Object.defineProperty(d, 'ConnectionStrategy', {
		enumerable: !0,
		get: function () {
			return Y.ConnectionStrategy;
		},
	});
	Object.defineProperty(d, 'ConnectionOptions', {
		enumerable: !0,
		get: function () {
			return Y.ConnectionOptions;
		},
	});
	Object.defineProperty(d, 'NullLogger', {
		enumerable: !0,
		get: function () {
			return Y.NullLogger;
		},
	});
	Object.defineProperty(d, 'createMessageConnection', {
		enumerable: !0,
		get: function () {
			return Y.createMessageConnection;
		},
	});
	Object.defineProperty(d, 'ProgressToken', {
		enumerable: !0,
		get: function () {
			return Y.ProgressToken;
		},
	});
	Object.defineProperty(d, 'ProgressType', {
		enumerable: !0,
		get: function () {
			return Y.ProgressType;
		},
	});
	Object.defineProperty(d, 'Trace', {
		enumerable: !0,
		get: function () {
			return Y.Trace;
		},
	});
	Object.defineProperty(d, 'TraceValues', {
		enumerable: !0,
		get: function () {
			return Y.TraceValues;
		},
	});
	Object.defineProperty(d, 'TraceFormat', {
		enumerable: !0,
		get: function () {
			return Y.TraceFormat;
		},
	});
	Object.defineProperty(d, 'SetTraceNotification', {
		enumerable: !0,
		get: function () {
			return Y.SetTraceNotification;
		},
	});
	Object.defineProperty(d, 'LogTraceNotification', {
		enumerable: !0,
		get: function () {
			return Y.LogTraceNotification;
		},
	});
	Object.defineProperty(d, 'ConnectionErrors', {
		enumerable: !0,
		get: function () {
			return Y.ConnectionErrors;
		},
	});
	Object.defineProperty(d, 'ConnectionError', {
		enumerable: !0,
		get: function () {
			return Y.ConnectionError;
		},
	});
	Object.defineProperty(d, 'CancellationReceiverStrategy', {
		enumerable: !0,
		get: function () {
			return Y.CancellationReceiverStrategy;
		},
	});
	Object.defineProperty(d, 'CancellationSenderStrategy', {
		enumerable: !0,
		get: function () {
			return Y.CancellationSenderStrategy;
		},
	});
	Object.defineProperty(d, 'CancellationStrategy', {
		enumerable: !0,
		get: function () {
			return Y.CancellationStrategy;
		},
	});
	Object.defineProperty(d, 'MessageStrategy', {
		enumerable: !0,
		get: function () {
			return Y.MessageStrategy;
		},
	});
	var Ua = Fe();
	d.RAL = Ua.default;
});
var Ao = c((An) => {
	j();
	h();
	Object.defineProperty(An, '__esModule', { value: !0 });
	var we = Je(),
		nr = class e extends we.AbstractMessageBuffer {
			constructor(t = 'utf-8') {
				super(t), (this.asciiDecoder = new TextDecoder('ascii'));
			}
			emptyBuffer() {
				return e.emptyBuffer;
			}
			fromString(t, n) {
				return new TextEncoder().encode(t);
			}
			toString(t, n) {
				return n === 'ascii' ? this.asciiDecoder.decode(t) : new TextDecoder(n).decode(t);
			}
			asNative(t, n) {
				return n === void 0 ? t : t.slice(0, n);
			}
			allocNative(t) {
				return new Uint8Array(t);
			}
		};
	nr.emptyBuffer = new Uint8Array(0);
	var On = class {
			constructor(t) {
				(this.socket = t),
					(this._onData = new we.Emitter()),
					(this._messageListener = (n) => {
						n.data.arrayBuffer().then(
							(r) => {
								this._onData.fire(new Uint8Array(r));
							},
							() => {
								(0, we.RAL)().console.error('Converting blob to array buffer failed.');
							},
						);
					}),
					this.socket.addEventListener('message', this._messageListener);
			}
			onClose(t) {
				return (
					this.socket.addEventListener('close', t),
					we.Disposable.create(() => this.socket.removeEventListener('close', t))
				);
			}
			onError(t) {
				return (
					this.socket.addEventListener('error', t),
					we.Disposable.create(() => this.socket.removeEventListener('error', t))
				);
			}
			onEnd(t) {
				return (
					this.socket.addEventListener('end', t),
					we.Disposable.create(() => this.socket.removeEventListener('end', t))
				);
			}
			onData(t) {
				return this._onData.event(t);
			}
		},
		jn = class {
			constructor(t) {
				this.socket = t;
			}
			onClose(t) {
				return (
					this.socket.addEventListener('close', t),
					we.Disposable.create(() => this.socket.removeEventListener('close', t))
				);
			}
			onError(t) {
				return (
					this.socket.addEventListener('error', t),
					we.Disposable.create(() => this.socket.removeEventListener('error', t))
				);
			}
			onEnd(t) {
				return (
					this.socket.addEventListener('end', t),
					we.Disposable.create(() => this.socket.removeEventListener('end', t))
				);
			}
			write(t, n) {
				if (typeof t == 'string') {
					if (n !== void 0 && n !== 'utf-8')
						throw new Error(
							`In a Browser environments only utf-8 text encoding is supported. But got encoding: ${n}`,
						);
					this.socket.send(t);
				} else this.socket.send(t);
				return Promise.resolve();
			}
			end() {
				this.socket.close();
			}
		},
		za = new TextEncoder(),
		Lo = Object.freeze({
			messageBuffer: Object.freeze({ create: (e) => new nr(e) }),
			applicationJson: Object.freeze({
				encoder: Object.freeze({
					name: 'application/json',
					encode: (e, t) => {
						if (t.charset !== 'utf-8')
							throw new Error(
								`In a Browser environments only utf-8 text encoding is supported. But got encoding: ${t.charset}`,
							);
						return Promise.resolve(za.encode(JSON.stringify(e, void 0, 0)));
					},
				}),
				decoder: Object.freeze({
					name: 'application/json',
					decode: (e, t) => {
						if (!(e instanceof Uint8Array))
							throw new Error('In a Browser environments only Uint8Arrays are supported.');
						return Promise.resolve(JSON.parse(new TextDecoder(t.charset).decode(e)));
					},
				}),
			}),
			stream: Object.freeze({
				asReadableStream: (e) => new On(e),
				asWritableStream: (e) => new jn(e),
			}),
			console,
			timer: Object.freeze({
				setTimeout(e, t, ...n) {
					let i = setTimeout(e, t, ...n);
					return { dispose: () => clearTimeout(i) };
				},
				setImmediate(e, ...t) {
					let n = setTimeout(e, 0, ...t);
					return { dispose: () => clearTimeout(n) };
				},
				setInterval(e, t, ...n) {
					let i = setInterval(e, t, ...n);
					return { dispose: () => clearInterval(i) };
				},
			}),
		});
	function Ln() {
		return Lo;
	}
	(function (e) {
		function t() {
			we.RAL.install(Lo);
		}
		e.install = t;
	})(Ln || (Ln = {}));
	An.default = Ln;
});
var Io = c((ae) => {
	j();
	h();
	var Va =
			(ae && ae.__createBinding) ||
			(Object.create
				? function (e, t, n, i) {
						i === void 0 && (i = n);
						var r = Object.getOwnPropertyDescriptor(t, n);
						(!r || ('get' in r ? !t.__esModule : r.writable || r.configurable)) &&
							(r = {
								enumerable: !0,
								get: function () {
									return t[n];
								},
							}),
							Object.defineProperty(e, i, r);
				  }
				: function (e, t, n, i) {
						i === void 0 && (i = n), (e[i] = t[n]);
				  }),
		Ba =
			(ae && ae.__exportStar) ||
			function (e, t) {
				for (var n in e)
					n !== 'default' && !Object.prototype.hasOwnProperty.call(t, n) && Va(t, e, n);
			};
	Object.defineProperty(ae, '__esModule', { value: !0 });
	ae.createMessageConnection = ae.BrowserMessageWriter = ae.BrowserMessageReader = void 0;
	var Ja = Ao();
	Ja.default.install();
	var at = Je();
	Ba(Je(), ae);
	var In = class extends at.AbstractMessageReader {
		constructor(t) {
			super(),
				(this._onData = new at.Emitter()),
				(this._messageListener = (n) => {
					this._onData.fire(n.data);
				}),
				t.addEventListener('error', (n) => this.fireError(n)),
				(t.onmessage = this._messageListener);
		}
		listen(t) {
			return this._onData.event(t);
		}
	};
	ae.BrowserMessageReader = In;
	var Fn = class extends at.AbstractMessageWriter {
		constructor(t) {
			super(),
				(this.port = t),
				(this.errorCount = 0),
				t.addEventListener('error', (n) => this.fireError(n));
		}
		write(t) {
			try {
				return this.port.postMessage(t), Promise.resolve();
			} catch (n) {
				return this.handleError(n, t), Promise.reject(n);
			}
		}
		handleError(t, n) {
			this.errorCount++, this.fireError(t, n, this.errorCount);
		}
		end() {}
	};
	ae.BrowserMessageWriter = Fn;
	function Xa(e, t, n, i) {
		return (
			n === void 0 && (n = at.NullLogger),
			at.ConnectionStrategy.is(i) && (i = { connectionStrategy: i }),
			(0, at.createMessageConnection)(e, t, n, i)
		);
	}
	ae.createMessageConnection = Xa;
});
var Wn = c((jl, Fo) => {
	j();
	h();
	Fo.exports = Io();
});
var Ho = c((zn) => {
	j();
	h();
	Object.defineProperty(zn, '__esModule', { value: !0 });
	var Wo = (t(), f(s)),
		Ee = Je(),
		ir = class e extends Ee.AbstractMessageBuffer {
			constructor(t = 'utf-8') {
				super(t);
			}
			emptyBuffer() {
				return e.emptyBuffer;
			}
			fromString(t, n) {
				return i.from(t, n);
			}
			toString(t, n) {
				return t instanceof i ? t.toString(n) : new Wo.TextDecoder(n).decode(t);
			}
			asNative(t, n) {
				return n === void 0
					? t instanceof i
						? t
						: i.from(t)
					: t instanceof i
					? t.slice(0, n)
					: i.from(t, 0, n);
			}
			allocNative(t) {
				return i.allocUnsafe(t);
			}
		};
	ir.emptyBuffer = i.allocUnsafe(0);
	var $n = class {
			constructor(t) {
				this.stream = t;
			}
			onClose(t) {
				return this.stream.on('close', t), Ee.Disposable.create(() => this.stream.off('close', t));
			}
			onError(t) {
				return this.stream.on('error', t), Ee.Disposable.create(() => this.stream.off('error', t));
			}
			onEnd(t) {
				return this.stream.on('end', t), Ee.Disposable.create(() => this.stream.off('end', t));
			}
			onData(t) {
				return this.stream.on('data', t), Ee.Disposable.create(() => this.stream.off('data', t));
			}
		},
		Hn = class {
			constructor(t) {
				this.stream = t;
			}
			onClose(t) {
				return this.stream.on('close', t), Ee.Disposable.create(() => this.stream.off('close', t));
			}
			onError(t) {
				return this.stream.on('error', t), Ee.Disposable.create(() => this.stream.off('error', t));
			}
			onEnd(t) {
				return this.stream.on('end', t), Ee.Disposable.create(() => this.stream.off('end', t));
			}
			write(t, n) {
				return new Promise((i, r) => {
					let s = (c) => {
						c == null ? i() : r(c);
					};
					typeof t == 'string' ? this.stream.write(t, n, s) : this.stream.write(t, s);
				});
			}
			end() {
				this.stream.end();
			}
		},
		$o = Object.freeze({
			messageBuffer: Object.freeze({ create: (e) => new ir(e) }),
			applicationJson: Object.freeze({
				encoder: Object.freeze({
					name: 'application/json',
					encode: (e, t) => {
						try {
							return Promise.resolve(i.from(JSON.stringify(e, void 0, 0), t.charset));
						} catch (n) {
							return Promise.reject(n);
						}
					},
				}),
				decoder: Object.freeze({
					name: 'application/json',
					decode: (e, t) => {
						try {
							return e instanceof i
								? Promise.resolve(JSON.parse(e.toString(t.charset)))
								: Promise.resolve(JSON.parse(new Wo.TextDecoder(t.charset).decode(e)));
						} catch (n) {
							return Promise.reject(n);
						}
					},
				}),
			}),
			stream: Object.freeze({
				asReadableStream: (e) => new $n(e),
				asWritableStream: (e) => new Hn(e),
			}),
			console,
			timer: Object.freeze({
				setTimeout(e, t, ...n) {
					let i = setTimeout(e, t, ...n);
					return { dispose: () => clearTimeout(i) };
				},
				setImmediate(e, ...t) {
					let n = queueMicrotask(e, ...t);
					return { dispose: () => clearImmediate(n) };
				},
				setInterval(e, t, ...n) {
					let i = setInterval(e, t, ...n);
					return { dispose: () => clearInterval(i) };
				},
			}),
		});
	function Un() {
		return $o;
	}
	(function (e) {
		function t() {
			Ee.RAL.install($o);
		}
		e.install = t;
	})(Un || (Un = {}));
	zn.default = Un;
});
var ut = c((C) => {
	j();
	h();
	var Qa =
			(C && C.__createBinding) ||
			(Object.create
				? function (e, t, n, i) {
						i === void 0 && (i = n);
						var r = Object.getOwnPropertyDescriptor(t, n);
						(!r || ('get' in r ? !t.__esModule : r.writable || r.configurable)) &&
							(r = {
								enumerable: !0,
								get: function () {
									return t[n];
								},
							}),
							Object.defineProperty(e, i, r);
				  }
				: function (e, t, n, i) {
						i === void 0 && (i = n), (e[i] = t[n]);
				  }),
		Ga =
			(C && C.__exportStar) ||
			function (e, t) {
				for (var n in e)
					n !== 'default' && !Object.prototype.hasOwnProperty.call(t, n) && Qa(t, e, n);
			};
	Object.defineProperty(C, '__esModule', { value: !0 });
	C.createMessageConnection =
		C.createServerSocketTransport =
		C.createClientSocketTransport =
		C.createServerPipeTransport =
		C.createClientPipeTransport =
		C.generateRandomPipeName =
		C.StreamMessageWriter =
		C.StreamMessageReader =
		C.SocketMessageWriter =
		C.SocketMessageReader =
		C.PortMessageWriter =
		C.PortMessageReader =
		C.IPCMessageWriter =
		C.IPCMessageReader =
			void 0;
	var ct = Ho();
	ct.default.install();
	var Uo = (H(), f(G)),
		Ya = (K(), f(J)),
		Za = (M(), f(L)),
		ar = (O(), f(N)),
		ce = Je();
	Ga(Je(), C);
	var Vn = class extends ce.AbstractMessageReader {
		constructor(t) {
			super(), (this.process = t);
			let n = this.process;
			n.on('error', (i) => this.fireError(i)), n.on('close', () => this.fireClose());
		}
		listen(t) {
			return (
				this.process.on('message', t), ce.Disposable.create(() => this.process.off('message', t))
			);
		}
	};
	C.IPCMessageReader = Vn;
	var Bn = class extends ce.AbstractMessageWriter {
		constructor(t) {
			super(), (this.process = t), (this.errorCount = 0);
			let n = this.process;
			n.on('error', (i) => this.fireError(i)), n.on('close', () => this.fireClose);
		}
		write(t) {
			try {
				return (
					typeof this.process.send == 'function' &&
						this.process.send(t, void 0, void 0, (n) => {
							n ? (this.errorCount++, this.handleError(n, t)) : (this.errorCount = 0);
						}),
					Promise.resolve()
				);
			} catch (n) {
				return this.handleError(n, t), Promise.reject(n);
			}
		}
		handleError(t, n) {
			this.errorCount++, this.fireError(t, n, this.errorCount);
		}
		end() {}
	};
	C.IPCMessageWriter = Bn;
	var Jn = class extends ce.AbstractMessageReader {
		constructor(t) {
			super(),
				(this.onData = new ce.Emitter()),
				t.on('close', () => this.fireClose),
				t.on('error', (n) => this.fireError(n)),
				t.on('message', (n) => {
					this.onData.fire(n);
				});
		}
		listen(t) {
			return this.onData.event(t);
		}
	};
	C.PortMessageReader = Jn;
	var Xn = class extends ce.AbstractMessageWriter {
		constructor(t) {
			super(),
				(this.port = t),
				(this.errorCount = 0),
				t.on('close', () => this.fireClose()),
				t.on('error', (n) => this.fireError(n));
		}
		write(t) {
			try {
				return this.port.postMessage(t), Promise.resolve();
			} catch (n) {
				return this.handleError(n, t), Promise.reject(n);
			}
		}
		handleError(t, n) {
			this.errorCount++, this.fireError(t, n, this.errorCount);
		}
		end() {}
	};
	C.PortMessageWriter = Xn;
	var Xe = class extends ce.ReadableStreamMessageReader {
		constructor(t, n = 'utf-8') {
			super((0, ct.default)().stream.asReadableStream(t), n);
		}
	};
	C.SocketMessageReader = Xe;
	var Qe = class extends ce.WriteableStreamMessageWriter {
		constructor(t, n) {
			super((0, ct.default)().stream.asWritableStream(t), n), (this.socket = t);
		}
		dispose() {
			super.dispose(), this.socket.destroy();
		}
	};
	C.SocketMessageWriter = Qe;
	var or = class extends ce.ReadableStreamMessageReader {
		constructor(t, n) {
			super((0, ct.default)().stream.asReadableStream(t), n);
		}
	};
	C.StreamMessageReader = or;
	var sr = class extends ce.WriteableStreamMessageWriter {
		constructor(t, n) {
			super((0, ct.default)().stream.asWritableStream(t), n);
		}
	};
	C.StreamMessageWriter = sr;
	var zo = g.env.XDG_RUNTIME_DIR,
		Ka = new Map([
			['linux', 107],
			['darwin', 103],
		]);
	function ec() {
		let e = (0, Za.randomBytes)(21).toString('hex');
		if (g.platform === 'win32') return `\\\\.\\pipe\\vscode-jsonrpc-${e}-sock`;
		let t;
		zo ? (t = Uo.join(zo, `vscode-ipc-${e}.sock`)) : (t = Uo.join(Ya.tmpdir(), `vscode-${e}.sock`));
		let n = Ka.get(g.platform);
		return (
			n !== void 0 &&
				t.length > n &&
				(0, ct.default)().console.warn(
					`WARNING: IPC handle "${t}" is longer than ${n} characters.`,
				),
			t
		);
	}
	C.generateRandomPipeName = ec;
	function tc(e, t = 'utf-8') {
		let n,
			i = new Promise((r, s) => {
				n = r;
			});
		return new Promise((r, s) => {
			let c = (0, ar.createServer)((m) => {
				c.close(), n([new Xe(m, t), new Qe(m, t)]);
			});
			c.on('error', s),
				c.listen(e, () => {
					c.removeListener('error', s), r({ onConnected: () => i });
				});
		});
	}
	C.createClientPipeTransport = tc;
	function rc(e, t = 'utf-8') {
		let n = (0, ar.createConnection)(e);
		return [new Xe(n, t), new Qe(n, t)];
	}
	C.createServerPipeTransport = rc;
	function nc(e, t = 'utf-8') {
		let n,
			i = new Promise((r, s) => {
				n = r;
			});
		return new Promise((r, s) => {
			let c = (0, ar.createServer)((m) => {
				c.close(), n([new Xe(m, t), new Qe(m, t)]);
			});
			c.on('error', s),
				c.listen(e, '127.0.0.1', () => {
					c.removeListener('error', s), r({ onConnected: () => i });
				});
		});
	}
	C.createClientSocketTransport = nc;
	function ic(e, t = 'utf-8') {
		let n = (0, ar.createConnection)(e, '127.0.0.1');
		return [new Xe(n, t), new Qe(n, t)];
	}
	C.createServerSocketTransport = ic;
	function oc(e) {
		let t = e;
		return t.read !== void 0 && t.addListener !== void 0;
	}
	function sc(e) {
		let t = e;
		return t.write !== void 0 && t.addListener !== void 0;
	}
	function ac(e, t, n, i) {
		n || (n = ce.NullLogger);
		let r = oc(e) ? new or(e) : e,
			s = sc(t) ? new sr(t) : t;
		return (
			ce.ConnectionStrategy.is(i) && (i = { connectionStrategy: i }),
			(0, ce.createMessageConnection)(r, s, n, i)
		);
	}
	C.createMessageConnection = ac;
});
var mr = {};
d(mr, {
	AnnotatedTextEdit: () => Ne,
	ChangeAnnotation: () => Ge,
	ChangeAnnotationIdentifier: () => Z,
	CodeAction: () => Si,
	CodeActionContext: () => Ci,
	CodeActionKind: () => qi,
	CodeActionTriggerKind: () => Ot,
	CodeDescription: () => ii,
	CodeLens: () => ki,
	Color: () => dr,
	ColorInformation: () => Zn,
	ColorPresentation: () => Kn,
	Command: () => Ye,
	CompletionItem: () => hi,
	CompletionItemKind: () => ci,
	CompletionItemLabelDetails: () => pi,
	CompletionItemTag: () => di,
	CompletionList: () => gi,
	CreateFile: () => dt,
	DeleteFile: () => ft,
	Diagnostic: () => xt,
	DiagnosticRelatedInformation: () => lr,
	DiagnosticSeverity: () => ri,
	DiagnosticTag: () => ni,
	DocumentHighlight: () => Ri,
	DocumentHighlightKind: () => bi,
	DocumentLink: () => Mi,
	DocumentSymbol: () => Pi,
	DocumentUri: () => Qn,
	EOL: () => uc,
	FoldingRange: () => ti,
	FoldingRangeKind: () => ei,
	FormattingOptions: () => xi,
	Hover: () => mi,
	InlayHint: () => Wi,
	InlayHintKind: () => hr,
	InlayHintLabelPart: () => gr,
	InlineValueContext: () => Fi,
	InlineValueEvaluatableExpression: () => Ii,
	InlineValueText: () => Li,
	InlineValueVariableLookup: () => Ai,
	InsertReplaceEdit: () => li,
	InsertTextFormat: () => ui,
	InsertTextMode: () => fi,
	Location: () => kt,
	LocationLink: () => Yn,
	MarkedString: () => Nt,
	MarkupContent: () => pt,
	MarkupKind: () => pr,
	OptionalVersionedTextDocumentIdentifier: () => Et,
	ParameterInformation: () => yi,
	Position: () => de,
	Range: () => z,
	RenameFile: () => lt,
	SelectionRange: () => Ei,
	SemanticTokenModifiers: () => Oi,
	SemanticTokenTypes: () => Ni,
	SemanticTokens: () => ji,
	SignatureInformation: () => vi,
	SymbolInformation: () => wi,
	SymbolKind: () => _i,
	SymbolTag: () => Di,
	TextDocument: () => Hi,
	TextDocumentEdit: () => Mt,
	TextDocumentIdentifier: () => oi,
	TextDocumentItem: () => ai,
	TextEdit: () => Te,
	URI: () => ur,
	VersionedTextDocumentIdentifier: () => si,
	WorkspaceChange: () => cc,
	WorkspaceEdit: () => fr,
	WorkspaceFolder: () => $i,
	WorkspaceSymbol: () => Ti,
	integer: () => Gn,
	uinteger: () => St,
});
var Qn,
	ur,
	Gn,
	St,
	de,
	z,
	kt,
	Yn,
	dr,
	Zn,
	Kn,
	ei,
	ti,
	lr,
	ri,
	ni,
	ii,
	xt,
	Ye,
	Te,
	Ge,
	Z,
	Ne,
	Mt,
	dt,
	lt,
	ft,
	fr,
	cr,
	Vo,
	cc,
	oi,
	si,
	Et,
	ai,
	pr,
	pt,
	ci,
	ui,
	di,
	li,
	fi,
	pi,
	hi,
	gi,
	Nt,
	mi,
	yi,
	vi,
	bi,
	Ri,
	_i,
	Di,
	wi,
	Ti,
	Pi,
	qi,
	Ot,
	Ci,
	Si,
	ki,
	xi,
	Mi,
	Ei,
	Ni,
	Oi,
	ji,
	Li,
	Ai,
	Ii,
	Fi,
	hr,
	gr,
	Wi,
	$i,
	uc,
	Hi,
	dc,
	u,
	yr = b(() => {
		j();
		h();
		(function (e) {
			function t(n) {
				return typeof n == 'string';
			}
			e.is = t;
		})(Qn || (Qn = {}));
		(function (e) {
			function t(n) {
				return typeof n == 'string';
			}
			e.is = t;
		})(ur || (ur = {}));
		(function (e) {
			(e.MIN_VALUE = -2147483648), (e.MAX_VALUE = 2147483647);
			function t(n) {
				return typeof n == 'number' && e.MIN_VALUE <= n && n <= e.MAX_VALUE;
			}
			e.is = t;
		})(Gn || (Gn = {}));
		(function (e) {
			(e.MIN_VALUE = 0), (e.MAX_VALUE = 2147483647);
			function t(n) {
				return typeof n == 'number' && e.MIN_VALUE <= n && n <= e.MAX_VALUE;
			}
			e.is = t;
		})(St || (St = {}));
		(function (e) {
			function t(i, r) {
				return (
					i === Number.MAX_VALUE && (i = St.MAX_VALUE),
					r === Number.MAX_VALUE && (r = St.MAX_VALUE),
					{ line: i, character: r }
				);
			}
			e.create = t;
			function n(i) {
				var r = i;
				return u.objectLiteral(r) && u.uinteger(r.line) && u.uinteger(r.character);
			}
			e.is = n;
		})(de || (de = {}));
		(function (e) {
			function t(i, r, s, c) {
				if (u.uinteger(i) && u.uinteger(r) && u.uinteger(s) && u.uinteger(c))
					return { start: de.create(i, r), end: de.create(s, c) };
				if (de.is(i) && de.is(r)) return { start: i, end: r };
				throw new Error(
					'Range#create called with invalid arguments['
						.concat(i, ', ')
						.concat(r, ', ')
						.concat(s, ', ')
						.concat(c, ']'),
				);
			}
			e.create = t;
			function n(i) {
				var r = i;
				return u.objectLiteral(r) && de.is(r.start) && de.is(r.end);
			}
			e.is = n;
		})(z || (z = {}));
		(function (e) {
			function t(i, r) {
				return { uri: i, range: r };
			}
			e.create = t;
			function n(i) {
				var r = i;
				return u.objectLiteral(r) && z.is(r.range) && (u.string(r.uri) || u.undefined(r.uri));
			}
			e.is = n;
		})(kt || (kt = {}));
		(function (e) {
			function t(i, r, s, c) {
				return { targetUri: i, targetRange: r, targetSelectionRange: s, originSelectionRange: c };
			}
			e.create = t;
			function n(i) {
				var r = i;
				return (
					u.objectLiteral(r) &&
					z.is(r.targetRange) &&
					u.string(r.targetUri) &&
					z.is(r.targetSelectionRange) &&
					(z.is(r.originSelectionRange) || u.undefined(r.originSelectionRange))
				);
			}
			e.is = n;
		})(Yn || (Yn = {}));
		(function (e) {
			function t(i, r, s, c) {
				return { red: i, green: r, blue: s, alpha: c };
			}
			e.create = t;
			function n(i) {
				var r = i;
				return (
					u.objectLiteral(r) &&
					u.numberRange(r.red, 0, 1) &&
					u.numberRange(r.green, 0, 1) &&
					u.numberRange(r.blue, 0, 1) &&
					u.numberRange(r.alpha, 0, 1)
				);
			}
			e.is = n;
		})(dr || (dr = {}));
		(function (e) {
			function t(i, r) {
				return { range: i, color: r };
			}
			e.create = t;
			function n(i) {
				var r = i;
				return u.objectLiteral(r) && z.is(r.range) && dr.is(r.color);
			}
			e.is = n;
		})(Zn || (Zn = {}));
		(function (e) {
			function t(i, r, s) {
				return { label: i, textEdit: r, additionalTextEdits: s };
			}
			e.create = t;
			function n(i) {
				var r = i;
				return (
					u.objectLiteral(r) &&
					u.string(r.label) &&
					(u.undefined(r.textEdit) || Te.is(r)) &&
					(u.undefined(r.additionalTextEdits) || u.typedArray(r.additionalTextEdits, Te.is))
				);
			}
			e.is = n;
		})(Kn || (Kn = {}));
		(function (e) {
			(e.Comment = 'comment'), (e.Imports = 'imports'), (e.Region = 'region');
		})(ei || (ei = {}));
		(function (e) {
			function t(i, r, s, c, m, q) {
				var R = { startLine: i, endLine: r };
				return (
					u.defined(s) && (R.startCharacter = s),
					u.defined(c) && (R.endCharacter = c),
					u.defined(m) && (R.kind = m),
					u.defined(q) && (R.collapsedText = q),
					R
				);
			}
			e.create = t;
			function n(i) {
				var r = i;
				return (
					u.objectLiteral(r) &&
					u.uinteger(r.startLine) &&
					u.uinteger(r.startLine) &&
					(u.undefined(r.startCharacter) || u.uinteger(r.startCharacter)) &&
					(u.undefined(r.endCharacter) || u.uinteger(r.endCharacter)) &&
					(u.undefined(r.kind) || u.string(r.kind))
				);
			}
			e.is = n;
		})(ti || (ti = {}));
		(function (e) {
			function t(i, r) {
				return { location: i, message: r };
			}
			e.create = t;
			function n(i) {
				var r = i;
				return u.defined(r) && kt.is(r.location) && u.string(r.message);
			}
			e.is = n;
		})(lr || (lr = {}));
		(function (e) {
			(e.Error = 1), (e.Warning = 2), (e.Information = 3), (e.Hint = 4);
		})(ri || (ri = {}));
		(function (e) {
			(e.Unnecessary = 1), (e.Deprecated = 2);
		})(ni || (ni = {}));
		(function (e) {
			function t(n) {
				var i = n;
				return u.objectLiteral(i) && u.string(i.href);
			}
			e.is = t;
		})(ii || (ii = {}));
		(function (e) {
			function t(i, r, s, c, m, q) {
				var R = { range: i, message: r };
				return (
					u.defined(s) && (R.severity = s),
					u.defined(c) && (R.code = c),
					u.defined(m) && (R.source = m),
					u.defined(q) && (R.relatedInformation = q),
					R
				);
			}
			e.create = t;
			function n(i) {
				var r,
					s = i;
				return (
					u.defined(s) &&
					z.is(s.range) &&
					u.string(s.message) &&
					(u.number(s.severity) || u.undefined(s.severity)) &&
					(u.integer(s.code) || u.string(s.code) || u.undefined(s.code)) &&
					(u.undefined(s.codeDescription) ||
						u.string((r = s.codeDescription) === null || r === void 0 ? void 0 : r.href)) &&
					(u.string(s.source) || u.undefined(s.source)) &&
					(u.undefined(s.relatedInformation) || u.typedArray(s.relatedInformation, lr.is))
				);
			}
			e.is = n;
		})(xt || (xt = {}));
		(function (e) {
			function t(i, r) {
				for (var s = [], c = 2; c < arguments.length; c++) s[c - 2] = arguments[c];
				var m = { title: i, command: r };
				return u.defined(s) && s.length > 0 && (m.arguments = s), m;
			}
			e.create = t;
			function n(i) {
				var r = i;
				return u.defined(r) && u.string(r.title) && u.string(r.command);
			}
			e.is = n;
		})(Ye || (Ye = {}));
		(function (e) {
			function t(s, c) {
				return { range: s, newText: c };
			}
			e.replace = t;
			function n(s, c) {
				return { range: { start: s, end: s }, newText: c };
			}
			e.insert = n;
			function i(s) {
				return { range: s, newText: '' };
			}
			e.del = i;
			function r(s) {
				var c = s;
				return u.objectLiteral(c) && u.string(c.newText) && z.is(c.range);
			}
			e.is = r;
		})(Te || (Te = {}));
		(function (e) {
			function t(i, r, s) {
				var c = { label: i };
				return r !== void 0 && (c.needsConfirmation = r), s !== void 0 && (c.description = s), c;
			}
			e.create = t;
			function n(i) {
				var r = i;
				return (
					u.objectLiteral(r) &&
					u.string(r.label) &&
					(u.boolean(r.needsConfirmation) || r.needsConfirmation === void 0) &&
					(u.string(r.description) || r.description === void 0)
				);
			}
			e.is = n;
		})(Ge || (Ge = {}));
		(function (e) {
			function t(n) {
				var i = n;
				return u.string(i);
			}
			e.is = t;
		})(Z || (Z = {}));
		(function (e) {
			function t(s, c, m) {
				return { range: s, newText: c, annotationId: m };
			}
			e.replace = t;
			function n(s, c, m) {
				return { range: { start: s, end: s }, newText: c, annotationId: m };
			}
			e.insert = n;
			function i(s, c) {
				return { range: s, newText: '', annotationId: c };
			}
			e.del = i;
			function r(s) {
				var c = s;
				return Te.is(c) && (Ge.is(c.annotationId) || Z.is(c.annotationId));
			}
			e.is = r;
		})(Ne || (Ne = {}));
		(function (e) {
			function t(i, r) {
				return { textDocument: i, edits: r };
			}
			e.create = t;
			function n(i) {
				var r = i;
				return u.defined(r) && Et.is(r.textDocument) && Array.isArray(r.edits);
			}
			e.is = n;
		})(Mt || (Mt = {}));
		(function (e) {
			function t(i, r, s) {
				var c = { kind: 'create', uri: i };
				return (
					r !== void 0 &&
						(r.overwrite !== void 0 || r.ignoreIfExists !== void 0) &&
						(c.options = r),
					s !== void 0 && (c.annotationId = s),
					c
				);
			}
			e.create = t;
			function n(i) {
				var r = i;
				return (
					r &&
					r.kind === 'create' &&
					u.string(r.uri) &&
					(r.options === void 0 ||
						((r.options.overwrite === void 0 || u.boolean(r.options.overwrite)) &&
							(r.options.ignoreIfExists === void 0 || u.boolean(r.options.ignoreIfExists)))) &&
					(r.annotationId === void 0 || Z.is(r.annotationId))
				);
			}
			e.is = n;
		})(dt || (dt = {}));
		(function (e) {
			function t(i, r, s, c) {
				var m = { kind: 'rename', oldUri: i, newUri: r };
				return (
					s !== void 0 &&
						(s.overwrite !== void 0 || s.ignoreIfExists !== void 0) &&
						(m.options = s),
					c !== void 0 && (m.annotationId = c),
					m
				);
			}
			e.create = t;
			function n(i) {
				var r = i;
				return (
					r &&
					r.kind === 'rename' &&
					u.string(r.oldUri) &&
					u.string(r.newUri) &&
					(r.options === void 0 ||
						((r.options.overwrite === void 0 || u.boolean(r.options.overwrite)) &&
							(r.options.ignoreIfExists === void 0 || u.boolean(r.options.ignoreIfExists)))) &&
					(r.annotationId === void 0 || Z.is(r.annotationId))
				);
			}
			e.is = n;
		})(lt || (lt = {}));
		(function (e) {
			function t(i, r, s) {
				var c = { kind: 'delete', uri: i };
				return (
					r !== void 0 &&
						(r.recursive !== void 0 || r.ignoreIfNotExists !== void 0) &&
						(c.options = r),
					s !== void 0 && (c.annotationId = s),
					c
				);
			}
			e.create = t;
			function n(i) {
				var r = i;
				return (
					r &&
					r.kind === 'delete' &&
					u.string(r.uri) &&
					(r.options === void 0 ||
						((r.options.recursive === void 0 || u.boolean(r.options.recursive)) &&
							(r.options.ignoreIfNotExists === void 0 ||
								u.boolean(r.options.ignoreIfNotExists)))) &&
					(r.annotationId === void 0 || Z.is(r.annotationId))
				);
			}
			e.is = n;
		})(ft || (ft = {}));
		(function (e) {
			function t(n) {
				var i = n;
				return (
					i &&
					(i.changes !== void 0 || i.documentChanges !== void 0) &&
					(i.documentChanges === void 0 ||
						i.documentChanges.every(function (r) {
							return u.string(r.kind) ? dt.is(r) || lt.is(r) || ft.is(r) : Mt.is(r);
						}))
				);
			}
			e.is = t;
		})(fr || (fr = {}));
		(cr = (function () {
			function e(t, n) {
				(this.edits = t), (this.changeAnnotations = n);
			}
			return (
				(e.prototype.insert = function (t, n, i) {
					var r, s;
					if (
						(i === void 0
							? (r = Te.insert(t, n))
							: Z.is(i)
							? ((s = i), (r = Ne.insert(t, n, i)))
							: (this.assertChangeAnnotations(this.changeAnnotations),
							  (s = this.changeAnnotations.manage(i)),
							  (r = Ne.insert(t, n, s))),
						this.edits.push(r),
						s !== void 0)
					)
						return s;
				}),
				(e.prototype.replace = function (t, n, i) {
					var r, s;
					if (
						(i === void 0
							? (r = Te.replace(t, n))
							: Z.is(i)
							? ((s = i), (r = Ne.replace(t, n, i)))
							: (this.assertChangeAnnotations(this.changeAnnotations),
							  (s = this.changeAnnotations.manage(i)),
							  (r = Ne.replace(t, n, s))),
						this.edits.push(r),
						s !== void 0)
					)
						return s;
				}),
				(e.prototype.delete = function (t, n) {
					var i, r;
					if (
						(n === void 0
							? (i = Te.del(t))
							: Z.is(n)
							? ((r = n), (i = Ne.del(t, n)))
							: (this.assertChangeAnnotations(this.changeAnnotations),
							  (r = this.changeAnnotations.manage(n)),
							  (i = Ne.del(t, r))),
						this.edits.push(i),
						r !== void 0)
					)
						return r;
				}),
				(e.prototype.add = function (t) {
					this.edits.push(t);
				}),
				(e.prototype.all = function () {
					return this.edits;
				}),
				(e.prototype.clear = function () {
					this.edits.splice(0, this.edits.length);
				}),
				(e.prototype.assertChangeAnnotations = function (t) {
					if (t === void 0)
						throw new Error('Text edit change is not configured to manage change annotations.');
				}),
				e
			);
		})()),
			(Vo = (function () {
				function e(t) {
					(this._annotations = t === void 0 ? Object.create(null) : t),
						(this._counter = 0),
						(this._size = 0);
				}
				return (
					(e.prototype.all = function () {
						return this._annotations;
					}),
					Object.defineProperty(e.prototype, 'size', {
						get: function () {
							return this._size;
						},
						enumerable: !1,
						configurable: !0,
					}),
					(e.prototype.manage = function (t, n) {
						var i;
						if (
							(Z.is(t) ? (i = t) : ((i = this.nextId()), (n = t)), this._annotations[i] !== void 0)
						)
							throw new Error('Id '.concat(i, ' is already in use.'));
						if (n === void 0) throw new Error('No annotation provided for id '.concat(i));
						return (this._annotations[i] = n), this._size++, i;
					}),
					(e.prototype.nextId = function () {
						return this._counter++, this._counter.toString();
					}),
					e
				);
			})()),
			(cc = (function () {
				function e(t) {
					var n = this;
					(this._textEditChanges = Object.create(null)),
						t !== void 0
							? ((this._workspaceEdit = t),
							  t.documentChanges
									? ((this._changeAnnotations = new Vo(t.changeAnnotations)),
									  (t.changeAnnotations = this._changeAnnotations.all()),
									  t.documentChanges.forEach(function (i) {
											if (Mt.is(i)) {
												var r = new cr(i.edits, n._changeAnnotations);
												n._textEditChanges[i.textDocument.uri] = r;
											}
									  }))
									: t.changes &&
									  Object.keys(t.changes).forEach(function (i) {
											var r = new cr(t.changes[i]);
											n._textEditChanges[i] = r;
									  }))
							: (this._workspaceEdit = {});
				}
				return (
					Object.defineProperty(e.prototype, 'edit', {
						get: function () {
							return (
								this.initDocumentChanges(),
								this._changeAnnotations !== void 0 &&
									(this._changeAnnotations.size === 0
										? (this._workspaceEdit.changeAnnotations = void 0)
										: (this._workspaceEdit.changeAnnotations = this._changeAnnotations.all())),
								this._workspaceEdit
							);
						},
						enumerable: !1,
						configurable: !0,
					}),
					(e.prototype.getTextEditChange = function (t) {
						if (Et.is(t)) {
							if ((this.initDocumentChanges(), this._workspaceEdit.documentChanges === void 0))
								throw new Error('Workspace edit is not configured for document changes.');
							var n = { uri: t.uri, version: t.version },
								i = this._textEditChanges[n.uri];
							if (!i) {
								var r = [],
									s = { textDocument: n, edits: r };
								this._workspaceEdit.documentChanges.push(s),
									(i = new cr(r, this._changeAnnotations)),
									(this._textEditChanges[n.uri] = i);
							}
							return i;
						} else {
							if ((this.initChanges(), this._workspaceEdit.changes === void 0))
								throw new Error('Workspace edit is not configured for normal text edit changes.');
							var i = this._textEditChanges[t];
							if (!i) {
								var r = [];
								(this._workspaceEdit.changes[t] = r),
									(i = new cr(r)),
									(this._textEditChanges[t] = i);
							}
							return i;
						}
					}),
					(e.prototype.initDocumentChanges = function () {
						this._workspaceEdit.documentChanges === void 0 &&
							this._workspaceEdit.changes === void 0 &&
							((this._changeAnnotations = new Vo()),
							(this._workspaceEdit.documentChanges = []),
							(this._workspaceEdit.changeAnnotations = this._changeAnnotations.all()));
					}),
					(e.prototype.initChanges = function () {
						this._workspaceEdit.documentChanges === void 0 &&
							this._workspaceEdit.changes === void 0 &&
							(this._workspaceEdit.changes = Object.create(null));
					}),
					(e.prototype.createFile = function (t, n, i) {
						if ((this.initDocumentChanges(), this._workspaceEdit.documentChanges === void 0))
							throw new Error('Workspace edit is not configured for document changes.');
						var r;
						Ge.is(n) || Z.is(n) ? (r = n) : (i = n);
						var s, c;
						if (
							(r === void 0
								? (s = dt.create(t, i))
								: ((c = Z.is(r) ? r : this._changeAnnotations.manage(r)), (s = dt.create(t, i, c))),
							this._workspaceEdit.documentChanges.push(s),
							c !== void 0)
						)
							return c;
					}),
					(e.prototype.renameFile = function (t, n, i, r) {
						if ((this.initDocumentChanges(), this._workspaceEdit.documentChanges === void 0))
							throw new Error('Workspace edit is not configured for document changes.');
						var s;
						Ge.is(i) || Z.is(i) ? (s = i) : (r = i);
						var c, m;
						if (
							(s === void 0
								? (c = lt.create(t, n, r))
								: ((m = Z.is(s) ? s : this._changeAnnotations.manage(s)),
								  (c = lt.create(t, n, r, m))),
							this._workspaceEdit.documentChanges.push(c),
							m !== void 0)
						)
							return m;
					}),
					(e.prototype.deleteFile = function (t, n, i) {
						if ((this.initDocumentChanges(), this._workspaceEdit.documentChanges === void 0))
							throw new Error('Workspace edit is not configured for document changes.');
						var r;
						Ge.is(n) || Z.is(n) ? (r = n) : (i = n);
						var s, c;
						if (
							(r === void 0
								? (s = ft.create(t, i))
								: ((c = Z.is(r) ? r : this._changeAnnotations.manage(r)), (s = ft.create(t, i, c))),
							this._workspaceEdit.documentChanges.push(s),
							c !== void 0)
						)
							return c;
					}),
					e
				);
			})());
		(function (e) {
			function t(i) {
				return { uri: i };
			}
			e.create = t;
			function n(i) {
				var r = i;
				return u.defined(r) && u.string(r.uri);
			}
			e.is = n;
		})(oi || (oi = {}));
		(function (e) {
			function t(i, r) {
				return { uri: i, version: r };
			}
			e.create = t;
			function n(i) {
				var r = i;
				return u.defined(r) && u.string(r.uri) && u.integer(r.version);
			}
			e.is = n;
		})(si || (si = {}));
		(function (e) {
			function t(i, r) {
				return { uri: i, version: r };
			}
			e.create = t;
			function n(i) {
				var r = i;
				return u.defined(r) && u.string(r.uri) && (r.version === null || u.integer(r.version));
			}
			e.is = n;
		})(Et || (Et = {}));
		(function (e) {
			function t(i, r, s, c) {
				return { uri: i, languageId: r, version: s, text: c };
			}
			e.create = t;
			function n(i) {
				var r = i;
				return (
					u.defined(r) &&
					u.string(r.uri) &&
					u.string(r.languageId) &&
					u.integer(r.version) &&
					u.string(r.text)
				);
			}
			e.is = n;
		})(ai || (ai = {}));
		(function (e) {
			(e.PlainText = 'plaintext'), (e.Markdown = 'markdown');
			function t(n) {
				var i = n;
				return i === e.PlainText || i === e.Markdown;
			}
			e.is = t;
		})(pr || (pr = {}));
		(function (e) {
			function t(n) {
				var i = n;
				return u.objectLiteral(n) && pr.is(i.kind) && u.string(i.value);
			}
			e.is = t;
		})(pt || (pt = {}));
		(function (e) {
			(e.Text = 1),
				(e.Method = 2),
				(e.Function = 3),
				(e.Constructor = 4),
				(e.Field = 5),
				(e.Variable = 6),
				(e.Class = 7),
				(e.Interface = 8),
				(e.Module = 9),
				(e.Property = 10),
				(e.Unit = 11),
				(e.Value = 12),
				(e.Enum = 13),
				(e.Keyword = 14),
				(e.Snippet = 15),
				(e.Color = 16),
				(e.File = 17),
				(e.Reference = 18),
				(e.Folder = 19),
				(e.EnumMember = 20),
				(e.Constant = 21),
				(e.Struct = 22),
				(e.Event = 23),
				(e.Operator = 24),
				(e.TypeParameter = 25);
		})(ci || (ci = {}));
		(function (e) {
			(e.PlainText = 1), (e.Snippet = 2);
		})(ui || (ui = {}));
		(function (e) {
			e.Deprecated = 1;
		})(di || (di = {}));
		(function (e) {
			function t(i, r, s) {
				return { newText: i, insert: r, replace: s };
			}
			e.create = t;
			function n(i) {
				var r = i;
				return r && u.string(r.newText) && z.is(r.insert) && z.is(r.replace);
			}
			e.is = n;
		})(li || (li = {}));
		(function (e) {
			(e.asIs = 1), (e.adjustIndentation = 2);
		})(fi || (fi = {}));
		(function (e) {
			function t(n) {
				var i = n;
				return (
					i &&
					(u.string(i.detail) || i.detail === void 0) &&
					(u.string(i.description) || i.description === void 0)
				);
			}
			e.is = t;
		})(pi || (pi = {}));
		(function (e) {
			function t(n) {
				return { label: n };
			}
			e.create = t;
		})(hi || (hi = {}));
		(function (e) {
			function t(n, i) {
				return { items: n || [], isIncomplete: !!i };
			}
			e.create = t;
		})(gi || (gi = {}));
		(function (e) {
			function t(i) {
				return i.replace(/[\\`*_{}[\]()#+\-.!]/g, '\\$&');
			}
			e.fromPlainText = t;
			function n(i) {
				var r = i;
				return u.string(r) || (u.objectLiteral(r) && u.string(r.language) && u.string(r.value));
			}
			e.is = n;
		})(Nt || (Nt = {}));
		(function (e) {
			function t(n) {
				var i = n;
				return (
					!!i &&
					u.objectLiteral(i) &&
					(pt.is(i.contents) || Nt.is(i.contents) || u.typedArray(i.contents, Nt.is)) &&
					(n.range === void 0 || z.is(n.range))
				);
			}
			e.is = t;
		})(mi || (mi = {}));
		(function (e) {
			function t(n, i) {
				return i ? { label: n, documentation: i } : { label: n };
			}
			e.create = t;
		})(yi || (yi = {}));
		(function (e) {
			function t(n, i) {
				for (var r = [], s = 2; s < arguments.length; s++) r[s - 2] = arguments[s];
				var c = { label: n };
				return (
					u.defined(i) && (c.documentation = i),
					u.defined(r) ? (c.parameters = r) : (c.parameters = []),
					c
				);
			}
			e.create = t;
		})(vi || (vi = {}));
		(function (e) {
			(e.Text = 1), (e.Read = 2), (e.Write = 3);
		})(bi || (bi = {}));
		(function (e) {
			function t(n, i) {
				var r = { range: n };
				return u.number(i) && (r.kind = i), r;
			}
			e.create = t;
		})(Ri || (Ri = {}));
		(function (e) {
			(e.File = 1),
				(e.Module = 2),
				(e.Namespace = 3),
				(e.Package = 4),
				(e.Class = 5),
				(e.Method = 6),
				(e.Property = 7),
				(e.Field = 8),
				(e.Constructor = 9),
				(e.Enum = 10),
				(e.Interface = 11),
				(e.Function = 12),
				(e.Variable = 13),
				(e.Constant = 14),
				(e.String = 15),
				(e.Number = 16),
				(e.Boolean = 17),
				(e.Array = 18),
				(e.Object = 19),
				(e.Key = 20),
				(e.Null = 21),
				(e.EnumMember = 22),
				(e.Struct = 23),
				(e.Event = 24),
				(e.Operator = 25),
				(e.TypeParameter = 26);
		})(_i || (_i = {}));
		(function (e) {
			e.Deprecated = 1;
		})(Di || (Di = {}));
		(function (e) {
			function t(n, i, r, s, c) {
				var m = { name: n, kind: i, location: { uri: s, range: r } };
				return c && (m.containerName = c), m;
			}
			e.create = t;
		})(wi || (wi = {}));
		(function (e) {
			function t(n, i, r, s) {
				return s !== void 0
					? { name: n, kind: i, location: { uri: r, range: s } }
					: { name: n, kind: i, location: { uri: r } };
			}
			e.create = t;
		})(Ti || (Ti = {}));
		(function (e) {
			function t(i, r, s, c, m, q) {
				var R = { name: i, detail: r, kind: s, range: c, selectionRange: m };
				return q !== void 0 && (R.children = q), R;
			}
			e.create = t;
			function n(i) {
				var r = i;
				return (
					r &&
					u.string(r.name) &&
					u.number(r.kind) &&
					z.is(r.range) &&
					z.is(r.selectionRange) &&
					(r.detail === void 0 || u.string(r.detail)) &&
					(r.deprecated === void 0 || u.boolean(r.deprecated)) &&
					(r.children === void 0 || Array.isArray(r.children)) &&
					(r.tags === void 0 || Array.isArray(r.tags))
				);
			}
			e.is = n;
		})(Pi || (Pi = {}));
		(function (e) {
			(e.Empty = ''),
				(e.QuickFix = 'quickfix'),
				(e.Refactor = 'refactor'),
				(e.RefactorExtract = 'refactor.extract'),
				(e.RefactorInline = 'refactor.inline'),
				(e.RefactorRewrite = 'refactor.rewrite'),
				(e.Source = 'source'),
				(e.SourceOrganizeImports = 'source.organizeImports'),
				(e.SourceFixAll = 'source.fixAll');
		})(qi || (qi = {}));
		(function (e) {
			(e.Invoked = 1), (e.Automatic = 2);
		})(Ot || (Ot = {}));
		(function (e) {
			function t(i, r, s) {
				var c = { diagnostics: i };
				return r != null && (c.only = r), s != null && (c.triggerKind = s), c;
			}
			e.create = t;
			function n(i) {
				var r = i;
				return (
					u.defined(r) &&
					u.typedArray(r.diagnostics, xt.is) &&
					(r.only === void 0 || u.typedArray(r.only, u.string)) &&
					(r.triggerKind === void 0 ||
						r.triggerKind === Ot.Invoked ||
						r.triggerKind === Ot.Automatic)
				);
			}
			e.is = n;
		})(Ci || (Ci = {}));
		(function (e) {
			function t(i, r, s) {
				var c = { title: i },
					m = !0;
				return (
					typeof r == 'string'
						? ((m = !1), (c.kind = r))
						: Ye.is(r)
						? (c.command = r)
						: (c.edit = r),
					m && s !== void 0 && (c.kind = s),
					c
				);
			}
			e.create = t;
			function n(i) {
				var r = i;
				return (
					r &&
					u.string(r.title) &&
					(r.diagnostics === void 0 || u.typedArray(r.diagnostics, xt.is)) &&
					(r.kind === void 0 || u.string(r.kind)) &&
					(r.edit !== void 0 || r.command !== void 0) &&
					(r.command === void 0 || Ye.is(r.command)) &&
					(r.isPreferred === void 0 || u.boolean(r.isPreferred)) &&
					(r.edit === void 0 || fr.is(r.edit))
				);
			}
			e.is = n;
		})(Si || (Si = {}));
		(function (e) {
			function t(i, r) {
				var s = { range: i };
				return u.defined(r) && (s.data = r), s;
			}
			e.create = t;
			function n(i) {
				var r = i;
				return u.defined(r) && z.is(r.range) && (u.undefined(r.command) || Ye.is(r.command));
			}
			e.is = n;
		})(ki || (ki = {}));
		(function (e) {
			function t(i, r) {
				return { tabSize: i, insertSpaces: r };
			}
			e.create = t;
			function n(i) {
				var r = i;
				return u.defined(r) && u.uinteger(r.tabSize) && u.boolean(r.insertSpaces);
			}
			e.is = n;
		})(xi || (xi = {}));
		(function (e) {
			function t(i, r, s) {
				return { range: i, target: r, data: s };
			}
			e.create = t;
			function n(i) {
				var r = i;
				return u.defined(r) && z.is(r.range) && (u.undefined(r.target) || u.string(r.target));
			}
			e.is = n;
		})(Mi || (Mi = {}));
		(function (e) {
			function t(i, r) {
				return { range: i, parent: r };
			}
			e.create = t;
			function n(i) {
				var r = i;
				return u.objectLiteral(r) && z.is(r.range) && (r.parent === void 0 || e.is(r.parent));
			}
			e.is = n;
		})(Ei || (Ei = {}));
		(function (e) {
			(e.namespace = 'namespace'),
				(e.type = 'type'),
				(e.class = 'class'),
				(e.enum = 'enum'),
				(e.interface = 'interface'),
				(e.struct = 'struct'),
				(e.typeParameter = 'typeParameter'),
				(e.parameter = 'parameter'),
				(e.variable = 'variable'),
				(e.property = 'property'),
				(e.enumMember = 'enumMember'),
				(e.event = 'event'),
				(e.function = 'function'),
				(e.method = 'method'),
				(e.macro = 'macro'),
				(e.keyword = 'keyword'),
				(e.modifier = 'modifier'),
				(e.comment = 'comment'),
				(e.string = 'string'),
				(e.number = 'number'),
				(e.regexp = 'regexp'),
				(e.operator = 'operator'),
				(e.decorator = 'decorator');
		})(Ni || (Ni = {}));
		(function (e) {
			(e.declaration = 'declaration'),
				(e.definition = 'definition'),
				(e.readonly = 'readonly'),
				(e.static = 'static'),
				(e.deprecated = 'deprecated'),
				(e.abstract = 'abstract'),
				(e.async = 'async'),
				(e.modification = 'modification'),
				(e.documentation = 'documentation'),
				(e.defaultLibrary = 'defaultLibrary');
		})(Oi || (Oi = {}));
		(function (e) {
			function t(n) {
				var i = n;
				return (
					u.objectLiteral(i) &&
					(i.resultId === void 0 || typeof i.resultId == 'string') &&
					Array.isArray(i.data) &&
					(i.data.length === 0 || typeof i.data[0] == 'number')
				);
			}
			e.is = t;
		})(ji || (ji = {}));
		(function (e) {
			function t(i, r) {
				return { range: i, text: r };
			}
			e.create = t;
			function n(i) {
				var r = i;
				return r != null && z.is(r.range) && u.string(r.text);
			}
			e.is = n;
		})(Li || (Li = {}));
		(function (e) {
			function t(i, r, s) {
				return { range: i, variableName: r, caseSensitiveLookup: s };
			}
			e.create = t;
			function n(i) {
				var r = i;
				return (
					r != null &&
					z.is(r.range) &&
					u.boolean(r.caseSensitiveLookup) &&
					(u.string(r.variableName) || r.variableName === void 0)
				);
			}
			e.is = n;
		})(Ai || (Ai = {}));
		(function (e) {
			function t(i, r) {
				return { range: i, expression: r };
			}
			e.create = t;
			function n(i) {
				var r = i;
				return r != null && z.is(r.range) && (u.string(r.expression) || r.expression === void 0);
			}
			e.is = n;
		})(Ii || (Ii = {}));
		(function (e) {
			function t(i, r) {
				return { frameId: i, stoppedLocation: r };
			}
			e.create = t;
			function n(i) {
				var r = i;
				return u.defined(r) && z.is(i.stoppedLocation);
			}
			e.is = n;
		})(Fi || (Fi = {}));
		(function (e) {
			(e.Type = 1), (e.Parameter = 2);
			function t(n) {
				return n === 1 || n === 2;
			}
			e.is = t;
		})(hr || (hr = {}));
		(function (e) {
			function t(i) {
				return { value: i };
			}
			e.create = t;
			function n(i) {
				var r = i;
				return (
					u.objectLiteral(r) &&
					(r.tooltip === void 0 || u.string(r.tooltip) || pt.is(r.tooltip)) &&
					(r.location === void 0 || kt.is(r.location)) &&
					(r.command === void 0 || Ye.is(r.command))
				);
			}
			e.is = n;
		})(gr || (gr = {}));
		(function (e) {
			function t(i, r, s) {
				var c = { position: i, label: r };
				return s !== void 0 && (c.kind = s), c;
			}
			e.create = t;
			function n(i) {
				var r = i;
				return (
					(u.objectLiteral(r) &&
						de.is(r.position) &&
						(u.string(r.label) || u.typedArray(r.label, gr.is)) &&
						(r.kind === void 0 || hr.is(r.kind)) &&
						r.textEdits === void 0) ||
					(u.typedArray(r.textEdits, Te.is) &&
						(r.tooltip === void 0 || u.string(r.tooltip) || pt.is(r.tooltip)) &&
						(r.paddingLeft === void 0 || u.boolean(r.paddingLeft)) &&
						(r.paddingRight === void 0 || u.boolean(r.paddingRight)))
				);
			}
			e.is = n;
		})(Wi || (Wi = {}));
		(function (e) {
			function t(n) {
				var i = n;
				return u.objectLiteral(i) && ur.is(i.uri) && u.string(i.name);
			}
			e.is = t;
		})($i || ($i = {}));
		uc = [
			`
`,
			`\r
`,
			'\r',
		];
		(function (e) {
			function t(s, c, m, q) {
				return new dc(s, c, m, q);
			}
			e.create = t;
			function n(s) {
				var c = s;
				return !!(
					u.defined(c) &&
					u.string(c.uri) &&
					(u.undefined(c.languageId) || u.string(c.languageId)) &&
					u.uinteger(c.lineCount) &&
					u.func(c.getText) &&
					u.func(c.positionAt) &&
					u.func(c.offsetAt)
				);
			}
			e.is = n;
			function i(s, c) {
				for (
					var m = s.getText(),
						q = r(c, function (Re, ue) {
							var _e = Re.range.start.line - ue.range.start.line;
							return _e === 0 ? Re.range.start.character - ue.range.start.character : _e;
						}),
						R = m.length,
						O = q.length - 1;
					O >= 0;
					O--
				) {
					var j = q[O],
						B = s.offsetAt(j.range.start),
						P = s.offsetAt(j.range.end);
					if (P <= R) m = m.substring(0, B) + j.newText + m.substring(P, m.length);
					else throw new Error('Overlapping edit');
					R = B;
				}
				return m;
			}
			e.applyEdits = i;
			function r(s, c) {
				if (s.length <= 1) return s;
				var m = (s.length / 2) | 0,
					q = s.slice(0, m),
					R = s.slice(m);
				r(q, c), r(R, c);
				for (var O = 0, j = 0, B = 0; O < q.length && j < R.length; ) {
					var P = c(q[O], R[j]);
					P <= 0 ? (s[B++] = q[O++]) : (s[B++] = R[j++]);
				}
				for (; O < q.length; ) s[B++] = q[O++];
				for (; j < R.length; ) s[B++] = R[j++];
				return s;
			}
		})(Hi || (Hi = {}));
		dc = (function () {
			function e(t, n, i, r) {
				(this._uri = t),
					(this._languageId = n),
					(this._version = i),
					(this._content = r),
					(this._lineOffsets = void 0);
			}
			return (
				Object.defineProperty(e.prototype, 'uri', {
					get: function () {
						return this._uri;
					},
					enumerable: !1,
					configurable: !0,
				}),
				Object.defineProperty(e.prototype, 'languageId', {
					get: function () {
						return this._languageId;
					},
					enumerable: !1,
					configurable: !0,
				}),
				Object.defineProperty(e.prototype, 'version', {
					get: function () {
						return this._version;
					},
					enumerable: !1,
					configurable: !0,
				}),
				(e.prototype.getText = function (t) {
					if (t) {
						var n = this.offsetAt(t.start),
							i = this.offsetAt(t.end);
						return this._content.substring(n, i);
					}
					return this._content;
				}),
				(e.prototype.update = function (t, n) {
					(this._content = t.text), (this._version = n), (this._lineOffsets = void 0);
				}),
				(e.prototype.getLineOffsets = function () {
					if (this._lineOffsets === void 0) {
						for (var t = [], n = this._content, i = !0, r = 0; r < n.length; r++) {
							i && (t.push(r), (i = !1));
							var s = n.charAt(r);
							(i =
								s === '\r' ||
								s ===
									`
`),
								s === '\r' &&
									r + 1 < n.length &&
									n.charAt(r + 1) ===
										`
` &&
									r++;
						}
						i && n.length > 0 && t.push(n.length), (this._lineOffsets = t);
					}
					return this._lineOffsets;
				}),
				(e.prototype.positionAt = function (t) {
					t = Math.max(Math.min(t, this._content.length), 0);
					var n = this.getLineOffsets(),
						i = 0,
						r = n.length;
					if (r === 0) return de.create(0, t);
					for (; i < r; ) {
						var s = Math.floor((i + r) / 2);
						n[s] > t ? (r = s) : (i = s + 1);
					}
					var c = i - 1;
					return de.create(c, t - n[c]);
				}),
				(e.prototype.offsetAt = function (t) {
					var n = this.getLineOffsets();
					if (t.line >= n.length) return this._content.length;
					if (t.line < 0) return 0;
					var i = n[t.line],
						r = t.line + 1 < n.length ? n[t.line + 1] : this._content.length;
					return Math.max(Math.min(i + t.character, r), i);
				}),
				Object.defineProperty(e.prototype, 'lineCount', {
					get: function () {
						return this.getLineOffsets().length;
					},
					enumerable: !1,
					configurable: !0,
				}),
				e
			);
		})();
		(function (e) {
			var t = Object.prototype.toString;
			function n(P) {
				return typeof P < 'u';
			}
			e.defined = n;
			function i(P) {
				return typeof P > 'u';
			}
			e.undefined = i;
			function r(P) {
				return P === !0 || P === !1;
			}
			e.boolean = r;
			function s(P) {
				return t.call(P) === '[object String]';
			}
			e.string = s;
			function c(P) {
				return t.call(P) === '[object Number]';
			}
			e.number = c;
			function m(P, Re, ue) {
				return t.call(P) === '[object Number]' && Re <= P && P <= ue;
			}
			e.numberRange = m;
			function q(P) {
				return t.call(P) === '[object Number]' && -2147483648 <= P && P <= 2147483647;
			}
			e.integer = q;
			function R(P) {
				return t.call(P) === '[object Number]' && 0 <= P && P <= 2147483647;
			}
			e.uinteger = R;
			function O(P) {
				return t.call(P) === '[object Function]';
			}
			e.func = O;
			function j(P) {
				return P !== null && typeof P == 'object';
			}
			e.objectLiteral = j;
			function B(P, Re) {
				return Array.isArray(P) && P.every(Re);
			}
			e.typedArray = B;
		})(u || (u = {}));
	});
var $ = c((ie) => {
	j();
	h();
	Object.defineProperty(ie, '__esModule', { value: !0 });
	ie.ProtocolNotificationType =
		ie.ProtocolNotificationType0 =
		ie.ProtocolRequestType =
		ie.ProtocolRequestType0 =
		ie.RegistrationType =
		ie.MessageDirection =
			void 0;
	var ht = ut();
	(function (e) {
		(e.clientToServer = 'clientToServer'), (e.serverToClient = 'serverToClient'), (e.both = 'both');
	})(ie.MessageDirection || (ie.MessageDirection = {}));
	var Ui = class {
		constructor(t) {
			this.method = t;
		}
	};
	ie.RegistrationType = Ui;
	var zi = class extends ht.RequestType0 {
		constructor(t) {
			super(t);
		}
	};
	ie.ProtocolRequestType0 = zi;
	var Vi = class extends ht.RequestType {
		constructor(t) {
			super(t, ht.ParameterStructures.byName);
		}
	};
	ie.ProtocolRequestType = Vi;
	var Bi = class extends ht.NotificationType0 {
		constructor(t) {
			super(t);
		}
	};
	ie.ProtocolNotificationType0 = Bi;
	var Ji = class extends ht.NotificationType {
		constructor(t) {
			super(t, ht.ParameterStructures.byName);
		}
	};
	ie.ProtocolNotificationType = Ji;
});
var vr = c((J) => {
	j();
	h();
	Object.defineProperty(J, '__esModule', { value: !0 });
	J.objectLiteral =
		J.typedArray =
		J.stringArray =
		J.array =
		J.func =
		J.error =
		J.number =
		J.string =
		J.boolean =
			void 0;
	function fc(e) {
		return e === !0 || e === !1;
	}
	J.boolean = fc;
	function Bo(e) {
		return typeof e == 'string' || e instanceof String;
	}
	J.string = Bo;
	function pc(e) {
		return typeof e == 'number' || e instanceof Number;
	}
	J.number = pc;
	function hc(e) {
		return e instanceof Error;
	}
	J.error = hc;
	function gc(e) {
		return typeof e == 'function';
	}
	J.func = gc;
	function Jo(e) {
		return Array.isArray(e);
	}
	J.array = Jo;
	function mc(e) {
		return Jo(e) && e.every((t) => Bo(t));
	}
	J.stringArray = mc;
	function yc(e, t) {
		return Array.isArray(e) && e.every(t);
	}
	J.typedArray = yc;
	function vc(e) {
		return e !== null && typeof e == 'object';
	}
	J.objectLiteral = vc;
});
var Qo = c((jt) => {
	j();
	h();
	Object.defineProperty(jt, '__esModule', { value: !0 });
	jt.ImplementationRequest = void 0;
	var Xo = $();
	(function (e) {
		(e.method = 'textDocument/implementation'),
			(e.messageDirection = Xo.MessageDirection.clientToServer),
			(e.type = new Xo.ProtocolRequestType(e.method));
	})(jt.ImplementationRequest || (jt.ImplementationRequest = {}));
});
var Yo = c((Lt) => {
	j();
	h();
	Object.defineProperty(Lt, '__esModule', { value: !0 });
	Lt.TypeDefinitionRequest = void 0;
	var Go = $();
	(function (e) {
		(e.method = 'textDocument/typeDefinition'),
			(e.messageDirection = Go.MessageDirection.clientToServer),
			(e.type = new Go.ProtocolRequestType(e.method));
	})(Lt.TypeDefinitionRequest || (Lt.TypeDefinitionRequest = {}));
});
var Zo = c((We) => {
	j();
	h();
	Object.defineProperty(We, '__esModule', { value: !0 });
	We.DidChangeWorkspaceFoldersNotification = We.WorkspaceFoldersRequest = void 0;
	var br = $();
	(function (e) {
		(e.method = 'workspace/workspaceFolders'),
			(e.messageDirection = br.MessageDirection.serverToClient),
			(e.type = new br.ProtocolRequestType0(e.method));
	})(We.WorkspaceFoldersRequest || (We.WorkspaceFoldersRequest = {}));
	(function (e) {
		(e.method = 'workspace/didChangeWorkspaceFolders'),
			(e.messageDirection = br.MessageDirection.clientToServer),
			(e.type = new br.ProtocolNotificationType(e.method));
	})(We.DidChangeWorkspaceFoldersNotification || (We.DidChangeWorkspaceFoldersNotification = {}));
});
var es = c((At) => {
	j();
	h();
	Object.defineProperty(At, '__esModule', { value: !0 });
	At.ConfigurationRequest = void 0;
	var Ko = $();
	(function (e) {
		(e.method = 'workspace/configuration'),
			(e.messageDirection = Ko.MessageDirection.serverToClient),
			(e.type = new Ko.ProtocolRequestType(e.method));
	})(At.ConfigurationRequest || (At.ConfigurationRequest = {}));
});
var ts = c(($e) => {
	j();
	h();
	Object.defineProperty($e, '__esModule', { value: !0 });
	$e.ColorPresentationRequest = $e.DocumentColorRequest = void 0;
	var Rr = $();
	(function (e) {
		(e.method = 'textDocument/documentColor'),
			(e.messageDirection = Rr.MessageDirection.clientToServer),
			(e.type = new Rr.ProtocolRequestType(e.method));
	})($e.DocumentColorRequest || ($e.DocumentColorRequest = {}));
	(function (e) {
		(e.method = 'textDocument/colorPresentation'),
			(e.messageDirection = Rr.MessageDirection.clientToServer),
			(e.type = new Rr.ProtocolRequestType(e.method));
	})($e.ColorPresentationRequest || ($e.ColorPresentationRequest = {}));
});
var ns = c((It) => {
	j();
	h();
	Object.defineProperty(It, '__esModule', { value: !0 });
	It.FoldingRangeRequest = void 0;
	var rs = $();
	(function (e) {
		(e.method = 'textDocument/foldingRange'),
			(e.messageDirection = rs.MessageDirection.clientToServer),
			(e.type = new rs.ProtocolRequestType(e.method));
	})(It.FoldingRangeRequest || (It.FoldingRangeRequest = {}));
});
var os = c((Ft) => {
	j();
	h();
	Object.defineProperty(Ft, '__esModule', { value: !0 });
	Ft.DeclarationRequest = void 0;
	var is = $();
	(function (e) {
		(e.method = 'textDocument/declaration'),
			(e.messageDirection = is.MessageDirection.clientToServer),
			(e.type = new is.ProtocolRequestType(e.method));
	})(Ft.DeclarationRequest || (Ft.DeclarationRequest = {}));
});
var as = c((Wt) => {
	j();
	h();
	Object.defineProperty(Wt, '__esModule', { value: !0 });
	Wt.SelectionRangeRequest = void 0;
	var ss = $();
	(function (e) {
		(e.method = 'textDocument/selectionRange'),
			(e.messageDirection = ss.MessageDirection.clientToServer),
			(e.type = new ss.ProtocolRequestType(e.method));
	})(Wt.SelectionRangeRequest || (Wt.SelectionRangeRequest = {}));
});
var cs = c((he) => {
	j();
	h();
	Object.defineProperty(he, '__esModule', { value: !0 });
	he.WorkDoneProgressCancelNotification =
		he.WorkDoneProgressCreateRequest =
		he.WorkDoneProgress =
			void 0;
	var kc = ut(),
		_r = $();
	(function (e) {
		e.type = new kc.ProgressType();
		function t(n) {
			return n === e.type;
		}
		e.is = t;
	})(he.WorkDoneProgress || (he.WorkDoneProgress = {}));
	(function (e) {
		(e.method = 'window/workDoneProgress/create'),
			(e.messageDirection = _r.MessageDirection.serverToClient),
			(e.type = new _r.ProtocolRequestType(e.method));
	})(he.WorkDoneProgressCreateRequest || (he.WorkDoneProgressCreateRequest = {}));
	(function (e) {
		(e.method = 'window/workDoneProgress/cancel'),
			(e.messageDirection = _r.MessageDirection.clientToServer),
			(e.type = new _r.ProtocolNotificationType(e.method));
	})(he.WorkDoneProgressCancelNotification || (he.WorkDoneProgressCancelNotification = {}));
});
var us = c((ge) => {
	j();
	h();
	Object.defineProperty(ge, '__esModule', { value: !0 });
	ge.CallHierarchyOutgoingCallsRequest =
		ge.CallHierarchyIncomingCallsRequest =
		ge.CallHierarchyPrepareRequest =
			void 0;
	var gt = $();
	(function (e) {
		(e.method = 'textDocument/prepareCallHierarchy'),
			(e.messageDirection = gt.MessageDirection.clientToServer),
			(e.type = new gt.ProtocolRequestType(e.method));
	})(ge.CallHierarchyPrepareRequest || (ge.CallHierarchyPrepareRequest = {}));
	(function (e) {
		(e.method = 'callHierarchy/incomingCalls'),
			(e.messageDirection = gt.MessageDirection.clientToServer),
			(e.type = new gt.ProtocolRequestType(e.method));
	})(ge.CallHierarchyIncomingCallsRequest || (ge.CallHierarchyIncomingCallsRequest = {}));
	(function (e) {
		(e.method = 'callHierarchy/outgoingCalls'),
			(e.messageDirection = gt.MessageDirection.clientToServer),
			(e.type = new gt.ProtocolRequestType(e.method));
	})(ge.CallHierarchyOutgoingCallsRequest || (ge.CallHierarchyOutgoingCallsRequest = {}));
});
var ds = c((X) => {
	j();
	h();
	Object.defineProperty(X, '__esModule', { value: !0 });
	X.SemanticTokensRefreshRequest =
		X.SemanticTokensRangeRequest =
		X.SemanticTokensDeltaRequest =
		X.SemanticTokensRequest =
		X.SemanticTokensRegistrationType =
		X.TokenFormat =
			void 0;
	var Oe = $();
	(function (e) {
		e.Relative = 'relative';
	})(X.TokenFormat || (X.TokenFormat = {}));
	var Dr;
	(function (e) {
		(e.method = 'textDocument/semanticTokens'), (e.type = new Oe.RegistrationType(e.method));
	})((Dr = X.SemanticTokensRegistrationType || (X.SemanticTokensRegistrationType = {})));
	(function (e) {
		(e.method = 'textDocument/semanticTokens/full'),
			(e.messageDirection = Oe.MessageDirection.clientToServer),
			(e.type = new Oe.ProtocolRequestType(e.method)),
			(e.registrationMethod = Dr.method);
	})(X.SemanticTokensRequest || (X.SemanticTokensRequest = {}));
	(function (e) {
		(e.method = 'textDocument/semanticTokens/full/delta'),
			(e.messageDirection = Oe.MessageDirection.clientToServer),
			(e.type = new Oe.ProtocolRequestType(e.method)),
			(e.registrationMethod = Dr.method);
	})(X.SemanticTokensDeltaRequest || (X.SemanticTokensDeltaRequest = {}));
	(function (e) {
		(e.method = 'textDocument/semanticTokens/range'),
			(e.messageDirection = Oe.MessageDirection.clientToServer),
			(e.type = new Oe.ProtocolRequestType(e.method)),
			(e.registrationMethod = Dr.method);
	})(X.SemanticTokensRangeRequest || (X.SemanticTokensRangeRequest = {}));
	(function (e) {
		(e.method = 'workspace/semanticTokens/refresh'),
			(e.messageDirection = Oe.MessageDirection.serverToClient),
			(e.type = new Oe.ProtocolRequestType0(e.method));
	})(X.SemanticTokensRefreshRequest || (X.SemanticTokensRefreshRequest = {}));
});
var fs = c(($t) => {
	j();
	h();
	Object.defineProperty($t, '__esModule', { value: !0 });
	$t.ShowDocumentRequest = void 0;
	var ls = $();
	(function (e) {
		(e.method = 'window/showDocument'),
			(e.messageDirection = ls.MessageDirection.serverToClient),
			(e.type = new ls.ProtocolRequestType(e.method));
	})($t.ShowDocumentRequest || ($t.ShowDocumentRequest = {}));
});
var hs = c((Ht) => {
	j();
	h();
	Object.defineProperty(Ht, '__esModule', { value: !0 });
	Ht.LinkedEditingRangeRequest = void 0;
	var ps = $();
	(function (e) {
		(e.method = 'textDocument/linkedEditingRange'),
			(e.messageDirection = ps.MessageDirection.clientToServer),
			(e.type = new ps.ProtocolRequestType(e.method));
	})(Ht.LinkedEditingRangeRequest || (Ht.LinkedEditingRangeRequest = {}));
});
var gs = c((H) => {
	j();
	h();
	Object.defineProperty(H, '__esModule', { value: !0 });
	H.WillDeleteFilesRequest =
		H.DidDeleteFilesNotification =
		H.DidRenameFilesNotification =
		H.WillRenameFilesRequest =
		H.DidCreateFilesNotification =
		H.WillCreateFilesRequest =
		H.FileOperationPatternKind =
			void 0;
	var le = $();
	(function (e) {
		(e.file = 'file'), (e.folder = 'folder');
	})(H.FileOperationPatternKind || (H.FileOperationPatternKind = {}));
	(function (e) {
		(e.method = 'workspace/willCreateFiles'),
			(e.messageDirection = le.MessageDirection.clientToServer),
			(e.type = new le.ProtocolRequestType(e.method));
	})(H.WillCreateFilesRequest || (H.WillCreateFilesRequest = {}));
	(function (e) {
		(e.method = 'workspace/didCreateFiles'),
			(e.messageDirection = le.MessageDirection.clientToServer),
			(e.type = new le.ProtocolNotificationType(e.method));
	})(H.DidCreateFilesNotification || (H.DidCreateFilesNotification = {}));
	(function (e) {
		(e.method = 'workspace/willRenameFiles'),
			(e.messageDirection = le.MessageDirection.clientToServer),
			(e.type = new le.ProtocolRequestType(e.method));
	})(H.WillRenameFilesRequest || (H.WillRenameFilesRequest = {}));
	(function (e) {
		(e.method = 'workspace/didRenameFiles'),
			(e.messageDirection = le.MessageDirection.clientToServer),
			(e.type = new le.ProtocolNotificationType(e.method));
	})(H.DidRenameFilesNotification || (H.DidRenameFilesNotification = {}));
	(function (e) {
		(e.method = 'workspace/didDeleteFiles'),
			(e.messageDirection = le.MessageDirection.clientToServer),
			(e.type = new le.ProtocolNotificationType(e.method));
	})(H.DidDeleteFilesNotification || (H.DidDeleteFilesNotification = {}));
	(function (e) {
		(e.method = 'workspace/willDeleteFiles'),
			(e.messageDirection = le.MessageDirection.clientToServer),
			(e.type = new le.ProtocolRequestType(e.method));
	})(H.WillDeleteFilesRequest || (H.WillDeleteFilesRequest = {}));
});
var ys = c((me) => {
	j();
	h();
	Object.defineProperty(me, '__esModule', { value: !0 });
	me.MonikerRequest = me.MonikerKind = me.UniquenessLevel = void 0;
	var ms = $();
	(function (e) {
		(e.document = 'document'),
			(e.project = 'project'),
			(e.group = 'group'),
			(e.scheme = 'scheme'),
			(e.global = 'global');
	})(me.UniquenessLevel || (me.UniquenessLevel = {}));
	(function (e) {
		(e.$import = 'import'), (e.$export = 'export'), (e.local = 'local');
	})(me.MonikerKind || (me.MonikerKind = {}));
	(function (e) {
		(e.method = 'textDocument/moniker'),
			(e.messageDirection = ms.MessageDirection.clientToServer),
			(e.type = new ms.ProtocolRequestType(e.method));
	})(me.MonikerRequest || (me.MonikerRequest = {}));
});
var vs = c((ye) => {
	j();
	h();
	Object.defineProperty(ye, '__esModule', { value: !0 });
	ye.TypeHierarchySubtypesRequest =
		ye.TypeHierarchySupertypesRequest =
		ye.TypeHierarchyPrepareRequest =
			void 0;
	var mt = $();
	(function (e) {
		(e.method = 'textDocument/prepareTypeHierarchy'),
			(e.messageDirection = mt.MessageDirection.clientToServer),
			(e.type = new mt.ProtocolRequestType(e.method));
	})(ye.TypeHierarchyPrepareRequest || (ye.TypeHierarchyPrepareRequest = {}));
	(function (e) {
		(e.method = 'typeHierarchy/supertypes'),
			(e.messageDirection = mt.MessageDirection.clientToServer),
			(e.type = new mt.ProtocolRequestType(e.method));
	})(ye.TypeHierarchySupertypesRequest || (ye.TypeHierarchySupertypesRequest = {}));
	(function (e) {
		(e.method = 'typeHierarchy/subtypes'),
			(e.messageDirection = mt.MessageDirection.clientToServer),
			(e.type = new mt.ProtocolRequestType(e.method));
	})(ye.TypeHierarchySubtypesRequest || (ye.TypeHierarchySubtypesRequest = {}));
});
var bs = c((He) => {
	j();
	h();
	Object.defineProperty(He, '__esModule', { value: !0 });
	He.InlineValueRefreshRequest = He.InlineValueRequest = void 0;
	var wr = $();
	(function (e) {
		(e.method = 'textDocument/inlineValue'),
			(e.messageDirection = wr.MessageDirection.clientToServer),
			(e.type = new wr.ProtocolRequestType(e.method));
	})(He.InlineValueRequest || (He.InlineValueRequest = {}));
	(function (e) {
		(e.method = 'workspace/inlineValue/refresh'),
			(e.messageDirection = wr.MessageDirection.serverToClient),
			(e.type = new wr.ProtocolRequestType0(e.method));
	})(He.InlineValueRefreshRequest || (He.InlineValueRefreshRequest = {}));
});
var Rs = c((ve) => {
	j();
	h();
	Object.defineProperty(ve, '__esModule', { value: !0 });
	ve.InlayHintRefreshRequest = ve.InlayHintResolveRequest = ve.InlayHintRequest = void 0;
	var yt = $();
	(function (e) {
		(e.method = 'textDocument/inlayHint'),
			(e.messageDirection = yt.MessageDirection.clientToServer),
			(e.type = new yt.ProtocolRequestType(e.method));
	})(ve.InlayHintRequest || (ve.InlayHintRequest = {}));
	(function (e) {
		(e.method = 'inlayHint/resolve'),
			(e.messageDirection = yt.MessageDirection.clientToServer),
			(e.type = new yt.ProtocolRequestType(e.method));
	})(ve.InlayHintResolveRequest || (ve.InlayHintResolveRequest = {}));
	(function (e) {
		(e.method = 'workspace/inlayHint/refresh'),
			(e.messageDirection = yt.MessageDirection.serverToClient),
			(e.type = new yt.ProtocolRequestType0(e.method));
	})(ve.InlayHintRefreshRequest || (ve.InlayHintRefreshRequest = {}));
});
var Ds = c((K) => {
	j();
	h();
	Object.defineProperty(K, '__esModule', { value: !0 });
	K.DiagnosticRefreshRequest =
		K.WorkspaceDiagnosticRequest =
		K.DocumentDiagnosticRequest =
		K.DocumentDiagnosticReportKind =
		K.DiagnosticServerCancellationData =
			void 0;
	var _s = ut(),
		au = vr(),
		vt = $();
	(function (e) {
		function t(n) {
			let i = n;
			return i && au.boolean(i.retriggerRequest);
		}
		e.is = t;
	})(K.DiagnosticServerCancellationData || (K.DiagnosticServerCancellationData = {}));
	(function (e) {
		(e.Full = 'full'), (e.Unchanged = 'unchanged');
	})(K.DocumentDiagnosticReportKind || (K.DocumentDiagnosticReportKind = {}));
	(function (e) {
		(e.method = 'textDocument/diagnostic'),
			(e.messageDirection = vt.MessageDirection.clientToServer),
			(e.type = new vt.ProtocolRequestType(e.method)),
			(e.partialResult = new _s.ProgressType());
	})(K.DocumentDiagnosticRequest || (K.DocumentDiagnosticRequest = {}));
	(function (e) {
		(e.method = 'workspace/diagnostic'),
			(e.messageDirection = vt.MessageDirection.clientToServer),
			(e.type = new vt.ProtocolRequestType(e.method)),
			(e.partialResult = new _s.ProgressType());
	})(K.WorkspaceDiagnosticRequest || (K.WorkspaceDiagnosticRequest = {}));
	(function (e) {
		(e.method = 'workspace/diagnostic/refresh'),
			(e.messageDirection = vt.MessageDirection.serverToClient),
			(e.type = new vt.ProtocolRequestType0(e.method));
	})(K.DiagnosticRefreshRequest || (K.DiagnosticRefreshRequest = {}));
});
var Ps = c((k) => {
	j();
	h();
	Object.defineProperty(k, '__esModule', { value: !0 });
	k.DidCloseNotebookDocumentNotification =
		k.DidSaveNotebookDocumentNotification =
		k.DidChangeNotebookDocumentNotification =
		k.NotebookCellArrayChange =
		k.DidOpenNotebookDocumentNotification =
		k.NotebookDocumentSyncRegistrationType =
		k.NotebookDocument =
		k.NotebookCell =
		k.ExecutionSummary =
		k.NotebookCellKind =
			void 0;
	var Ut = (yr(), f(mr)),
		be = vr(),
		Pe = $(),
		ws;
	(function (e) {
		(e.Markup = 1), (e.Code = 2);
		function t(n) {
			return n === 1 || n === 2;
		}
		e.is = t;
	})((ws = k.NotebookCellKind || (k.NotebookCellKind = {})));
	var Ts;
	(function (e) {
		function t(r, s) {
			let c = { executionOrder: r };
			return (s === !0 || s === !1) && (c.success = s), c;
		}
		e.create = t;
		function n(r) {
			let s = r;
			return (
				be.objectLiteral(s) &&
				Ut.uinteger.is(s.executionOrder) &&
				(s.success === void 0 || be.boolean(s.success))
			);
		}
		e.is = n;
		function i(r, s) {
			return r === s
				? !0
				: r == null || s === null || s === void 0
				? !1
				: r.executionOrder === s.executionOrder && r.success === s.success;
		}
		e.equals = i;
	})((Ts = k.ExecutionSummary || (k.ExecutionSummary = {})));
	var Xi;
	(function (e) {
		function t(s, c) {
			return { kind: s, document: c };
		}
		e.create = t;
		function n(s) {
			let c = s;
			return (
				be.objectLiteral(c) &&
				ws.is(c.kind) &&
				Ut.DocumentUri.is(c.document) &&
				(c.metadata === void 0 || be.objectLiteral(c.metadata))
			);
		}
		e.is = n;
		function i(s, c) {
			let m = new Set();
			return (
				s.document !== c.document && m.add('document'),
				s.kind !== c.kind && m.add('kind'),
				s.executionSummary !== c.executionSummary && m.add('executionSummary'),
				(s.metadata !== void 0 || c.metadata !== void 0) &&
					!r(s.metadata, c.metadata) &&
					m.add('metadata'),
				(s.executionSummary !== void 0 || c.executionSummary !== void 0) &&
					!Ts.equals(s.executionSummary, c.executionSummary) &&
					m.add('executionSummary'),
				m
			);
		}
		e.diff = i;
		function r(s, c) {
			if (s === c) return !0;
			if (s == null || c === null || c === void 0 || typeof s != typeof c || typeof s != 'object')
				return !1;
			let m = Array.isArray(s),
				q = Array.isArray(c);
			if (m !== q) return !1;
			if (m && q) {
				if (s.length !== c.length) return !1;
				for (let R = 0; R < s.length; R++) if (!r(s[R], c[R])) return !1;
			}
			if (be.objectLiteral(s) && be.objectLiteral(c)) {
				let R = Object.keys(s),
					O = Object.keys(c);
				if (R.length !== O.length || (R.sort(), O.sort(), !r(R, O))) return !1;
				for (let j = 0; j < R.length; j++) {
					let B = R[j];
					if (!r(s[B], c[B])) return !1;
				}
			}
			return !0;
		}
	})((Xi = k.NotebookCell || (k.NotebookCell = {})));
	(function (e) {
		function t(i, r, s, c) {
			return { uri: i, notebookType: r, version: s, cells: c };
		}
		e.create = t;
		function n(i) {
			let r = i;
			return (
				be.objectLiteral(r) &&
				be.string(r.uri) &&
				Ut.integer.is(r.version) &&
				be.typedArray(r.cells, Xi.is)
			);
		}
		e.is = n;
	})(k.NotebookDocument || (k.NotebookDocument = {}));
	var zt;
	(function (e) {
		(e.method = 'notebookDocument/sync'),
			(e.messageDirection = Pe.MessageDirection.clientToServer),
			(e.type = new Pe.RegistrationType(e.method));
	})(
		(zt = k.NotebookDocumentSyncRegistrationType || (k.NotebookDocumentSyncRegistrationType = {})),
	);
	(function (e) {
		(e.method = 'notebookDocument/didOpen'),
			(e.messageDirection = Pe.MessageDirection.clientToServer),
			(e.type = new Pe.ProtocolNotificationType(e.method)),
			(e.registrationMethod = zt.method);
	})(k.DidOpenNotebookDocumentNotification || (k.DidOpenNotebookDocumentNotification = {}));
	(function (e) {
		function t(i) {
			let r = i;
			return (
				be.objectLiteral(r) &&
				Ut.uinteger.is(r.start) &&
				Ut.uinteger.is(r.deleteCount) &&
				(r.cells === void 0 || be.typedArray(r.cells, Xi.is))
			);
		}
		e.is = t;
		function n(i, r, s) {
			let c = { start: i, deleteCount: r };
			return s !== void 0 && (c.cells = s), c;
		}
		e.create = n;
	})(k.NotebookCellArrayChange || (k.NotebookCellArrayChange = {}));
	(function (e) {
		(e.method = 'notebookDocument/didChange'),
			(e.messageDirection = Pe.MessageDirection.clientToServer),
			(e.type = new Pe.ProtocolNotificationType(e.method)),
			(e.registrationMethod = zt.method);
	})(k.DidChangeNotebookDocumentNotification || (k.DidChangeNotebookDocumentNotification = {}));
	(function (e) {
		(e.method = 'notebookDocument/didSave'),
			(e.messageDirection = Pe.MessageDirection.clientToServer),
			(e.type = new Pe.ProtocolNotificationType(e.method)),
			(e.registrationMethod = zt.method);
	})(k.DidSaveNotebookDocumentNotification || (k.DidSaveNotebookDocumentNotification = {}));
	(function (e) {
		(e.method = 'notebookDocument/didClose'),
			(e.messageDirection = Pe.MessageDirection.clientToServer),
			(e.type = new Pe.ProtocolNotificationType(e.method)),
			(e.registrationMethod = zt.method);
	})(k.DidCloseNotebookDocumentNotification || (k.DidCloseNotebookDocumentNotification = {}));
});
var Os = c((o) => {
	j();
	h();
	Object.defineProperty(o, '__esModule', { value: !0 });
	o.WorkspaceSymbolRequest =
		o.CodeActionResolveRequest =
		o.CodeActionRequest =
		o.DocumentSymbolRequest =
		o.DocumentHighlightRequest =
		o.ReferencesRequest =
		o.DefinitionRequest =
		o.SignatureHelpRequest =
		o.SignatureHelpTriggerKind =
		o.HoverRequest =
		o.CompletionResolveRequest =
		o.CompletionRequest =
		o.CompletionTriggerKind =
		o.PublishDiagnosticsNotification =
		o.WatchKind =
		o.RelativePattern =
		o.FileChangeType =
		o.DidChangeWatchedFilesNotification =
		o.WillSaveTextDocumentWaitUntilRequest =
		o.WillSaveTextDocumentNotification =
		o.TextDocumentSaveReason =
		o.DidSaveTextDocumentNotification =
		o.DidCloseTextDocumentNotification =
		o.DidChangeTextDocumentNotification =
		o.TextDocumentContentChangeEvent =
		o.DidOpenTextDocumentNotification =
		o.TextDocumentSyncKind =
		o.TelemetryEventNotification =
		o.LogMessageNotification =
		o.ShowMessageRequest =
		o.ShowMessageNotification =
		o.MessageType =
		o.DidChangeConfigurationNotification =
		o.ExitNotification =
		o.ShutdownRequest =
		o.InitializedNotification =
		o.InitializeErrorCodes =
		o.InitializeRequest =
		o.WorkDoneProgressOptions =
		o.TextDocumentRegistrationOptions =
		o.StaticRegistrationOptions =
		o.PositionEncodingKind =
		o.FailureHandlingKind =
		o.ResourceOperationKind =
		o.UnregistrationRequest =
		o.RegistrationRequest =
		o.DocumentSelector =
		o.NotebookCellTextDocumentFilter =
		o.NotebookDocumentFilter =
		o.TextDocumentFilter =
			void 0;
	o.TypeHierarchySubtypesRequest =
		o.TypeHierarchyPrepareRequest =
		o.MonikerRequest =
		o.MonikerKind =
		o.UniquenessLevel =
		o.WillDeleteFilesRequest =
		o.DidDeleteFilesNotification =
		o.WillRenameFilesRequest =
		o.DidRenameFilesNotification =
		o.WillCreateFilesRequest =
		o.DidCreateFilesNotification =
		o.FileOperationPatternKind =
		o.LinkedEditingRangeRequest =
		o.ShowDocumentRequest =
		o.SemanticTokensRegistrationType =
		o.SemanticTokensRefreshRequest =
		o.SemanticTokensRangeRequest =
		o.SemanticTokensDeltaRequest =
		o.SemanticTokensRequest =
		o.TokenFormat =
		o.CallHierarchyPrepareRequest =
		o.CallHierarchyOutgoingCallsRequest =
		o.CallHierarchyIncomingCallsRequest =
		o.WorkDoneProgressCancelNotification =
		o.WorkDoneProgressCreateRequest =
		o.WorkDoneProgress =
		o.SelectionRangeRequest =
		o.DeclarationRequest =
		o.FoldingRangeRequest =
		o.ColorPresentationRequest =
		o.DocumentColorRequest =
		o.ConfigurationRequest =
		o.DidChangeWorkspaceFoldersNotification =
		o.WorkspaceFoldersRequest =
		o.TypeDefinitionRequest =
		o.ImplementationRequest =
		o.ApplyWorkspaceEditRequest =
		o.ExecuteCommandRequest =
		o.PrepareRenameRequest =
		o.RenameRequest =
		o.PrepareSupportDefaultBehavior =
		o.DocumentOnTypeFormattingRequest =
		o.DocumentRangeFormattingRequest =
		o.DocumentFormattingRequest =
		o.DocumentLinkResolveRequest =
		o.DocumentLinkRequest =
		o.CodeLensRefreshRequest =
		o.CodeLensResolveRequest =
		o.CodeLensRequest =
		o.WorkspaceSymbolResolveRequest =
			void 0;
	o.DidCloseNotebookDocumentNotification =
		o.DidSaveNotebookDocumentNotification =
		o.DidChangeNotebookDocumentNotification =
		o.NotebookCellArrayChange =
		o.DidOpenNotebookDocumentNotification =
		o.NotebookDocumentSyncRegistrationType =
		o.NotebookDocument =
		o.NotebookCell =
		o.ExecutionSummary =
		o.NotebookCellKind =
		o.DiagnosticRefreshRequest =
		o.WorkspaceDiagnosticRequest =
		o.DocumentDiagnosticRequest =
		o.DocumentDiagnosticReportKind =
		o.DiagnosticServerCancellationData =
		o.InlayHintRefreshRequest =
		o.InlayHintResolveRequest =
		o.InlayHintRequest =
		o.InlineValueRefreshRequest =
		o.InlineValueRequest =
		o.TypeHierarchySupertypesRequest =
			void 0;
	var h$1 = $(),
		qs = (yr(), f(mr)),
		ee = vr(),
		bu = Qo();
	Object.defineProperty(o, 'ImplementationRequest', {
		enumerable: !0,
		get: function () {
			return bu.ImplementationRequest;
		},
	});
	var Ru = Yo();
	Object.defineProperty(o, 'TypeDefinitionRequest', {
		enumerable: !0,
		get: function () {
			return Ru.TypeDefinitionRequest;
		},
	});
	var Cs = Zo();
	Object.defineProperty(o, 'WorkspaceFoldersRequest', {
		enumerable: !0,
		get: function () {
			return Cs.WorkspaceFoldersRequest;
		},
	});
	Object.defineProperty(o, 'DidChangeWorkspaceFoldersNotification', {
		enumerable: !0,
		get: function () {
			return Cs.DidChangeWorkspaceFoldersNotification;
		},
	});
	var _u = es();
	Object.defineProperty(o, 'ConfigurationRequest', {
		enumerable: !0,
		get: function () {
			return _u.ConfigurationRequest;
		},
	});
	var Ss = ts();
	Object.defineProperty(o, 'DocumentColorRequest', {
		enumerable: !0,
		get: function () {
			return Ss.DocumentColorRequest;
		},
	});
	Object.defineProperty(o, 'ColorPresentationRequest', {
		enumerable: !0,
		get: function () {
			return Ss.ColorPresentationRequest;
		},
	});
	var Du = ns();
	Object.defineProperty(o, 'FoldingRangeRequest', {
		enumerable: !0,
		get: function () {
			return Du.FoldingRangeRequest;
		},
	});
	var wu = os();
	Object.defineProperty(o, 'DeclarationRequest', {
		enumerable: !0,
		get: function () {
			return wu.DeclarationRequest;
		},
	});
	var Tu = as();
	Object.defineProperty(o, 'SelectionRangeRequest', {
		enumerable: !0,
		get: function () {
			return Tu.SelectionRangeRequest;
		},
	});
	var Qi = cs();
	Object.defineProperty(o, 'WorkDoneProgress', {
		enumerable: !0,
		get: function () {
			return Qi.WorkDoneProgress;
		},
	});
	Object.defineProperty(o, 'WorkDoneProgressCreateRequest', {
		enumerable: !0,
		get: function () {
			return Qi.WorkDoneProgressCreateRequest;
		},
	});
	Object.defineProperty(o, 'WorkDoneProgressCancelNotification', {
		enumerable: !0,
		get: function () {
			return Qi.WorkDoneProgressCancelNotification;
		},
	});
	var Gi = us();
	Object.defineProperty(o, 'CallHierarchyIncomingCallsRequest', {
		enumerable: !0,
		get: function () {
			return Gi.CallHierarchyIncomingCallsRequest;
		},
	});
	Object.defineProperty(o, 'CallHierarchyOutgoingCallsRequest', {
		enumerable: !0,
		get: function () {
			return Gi.CallHierarchyOutgoingCallsRequest;
		},
	});
	Object.defineProperty(o, 'CallHierarchyPrepareRequest', {
		enumerable: !0,
		get: function () {
			return Gi.CallHierarchyPrepareRequest;
		},
	});
	var bt = ds();
	Object.defineProperty(o, 'TokenFormat', {
		enumerable: !0,
		get: function () {
			return bt.TokenFormat;
		},
	});
	Object.defineProperty(o, 'SemanticTokensRequest', {
		enumerable: !0,
		get: function () {
			return bt.SemanticTokensRequest;
		},
	});
	Object.defineProperty(o, 'SemanticTokensDeltaRequest', {
		enumerable: !0,
		get: function () {
			return bt.SemanticTokensDeltaRequest;
		},
	});
	Object.defineProperty(o, 'SemanticTokensRangeRequest', {
		enumerable: !0,
		get: function () {
			return bt.SemanticTokensRangeRequest;
		},
	});
	Object.defineProperty(o, 'SemanticTokensRefreshRequest', {
		enumerable: !0,
		get: function () {
			return bt.SemanticTokensRefreshRequest;
		},
	});
	Object.defineProperty(o, 'SemanticTokensRegistrationType', {
		enumerable: !0,
		get: function () {
			return bt.SemanticTokensRegistrationType;
		},
	});
	var Pu = fs();
	Object.defineProperty(o, 'ShowDocumentRequest', {
		enumerable: !0,
		get: function () {
			return Pu.ShowDocumentRequest;
		},
	});
	var qu = hs();
	Object.defineProperty(o, 'LinkedEditingRangeRequest', {
		enumerable: !0,
		get: function () {
			return qu.LinkedEditingRangeRequest;
		},
	});
	var Ze = gs();
	Object.defineProperty(o, 'FileOperationPatternKind', {
		enumerable: !0,
		get: function () {
			return Ze.FileOperationPatternKind;
		},
	});
	Object.defineProperty(o, 'DidCreateFilesNotification', {
		enumerable: !0,
		get: function () {
			return Ze.DidCreateFilesNotification;
		},
	});
	Object.defineProperty(o, 'WillCreateFilesRequest', {
		enumerable: !0,
		get: function () {
			return Ze.WillCreateFilesRequest;
		},
	});
	Object.defineProperty(o, 'DidRenameFilesNotification', {
		enumerable: !0,
		get: function () {
			return Ze.DidRenameFilesNotification;
		},
	});
	Object.defineProperty(o, 'WillRenameFilesRequest', {
		enumerable: !0,
		get: function () {
			return Ze.WillRenameFilesRequest;
		},
	});
	Object.defineProperty(o, 'DidDeleteFilesNotification', {
		enumerable: !0,
		get: function () {
			return Ze.DidDeleteFilesNotification;
		},
	});
	Object.defineProperty(o, 'WillDeleteFilesRequest', {
		enumerable: !0,
		get: function () {
			return Ze.WillDeleteFilesRequest;
		},
	});
	var Yi = ys();
	Object.defineProperty(o, 'UniquenessLevel', {
		enumerable: !0,
		get: function () {
			return Yi.UniquenessLevel;
		},
	});
	Object.defineProperty(o, 'MonikerKind', {
		enumerable: !0,
		get: function () {
			return Yi.MonikerKind;
		},
	});
	Object.defineProperty(o, 'MonikerRequest', {
		enumerable: !0,
		get: function () {
			return Yi.MonikerRequest;
		},
	});
	var Zi = vs();
	Object.defineProperty(o, 'TypeHierarchyPrepareRequest', {
		enumerable: !0,
		get: function () {
			return Zi.TypeHierarchyPrepareRequest;
		},
	});
	Object.defineProperty(o, 'TypeHierarchySubtypesRequest', {
		enumerable: !0,
		get: function () {
			return Zi.TypeHierarchySubtypesRequest;
		},
	});
	Object.defineProperty(o, 'TypeHierarchySupertypesRequest', {
		enumerable: !0,
		get: function () {
			return Zi.TypeHierarchySupertypesRequest;
		},
	});
	var ks = bs();
	Object.defineProperty(o, 'InlineValueRequest', {
		enumerable: !0,
		get: function () {
			return ks.InlineValueRequest;
		},
	});
	Object.defineProperty(o, 'InlineValueRefreshRequest', {
		enumerable: !0,
		get: function () {
			return ks.InlineValueRefreshRequest;
		},
	});
	var Ki = Rs();
	Object.defineProperty(o, 'InlayHintRequest', {
		enumerable: !0,
		get: function () {
			return Ki.InlayHintRequest;
		},
	});
	Object.defineProperty(o, 'InlayHintResolveRequest', {
		enumerable: !0,
		get: function () {
			return Ki.InlayHintResolveRequest;
		},
	});
	Object.defineProperty(o, 'InlayHintRefreshRequest', {
		enumerable: !0,
		get: function () {
			return Ki.InlayHintRefreshRequest;
		},
	});
	var Vt = Ds();
	Object.defineProperty(o, 'DiagnosticServerCancellationData', {
		enumerable: !0,
		get: function () {
			return Vt.DiagnosticServerCancellationData;
		},
	});
	Object.defineProperty(o, 'DocumentDiagnosticReportKind', {
		enumerable: !0,
		get: function () {
			return Vt.DocumentDiagnosticReportKind;
		},
	});
	Object.defineProperty(o, 'DocumentDiagnosticRequest', {
		enumerable: !0,
		get: function () {
			return Vt.DocumentDiagnosticRequest;
		},
	});
	Object.defineProperty(o, 'WorkspaceDiagnosticRequest', {
		enumerable: !0,
		get: function () {
			return Vt.WorkspaceDiagnosticRequest;
		},
	});
	Object.defineProperty(o, 'DiagnosticRefreshRequest', {
		enumerable: !0,
		get: function () {
			return Vt.DiagnosticRefreshRequest;
		},
	});
	var qe = Ps();
	Object.defineProperty(o, 'NotebookCellKind', {
		enumerable: !0,
		get: function () {
			return qe.NotebookCellKind;
		},
	});
	Object.defineProperty(o, 'ExecutionSummary', {
		enumerable: !0,
		get: function () {
			return qe.ExecutionSummary;
		},
	});
	Object.defineProperty(o, 'NotebookCell', {
		enumerable: !0,
		get: function () {
			return qe.NotebookCell;
		},
	});
	Object.defineProperty(o, 'NotebookDocument', {
		enumerable: !0,
		get: function () {
			return qe.NotebookDocument;
		},
	});
	Object.defineProperty(o, 'NotebookDocumentSyncRegistrationType', {
		enumerable: !0,
		get: function () {
			return qe.NotebookDocumentSyncRegistrationType;
		},
	});
	Object.defineProperty(o, 'DidOpenNotebookDocumentNotification', {
		enumerable: !0,
		get: function () {
			return qe.DidOpenNotebookDocumentNotification;
		},
	});
	Object.defineProperty(o, 'NotebookCellArrayChange', {
		enumerable: !0,
		get: function () {
			return qe.NotebookCellArrayChange;
		},
	});
	Object.defineProperty(o, 'DidChangeNotebookDocumentNotification', {
		enumerable: !0,
		get: function () {
			return qe.DidChangeNotebookDocumentNotification;
		},
	});
	Object.defineProperty(o, 'DidSaveNotebookDocumentNotification', {
		enumerable: !0,
		get: function () {
			return qe.DidSaveNotebookDocumentNotification;
		},
	});
	Object.defineProperty(o, 'DidCloseNotebookDocumentNotification', {
		enumerable: !0,
		get: function () {
			return qe.DidCloseNotebookDocumentNotification;
		},
	});
	var xs;
	(function (e) {
		function t(n) {
			let i = n;
			return ee.string(i.language) || ee.string(i.scheme) || ee.string(i.pattern);
		}
		e.is = t;
	})((xs = o.TextDocumentFilter || (o.TextDocumentFilter = {})));
	var Ms;
	(function (e) {
		function t(n) {
			let i = n;
			return (
				ee.objectLiteral(i) &&
				(ee.string(i.notebookType) || ee.string(i.scheme) || ee.string(i.pattern))
			);
		}
		e.is = t;
	})((Ms = o.NotebookDocumentFilter || (o.NotebookDocumentFilter = {})));
	var Es;
	(function (e) {
		function t(n) {
			let i = n;
			return (
				ee.objectLiteral(i) &&
				(ee.string(i.notebook) || Ms.is(i.notebook)) &&
				(i.language === void 0 || ee.string(i.language))
			);
		}
		e.is = t;
	})((Es = o.NotebookCellTextDocumentFilter || (o.NotebookCellTextDocumentFilter = {})));
	var Ns;
	(function (e) {
		function t(n) {
			if (!Array.isArray(n)) return !1;
			for (let i of n) if (!ee.string(i) && !xs.is(i) && !Es.is(i)) return !1;
			return !0;
		}
		e.is = t;
	})((Ns = o.DocumentSelector || (o.DocumentSelector = {})));
	(function (e) {
		(e.method = 'client/registerCapability'),
			(e.messageDirection = h$1.MessageDirection.serverToClient),
			(e.type = new h$1.ProtocolRequestType(e.method));
	})(o.RegistrationRequest || (o.RegistrationRequest = {}));
	(function (e) {
		(e.method = 'client/unregisterCapability'),
			(e.messageDirection = h$1.MessageDirection.serverToClient),
			(e.type = new h$1.ProtocolRequestType(e.method));
	})(o.UnregistrationRequest || (o.UnregistrationRequest = {}));
	(function (e) {
		(e.Create = 'create'), (e.Rename = 'rename'), (e.Delete = 'delete');
	})(o.ResourceOperationKind || (o.ResourceOperationKind = {}));
	(function (e) {
		(e.Abort = 'abort'),
			(e.Transactional = 'transactional'),
			(e.TextOnlyTransactional = 'textOnlyTransactional'),
			(e.Undo = 'undo');
	})(o.FailureHandlingKind || (o.FailureHandlingKind = {}));
	(function (e) {
		(e.UTF8 = 'utf-8'), (e.UTF16 = 'utf-16'), (e.UTF32 = 'utf-32');
	})(o.PositionEncodingKind || (o.PositionEncodingKind = {}));
	(function (e) {
		function t(n) {
			let i = n;
			return i && ee.string(i.id) && i.id.length > 0;
		}
		e.hasId = t;
	})(o.StaticRegistrationOptions || (o.StaticRegistrationOptions = {}));
	(function (e) {
		function t(n) {
			let i = n;
			return i && (i.documentSelector === null || Ns.is(i.documentSelector));
		}
		e.is = t;
	})(o.TextDocumentRegistrationOptions || (o.TextDocumentRegistrationOptions = {}));
	(function (e) {
		function t(i) {
			let r = i;
			return (
				ee.objectLiteral(r) && (r.workDoneProgress === void 0 || ee.boolean(r.workDoneProgress))
			);
		}
		e.is = t;
		function n(i) {
			let r = i;
			return r && ee.boolean(r.workDoneProgress);
		}
		e.hasWorkDoneProgress = n;
	})(o.WorkDoneProgressOptions || (o.WorkDoneProgressOptions = {}));
	(function (e) {
		(e.method = 'initialize'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolRequestType(e.method));
	})(o.InitializeRequest || (o.InitializeRequest = {}));
	(function (e) {
		e.unknownProtocolVersion = 1;
	})(o.InitializeErrorCodes || (o.InitializeErrorCodes = {}));
	(function (e) {
		(e.method = 'initialized'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolNotificationType(e.method));
	})(o.InitializedNotification || (o.InitializedNotification = {}));
	(function (e) {
		(e.method = 'shutdown'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolRequestType0(e.method));
	})(o.ShutdownRequest || (o.ShutdownRequest = {}));
	(function (e) {
		(e.method = 'exit'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolNotificationType0(e.method));
	})(o.ExitNotification || (o.ExitNotification = {}));
	(function (e) {
		(e.method = 'workspace/didChangeConfiguration'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolNotificationType(e.method));
	})(o.DidChangeConfigurationNotification || (o.DidChangeConfigurationNotification = {}));
	(function (e) {
		(e.Error = 1), (e.Warning = 2), (e.Info = 3), (e.Log = 4);
	})(o.MessageType || (o.MessageType = {}));
	(function (e) {
		(e.method = 'window/showMessage'),
			(e.messageDirection = h$1.MessageDirection.serverToClient),
			(e.type = new h$1.ProtocolNotificationType(e.method));
	})(o.ShowMessageNotification || (o.ShowMessageNotification = {}));
	(function (e) {
		(e.method = 'window/showMessageRequest'),
			(e.messageDirection = h$1.MessageDirection.serverToClient),
			(e.type = new h$1.ProtocolRequestType(e.method));
	})(o.ShowMessageRequest || (o.ShowMessageRequest = {}));
	(function (e) {
		(e.method = 'window/logMessage'),
			(e.messageDirection = h$1.MessageDirection.serverToClient),
			(e.type = new h$1.ProtocolNotificationType(e.method));
	})(o.LogMessageNotification || (o.LogMessageNotification = {}));
	(function (e) {
		(e.method = 'telemetry/event'),
			(e.messageDirection = h$1.MessageDirection.serverToClient),
			(e.type = new h$1.ProtocolNotificationType(e.method));
	})(o.TelemetryEventNotification || (o.TelemetryEventNotification = {}));
	(function (e) {
		(e.None = 0), (e.Full = 1), (e.Incremental = 2);
	})(o.TextDocumentSyncKind || (o.TextDocumentSyncKind = {}));
	(function (e) {
		(e.method = 'textDocument/didOpen'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolNotificationType(e.method));
	})(o.DidOpenTextDocumentNotification || (o.DidOpenTextDocumentNotification = {}));
	(function (e) {
		function t(i) {
			let r = i;
			return (
				r != null &&
				typeof r.text == 'string' &&
				r.range !== void 0 &&
				(r.rangeLength === void 0 || typeof r.rangeLength == 'number')
			);
		}
		e.isIncremental = t;
		function n(i) {
			let r = i;
			return (
				r != null && typeof r.text == 'string' && r.range === void 0 && r.rangeLength === void 0
			);
		}
		e.isFull = n;
	})(o.TextDocumentContentChangeEvent || (o.TextDocumentContentChangeEvent = {}));
	(function (e) {
		(e.method = 'textDocument/didChange'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolNotificationType(e.method));
	})(o.DidChangeTextDocumentNotification || (o.DidChangeTextDocumentNotification = {}));
	(function (e) {
		(e.method = 'textDocument/didClose'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolNotificationType(e.method));
	})(o.DidCloseTextDocumentNotification || (o.DidCloseTextDocumentNotification = {}));
	(function (e) {
		(e.method = 'textDocument/didSave'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolNotificationType(e.method));
	})(o.DidSaveTextDocumentNotification || (o.DidSaveTextDocumentNotification = {}));
	(function (e) {
		(e.Manual = 1), (e.AfterDelay = 2), (e.FocusOut = 3);
	})(o.TextDocumentSaveReason || (o.TextDocumentSaveReason = {}));
	(function (e) {
		(e.method = 'textDocument/willSave'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolNotificationType(e.method));
	})(o.WillSaveTextDocumentNotification || (o.WillSaveTextDocumentNotification = {}));
	(function (e) {
		(e.method = 'textDocument/willSaveWaitUntil'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolRequestType(e.method));
	})(o.WillSaveTextDocumentWaitUntilRequest || (o.WillSaveTextDocumentWaitUntilRequest = {}));
	(function (e) {
		(e.method = 'workspace/didChangeWatchedFiles'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolNotificationType(e.method));
	})(o.DidChangeWatchedFilesNotification || (o.DidChangeWatchedFilesNotification = {}));
	(function (e) {
		(e.Created = 1), (e.Changed = 2), (e.Deleted = 3);
	})(o.FileChangeType || (o.FileChangeType = {}));
	(function (e) {
		function t(n) {
			let i = n;
			return (
				ee.objectLiteral(i) &&
				(qs.URI.is(i.baseUri) || qs.WorkspaceFolder.is(i.baseUri)) &&
				ee.string(i.pattern)
			);
		}
		e.is = t;
	})(o.RelativePattern || (o.RelativePattern = {}));
	(function (e) {
		(e.Create = 1), (e.Change = 2), (e.Delete = 4);
	})(o.WatchKind || (o.WatchKind = {}));
	(function (e) {
		(e.method = 'textDocument/publishDiagnostics'),
			(e.messageDirection = h$1.MessageDirection.serverToClient),
			(e.type = new h$1.ProtocolNotificationType(e.method));
	})(o.PublishDiagnosticsNotification || (o.PublishDiagnosticsNotification = {}));
	(function (e) {
		(e.Invoked = 1), (e.TriggerCharacter = 2), (e.TriggerForIncompleteCompletions = 3);
	})(o.CompletionTriggerKind || (o.CompletionTriggerKind = {}));
	(function (e) {
		(e.method = 'textDocument/completion'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolRequestType(e.method));
	})(o.CompletionRequest || (o.CompletionRequest = {}));
	(function (e) {
		(e.method = 'completionItem/resolve'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolRequestType(e.method));
	})(o.CompletionResolveRequest || (o.CompletionResolveRequest = {}));
	(function (e) {
		(e.method = 'textDocument/hover'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolRequestType(e.method));
	})(o.HoverRequest || (o.HoverRequest = {}));
	(function (e) {
		(e.Invoked = 1), (e.TriggerCharacter = 2), (e.ContentChange = 3);
	})(o.SignatureHelpTriggerKind || (o.SignatureHelpTriggerKind = {}));
	(function (e) {
		(e.method = 'textDocument/signatureHelp'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolRequestType(e.method));
	})(o.SignatureHelpRequest || (o.SignatureHelpRequest = {}));
	(function (e) {
		(e.method = 'textDocument/definition'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolRequestType(e.method));
	})(o.DefinitionRequest || (o.DefinitionRequest = {}));
	(function (e) {
		(e.method = 'textDocument/references'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolRequestType(e.method));
	})(o.ReferencesRequest || (o.ReferencesRequest = {}));
	(function (e) {
		(e.method = 'textDocument/documentHighlight'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolRequestType(e.method));
	})(o.DocumentHighlightRequest || (o.DocumentHighlightRequest = {}));
	(function (e) {
		(e.method = 'textDocument/documentSymbol'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolRequestType(e.method));
	})(o.DocumentSymbolRequest || (o.DocumentSymbolRequest = {}));
	(function (e) {
		(e.method = 'textDocument/codeAction'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolRequestType(e.method));
	})(o.CodeActionRequest || (o.CodeActionRequest = {}));
	(function (e) {
		(e.method = 'codeAction/resolve'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolRequestType(e.method));
	})(o.CodeActionResolveRequest || (o.CodeActionResolveRequest = {}));
	(function (e) {
		(e.method = 'workspace/symbol'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolRequestType(e.method));
	})(o.WorkspaceSymbolRequest || (o.WorkspaceSymbolRequest = {}));
	(function (e) {
		(e.method = 'workspaceSymbol/resolve'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolRequestType(e.method));
	})(o.WorkspaceSymbolResolveRequest || (o.WorkspaceSymbolResolveRequest = {}));
	(function (e) {
		(e.method = 'textDocument/codeLens'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolRequestType(e.method));
	})(o.CodeLensRequest || (o.CodeLensRequest = {}));
	(function (e) {
		(e.method = 'codeLens/resolve'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolRequestType(e.method));
	})(o.CodeLensResolveRequest || (o.CodeLensResolveRequest = {}));
	(function (e) {
		(e.method = 'workspace/codeLens/refresh'),
			(e.messageDirection = h$1.MessageDirection.serverToClient),
			(e.type = new h$1.ProtocolRequestType0(e.method));
	})(o.CodeLensRefreshRequest || (o.CodeLensRefreshRequest = {}));
	(function (e) {
		(e.method = 'textDocument/documentLink'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolRequestType(e.method));
	})(o.DocumentLinkRequest || (o.DocumentLinkRequest = {}));
	(function (e) {
		(e.method = 'documentLink/resolve'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolRequestType(e.method));
	})(o.DocumentLinkResolveRequest || (o.DocumentLinkResolveRequest = {}));
	(function (e) {
		(e.method = 'textDocument/formatting'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolRequestType(e.method));
	})(o.DocumentFormattingRequest || (o.DocumentFormattingRequest = {}));
	(function (e) {
		(e.method = 'textDocument/rangeFormatting'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolRequestType(e.method));
	})(o.DocumentRangeFormattingRequest || (o.DocumentRangeFormattingRequest = {}));
	(function (e) {
		(e.method = 'textDocument/onTypeFormatting'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolRequestType(e.method));
	})(o.DocumentOnTypeFormattingRequest || (o.DocumentOnTypeFormattingRequest = {}));
	(function (e) {
		e.Identifier = 1;
	})(o.PrepareSupportDefaultBehavior || (o.PrepareSupportDefaultBehavior = {}));
	(function (e) {
		(e.method = 'textDocument/rename'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolRequestType(e.method));
	})(o.RenameRequest || (o.RenameRequest = {}));
	(function (e) {
		(e.method = 'textDocument/prepareRename'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolRequestType(e.method));
	})(o.PrepareRenameRequest || (o.PrepareRenameRequest = {}));
	(function (e) {
		(e.method = 'workspace/executeCommand'),
			(e.messageDirection = h$1.MessageDirection.clientToServer),
			(e.type = new h$1.ProtocolRequestType(e.method));
	})(o.ExecuteCommandRequest || (o.ExecuteCommandRequest = {}));
	(function (e) {
		(e.method = 'workspace/applyEdit'),
			(e.messageDirection = h$1.MessageDirection.serverToClient),
			(e.type = new h$1.ProtocolRequestType('workspace/applyEdit'));
	})(o.ApplyWorkspaceEditRequest || (o.ApplyWorkspaceEditRequest = {}));
});
var Ls = c((Tr) => {
	j();
	h();
	Object.defineProperty(Tr, '__esModule', { value: !0 });
	Tr.createProtocolConnection = void 0;
	var js = ut();
	function Nd(e, t, n, i) {
		return (
			js.ConnectionStrategy.is(i) && (i = { connectionStrategy: i }),
			(0, js.createMessageConnection)(e, t, n, i)
		);
	}
	Tr.createProtocolConnection = Nd;
});
var As = c((oe) => {
	j();
	h();
	var Od =
			(oe && oe.__createBinding) ||
			(Object.create
				? function (e, t, n, i) {
						i === void 0 && (i = n);
						var r = Object.getOwnPropertyDescriptor(t, n);
						(!r || ('get' in r ? !t.__esModule : r.writable || r.configurable)) &&
							(r = {
								enumerable: !0,
								get: function () {
									return t[n];
								},
							}),
							Object.defineProperty(e, i, r);
				  }
				: function (e, t, n, i) {
						i === void 0 && (i = n), (e[i] = t[n]);
				  }),
		Pr =
			(oe && oe.__exportStar) ||
			function (e, t) {
				for (var n in e)
					n !== 'default' && !Object.prototype.hasOwnProperty.call(t, n) && Od(t, e, n);
			};
	Object.defineProperty(oe, '__esModule', { value: !0 });
	oe.LSPErrorCodes = oe.createProtocolConnection = void 0;
	Pr(ut(), oe);
	Pr((yr(), f(mr)), oe);
	Pr($(), oe);
	Pr(Os(), oe);
	var jd = Ls();
	Object.defineProperty(oe, 'createProtocolConnection', {
		enumerable: !0,
		get: function () {
			return jd.createProtocolConnection;
		},
	});
	(function (e) {
		(e.lspReservedErrorRangeStart = -32899),
			(e.RequestFailed = -32803),
			(e.ServerCancelled = -32802),
			(e.ContentModified = -32801),
			(e.RequestCancelled = -32800),
			(e.lspReservedErrorRangeEnd = -32800);
	})(oe.LSPErrorCodes || (oe.LSPErrorCodes = {}));
});
var Wd = c((Ce) => {
	j();
	h();
	var Ad =
			(Ce && Ce.__createBinding) ||
			(Object.create
				? function (e, t, n, i) {
						i === void 0 && (i = n);
						var r = Object.getOwnPropertyDescriptor(t, n);
						(!r || ('get' in r ? !t.__esModule : r.writable || r.configurable)) &&
							(r = {
								enumerable: !0,
								get: function () {
									return t[n];
								},
							}),
							Object.defineProperty(e, i, r);
				  }
				: function (e, t, n, i) {
						i === void 0 && (i = n), (e[i] = t[n]);
				  }),
		Is =
			(Ce && Ce.__exportStar) ||
			function (e, t) {
				for (var n in e)
					n !== 'default' && !Object.prototype.hasOwnProperty.call(t, n) && Ad(t, e, n);
			};
	Object.defineProperty(Ce, '__esModule', { value: !0 });
	Ce.createProtocolConnection = void 0;
	var Id = Wn();
	Is(Wn(), Ce);
	Is(As(), Ce);
	function Fd(e, t, n, i) {
		return (0, Id.createMessageConnection)(e, t, n, i);
	}
	Ce.createProtocolConnection = Fd;
});

export { Wd as a };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=chunk-2BYXGS2I.js.map
