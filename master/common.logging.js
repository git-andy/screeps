var helper = require('common.helper');

var logger = {
    logroomstatus : function() {
        for(var name in Game.rooms) {
            var controllerLevel = Game.rooms[name].controller.level;
            
            
            
            console.log('ROOM: {Room: '+name+
                ',Energy:'+Game.rooms[name].energyAvailable+'/'+Game.rooms[name].energyCapacityAvailable+
                ',Minerals:'+
                ',Controller_Level:'+controllerLevel+
                ',Upgrade_Status:' + Game.rooms[name].controller.progress +'/'+Game.rooms[name].controller.progressTotal+
                ',Percentage:'+parseFloat((Number(Game.rooms[name].controller.progress)*100/Number(Game.rooms[name].controller.progressTotal)).toFixed(2))+
                '}');
            var allowedExtensions = CONTROLLER_STRUCTURES['extension'][controllerLevel];
            var currentExtensions = Game.rooms[name].find(FIND_STRUCTURES, { filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION);}}).length;
            
            var constructionSites = Game.rooms[name].find(FIND_CONSTRUCTION_SITES).length
            console.log('ROOM: {Room: '+name+',Constructions:{Extensions:' + currentExtensions + '/' + allowedExtensions+',ConstructionSites:'+constructionSites+'/100}}');
        } 
        for (var spawn in Game.spawns){
            var remainTime = 0;
            var totalTime = 0;
            if (Game.spawns[spawn].spawning)
            {
                remainTime = Game.spawns[spawn].spawning.remainingTime;
                totalTime = Game.spawns[spawn].spawning.needTime;
            }
            var spawnMessage = 'SPAWN: {Room: '+Game.spawns[spawn].room.name+
            ', spawn:'+spawn+
            ', maxCreepCost:' +Game.spawns[spawn].memory.maxCreepCost
            if (Game.spawns[spawn].spawning) {
                spawnMessage += ', spawning:' + Game.spawns[spawn].spawning.name
            }
            spawnMessage +=', spawnstaus:'+remainTime+'/'+totalTime+'}';
            console.log(spawnMessage);
        }   
    },
    logcreepdata : function(creep)
    {
        console.log('CREEP: {name:'+creep.name +
            ', working:'+creep.memory.working +
            //', renewing:'+creep.memory.renewing +
            ', ticksToLive:'+creep.ticksToLive +
            //', fatigue:'+creep.fatigue +
            //, energy:'+ creep.carry.energy + '/' + creep.carryCapacity +
            ', resource:'+ _.sum(creep.carry) + '/' + creep.carryCapacity +
            ', creepCost:'+creep.memory.creepCost + 
            ', roomName (homeRoom):'+creep.memory.roomName +
            ', targetRoom:'+creep.memory.targetRoom +
            //', position:' + creep.pos +
            ', task:'+ creep.memory.task+
            '}');
    },
    logconstructionsites : function(roomName) {
        for (var siteName in Game.constructionSites) {
            this.logconstructionsite(siteName, Game.constructionSites[siteName],roomName);
        }
    },
    logconstructionsite : function(siteName, constuctionsite, roomName)
    {
        if (constuctionsite.pos.roomName == roomName) {
            console.log('CONSTRUCTION SITE: '+siteName+' '+ constuctionsite.structureType  + ' ' +constuctionsite.pos+': '+constuctionsite.progress+'/'+constuctionsite.progressTotal);
            /*
            if (constuctionsite.structureType == STRUCTURE_ROAD)
            {
                   console.log('Delete... ' + constuctionsite.pos);
                   constuctionsite.remove();
            }
            */
        }
    },
    logstructures: function() {
        for (var structureName in Game.structures) {
            this.logstructure(structureName);
        }      
    },
    logstructure: function(structureName){
        console.log('STRUCTURE: '+Game.structures[structureName].structureType+'('+Game.structures[structureName].id+') '+Game.structures[structureName].pos+' : '+Game.structures[structureName].energy+'/'+Game.structures[structureName].energyCapacity);
    },
    logwhatsatthislocation: function(gameposition)
    {
        var result = '';
        //console.log('Terrain at ' + gameposition + ' ');
        gameposition.look().forEach(function(square) {
            //console.log(square.type);
            if (square.type == 'structure') {
                //console.log('  ' + square.structure.structureType);
                result = square.structure.structureType;
            }
            if (square.type == 'terrain') {
                //console.log('  ' + square.terrain);
            }
        });
        
        return result;
    },
    log: function(functionName, message)
    {
        console.log(functionName+': ' + message);
    }
};

module.exports = logger;