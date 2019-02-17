const express = require('express');
const fetch = require('node-fetch');
const btoa = require('btoa');
const Discord = require('discord.js')

const router = express.Router();


let client = new Discord.Client();


client.login(process.env.TOKENE);

router.get('/avatar/:id', (req, res) => {
  client.fetchUser(req.params.id).then(user=>{
      if(user){
    res.redirect(user.displayAvatarURL);
  }else{
    res.redirect('https://cdn.browshot.com/static/images/not-found.png');
  }
  }).catch(e=>{
    res.redirect('https://cdn.browshot.com/static/images/not-found.png');
  });
});
router.get('/user', (req, res) => {
  if (!req.query.code) return res.send('no');
  const code = req.query.code;
  fetch(`https://discordapp.com/api/users/@me`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${req.query.code}`,
      },
    }).then(response => {
    response.json().then(json => {
      res.send(json);
    });
  });
  console.log(req.query);
});

router.get('/status/:id', (req, res) => {
  let user = client.users.get(req.params.id);
  if (user) {
    res.send({
      status: user.presence.status
    })
  } else {
    res.send({
      status: null
    })
  }
});

router.get('/tag/:id', (req, res) => {
  client.fetchUser(req.params.id).then(user => {
  if(user){
    res.send({tag: user.tag});
  }else{
    res.status(404).send("{\"tag\": \"USER NOT FOUND\"}");
  }
  }).catch(err => {
    res.status(404).send("{\"tag\": \"USER NOT FOUND\"}");
  });
});

module.exports = router;