// quick hack for now
var channela = ""
var channelb = ""

GenChatService = {

    comet:              null,
    
    // inits the chat server and connects to a channel
    // "arg" can be null, a string, or an array of strings.
    // <null> connects to a unique random channel, <string> connects to a 
    // named channel, and an array connects to a random channel in that array
    initChat: function(arg){
        this.comet = new Faye.Client('/chat/comet');
        
        var channel = this.findChannel(arg);   
        Chat.init(this.comet, channel);    
        console.log("connected to "+channel)
        
        return channel
    },
    
    // callback is optional. If it is ommitted, chats will use default
    // accept function and client list will also be subscribed to
    subscribe: function(arg, callback){
        var channel = this.findChannel(arg);   
        if (arguments.length == 2){
            Chat.subscribe(channel, callback, true); 
        } else {
            Chat.subscribe(channel, true); 
            comet = Chat._comet;
            comet.subscribe('/smeta/clients'+channel, Chat.updateClientList, Chat);
        }
           
        console.log("connected to "+channel)
        
        return channel
    },
    
    // doesn't really unsubscribe, just prevents your chats from
    // entering specified channel
    unsubscribe: function(channel){
        Chat.stopChattingInChannel(channel);
    },
    
    // "arg" can be null, a string, or an array of strings.
    // <null> connects to a unique random channel, <string> connects to a 
    // named channel, and an array connects to a random channel in that array
    findChannel: function(arg){
        var channel;
        if (arg == null){
            channel = "/random"+Math.floor(Math.random() * 10000);
        } else if ($.isArray(arg)){
            channel = arg[Math.floor(Math.random() * arg.length)];
        } else {
            channel = arg;
        }
        if (channel.slice(0,1) != "/")
            channel = "/"+channel;
        return channel;
    },
    
    // callback gets the name of the channel
    //for now, let's just use testa and testb
    findChannelWithLeastClients: function(channels, callback){
        channela = channels[0];
        channelb = channels[1];
        
        function channelSwitcher(channel){
            this._channel = channel;
            
            this.test = function(){
                alert("my _channel is "+this._channel);
            }
            
            this.handleCallback = function(num){
                alert(num + " clients are connected to "+this._channel);
                switchChannels(this._channel, num);
            }
            
            this.clients = [];
            this.clients[channela] = -1;
            this.clients[channelb] = -1;
            
            this.switchChannels = function(channel, number){
                this.clients[channel] = number;
                if (this.clients[channela] > -1 && this.clients[channelb] > -1){
                    if (this.clients[channela] > this.clients[channelb]){
                        alert("returning "+channelb);
                        callback(channelb)
                    } else {
                        alert("returning "+channela);
                        callback(channela)
                    }
                }
            }
        }
        
        z = new channelSwitcher("x");
        zz = z.handleCallback;
        zz(1000);
        
        this.clientsInChannel(channela, new channelSwitcher(channela).handleCallback);
        this.clientsInChannel(channelb, new channelSwitcher(channelb).handleCallback);
    },
    
    // callback gets number of clients in channel
    clientsInChannel: function(channel, callback){
        returnNumberOfClients = function(message){
            var numClients = [].concat(message.data);
            callback(numClients.length);
        }
        
        trans = Faye.Transport.get(this.comet);
        trans.send({
           channel:  '/meta/clients',
           id:       this._clientId,
           "real_channel":  channel,
         }, returnNumberOfClients, this);
    }

}