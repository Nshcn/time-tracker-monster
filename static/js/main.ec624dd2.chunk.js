(this.webpackJsonpfight = this.webpackJsonpfight || []).push([[0], { 10: function (e, t, a) { }, 12: function (e, t, a) { "use strict"; a.r(t); var s = a(1), c = a.n(s), r = a(4), l = a.n(r), n = (a(9), a(2)), o = (a(10), [{ id: 1, name: "crabKing", imgURL: a.p + "static/media/crab.4783935e.png", hpbase: 256, atkbase: 10, defbase: 45 }, { id: 2, name: "flyDragon", imgURL: a.p + "static/media/flydragon.d74481c2.png", hpbase: 80, atkbase: 230, defbase: 9 }]), i = a(0); var b = function () { var e = Object(s.useRef)(), t = Object(s.useState)(""), a = Object(n.a)(t, 2), c = a[0], r = a[1], l = Object(s.useState)(null), b = Object(n.a)(l, 2), j = b[0], m = b[1], p = Object(s.useState)(null), h = Object(n.a)(p, 2), d = h[0], O = h[1], u = Object(s.useState)(!0), g = Object(n.a)(u, 2), f = g[0], S = g[1], x = Object(s.useState)(null), v = Object(n.a)(x, 2), I = v[0], M = v[1], N = Object(s.useState)(null), P = Object(n.a)(N, 2), k = P[0], J = P[1], y = Object(s.useState)(-1), q = Object(n.a)(y, 2), D = q[0], L = q[1], R = Object(s.useState)(null), U = Object(n.a)(R, 2), C = U[0], w = U[1], E = Object(s.useState)(""), H = Object(n.a)(E, 2), B = H[0], K = H[1], z = Object(s.useState)(null), A = Object(n.a)(z, 2), F = A[0], G = A[1]; return Object(s.useEffect)((function () { return e.current = setInterval((function () { if (null === j) { var e = localStorage.getItem("activeID"); if (!e) return void S(!1); r(e); var t = JSON.parse(localStorage.getItem("pets")); m(t[e]), O(t[e].monProps[0]) } if (G(localStorage.getItem("coin") || 0), -1 !== D) { if (null === k) { var a = Object.create(o[Math.floor(2 * Math.random())]); console.log(D), a.hpbase = Math.ceil(a.hpbase * D + Math.random() * Math.sqrt(D) * D), a.atkbase = Math.ceil(a.atkbase * D + Math.random() * Math.sqrt(D) * D), a.defbase = Math.ceil(a.defbase * D + Math.random() * Math.sqrt(D) * D), J(a), w(a.hpbase) } if (null === I && M("atk"), c && j && k && null != I) if (S(!1), "" === B) { if (d <= 0) return M(null), J(null), K(""), S(!0), m(null), void O(j.monProps[0]); var s = C - Math.max(0, j.monProps[1] - k.defbase + Math.floor(Math.random() * j.monProps[1] - j.monProps[1] / 2)); w(s), M(""), C > 0 && K("atk") } else if ("" === I) { if (C <= 0) return M(null), m(null), J(null), L(parseInt(D) + 1), localStorage.setItem("level", parseInt(D) + 1), O(j.monProps[0]), S(!0), void K(""); d -= Math.max(0, k.atkbase - j.monProps[2] + Math.floor(Math.random() * k.atkbase - k.atkbase / 2)), O(d), K(""), d > 0 && M("atk") } } else L(localStorage.getItem("level") || 1) }), 1e3), function () { clearInterval(e.current) } })), Object(i.jsx)("div", { className: "fight-container", children: c && j && k ? Object(i.jsxs)("div", { children: [Object(i.jsxs)("h1", { children: ["\u7b2c", D, "\u5173"] }), Object(i.jsxs)("div", { children: ["\u65f6\u7a7a\u80fd\u91cf\uff1a", F] }), Object(i.jsxs)("div", { className: "fight", children: [Object(i.jsx)("div", { className: "img-container", children: Object(i.jsx)("img", { className: I, src: j.dataURL, alt: "" }) }), Object(i.jsx)("div", { className: "img-container enermy", children: Object(i.jsx)("img", { className: B, src: k.imgURL, alt: "" }) })] }), Object(i.jsxs)("div", { className: "props-container", children: [Object(i.jsxs)("div", { className: "props", children: [Object(i.jsxs)("b", { children: ["\u6211\u65b9\u8840\u91cf\uff1a", Object(i.jsx)("progress", { className: "HP-progress", max: j.monProps[0], value: d })] }), Object(i.jsxs)("p", { children: ["\u8840\u91cf:", d, "/", j.monProps[0], Object(i.jsx)("button", { className: "props-plus", onClick: function () { if (F >= 100) { G(F - 100), localStorage.setItem("coin", F - 100); var e = JSON.parse(localStorage.getItem("pets")); e[localStorage.getItem("activeID")].monProps[0] -= -D, j.monProps[0] -= -D, localStorage.setItem("pets", JSON.stringify(e)) } }, children: "+" })] }), Object(i.jsxs)("p", { children: ["\u653b\u51fb:", j.monProps[1], Object(i.jsx)("button", { className: "props-plus", onClick: function () { if (F >= 100) { G(F - 100), localStorage.setItem("coin", F - 100); var e = JSON.parse(localStorage.getItem("pets")); e[localStorage.getItem("activeID")].monProps[1] -= -D, j.monProps[1] -= -D, localStorage.setItem("pets", JSON.stringify(e)) } }, children: "+" })] }), Object(i.jsxs)("p", { children: ["\u9632\u5fa1:", j.monProps[2], Object(i.jsx)("button", { className: "props-plus", onClick: function () { if (F >= 100) { G(F - 100), localStorage.setItem("coin", F - 100); var e = JSON.parse(localStorage.getItem("pets")); e[localStorage.getItem("activeID")].monProps[2] -= -Math.ceil(Math.sqrt(D)), j.monProps[2] -= -Math.ceil(Math.sqrt(D)), localStorage.setItem("pets", JSON.stringify(e)) } }, children: "+" })] })] }), Object(i.jsxs)("div", { className: "props", children: [Object(i.jsxs)("b", { children: ["\u654c\u65b9\u8840\u91cf\uff1a", Object(i.jsx)("progress", { className: "HP-progress", max: k.hpbase, value: C })] }), Object(i.jsxs)("p", { children: ["\u8840\u91cf:", C, "/", k.hpbase] }), Object(i.jsxs)("p", { children: ["\u653b\u51fb:", k.atkbase] }), Object(i.jsxs)("p", { children: ["\u9632\u5fa1:", k.defbase] })] })] })] }) : f ? Object(i.jsx)("h1", { children: "Loading..." }) : Object(i.jsx)("h1", { children: "\u8bf7\u5148\u8bbe\u7f6e\u4e0a\u573a\u5ba0\u7269" }) }) }; l.a.render(Object(i.jsx)(c.a.StrictMode, { children: Object(i.jsx)(b, {}) }), document.getElementById("root")) }, 9: function (e, t, a) { } }, [[12, 1, 2]]]);
//# sourceMappingURL=main.ec624dd2.chunk.js.map