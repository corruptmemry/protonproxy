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

#### 🤔 What's this?
ProtonProxy - is a proxy for Minecraft client written in Typescript.
With ProtonProxy you can write and use plugins that modify/send new packets to Minecraft server.

# Requirements

- Node.JS
- tsc
- ts-node

# Usage

## Compiling

```sh
$ tsc
```

## Running
Modify 'serviceHost' and 'servicePort' values in 'config.json' to yours and run:
```sh
$ ts-node -r tsconfig-paths/register dist/cli.js
```

## Credits

<a href="https://github.com/diginet-ab/tcp-proxy">Server code</a>
