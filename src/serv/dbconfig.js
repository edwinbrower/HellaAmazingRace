var mongoose = require('mongoose');

// chamber's
// mongoose.connect('mongodb://jason:admin@ds135790.mlab.com:35790/hella-amazing-race');
// han's
mongoose.connect('mongodb://Users:password@ds145800.mlab.com:45800/amazingrace');

mongoose.connection.on('error', function(error) {
  console.error(error);
});

mongoose.connection.once('open', function() {
  console.log('Mongoose connected.');
});

module.exports = mongoose;