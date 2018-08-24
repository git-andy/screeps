// Game.rooms['E7N43'].createConstructionSite(11,31,STRUCTURE_LAB);

var logger = require('common.logging');
var controller = require('creep.controller');
var workermanager = require('creep.workermanager');
var helper = require('common.helper');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        controller.renewManager(creep);
        
        if (creep.memory.renewing)
        {
            controller.renew(creep);
        } else {
            // if building and energy is empty, don't carry on building
    	    if(creep.memory.working && creep.carry.energy == 0) {
                creep.memory.working = false;
                creep.memory.action = 'harvesting';
    	    }
    	    // If not already building and full of energy, go build
    	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
    	        creep.memory.working = true;
    	        creep.memory.action = 'building';
    	    }
    
            if(creep.memory.working) {
                if (controller.buildextensionsite(creep)) {
                } else if (controller.buildconstructionsitecontainer(creep)) {
                } else if (controller.buildconstructionsite(creep)) {
                } else if (controller.buildroad(creep)) { 
                } else if (controller.buildconstructionsitelab(creep)) { 
                } else if (controller.transferenergytospawn(creep)) { 
                } else if (controller.transferenergytoextension(creep)) {
                } else if (controller.repairroad(creep)) {
                } else {
                    workermanager.upgradecontroller(creep);
                }
            } else {
                controller.harvest(creep);
            }
        }
	}
};

module.exports = roleBuilder;