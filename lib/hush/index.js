 function Config (conffile) {
  conffile     = conffile || 'PIRATE.conf';
  const fs     = require('fs');
  const os     = require('os');
  var platform = os.platform();
  var homedir  = os.homedir();
  var path     = homedir + '/.komodo/PIRATE/';
  var mac_path = homedir + "/Library/Application Support/Komodo/PIRATE/";

  console.log("OS: " + platform + " Home: " + homedir);

  if (fs.existsSync(path)) {
    console.log(path + " exists!");
    conffile = path + conffile
    console.log("Found " + conffile);
  } else if (platform == "win32") {
    // should we be auto-creating here?
    if (!fs.existsSync(process.env.APPDATA + '\\PIRATE')) {
      fs.mkdirSync(process.env.APPDATA + '\\PIRATE')
    }
    //TODO: actually check that directory + file exists, lol
    var path = process.env.APPDATA + '\\PIRATE\\'
    conffile = path + conffile;
    console.log("Found " + conffile);
  } else if (fs.existsSync(mac_path)) {
    console.log(mac_path + " exists!");
    path     = mac_path;
    if (fs.existsSync(mac_path + conffile)) {
        conffile = mac_path + conffile;
        console.log("Found " + conffile);
    }

  } else {
    // TODO: Give user the option to tell us
    // the correct directory
    console.log("Could not find PIRATE.conf!");
  }
  // Read all lines from config file, remove commented lines and empty lines.
  self.filteredlines = require('fs').readFileSync(conffile, 'utf-8').split('\n').filter(line => line.trim() && !line.trim().startsWith('#'))
  // Create a dictionary from keys and values
  self.keysvalues = self.filteredlines.reduce(function(map, line) {
    var m     = line.match(/^([^=]+)=(.*)/);
    var key   = m[1].trim()
    var value = m[2].trim()
    map[key]  = value
    return map;
  }, {});
}

Config.prototype.get = function (name) {
  return self.keysvalues[name]
};
Config.prototype.rpcuser = function (name) {
  return self.keysvalues['rpcuser']
};
Config.prototype.rpcpassword = function (name) {
  return self.keysvalues['rpcpassword']
};
Config.prototype.rpcport = function (name) {
  return this.get('testnet') == 1 ? 45453 : 45453
};

module.exports =   {
   Config:Config
}

