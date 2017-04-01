var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ResultSchema = new Schema({
  title: { type: String, required: true },
  winner: { type: String, required: true },
  time: { type: String, required: true },
  path: { type: String, required: true}
});

var Results = mongoose.model('results', ResultSchema);

module.exports = Results;
