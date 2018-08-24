var creepController = require('creep.controller');

var roomDefender = {
    defendRoom: function(roomName, targetAttackers) {
        var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
        if(hostiles.length > 0) {
            var username = hostiles[0].owner.username;
           // Game.notify(`User ${username} spotted in room ${roomName}`);
            var towers = Game.rooms[roomName].find(
                FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            towers.forEach(tower => tower.attack(hostiles[0]));
            
            var attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
            
            //console.log(roomName + ' attackers  ' + attackers.length + '/' + targetAttackers);
            
            if (attackers.length < targetAttackers) {
                //console.log('Spqwnign Attacker');
                creepController.spawnAttacker('Spawn2','attacker',roomName);
            }
            
        }
    }
}

module.exports = roomDefender;