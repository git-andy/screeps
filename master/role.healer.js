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
            
            if (creep.memory.working)
            {
                const target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                    filter: function(object) {
                        return object.hits < object.hitsMax;
                    }
                });
                if(target) {
                    if(creep.heal(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            } else {
                controller.harvest(creep);
            }
        }
	}
};

module.exports = roleMiner;