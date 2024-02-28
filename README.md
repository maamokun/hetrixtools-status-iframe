# HetrixTools iframe Renderer

![iframe in action](https://ss.sangonomiya.asia/r/rMXdBL.png)

This is a server that dynamically renders an iframe-able HTML widget of your server status, powered by HetrixTools

## Features
- Customizable iframe with text and colours
- Does not use many API requests thanks to a clever combination of the API and Webhooks
- Remotely resync your status if something goes wrong
- Utilizes an in-memory database, no persistent storage required
- Written for Bun

## Smart Resync
- To circumvent the limited amount of API requests that HetrixTools provides, we do not directly update the status of your services with the API.
- Instead, we use HetrixTools built-in Webhook feature.
- HetrixTools will POST to your server when a services's status changes, and you server will track that.
- In case of failed webhook requests or the server loses count, we do use the API to resync with the official data from HetrixTools on a scheduled interval (6 hours default). This is done on a much lower basis, and will make sure that there aren't too many API requests.

## Installation
You will need:
- A Linux server (anything should work)
- NodeJS (v18 or up)
- [Bun](https://bun.sh/)
- an account with [HetrixTools](https://hetrixtools.com/)

### HetrixTools Configuration
- Log into the HetrixTools dashboard.
- Follow [these instructions](https://docs.hetrixtools.com/api-key/) and create an API key. Save this for later.
- [Create a contact list](https://docs.hetrixtools.com/create-a-contact-list/) if you haven't already.
- Under "Actions", choose Edit.
- In the options, select "Webhook"
- In the webhook options, enter
    - Webhook URL: Enter in the format `https://(your domain)/ingest`. Replace your domain with the domain you plan to host the server off of.
    - Webhook Authentication Token: Any random string. Keep this for later.
- Example Image
![HetrixTools Setup](https://ss.sangonomiya.asia/r/1oFfm6.png)

### Server Setup
- Clone this repository into your desired directory, and cd into it.
- Copy `.env.example` into `.env`.
- Configure the following variables:
    - HETRIX_KEY: Your HertixTools API key
    - HETRIX_AUTH: The Webhook Authentication Token from earlier
    - ADMIN_KEY: An Administrator password. Set to anything you like.
- The others have defaults, if you do not want to configure them, delete the placeholders
- Close out of `.env`
- run `bun i` to install the modules.
- run `bun run index.js` to run the server.
- If there are no errors, your server should be running!

### Endpoints
- `/` - The iframe will be rendered here.
- `/raw` - Raw JSON data of your status. Useful for diagnostic purposes.
- `/update` - Remotely resync your data before the interval if something goes wrong. It can be used like this:
    - ```https://yourdomain.com/update?key=Y0urP4ssw0rD```
    - Replace the password with the `ADMIN_KEY` we set in `.env`.
- `/ingest` - Endpoint for HetrixTools to POST into. Does not accept GET requests.

### Run unattended
- The easiest way to run this server at all times is with a process manager, such as PM2.
- Run `bun i pm2` to install it.
- Run `pm2 start --interpreter ~/.bun/bin/bun index.js` to get PM2 to rn the server for you.
- You're done!