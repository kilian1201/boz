const express = require('express');
const fetch = require('node-fetch');
const btoa = require('btoa');
const Discord = require('discord.js');
const fs = require('fs');

const JsSearch = require('js-search');

const router = express.Router();

var db = require('../db.json')

var queue = db.queue
var bots = db.bots
  
router.get('/bots/:id/info', (req, res) => {
  let botInfo;
  Object.keys(bots).forEach(i => {
  if (bots[i].id == req.params.id){
  botInfo = bots[i];
  }
    })
  if (botInfo != null) {
  res.send(botInfo);
  } else {
   res.status(404).send('Not Found.') 
  }
});

router.get('/allbots', (req, res) => {
  res.send(bots);
});

router.get("/bots/total", (req, res) => {
  res.send({total: Object.keys(bots).length});
});

router.get('/bots/search', (req, res) => {
  
  var search = new JsSearch.Search('id');
  search.addIndex('id');
  search.addIndex('name');
  search.addIndex('owner');
  
  let botArray = [];
  
  Object.keys(bots).forEach(key => {
    botArray[botArray.length] = bots[key];
  });
  

  search.addDocuments(botArray);
    res.send(search.search(req.query.q));
});  

router.use("/discord", require('../api/discordAPI.js'));
router.use("/newbot", require('../api/newbot.js'));



router.post('/stats/:id/:key', (req, res) => {
  // console.log(req.params, req.query);
  if(process.DB.get('bots').find({id: req.params.id}).value()){
    if(req.query.count && parseInt(req.query.count)==req.query.count){
      console.log(process.DB.get('bots').find({id: req.params.id}).value().apiKey);
      if(process.DB.get('bots').find({id: req.params.id}).value().apiKey && process.DB.get('bots').find({id: req.params.id}).value().apiKey == req.params.key){
        process.DB.get('bots').find({id: req.params.id}).set('servers', req.query.count).write();
        res.send({success: true});
      }else{
        res.send(req.params);
      }
    }else{
      res.send({error: 'Missing \'count\' in query-string'});
    }
  }else{
    res.send({error: 'Authorization_defined_no_bot_found'});
  }
});



router.get('/approve/:id', (req, res) => {
  if(!process.DB.get('queue').find({id: req.params.id})){
    res.send('Doesn\'t exist!');
  }else{
   let bot = process.bot;
      fetch('discordrobots.tk/api/discord/user/?code=' + req.query.code).then(response => {
    response.json().then(body => {
      if(body.id && bot.users.get(body.id)){
        
        if(bot.guilds.get('518933890392522753').members.get(body.id)&&bot.guilds.get('518933890392522753').members.get(body.id).roles.find('name', 'Website Moderator')){
      bot.channels.get("531506819382771733").send(` <@${req.params.id}> by <@${process.DB.get('queue').find({id:req.params.id}).value().owner[0]}> was approved by <@${body.id}>!`);
      bot.users.get(body.id).send(`You succesfully approved **<@${req.params.id}>**`)
 ;     
//      bot.users.get(process.DB.get('queue').value()[0].owner[0]).send(process.DB.get('queue').find({id: req.params.id}).value().name +" has been approved!")
      
      process.DB.get('bots').push(process.DB.get('queue').find({id: req.params.id}).value()).write();
      
      process.DB.get('queue').remove({ id: req.params.id }).write();
          
          res.send('Bot approved.+invite');
        }else{
          res.send('You are lacking permissions');
        }  
      }else{
        res.send('Rejected');
      }
    });
  });
    
  }
});

router.get('/cerq', (req , res) => res.send(process.DB.get('certifyQueue').value()))

router.get('/certify/:id', (req, res) => {
  
  
  process.DB.get('certifyQueue').write({
    id: req.params.id
  })
  
  res.redirect('queued') // callback :D
  res.send(process.DB.get('certifyQueue').value())
})

router.get('/decline/:id', (req, res) => {
  if(!process.DB.get('queue').find({id: req.params.id})){
    res.send('Doesn\'t exist!');
  }else{
   let bot = process.bot;
 fetch('https://discordrobots.tk/api/discord/user/?code=' + req.query.code).then(response => {
        response.json().then(body => {
      if(body.id && bot.users.get(body.id)){
        
        if(bot.guilds.get('518933890392522753').members.get(body.id)&&bot.guilds.get('518933890392522753').members.get(body.id).roles.find('name', 'Website Moderators')){
          
                bot.channels.get("542116164571103242").send(`**${process.DB.get('queue').value()[0].name}** \`(${process.DB.get('queue').value()[0].name})\` by <@${process.DB.get('queue').value()[0].owner}> was declined by <@${body.id}> **Reason:** ${decodeURI(req.query.reason) != undefined ? decodeURI(req.query.reason) : 'Other'}`);
      process.DB.get('queue').find({id:req.params.id}).value().owner.forEach(botOwner => {
        bot.users.get(botOwner).send(`Your bot <@${req.params.id}>, was declined by <@${body.id}> for ${decodeURI(req.query.reason)}`);
      });
      
      process.DB.get('queue').remove({ id: req.params.id }).write();
          
          res.send('done.');
        }else{
          res.send('No permission!');
        }  
      }else{
        res.send('No thanks');
      }
    });
  });
    
  }
});


module.exports = router;