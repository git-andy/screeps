//Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Harvester' );
var logger = require('common.logging');
var controller = require('creep.controller');
var workermanager = require('creep.workermanager');
var helper = require('common.helper');

var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        controller.renewManager(creep);
        
        if (creep.memory.renewing)
        {
            controller.renew(creep);
        } else {
            if(creep.memory.working && creep.carry.energy == 0) {
                creep.memory.working = false;
    	    }
    	    
    	    if(!creep.memory.working && (_.sum(creep.carry) == creep.carryCapacity)) {
    	        creep.memory.working = true;
    	    }
            
            // Transfer Energy to Extension or Spawn
            // Build Construction Site
            
            // Harvest
            
            if (creep.memory.working)
            {
                if (workermanager.transferminerals(creep)) {
                }
            } else {
                workermanager.mine(creep);
            }
        }
	}
};

module.exports = roleMiner;