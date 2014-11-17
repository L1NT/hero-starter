/*

  Strategies for the hero are contained within the "moves" object as
  name-value pairs, like so:

    //...
    ambusher : function(gamedData, helpers){
      // implementation of strategy.
    },
    heWhoLivesToFightAnotherDay: function(gamedData, helpers){
      // implementation of strategy.
    },
    //...other strategy definitions.

  The "moves" object only contains the data, but in order for a specific
  strategy to be implemented we MUST set the "move" variable to a
  definite property.  This is done like so:

  move = moves.heWhoLivesToFightAnotherDay;

  You MUST also export the move function, in order for your code to run
  So, at the bottom of this code, keep the line that says:

  module.exports = move;

  The "move" function must return "North", "South", "East", "West", or "Stay"
  (Anything else will be interpreted by the game as "Stay")

  The "move" function should accept two arguments that the website will be passing in:
    - a "gameData" object which holds all information about the current state
      of the battle

    - a "helpers" object, which contains useful helper functions
      - check out the helpers.js file to see what is available to you

    (the details of these objects can be found on javascriptbattle.com/#rules)

  Such is the power of Javascript!!!

*/

// Strategy definitions
var moves = {
  // Aggressor
  aggressor: function(gameData, helpers) {
    // Here, we ask if your hero's health is below 30
    if (gameData.activeHero.health <= 30){
      // If it is, head towards the nearest health well
      return helpers.findNearestHealthWell(gameData);
    } else {
      // Otherwise, go attack someone...anyone.
      return helpers.findNearestEnemy(gameData);
    }
  },

  // Health Nut
  healthNut:  function(gameData, helpers) {
    // Here, we ask if your hero's health is below 75
    if (gameData.activeHero.health <= 75){
      // If it is, head towards the nearest health well
      return helpers.findNearestHealthWell(gameData);
    } else {
      // Otherwise, go mine some diamonds!!!
      return helpers.findNearestNonTeamDiamondMine(gameData);
    }
  },

  // Balanced
  balanced: function(gameData, helpers){
    //FIXME : fix;
    return null;
  },

  // The "Northerner"
  // This hero will walk North.  Always.
  northener : function(gameData, helpers) {
    var myHero = gameData.activeHero;
    return 'North';
  },

  // The "Blind Man"
  // This hero will walk in a random direction each turn.
  blindMan : function(gameData, helpers) {
    var myHero = gameData.activeHero;
    var choices = ['North', 'South', 'East', 'West'];
    return choices[Math.floor(Math.random()*4)];
  },

  // The "Priest"
  // This hero will heal nearby friendly champions.
  priest : function(gameData, helpers) {
    var myHero = gameData.activeHero;
    if (myHero.health < 60) {
      return helpers.findNearestHealthWell(gameData);
    } else {
      return helpers.findNearestTeamMember(gameData);
    }
  },

  // The "Unwise Assassin"
  // This hero will attempt to kill the closest enemy hero. No matter what.
  unwiseAssassin : function(gameData, helpers) {
    var myHero = gameData.activeHero;
    if (myHero.health < 30) {
      return helpers.findNearestHealthWell(gameData);
    } else {
      return helpers.findNearestEnemy(gameData);
    }
  },

  // The "Careful Assassin"
  // This hero will attempt to kill the closest weaker enemy hero.
  carefulAssassin : function(gameData, helpers) {
    var myHero = gameData.activeHero;
    if (myHero.health < 50) {
      return helpers.findNearestHealthWell(gameData);
    } else {
      return helpers.findNearestWeakerEnemy(gameData).direction;
    }
  },

  // The "Safe Diamond Miner"
  // This hero will attempt to capture enemy diamond mines.
  safeDiamondMiner : function(gameData, helpers) {
    var myHero = gameData.activeHero;

    //Get stats on the nearest health well
    var healthWellStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
      if (boardTile.type === 'HealthWell') {
        return true;
      }
    });
    var distanceToHealthWell = healthWellStats.distance;
    var directionToHealthWell = healthWellStats.direction;

    if (myHero.health < 40) {
      //Heal no matter what if low health
      return directionToHealthWell;
    } else if (myHero.health < 100 && distanceToHealthWell === 1) {
      //Heal if you aren't full health and are close to a health well already
      return directionToHealthWell;
    } else {
      //If healthy, go capture a diamond mine!
      return helpers.findNearestNonTeamDiamondMine(gameData);
    }
  },

  // The "Selfish Diamond Miner"
  // This hero will attempt to capture diamond mines (even those owned by teammates).
  selfishDiamondMiner :function(gameData, helpers) {
    var myHero = gameData.activeHero;

    //Get stats on the nearest health well
    var healthWellStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
      if (boardTile.type === 'HealthWell') {
        return true;
      }
    });

    var distanceToHealthWell = healthWellStats.distance;
    var directionToHealthWell = healthWellStats.direction;

    if (myHero.health < 40) {
      //Heal no matter what if low health
      return directionToHealthWell;
    } else if (myHero.health < 100 && distanceToHealthWell === 1) {
      //Heal if you aren't full health and are close to a health well already
      return directionToHealthWell;
    } else {
      //If healthy, go capture a diamond mine!
      return helpers.findNearestUnownedDiamondMine(gameData);
    }
  },

  // The "Coward"
  // This hero will try really hard not to die.
  coward : function(gameData, helpers) {
    return helpers.findNearestHealthWell(gameData);
  },

  // The "Careful Greedy Assassin"
  // This hero will attempt to kill the closest weaker enemy hero.
  carefulGreedyAssassin : function(gameData, helpers) {
    if (gameData.activeHero.health < 80) {
      return helpers.findNearestHealthWell(gameData);
    } else {
    	var enemy = helpers.findNearestWeakerEnemy(gameData);
    	if (enemy && helpers.count(gameData, enemy, 'Hero') < 2) {
    		return enemy;
    	} else {
    		return helpers.findNearestUnownedDiamondMine(gameData);
    	}
    }
  },

	L1NT: function(gameData, helpers) {
		var hero = gameData.activeHero;
		var dft = hero.distanceFromTop,
			dfl = hero.distanceFromLeft;
		var moves = {
			Stay: 0,
			North: 0,
			East: 0,
			South: 0,
			West: 0
		};

		//grave robbing
		var nearestGrave = helpers.findNearestObjectDirectionAndDistance(gameData.board, hero, function(tile) {
			return tile.type === 'Bones';
		});
		if (nearestGrave) {
			if (nearestGrave.distance == 1 && hero.health > 50) {
				moves[nearestGrave.direction] += 10000/(101 - hero.health)
			} else {
				moves[nearestGrave.direction] += 500/nearestGrave.distance;
			}
		}

		//diamond mines (careful as it'll cost 20hp to take a mine)
		var nearestMine = helpers.findNearestObjectDirectionAndDistance(gameData.board, hero, function(tile) {
		    if (tile.type === 'DiamondMine') {
		        if (tile.owner) {
		          return tile.owner.id !== hero.id;
		        } else {
		          return true;
		        }
			} else {
				return false;
			}
		});
		if (nearestMine) {
			moves[nearestMine.direction] += (hero.health * 2.5) / (nearestMine.distance ? nearestMine.distance : 1);
		}

		//attacking enemies (i.e. enemy is adjacent)
		for (var dir in moves) {
			var tile = helpers.getTileNearby(gameData.board, dft, dfl, dir);
			if (tile && tile.type === 'Hero' && tile.team !== hero.team) {
				if (tile.health <= 30 && hero.health > 50)
					moves[dir] += (hero.health - tile.health) * 10;
				else
					moves[dir] += (hero.health - tile.health) * 3;
			}
		}

		//chasing enemies (i.e. moving towards)

		//replenishing health
		var nearestHealth = helpers.findNearestObjectDirectionAndDistance(gameData.board, hero, function(tile) {
		    return tile.type === 'HealthWell';
		  });
		if (nearestHealth) {
			moves[nearestHealth.direction] += Math.pow((100-hero.health)/10, 3) * Math.pow(nearestHealth.distance, 2);
		}

		//helping others

		//impassable tiles
		//(gets a value of zero, if we can't move there)


		var direction,
			value = -10000;
		for (var dir in moves) {
			if (moves[dir] > value) {
				direction = dir;
				value = moves[dir];
			}
		}

		return direction;
	}
};


//  Set our heros strategy
var  move =  moves.L1NT;

// Export the move function here
module.exports = move;
