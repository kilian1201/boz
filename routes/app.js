const express = require('express');
const fetch = require('node-fetch');
const btoa = require('btoa');
const Discord = require('discord.js');
const fs = require('fs');
const snek = require('snekfetch');
const clie = new Discord.Client()
const router = express.Router();
var queue = require("../data/queue.json");
var bots = require("../data/bots.json");

let bot;
router.get('/april', (req, res) => {
  res.sendFile('/app/css/april.css');
});

router.get('/navbar', (req, res) => {
  res.sendFile('/app/css/navbar.css');
});

router.get('/navigationbar.ejs', (req, res) => {
  res.sendFile('/app/views/navigationbar.ejs');
});
router.get('/staffcredits', (req, res) => {
  res.sendFile('/app/views/staffcredits.ejs');
});




router.get('/credits', (req, res) => {
  let members = bot.guilds.get('518933890392522753').members;
  let owners = [];
  let bdevelopers = [];
  let developers = [];
  let hdevelopers = [];
  let mods = [];
  let cool_people = [];
  members.forEach(member => {
    if(member.roles.find('name', 'Owner')){
      owners[owners.length] = member;
    }
  });
  members.forEach(member => {
    if(member.roles.find('name', 'Website Developer')){
      developers[developers.length] = member;
    }
  });
    members.forEach(member => {
    if(member.roles.find('name', 'Bot Developers')){
      bdevelopers[bdevelopers.length] = member;
    }
  });
  members.forEach(member => {
    if(member.id === "444982015474008064" || member.id === "480779413311455252") {
      cool_people[cool_people.length] = member; 
    }
  });
  res.render('/app/views/credits.ejs', {bosses: cool_people, members: members, owners: owners, developers: developers, hdevelopers: hdevelopers});
});


router.get("/login", (req, res) => {
  res.redirect('/login/login')
  //res.render('login.ejs', {req:req})
});

router.get("/queue", (req, res) => {
  fetch('https://discordrobots.tk/api/discord/user/?code=' + req.query.code).then(response => {
        response.json().then(body => {
      if(body.id && bot.users.get(body.id)){
        
        if(bot.guilds.get('518933890392522753').members.get(body.id) && bot.guilds.get('518933890392522753').members.get(body.id).roles.find('name', 'Website Moderators')){
               res.render('queue.ejs', {bots: process.DB.get('queue').value(), bot: bots, req: req}); 
      }
      }});
  });
  //res.redirect("/queue/login");
});
router.get("/certify/:id", (req,res) => {
  
  var bots = process.DB.get('bots').value().filter(v=>v.owner.includes(req.params.id));
  var topbots = process.TOPBOT.get('bots').value().filter(v=>v.owner.includes(req.params.id)); 
  
  res.render('certify.ejs', {
    bots: bots
  });
});



router.get("/user", (req, res) => {
  res.render("/app/views/user.ejs");
});


