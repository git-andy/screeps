//Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Upgrader1' );
var logger = require('common.logging');
var controller = require('creep.controller');
var workermanager = require('creep.workermanager');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        controller.renewManager(creep);
        
        if (creep.memory.renewing)
        {
            controller.renew(creep);
            } else {
            if(creep.memory.working && creep.carry.energy == 0) {
                creep.memory.working = false;
                creep.memory.action = 'harvesting';
    	    }
    	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
    	        creep.memory.working = true;
    	        creep.memory.action = 'upgrading';
    	    }
    
    	    // Upgrade Controller
            
            // Harvest
    
    	    if(creep.memory.working) {
    	        if (workermanager.upgradecontroller(creep)) {
    	        }
            }
            else {
                controller.harvest(creep);
            }
        }
	}
};

module.exports = roleUpgrader;