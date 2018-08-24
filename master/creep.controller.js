var logger = require('common.logging');
var helper = require('common.helper');

var creepController = {
    renewManager: function(creep){
        var renewToEnergy = 1100;
        var renewBelowEnergy = 100;
        
        var maxCreepCost = creep.room.energyCapacityAvailable;
        var creepLiveCost = maxCreepCost * 0.85;
        
        if (creep.memory.renewing && creep.ticksToLive > renewToEnergy) {
            creep.memory.renewing = false;
        }
        
        if (!creep.memory.renewing && creep.ticksToLive < renewBelowEnergy && creep.memory.creepCost > creepLiveCost) 
        {
            creep.memory.renewing = true;
        }    
    },
    renew: function(creep){

        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => { return (structure.structureType == STRUCTURE_SPAWN); }
        });
        if (target)
        {
            var renewResult = target.renewCreep(creep);
            if (renewResult == OK)
            {
                creep.memory.action = 'renewing from ' + target.pos;
                return true;
            } else if (renewResult == ERR_NOT_IN_RANGE) {
                creep.memory.action = 'moving to ' + target.pos + ' for renewing';
                this.move(creep,target);
                return true;
            } else if (renewResult == ERR_FULL)
            {
                return false;
            }
        }
        return false;
    },
    transferenergytospawn: function(creep)
    {
        var homeRoom = Game.rooms[creep.memory.roomName];
        var targets = homeRoom.find(FIND_STRUCTURES, {
                filter: (structure) => { return (structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity; }
        });
        
        if(targets.length > 0) {
            var transferResult = creep.transfer(targets[0], RESOURCE_ENERGY);
            if(transferResult == ERR_NOT_IN_RANGE) {
                creep.memory.action = 'transfering to [' + helper.whatstructureishere(targets[0].pos) + ']';
                this.move(creep, targets[0]);
                return true;
            }
        }
        return false;
    },
    transferenergytoextension: function(creep)
    {
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => { return (structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity; }
        });
        
        if(target)
        {
            var transferResult = creep.transfer(target, RESOURCE_ENERGY);
            if(transferResult == ERR_NOT_IN_RANGE) {
                creep.memory.action = 'transfering to structure [' + helper.whatstructureishere(target.pos) + ']';
                this.move(creep, target);
                return true;
            }
        } 
        return false;
    },
    transferenergytotower: function(creep)
    {
        var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => { return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity; }
        });
        
        if(targets.length > 0) {
            var transferResult = creep.transfer(targets[0], RESOURCE_ENERGY);
            if(transferResult == ERR_NOT_IN_RANGE) {
                creep.memory.action = 'transfering to tower [' + helper.whatstructureishere(targets[0].pos) + ']';
                this.move(creep, targets[0]);
                return true;
            }
        } 
        return false;
    },
    buildconstructionsitecontainer: function(creep)
    {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES, {filter: (structure) => {return (structure.structureType == STRUCTURE_CONTAINER);}});
        if(targets.length > 0) {
            var buildResult = creep.build(targets[0]);
            //console.log(creep.name + ' ' + buildResult);
            if(buildResult == OK) {
                //console.log(creep.name + ' building ');
                creep.memory.action = 'building ' + helper.whatstructureishere(targets[0].pos);
                return true;
            } else if (buildResult == ERR_NOT_IN_RANGE) {
                //console.log(creep.name + ' moving ');
                creep.memory.action = 'moving to build ' + helper.whatstructureishere(targets[0].pos);
                this.move(creep,targets[0]);
                return true;
            } 
        }
        return false;
    },
    buildconstructionsitelab: function(creep)
    {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES, {filter: (structure) => {return (structure.structureType == STRUCTURE_LAB);}});
        if(targets.length > 0) {
            var buildResult = creep.build(targets[0]);
            //console.log(creep.name + ' ' + buildResult);
            if(buildResult == OK) {
                //console.log(creep.name + ' building ');
                creep.memory.action = 'building ' + helper.whatstructureishere(targets[0].pos);
                return true;
            } else if (buildResult == ERR_NOT_IN_RANGE) {
                //console.log(creep.name + ' moving ');
                creep.memory.action = 'moving to build ' + helper.whatstructureishere(targets[0].pos);
                this.move(creep,targets[0]);
                return true;
            } 
        }
        return false;
    },
    buildconstructionsite: function(creep)
    {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES, {filter: (structure) => {return (structure.structureType != STRUCTURE_ROAD && structure.structureType != STRUCTURE_LAB);}});
        if(targets.length > 0) {
            var buildResult = creep.build(targets[0]);
            //console.log(creep.name + ' ' + buildResult);
            if(buildResult == OK) {
                //console.log(creep.name + ' building ');
                creep.memory.action = 'building ' + helper.whatstructureishere(targets[0].pos);
                return true;
            } else if (buildResult == ERR_NOT_IN_RANGE) {
                //console.log(creep.name + ' moving ');
                creep.memory.action = 'moving to build ' + helper.whatstructureishere(targets[0].pos);
                this.move(creep,targets[0]);
                return true;
            } 
        }
        return false;
    },
    buildroad: function(creep)
    {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES, {filter: (structure) => {return (structure.structureType == STRUCTURE_ROAD);}});
        if(targets.length > 0) {
            var buildResult = creep.build(targets[0]);
            //console.log(creep.name + ' ' + buildResult);
            if(buildResult == OK) {
                //console.log(creep.name + ' building ');
                creep.memory.action = 'building ' + helper.whatstructureishere(targets[0].pos);
                return true;
            } else if (buildResult == ERR_NOT_IN_RANGE) {
                //console.log(creep.name + ' moving ');
                creep.memory.action = 'moving to build ' + helper.whatstructureishere(targets[0].pos);
                this.move(creep,targets[0]);
                return true;
            } 
        }
        return false;
    },
    buildextensionsite: function(creep)
    {
        var targetsExtensions = creep.room.find(FIND_CONSTRUCTION_SITES, {filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION);}});
        if(targetsExtensions.length) {
            if(creep.build(targetsExtensions[0]) == ERR_NOT_IN_RANGE) {
                creep.memory.action = 'building extension';
                this.move(creep,targetsExtensions[0]);
                return true;
            }
        }
        return false
    },
    repairwall:function(creep)
    {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_WALL) &&
                    structure.hits < structure.hitsMax;
            }
        });
        if(targets.length > 0) {
            targets.sort((a,b) => a.hits - b.hits);
            
            if(creep.repair(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.memory.action = 'repairing ' + helper.whatstructureishere(targets[0].pos);
                this.move(creep,targets[0]);
                return true;
            }
        }
        return false;
    
    },
    repairroad:function(creep)
    {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_ROAD) &&
                    structure.hits < structure.hitsMax;
            }
        });
        if(targets.length > 0) {
            if(creep.repair(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.memory.action = 'repairing ' + helper.whatstructureishere(targets[0].pos);
                this.move(creep,targets[0]);
                return true;
            }
        }
        return false;
    
    },
    repairstructure:function(creep)
    {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax
        });
        
        targets.sort((a,b) => a.hits - b.hits);

        if(targets.length > 0) {
            if(creep.repair(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.memory.action = 'repairing ' + helper.whatstructureishere(targets[0].pos);
                this.move(creep,targets[0]);
                return true;
            }
        }
        return false;
    
    },
    harvest: function(creep)
    {
        var roomName = creep.memory.roomName; // Room where creep spawned
        if (creep.memory.targetRoom) // Target room for creep
        {
            roomName = creep.memory.targetRoom;
        }
        
        var source;
        if (roomName != creep.pos.roomName) {
            var room = Game.rooms[roomName];
            if (!room) {
                room = creep.room;
            }
            var sources = room.find(FIND_SOURCES);
            
            source = sources[0];
        } else {
            source = creep.pos.findClosestByPath(FIND_SOURCES);
        }
        //console.log('Room Energy Source Status: ['+creep.name+']');
        //console.log('Room Energy Source Status: ['+creep.name+']' + source.pos + ' ' + source.energy);
        //var targets = [Game.creeps.John, room.getPositionAt(10,10)];
        // creep.findClosestByPath(FIND_SOURCES,adjacentSources);
        
        var harvestResult = creep.harvest(source);
        if (harvestResult == OK) {
            creep.memory.action = 'harvesting ' + source.pos;
            return true;
        } else if (harvestResult == ERR_NOT_IN_RANGE) {
            creep.memory.action = 'moving to source ' + source.pos;
            this.move(creep,source);
            return true;
        }
        return false;
    },
    spawnAttacker: function(spawnName, creepType)
    {
        this.spawnAttacker(spawnName,creepType,'E6N43');
    },
    spawnAttacker: function(spawnName, creepType, targetRoom)
    {
        console.log(Game.spawns[spawnName]);
        if(!Game.spawns[spawnName].spawning) { 
            var newName = creepType + Game.time;
            var spawnResult = false;
            creepController.spawn(spawnName,'attacker',[MOVE,MOVE,TOUGH,ATTACK,ATTACK,RANGED_ATTACK],[{key:'targetRoom',value:targetRoom}]);
        }
    },
    spawnExplorer: function(spawnName, remoteRoom)
        {
        if(!Game.spawns[spawnName].spawning) { 
            var newName = 'explorer' + Game.time;
            var spawnResult = false;
        
            creepController.spawn(spawnName,'explorer',[MOVE,MOVE,CLAIM,CLAIM,ATTACK],[{key:'targetRoom',value:remoteRoom}]);
        }
    },
    spawnExplorer: function(spawnName, remoteRoom, controllerPos)
        {
        if(!Game.spawns[spawnName].spawning) { 
            var newName = 'explorer' + Game.time;
            var spawnResult = false;
        
            creepController.spawn(spawnName,'explorer',[MOVE,MOVE,CLAIM,CLAIM,ATTACK],[{key:'targetRoom',value:remoteRoom},{key:'controllerPos',value:controllerPos}]);
        }
    },
    spawnWorker: function(spawnName, creepType, remoteRoom)
    {
        if(!Game.spawns[spawnName].spawning) { 
            //console.log('ENTER: creep.controller.spawnWorker');
            var newName = creepType + Game.time;
            var spawnResult = false;
            
            var controllerLevel = Game.spawns[spawnName].room.controller.level;
            // what's the best creep I can create with my level and energy
            var energyAvailable = Game.spawns[spawnName].room.energyAvailable
            var energyCapacity = Game.spawns[spawnName].room.energyCapacityAvailable
            
            if (energyAvailable < 200)
            {
                // we have less than 200 energy, wait for 200 to create minimum creep
                console.log('Not enough energy for basic spawn ['+spawnName+'] of ' + creepType + ' working in '+remoteRoom+' need ' + (200-energyAvailable));
                return ERR_NOT_ENOUGH_ENERGY;
            } 
            else 
            {
                var finished = false;
                var counter = 1;
                var working = [];
                var cancreate = [];
                while (!finished) {
                    for(var i=0;i<counter;i++)
                    {
                        if (creepType == 'healer')
                        {
                            working.push(HEAL);
                        }
                        working.push(WORK);
                        working.push(CARRY);
                        working.push(MOVE);
                    }
                    var creepCost = creepController.bodyCost(working);
                    //console.log('Checking ' + working + ' ' + creepCost);
                    if (creepCost > energyAvailable) {
                        // cant create this creep, exit with pervious creep in memory
                        finished = true;
                        //console.log('Too big, exiting with ' + cancreate);
                    } else {
                        // can create this creep but do we want to?
                        cancreate = working.slice(); // copy working array
                        //console.log('Ok setting cancreate ' + cancreate + ' ' + creepCost);
                    }
                }
                //console.log('How about ' + cancreate);
                if(creepController.testSpawn(spawnName,creepType,cancreate) == OK) {
                    return creepController.spawn(spawnName,creepType,cancreate,[{key:'targetRoom',value:remoteRoom}]);
                }
            }
            //console.log('EXIT: creep.controller.spawnWorker');
        } else 
        {
            return ERR_BUSY;
        }
    },
    bodyCost: function (body) {
        return body.reduce(function (cost, part) {
            return cost + BODYPART_COST[part];
        }, 0);
    },
    testSpawn: function(spawnName,creepType,creepArray)
    {
        return this.spawnbase(spawnName,creepType,creepArray,true);
    },
    spawn:function(spawnName,creepType,creepArray,moreMemory)
    {
        return this.spawnbase(spawnName,creepType,creepArray,false,moreMemory);
    },
    spawnbase: function(spawnNameVar,creepType,creepArray,dryRun,moreMemory)
    {
        var newName = creepType+'_'+Game.time;
        var creepCostParam = creepController.bodyCost(creepArray);
        if (dryRun)
        {
            console.log('Testing new creep ' + creepType + ' {' + creepArray + '} = ' + creepCostParam);
            spawnResult = Game.spawns[spawnNameVar].spawnCreep(creepArray, newName,{dryRun: true});
            console.log('Test Spawn result ' + helper.spawnResultToText(spawnResult));
        } else {
            //console.log('Spawning new creep: ' + creepType + ' at ' + newName + ' {' + creepArray + '}');
            var roomNamevar = Game.spawns[spawnNameVar].room.name;
            //console.log('***********');
            //console.log('Spawning ' + roomNamevar + ' ' + spawnNameVar + ' ' + creepCostParam);
            //console.log('***********');
            if (!(Game.spawns[spawnNameVar].memory.maxCreepCost) || (Game.spawns[spawnNameVar].memory.maxCreepCost < creepCostParam)) {Game.spawns[spawnNameVar].memory.maxCreepCost = creepCostParam;}
            spawnResult = Game.spawns[spawnNameVar].spawnCreep(creepArray, newName, {memory: {role: creepType, creepCost: creepCostParam, roomName: roomNamevar, spawnName: spawnNameVar, working: false, renewing: false}});
            if (spawnResult == OK) {
                for (var mem in moreMemory)
                {
                    Game.creeps[newName].memory[moreMemory[mem].key] = moreMemory[mem].value;
                }
            }
            
            console.log('Spawn result ' + newName + ' ' + helper.spawnResultToText(spawnResult));
        }
        return spawnResult;
    },
    move: function(creep, position) {

        var moveResult = creep.moveTo(position, {visualizePathStyle: {stroke: '#ffffff'}});
        if (moveResult == ERR_NO_PATH) {
            //console.log(creep.name + ' ' + creep.pos.x + ' ' + creep.pos.y);
            //var path = creep.room.findPath(creep.pos,position,{ maxOps: 10000000 });
            //console.log(path);
            //console.log(`Path result was: ${JSON.stringify(path)}`);
        }
        
        creep.memory.destination = position.pos;
        creep.memory.moveresult = helper.moveResultToText(moveResult);
        creep.memory.task = ' ' + creep.memory.action + ' ' + creep.memory.moveresult;
        }
};

module.exports = creepController;