router.get('/queue/login', (req, res) => {
  console.log("[COOKIES] " + JSON.stringify(req.cookies));
  if (req.cookies.DISCORD_SECURITY != undefined && req.cookies.DISCORD_SECURITY != 'undefined') {
    try {
     //gotta refresh the token
      var token = req.cookies.DISCORD_SECURITY;
      var CLIENT_ID = process.env.CLIENT_ID
      var CLIENT_SECRET = process.env.CLIENT_SECRET
      fetch(`https://discordapp.com/api/oauth2/token?client_id=${CLIENT_ID}&grant_type=refresh_token&refresh_token=${token}&client_secret=${CLIENT_SECRET}&redirect_uri=${redirect}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        }).then(response => {
          response.json().then( json => {
          // console.log("[SESSION REFRESHED] " + JSON.stringify(json));
          // TODO: Add Cookie-Law warning at the home page
          // res.header('Set-Cookie', `BOAT_SECURITY=${json.access_token}`);
          if (json.access_token) {
            return res.redirect(`/queue/?code=${json.access_token}`);
          } else {
            return; 
          }
        });
      });
    } catch(e) {
      console.log("[ERROR ON LOGIN] "  + String(e))
      return res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=identify`);
    }
  } else {
    return res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=identify`);
  }
 /* FUNCTION OF THIS IS TO LIMIT THE USERS ON THE QUEUE PAGE TO ONLY MODS AND ADMINS
 
 const members = bot.guilds.get(' 437196655981594282').members;
    members.forEach(member => {
  if (!member.roles.find("name", "Websitesite Administrator")) {
    res.redirect("/queue/login")
  }
  if (!member.roles.find("name", "Websitesite Moderators")) {
    res.redirect("/queue/login")
  }
  if (!member.roles.find("name", "Moderators")) {
    res.redirect("/queue/login")
  }
  if (!member.roles.find("name", "Websitesite Developers")) {
    res.redirect("/queue/login")
  } 
}) */
  
});

router.get("/panel/:pass", (req, res) => {
  
  var pass = req.params.pass;
  
  var passs = [
    'dbcstaff'
  ]
  
  if (passs.includes(pass)) {
    res.render('panel.ejs', {req: req});
  } else {
    res.redirect('/')
  }
});


const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirect = encodeURIComponent('http://discordrobots.tk/login/callback');


router.get('/panel', (req, res) => {
  const url = "https://discordrobots.tk/api/discord/user/?code=" + req.query.code;


router.get(url, result => {
  result.setEncoding("utf8");
  let body = "";
  result.on("data", data => {
    body += data;
  });
  result.on("end", () => {
    if(body == 'no') return res.redirect('https://discordrobots.tk/api/discord/login');
    body = JSON.parse(body);
    // console.log(body);
    const members = bot.guilds.get('518933890392522753').members;
    members.get(body.id)
    members.forEach(member => {
      if (member.roles.find("name", "Websitesite Administrator")) {
        res.send('<a href ="/panel/dbcstaff"> Go to the panel.</a>');
      }
      if (member.roles.find("name","Website Developer")) {
        res.send('<a href ="/panel/dbcstaff"> Go to the panel.</a>');
  };
    });
});
});
});

router.get('/login/login', (req, res) => {
  console.log("[COOKIES] " + JSON.stringify(req.cookies));
  if (req.cookies.DISCORD_SECURITY != undefined && req.cookies.DISCORD_SECURITY != 'undefined') {
    try {
     //gotta refresh the token
      var token = req.cookies.DISCORD_SECURITY;
      fetch(`https://discordapp.com/api/oauth2/token?client_id=${CLIENT_ID}&grant_type=refresh_token&refresh_token=${token}&client_secret=${CLIENT_SECRET}&redirect_uri=${redirect}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        }).then(response => {
          response.json().then( json => {
          console.log("[SESSION REFRESHED] " + JSON.stringify(json));
          // TODO: Add Cookie-Law warning at the home page
          // res.header('Set-Cookie', `BOAT_SECURITY=${json.access_token}`);
          if (json.access_token) {
            return res.redirect(`/panel/123/?code=${json.access_token}`);
          } else {
            return; 
          }
        });
      });
    } catch(e) {
      console.log("[ERROR ON LOGIN] "  + String(e))
      return res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=identify`);
    }
  } else {
    return res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=identify`);
    bot.guilds.get("532594559532662794").send(`${req.user.username} just logged in!`)
  }
});
  

