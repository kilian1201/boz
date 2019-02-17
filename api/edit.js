     const express = require('express');
const fetch = require('node-fetch');
const btoa = require('btoa');
const Discord = require('discord.js');
const fs = require('fs');
 
const router = express.Router();

let client = new Discord.Client();

client.on('ready', () => {
  console.log('Edit (EXPERIMENTAL) instance live');
  client.channels.get("536349957872025620").send(new Discord.RichEmbed()
                                                .setTitle("Service started")
                                                .setDescription("`Edit (EXPERIMENTAL)` module loaded succesfully")
                                                .setColor(`GREEN`))
});

client.login(process.env.TOKENE);
let bodyParser = require('body-parser');
router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
router.post('/', (req, res) => {
  const https = require("https");
     
     const url =
  "https://discordbotsclub.org/api/discord/user/?code=" + req.body.key;

https.get(url, result => {
  result.setEncoding("utf8");
  let body = "";
  result.on("data", data => {
    body += data;
  }); 
  result.on("end", () => {
    if(body == 'no') return res.redirect('https://discordbotsclub.org/callback');
    body = JSON.parse(body);
    // console.log(body);
    const guild = client.guilds.get('524681874732220418');
    if(!client.guilds.get('524681874732220418').members.get(body.id)) return res.send('Join our server first! <a href="https://discord.gg/7tDWPaA">click here</a>');
    
      client.fetchUser(req.body.boatID).then(bot => {
    if(!bot.bot) return res.send('Error: Please submit a bot account and not a user account.');
    
    if(client.guilds.get('524681874732220418').members.get(req.body.boatID)) return res.send('Error: This bot is already in our database!');
    
    if(!req.body.prefix) return res.send('Error:Please include your bot prefix.');
    
    if(!req.body.prefix) return res.send('Error:Please include the help command');
    
       // if(process.DB.get('queue').find({id: req.body.boatID + ''}).value()) return res.send('Error: This bot is already in our database and is waiting for approval');
        if(process.DB.get('queue').find({id: req.body.boatID + ''}).value())
    try{
      process.DB.get('bots').value()[0].push({
       id: req.body.boatID,
        name: bot.tag,
        prefix: req.body.prefix,
        hc: req.body.prefix,
        owner: [body.id],
        desc: req.body.description,
        longdesc: req.body.longdescription,
        git: req.body.git,
        website: req.body.website,
        support: req.body.support,
        library: req.body.library,
        certified: false
      }).write()
    } catch(e) {console.log(e);}
                client.channels.get("536345225585491973").send(new Discord.RichEmbed()
                                                              .setTitle(`TESTING`)
                                                              .setDescription(`**${client.users.get(body.id)}** added **${bot.tag}** to the queue!`)
                                                              .setColor(`${process.DB.get('queue').value().length} in total bots queued`)); // c'mon why the ping
        res.redirect("/queued");
  }).catch(err => {
    console.error(err);
    return res.send('I haven\'t found this user..');

      });
  });
});
        
});

module.exports = router;
