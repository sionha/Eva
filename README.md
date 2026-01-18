# Eva Music Bot

A Discord music bot named Eva that can play music from YouTube and work 24/7 when hosted.

## Features

- Play music from YouTube URLs or by searching song titles
- Queue system for multiple songs
- Skip and stop commands
- 24/7 availability when hosted on a server

## Setup

### Prerequisites

1. Install Node.js (version 16 or higher) from [nodejs.org](https://nodejs.org/)

2. Create a Discord bot:
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Go to Bot section and create a bot
   - Copy the token

3. Invite the bot to your server:
   - In the OAuth2 section, select "bot" scope
   - Select permissions: Send Messages, Use Slash Commands, Connect, Speak
   - Use the generated URL to invite the bot

### Installation

1. Clone or download this repository
2. Navigate to the project folder
3. Run `npm install` to install dependencies

### Configuration

1. Open `.env` file
2. Replace `MTQ2MjM1NjY1MzQyNzkxNzAyNA.GeMCho.9OWMkP7uUnxE-ZoZrOwMEZYvTDXXX1UpfCNpmQ` with your bot token

### Running the Bot

Run `npm start` or `node index.js`

## Commands

- `!play <YouTube URL or song title>` or `!p <URL or title>` - Play a song
- `!skip` - Skip the current song
- `!stop` - Stop the music and clear the queue
- `!queue` or `!q` - Display the current queue

## Hosting for 24/7

To keep the bot running 24/7, host it on a cloud platform. Here are free options:

### Railway (Recommended Free Option)
1. Go to [Railway.app](https://railway.app) and sign up with GitHub
2. Click "New Project" > "Deploy from GitHub repo"
3. Connect your repository or upload the project files
4. Set environment variables in the "Variables" tab: `TOKEN` = your bot token
5. Railway will auto-detect Node.js and deploy

### Render
1. Go to [Render.com](https://render.com) and sign up
2. Create a new "Web Service"
3. Connect your GitHub repo or upload files
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variable: `TOKEN` = your bot token
7. Deploy (free tier has 750 hours/month)

### Fly.io
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Run `fly launch` in your project directory
3. Follow prompts, select region
4. Set secret: `fly secrets set TOKEN=your_bot_token`
5. Deploy with `fly deploy`

### Heroku (Limited Free Tier)
1. Install Heroku CLI
2. Run `heroku create your-bot-name`
3. Set token: `heroku config:set TOKEN=your_bot_token`
4. Deploy: `git push heroku main`

For paid options or more control, use VPS providers like DigitalOcean or Linode.

## Note

This bot uses ytdl-core which may have issues with YouTube policies. Keep dependencies updated.