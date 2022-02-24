import {proxyOptions} from '@modules/proxyOptions';
import {TcpProxy} from '@modules/core';
import * as config from '../../config.json';

/**
 * Creates a new proxy instance
 *
 * @export
 * @param {proxyOptions} [proxyOptions={}]
 * @return {*}
 */
export function createProxy(
    proxyOptions: proxyOptions = {},
) {
  const proxy = new TcpProxy(
      config.localPort,
      config.serviceHost,
      config.servicePort,
      proxyOptions,
  );
  return proxy;
}
