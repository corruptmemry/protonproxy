<p align="center">
<img src="https://img.shields.io/github/contributors/corruptmemry/protonproxy.svg?style=for-the-badge"/>
<img src="https://img.shields.io/github/forks/corruptmemry/protonproxy.svg?style=for-the-badge"/>
<img src="https://img.shields.io/github/stars/corruptmemry/protonproxy.svg?style=for-the-badge"/>
<img src="https://img.shields.io/github/issues/corruptmemry/protonproxy.svg?style=for-the-badge"/>
</p>
<br />
  <h3 align="center">ProtonProxy</h3>
  <br />
  <p align="center">
  🪐 A proxy for Minecraft client written in TS. (A NeutronProxy remake)
  <br />
  <a href="https://github.com/corruptmemry/protonproxy/issues">Report bug</a>
  .
  <a href="https://github.com/corruptmemry/protonproxy/issues">Request a feature</a>
  </p>
<br />

### 🤔 What's this?
ProtonProxy - is a proxy for Minecraft client written in Typescript.
With ProtonProxy you can write and use plugins that modify/send new packets to Minecraft server.

### 📦 Installation and using
First of all, install Node.JS and npm.
Then, you need to install required packages via 'npm':
  ```sh
  $ npm i typescript -g
  $ npm i eslint -g
  $ npm i --save-dev --save-exact prettier
  $ npm i colors
  $ npm i ts-node -g
  ```
And finally:

1. Configure `config.json`
2. Run `tsc`
3. Run `node dist/cli.js`
4. Connect to `localhost:25564`

***

ProtonProxy is licensed under MIT License.
Credits for <a href="https://github.com/diginet-ab/tcp-proxy">server code</a>.
