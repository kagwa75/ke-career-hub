const dns = require("node:dns");

const PIN = { address: "3.18.239.121", family: 4 };

for (const mod of [dns, dns.promises]) {
  const original = mod.lookup;
  mod.lookup = (hostname, options, callback) => {
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    const opts = options ?? {};
    if (String(hostname).includes("neon.tech")) {
      const all = opts.all !== undefined ? opts.all : false;
      if (typeof callback === "function") {
        if (all) return callback(null, [PIN]);
        return callback(null, PIN.address, PIN.family);
      }
      if (all) return Promise.resolve([PIN]);
      return Promise.resolve({ address: PIN.address, family: PIN.family });
    }
    if (typeof callback === "function") return original.call(mod, hostname, opts, callback);
    return original.call(mod, hostname, opts);
  };
}