router.get('/login/callback', (req, res) => {
  if (!req.query.code) {
    res.redirect("/403");
  }
  const code = req.query.code;
  console.log("[ACCESS KEY] " + code);
  const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${creds}`,
      },
    }).then(response => {
      response.json().then( json => {
      console.log("[NEW SESSION] " + JSON.stringify(json));
      // TODO: Add Cookie-Law warning at the home page
      // res.header('Set-Cookie', `BOAT_SECURITY=${json.access_token}`);
      console.dir(String(json.refresh_token))
      res.cookie("DISCORD_SECURITY", String(json.refresh_token));
      res.cookie("Third-Party Income", "DBC Has permission granted to view what you are doing on the PANEL");
      res.redirect(`/panel/?code=${json.access_token}`);
    });
  });
});

router.get("/edit/445566543355", (req, res) => {
  res.render('edit.ejs');
}); 

router.get('/stats', (req, res) => {
  res.render('stats.ejs');
});

router.get("/approved", (req, res) => {
  res.render('approved.ejs');
});

router.get("/declined", (req, res) => {
  res.render('declined.ejs');
});

router.get("/certify", (req, res) => {
  res.render('certify.ejs');
});

router.get("/docs/status", (req, res) => {
  res.render('docs/status.ejs');
});

router.get("/", (request, res) => {
  res.render('index.ejs', {bots: process.DB.get('bots').value(), bot: bot});
  req: request
});

router.get("/topbots", (request, res) => {
  res.render('topbots.ejs', {bots: process.DB.get('topbots').value(), bot: bot});
  req: request
});

router.get("/docs/certify", (request, res) => {
  res.render('docs/certify.ejs', {bots: process.DB.get('bots').value(), bot: bot});
  req: request
});

router.get("/agree", (req, res) => {
  res.render('to-agree.ejs');
});

router.get("/newbot", (request, res) => {
  res.render('newbot.ejs', {bots: process.DB.get('bots').value(), bot: bot});
});

router.get("/edit", (request, res) => {
  res.render('edit.ejs', {bots: process.DB.get('bots').value(), bot: bot});
});

router.get("/report", (req, res) => {
  res.render("report.ejs");
});

router.get("/success", (req, res) => {
  res.render("success.ejs");
});

router.get("/users", (req, res)  => {
  let members = bot.guilds.get('518933890392522753').members;
  let users = [];
  members.forEach(member => {
    if(member.roles.find('name', '@everyone') && member.user){
      users[users.length] = member;
    }
  });
  res.render('/app/views/users.ejs', {users: users});// or '/app/views/users.ejs'
});

router.get("/cookies", (request, res) => {
  res.render('cookies.ejs');
});

router.get("/botdevs", (req, res)  => {
  let members = bot.guilds.get('518933890392522753').members;
  let bdevelopers = [];
  members.forEach(member => {
    if(member.roles.find('name', 'Bot Owner')){
      bdevelopers[bdevelopers.length] = member;
    }
  });
  res.render('/app/views/botdevs.ejs', {developers: bdevelopers});// or '/app/views/users.ejs'
});

router.get('/bots/:id', (req, res) => { // Just watch and learn kiddos.
  if (req.params.id != null){
      let botInfo = process.DB.get('bots').find({id:req.params.id});
      if(!botInfo.value()) return res.status(404).render('error.ejs')
      let botInfoValue = botInfo.value();
            let owners = [];
        botInfoValue.owner.forEach(owner => {
          if(bot.users.get(owner)){
            owners[owners.length] = bot.users.get(owner).tag;
          }
        });
    res.render('bot.ejs', {botInfo: botInfoValue, ownerInfo: owners.join(', '), bot: bot})
    
  } else {
  res.status(404).render('error.ejs');
  }
});

router.get("/403", (req, res) => {
    res.render('403.ejs');
});

router.get("/404", (req, res)  => {
    res.render('404.ejs');
});

router.get("/503", (req, res) => {
    res.render('503.ejs');
});

router.get("/queued", (request, res) => {
  res.render('queued.ejs', {bots: process.DB.get('bots').value(), bot: bot});
  req: request
});

router.get('/bots', (req, res) => {
  res.render('bots.ejs', {bots: process.DB.get('bots').value(), bot: bot});
});
router.get('/hold', (req, res) => {
  res.render('hold.ejs');
});
router.get('/search', (req, res) => {
  res.render('search.ejs');
});

router.get('/queue', (req, res) => {
  res.render('queue.ejs');
});

router.get("/decline/:id", (req, res) => {
  fetch('https://discordrobots.tk/api/discord/user/?code=' + req.query.code).then(response => {
        response.json().then(body => {
      if(body.id && bot.users.get(body.id)){
        
        if(bot.guilds.get('518933890392522753').members.get(body.id)&&bot.guilds.get('518933890392522753').members.get(body.id).roles.find('name', 'Websitesite Moderator')){
               res.render('decline.ejs', {DB: process.DB, bot: bot, req: req}); 
        }else{
          res.send('404 not found');
        }  
      } else {
        res.send('I believe there is an error with permissions');
      }
    });
  });
  //res.redirect("/queue/login");
});

router.get("/decline/:id/do", (req, res) => {
  let reason;
  
  if(req.query.reason=='Other?'){
    reason = req.query['other-reason']
  }else{
    reason = req.query.reason;
  }
  
  res.redirect(`https://discordrobots.tk/api/decline/${req.params.id}/?code=${req.query.code}&reason=${reason}`);
});

router.get('/users/:id', (req, res) => {
  
  var usr = bot.users.get(req.params.id)
  if (!usr) { 
    res.send('No User Found!');
  }
  if (usr.bot) {
    res.redirect('/bots/' + usr.id);
  }
  var bots = process.DB.get('bots').value().filter(v=>v.owner.includes(req.params.id));
  
  if (!bots) {
    res.send('User isn\'t registered!')
  }  
  
  var profile = process.DB.get('users').find({id: req.params.id}).value()//)
  res.render('user.ejs', {
    user: usr,
    bots: bots, 
    profile: profile,
    bot: bot
  })
})


module.exports.router = router;
  
module.exports.setBot = (botUser) => {
  bot = botUser;
  process.bot = botUser;
}