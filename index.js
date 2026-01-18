require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const prefix = '!';
const queue = new Map();

client.once('ready', () => {
  console.log('Eva is online!');
  client.user.setActivity('Music 24/7', { type: 'LISTENING' });
});

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  const serverQueue = queue.get(message.guild.id);

  if (command === 'play' || command === 'p') {
    execute(message, serverQueue, args);
    return;
  } else if (command === 'skip') {
    skip(message, serverQueue);
    return;
  } else if (command === 'stop') {
    stop(message, serverQueue);
    return;
  } else if (command === 'queue' || command === 'q') {
    displayQueue(message, serverQueue);
    return;
  } else {
    message.channel.send('Unknown command. Use !play, !skip, !stop, !queue');
  }
});

async function execute(message, serverQueue, args) {
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');

  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
    return message.channel.send('I need the permissions to join and speak in your voice channel!');
  }

  const query = args.join(' ');
  let url;
  if (ytdl.validateURL(query)) {
    url = query;
  } else {
    const searchResults = await ytSearch(query);
    if (searchResults.videos.length > 0) {
      url = searchResults.videos[0].url;
    } else {
      return message.channel.send('No video found for that search.');
    }
  }
  const songInfo = await ytdl.getInfo(url);
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
      player: null,
    };

    queue.set(message.guild.id, queueContruct);
    queueContruct.songs.push(song);

    try {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to skip the music!');
  if (!serverQueue) return message.channel.send('There is no song that I could skip!');
  serverQueue.player.stop();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
  if (!serverQueue) return message.channel.send('There is no song that I could stop!');
  serverQueue.songs = [];
  serverQueue.player.stop();
}

function displayQueue(message, serverQueue) {
  if (!serverQueue) return message.channel.send('There is no queue!');
  let queueMessage = 'Current queue:\n';
  for (let i = 0; i < serverQueue.songs.length; i++) {
    queueMessage += `${i + 1}. ${serverQueue.songs[i].title}\n`;
  }
  message.channel.send(queueMessage);
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.connection.destroy();
    queue.delete(guild.id);
    return;
  }

  const stream = ytdl(song.url, { filter: 'audioonly' });
  const resource = createAudioResource(stream);
  const player = createAudioPlayer();
  serverQueue.player = player;

  player.play(resource);
  serverQueue.connection.subscribe(player);

  player.on(AudioPlayerStatus.Idle, () => {
    serverQueue.songs.shift();
    play(guild, serverQueue.songs[0]);
  });

  player.on('error', error => {
    console.error(error);
    serverQueue.songs.shift();
    play(guild, serverQueue.songs[0]);
  });

  serverQueue.textChannel.send(`Now playing: **${song.title}**`);
}

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

client.login(process.env.TOKEN);