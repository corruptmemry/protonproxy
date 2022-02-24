import { info, custom, error } from "@modules/log";
import * as path from "path";
import { localServerOptions } from "@modules/localServerOptions";
import { proxyOptions } from "@modules/proxyOptions";
import { TcpProxy } from "@modules/core";
const config = require("../../config.json");

/**
 * Create a new proxy
 * @param {Object} localServerOptions Settings for the local server
 * @param {Object} serverList An object that maps a 'serverName' to the server info
 * @returns {MinecraftProxy} A new Minecraft proxy
 */
export function createProxy(
  localServerOptions: localServerOptions = {},
  proxyOptions: proxyOptions = {}
) {
  const { motd = "A proxy server" } = localServerOptions;
  const { enablePlugins = true, hostname = "0.0.0.0" } = proxyOptions;

  const proxy = new TcpProxy(
    config.localPort,
    config.serviceHost,
    config.servicePort,
    proxyOptions
  );
}
