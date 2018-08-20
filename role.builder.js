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
    
            // Priority
            // Build Construction site Structure Extension
            // Build Constriction site Structure (Any)
            // Transfer Energy to Extension or Spawn
            // Repair Road
            
            // Harvest
    
    
            if(creep.memory.working) {
                //console.log(creep.name + ' working ' + creep.memory.working);
                if (controller.buildextensionsite(creep)) {
                //    console.log(creep.name + ' buildextensionsite');
                } else if (controller.buildconstructionsitecontainer(creep)) {
                } else if (controller.buildconstructionsite(creep)) {
                //    console.log(creep.name + ' buildconstructionsite');
                } else if (controller.buildroad(creep)) { 
                } else if (controller.transferenergytospawn(creep)) { 
                //        console.log(creep.name + ' transferenergytospawn');
                } else if (controller.transferenergytoextension(creep)) {
                //        console.log(creep.name + ' transferenergytoextension');
                } else if (controller.repairroad(creep)) {
                //    console.log(creep.name + ' repairroad');
                } else {
                    workermanager.upgradecontroller(creep);
                }
            } else {
                //console.log(creep.name + ' harvesting ' + creep.memory.working);
                controller.harvest(creep);
            }
        }
	}
};

module.exports = roleBuilder;