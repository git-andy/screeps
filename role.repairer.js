var logger = require('common.logging');
var helper = require('common.helper');
var controller = require('creep.controller');
var workermanager = require('creep.workermanager');

var roleRepairer = {
    run: function(creep) {
        controller.renewManager(creep);
        
        if (creep.memory.renewing)
        {
            controller.renew(creep);
        } else {
            // if building and enegy is empty, don't carry on building
    	    if(creep.memory.working && creep.carry.energy == 0) {
                creep.memory.working = false;
                creep.memory.action = 'harvesting'
    	    }
    	    // If not already building and full of energy, go build
    	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
    	        creep.memory.working = true;
    	        creep.memory.action = 'repairing';
    	    }
    	    
    	    if (creep.memory.working) {
    	        if (controller.repairroad(creep)) {
                } else if (controller.repairstructure(creep)) { 
    	        } else if (controller.repairwall(creep)) {    
    	        } else if (controller.buildconstructionsite(creep)) {
                } else { workermanager.upgradecontroller(creep);
                }
            } else {
                controller.harvest(creep);
            }
        }
    }
};

module.exports = roleRepairer;