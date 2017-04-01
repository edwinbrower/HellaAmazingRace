import Race from '../schemas/races';
import Results from '../schemas/results';

exports.storeSavedRace = (req, res) => {
  var race = req.body;
  Race.findOne({ title: race.title }).exec((err, found) => {
    if (!found) {
      var newRace = new Race({
        title: race.title,
        start: race.start,
        checkpoints: JSON.stringify(race.checkpoints),
        finish: race.finish
      });
      newRace.save((err, newRace) => {
        if (err) {
          throw err;
        } else {
          res.send('Race Saved');
        }
      });
    } else {
      res.send('Race name already exists');
    }
  });
};

exports.loadRaceData = (req, res) => {
  Race.findOne(req.body).exec((err, raceData) => {
    if (!raceData) {
      res.send('Race doesn\'t exist');
    } else {
      res.send(raceData);
    }
  });
};

exports.saveRaceResults = (req, res) => {
  let raceResults = new Results({
    title: req.body.title,
    winner: req.body.winner,
    time: req.body.time,
    path: req.body.path
  });

  raceResults.save((err, raceResults) => {
    if (err) { 
      throw err; 
    } else {
      res.send('Results saved.');
    }
  });
};

exports.loadRaceResults = (req, res) => {
  Results.find().exec((err, raceData) => {
    if (!raceData) {
      res.send('No previous race results...');
    } else {
      res.send(raceData);
    }
  });
}







