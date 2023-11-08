const venom = require('venom-bot');
const express = require('express');
const exphbs = require('express-handlebars');
const uuid = require('uuid');
const app = express();

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');


const fs = require('fs');

app.get('/new', (req, res) => {
    const sessionName = uuid.v4(); // Generate a random session name
    venom
      .create(
        sessionName,
        (base64Qr, asciiQR, attempts, urlCode) => {
            app.get('/qr', (req, res) => {
                res.render('index2');
              });
              app.get('/out.png',(req, res) => {
                res.sendFile(__dirname+'/out2.png')
              })
          var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            response = {};
    
          if (matches.length !== 3) {
            return new Error('Invalid input string');
          }
          response.type = matches[1];
          response.data = new Buffer.from(matches[2], 'base64');
    
          var imageBuffer = response;
          require('fs').writeFile(
            'out2.png',
            imageBuffer['data'],
            'binary',
            function (err) {
              if (err != null) {
                console.log(err);
              }
            }
          );
        },
        undefined,
        { logQR: false }
      )
      .then((client) => {
        start(client);
        res.send(`New session created with name: ${sessionName}`); // Send a response with the generated session name
      })
      .catch((erro) => {
        console.log(erro);
        res.status(500).send('Error creating a new session.'); // Send an error response
      });
  });

venom
  .create(
    'nishmal',
    (base64Qr, asciiQR, attempts, urlCode) => {
        app.get('/', (req, res) => {
            res.render('index');
          });
          app.get('/out.png',(req, res) => {
            res.sendFile(__dirname+'/out.png')
          })
      var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

      if (matches.length !== 3) {
        return new Error('Invalid input string');
      }
      response.type = matches[1];
      response.data = new Buffer.from(matches[2], 'base64');

      var imageBuffer = response;
      require('fs').writeFile(
        'out.png',
        imageBuffer['data'],
        'binary',
        function (err) {
          if (err != null) {
            console.log(err);
          }
        }
      );
    },
    undefined,
    { logQR: false }
  )
  .then((client) => {
    start(client);
  })
  .catch((erro) => {
    console.log(erro);
  });
  function start(client) {
    client.onMessage(async(message) => {
      if (message.body === 'codewars' && message.isGroupMsg === false) {
        client
          .sendText(message.from, await testing())
          .then((result) => {
            console.log('Result: ', ); //return object success
          })
          .catch((erro) => {
            console.error('Error when sending: ', erro); //return object error
          });
      }
    });
  }

  const usersData = {
    "Nishmal": "Its-me-nishmal",
    "Amal Nath": "AmalNath-VS",
    "Fahim": "muhammmedfahim4321",
    "Abdul Bari": "Abdulbarikt",
    "Afaf": "Afaf997",
    "Subhin": "SUBHIN-TM",
    "Rifna": "Rifna",
    "Afsal Kp": "Afsalkp7",
    "Jeeva": "Jeevamk",
    "Krishnadas": "Krishnadas3",
    "Adhila Millath": "adila millath"
  };
  async function testing() {
    const responseMessages = [];
    responseMessages.push("╭────《 𝕔𝕠𝕕𝕖𝕨𝕒𝕣𝕖𝕤 𝕥𝕠𝕕𝕒𝕪 》────⊷\n│╭──────✧❁✧──────◆");
  
    for (const user in usersData) {
      const codeWarsUsername = usersData[user];
  
      try {
        const challengesResponse = await fetch(`https://www.codewars.com/api/v1/users/${codeWarsUsername}/code-challenges/completed`);
        const challengesData = await challengesResponse.json();
  
        // Calculate completed challenges today
        const today = new Date().toISOString().split('T')[0];
        const completedToday = challengesData.data.filter(challenge => challenge.completedAt.startsWith(today));
  
        // Construct the response message for this user
        const responseMessage = `│   ${user} :- ${completedToday.length}`;
        responseMessages.push(responseMessage);
      } catch (error) {
        console.error('An error occurred:', error);
  
        // Check if the error message is user-friendly or not
        let errorMessage = `An error occurred while processing data for ${user}. Please try again later.`;
  
        if (error.message) {
          // If the error has a message, you can include it in the response
          errorMessage += ` Error details: ${error.message}`;
        }
  
        responseMessages.push(errorMessage);
      }
    }
  
    responseMessages.push("│╰──────✧❁✧──────◆\n╰══════════════════⊷");
  
    return responseMessages.join('\n');
  }
 

app.listen(3004, () => {
  console.log('Server is running on port 3003');
});
