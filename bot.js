const Discord = require('discord.js');
const bot = new Discord.Client();

const token = 'Token des Bots';

const prefix = '!';

var moneyList;

bot.on('ready', () =>{
    console.log('Bot Is Online');
});

bot.on('message', message => {
    if (message.content.startsWith(prefix)) {
        let args = message.content.substring(prefix.length).split(' ');
        var channel = message.channel;

        switch (args[0]){
            case 'z':
                channel.send(message.content.substring(prefix.length + 1))
                break;
            case 'cl':
                if (!args[1]) {
                    channel.send('Bitte eine Zahl eingeben.')
                }
                else{
                    if (!isNaN(args[1])){
                        var number = parseInt(args[1]);
                        channel.bulkDelete(number + 1);
                    }
                    else{
                        channel.send('Argument war keine Zahl.');
                    }
                }
                break;
            case 'umfrage':
                if (!args[1]) {
                    channel.send('Bitte text eingeben.');
                }
                else{
                    channel.bulkDelete(1);
                    channel.send(message.content.substring(prefix.length + 7)).then(sentEmbed => {
                        sentEmbed.react("✅");
                        sentEmbed.react("❎");
                    })
                }
                break;
            case 'u3':
                    if (!args[1]) {
                        channel.send('Bitte text eingeben.');
                    }
                    else{
                        channel.bulkDelete(1);
                        channel.send(message.content.substring(prefix.length + 2)).then(sentEmbed => {
                            sentEmbed.react('1️⃣');
                            sentEmbed.react('2️⃣');
                            sentEmbed.react('3️⃣');
                        })
                    }
                    break;
            case 'work':
                var user = message.author;
                
                addMoneyToUser(1, user)

                channel.send(user.username + ' has now ' + moneyList[user.username] + ' Euro');
                break;

            case 'money':

                if (!args[1]) {
                    var user = getUserFromMention(args[1]);
                    
                    prepareMoneyList(user);
                    writeMoneyListInFile();

                    channel.send(user.username + ' has ' + moneyList[user.username] + ' Euro');
                    break;
                }
                else{
                    var user = getUserFromMention(args[1]);
                    if (!user) {
                        channel.send('Das war kein user!')
                        break;
                    }
                    var user = message.author;
                    
                    prepareMoneyList(user);
                    writeMoneyListInFile();

                    channel.send(user.username + ' has ' + moneyList[user.username] + ' Euro');
                    break;
                }

            case 'geldadd':
                if (message.member.permissions.has('ADMINISTRATOR')) {
                    if (args.length == 3) {
                        if (isNaN(args[2])) {
                            channel.send('Bitte gib eine gültige zahl ein')
                            break;
                        }

                        var user = getUserFromMention(args[1])
                        if (!user) {
                            channel.send('Bitte geben sie einen richtigen user ein!')
                            break;
                        }

                        addMoneyToUser(parseInt(args[2]), user);

                        channel.send('Erfolgreich!');
                    }
                    else{
                        channel.send('Bitte gib name und anzahl an.')
                    }
                }
                else{
                    channel.send('Du hast keine Rechte dazu!')
                }
                break;

            case 'geldremove':
                if (message.member.permissions.has('ADMINISTRATOR')) {
                    if (args.length == 3) {

                        var user = getUserFromMention(args[1])
                        if (!user) {
                            channel.send('Bitte geben sie einen richtigen user ein!')
                            break;
                        }

                        if (isNaN(args[2])) {
                            channel.send('Bitte gib eine gültige zahl ein')
                            break;
                        }

                        removeMoneyToUser(parseInt(args[2]), user);

                        channel.send('Erfolgreich!');
                    }
                    else{
                        channel.send('Bitte gib name und anzahl an.')
                    }
                }
                else{
                    channel.send('Du hast keine Rechte dazu!')
                }
                break;
                
                case 'help':
                channel.send('Help page for this bot.')
                channel.send('`!money @user` - Rufe das Geld von @user ab)
                channel.send('!u3 <Nachricht> - eine Umfrage mit 1,2 oder 3.')
                channel.send('!cl <nummer> - löscht die letzten <nummer> Nachrichten')
                channel.send('!work - arbeite und kriege Geld')
                channel.send('!moneyadd @user <nummer> - @user <nummer> Euro geben (nur Mit Administrator Berechtigung)')
                channel.send('!moneyremove @user <nummer> - von @user <nummer> Euro entfernen')
                channel.send('!moneyset @user <nummer> - das Geld von @user auf <nummer> Euro setzen')
                channel.send('!umfrage <Nachricht> - sendet eine Umfrage mit ✅/❌') 
                channel.send('my Prefix is `!`')
                break;
                
                case 'kick':
                  var user = getUserFromMention(args[1])
                  user.kick
                  break;
            
            case 'geldset':
                if (message.member.permissions.has('ADMINISTRATOR')) {
                    if (args.length == 3) {

                        var user = getUserFromMention(args[1])
                        if (!user) {
                            channel.send('Bitte geben sie einen richtigen user ein!')
                            break;
                        }

                        if (isNaN(args[2])) {
                            channel.send('Bitte gib eine gültige zahl ein')
                            break;
                        }

                        setMoneyToUser(parseInt(args[2]), user);

                        channel.send('Erfolgreich!');
                    }
                    else{
                        channel.send('Bitte gib name und anzahl an.')
                    }
                }
                else{
                    channel.send('Du hast keine Rechte dazu!')
                }
                break;
        }
    }
});

function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return bot.users.cache.get(mention);
	}
}

function prepareMoneyList(user){
    var fs = require('fs');
    
    var path = "moneyList.json";

    if (!moneyList) {
        moneyList = {};
    }
    try {
        var jsonIn = fs.readFileSync(path).toString().split("\n");
        moneyList = JSON.parse(jsonIn);
    } catch (error) {
        
    }
    
    if (moneyList[user.username] == undefined) {
        moneyList[user.username] = 0;
    }
}

function writeMoneyListInFile(){
    var fs = require('fs');

    var path = "moneyList.json";

    var json = JSON.stringify(moneyList);
                
    fs.writeFile(path, json, function(err, result) {
        if(err) console.log('error', err);
    });
}

function addMoneyToUser(money, user){
    prepareMoneyList(user);

    moneyList[user.username] += money;

    writeMoneyListInFile();
}

function removeMoneyToUser(money, user){
    prepareMoneyList(user);

    moneyList[user.username] -= money;

    writeMoneyListInFile();
}

function setMoneyToUser(money, user){
    prepareMoneyList(user);

    moneyList[user.username] = money;

    writeMoneyListInFile();
}

bot.login(token);