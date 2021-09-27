/* #TA-01 */
require("ts-node").register({ files: true });

module.exports = {
  networks: {
    /* #02-01 */
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    test: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
  },
  /* #02-02 */
  contracts_build_directory: "./truffle_abis/",
  compilers: {
    /* #02-03 */
    solc: {
      version: "^0.8.0",
    },
  },
};
