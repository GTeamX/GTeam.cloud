[//]: # (Main image, centered)
<p align="center">
  <img width="300" src="https://github.com/GTeamX/GTeam.cloud/blob/prod/assets/images/gteam_cloud_logo_black_transparent.png?raw=true" alt="GTeam's Cloud logo">
</p>

[//]: # (Main title, centered)
<h1 align="center">GTeam.cloud</h1>

[//]: # (Shield.io badges, main basic stuff, centered)
<div align="center">

<a href="https://github.com/GTeamX/GTeam.cloud/blob/prod/LICENSE">![GitHub License](https://img.shields.io/github/license/GTeamX/GTeam.cloud?style=for-the-badge)</a>
<br>
<a href="https://github.com/GTeamX/GTeam.cloud/actions">![GitHub branch check runs](https://img.shields.io/github/check-runs/GTeamX/GTeam.cloud/prod?style=for-the-badge&label='prod'%20branch%20checks)</a>
<a href="https://github.com/GTeamX/GTeam.cloud/actions">![GitHub branch check runs](https://img.shields.io/github/check-runs/GTeamX/GTeam.cloud/dev?style=for-the-badge&label='dev'%20branch%20checks)</a>
<br>
<a href="https://github.com/GTeamX/GTeam.cloud/stargazers">![GitHub Repo stars](https://img.shields.io/github/stars/GTeamX/GTeam.cloud?style=for-the-badge)</a>
<a href="https://github.com/GTeamX/GTeam.cloud/watchers">![GitHub watchers](https://img.shields.io/github/watchers/GTeamX/GTeam.cloud?style=for-the-badge)</a>
<a href="https://github.com/GTeamX/GTeam.cloud/forks">![GitHub forks](https://img.shields.io/github/forks/GTeamX/GTeam.cloud?style=for-the-badge)</a>
<a href="https://discord.gteam.cloud">![Discord](https://img.shields.io/discord/1046001788106575912?style=for-the-badge&label=Discord)</a>

</div>

Website for GTeam's projects, Cloud and API.

## Cloud

Our ISO providing service (Cloud) uses ISOs from different sources such as official sources (Microsoft, Debian, Broadcom) but also third-party services like [rgadguard](https://files.rg-adguard.net/) or even Microsoft's own [update catalog](https://catalog.update.microsoft.com/home.aspx).

We provide these ISOs free of charge and **without any kind of license**. You will have to provide the license yourself.

A hash checking service is also available at the bottom of the page to easily verify the integrity of your ISO, or if it provides from us/our sources.

These services are made to be the easiest, most simple and straightforward possible. If you struggle to use it, don't fear to ask help on our [Discord](https://discord.gteam.cloud)!

## API

We developed a proprietary, custom-built API hosted in Germany (fully GDPR-compliant) to determine IP reputation. The API is free, requires no authentication keys, and supports both IPv4 and IPv6.

You can manually query the API using the following structure:
`https://api.gteam.cloud/coralgate/v2/<ip_address>`

**Examples:**
- `https://api.gteam.cloud/coralgate/v2/185.65.134.164` *(Returns malicious)*
- `https://api.gteam.cloud/coralgate/v2/9.9.9.9` *(Returns safe)*

### False Positives

If your ISP, domain name, or personal IP is falsely flagged and blocked by our API, please open a ticket on our [Discord](https://discord.gteam.cloud). Provide the affected IP addresses and their primary use case, and our support team will assist with whitelisting.

**Traffic routinely blocked by the API:**
Port/IP scanners, crawlers, MOTD/player-count fetchers, VPNs, proxies, TOR exit nodes, and automated hosting services (e.g., Shodan, OpenHeimer).

**Traffic exempt from blocking:**
Known voting sites and verified server lists.

## Contributing & Support

**Issues & Feature Requests:**
Please utilize the provided GitHub templates when opening an issue or requesting a feature. If your ticket requires urgent attention, you may reference it in our Discord support channels.

**Contributing:**
We welcome pull requests. Ensure your code follows our existing naming conventions and indentation standards. When submitting a PR, detail the browser used, additionnal extentions and any other relevant information.

## Credits & License

GTeam.cloud is built on top of these incredible open-source projects:

* [TailwindCSS](https://github.com/tailwindlabs/tailwindcss) by [TailwindLabs](https://github.com/tailwindlabs) - Allows us to easily style our HTML elements using classes.

This project is licensed under the [Apache License v2.0 (ALv2)](LICENSE).
