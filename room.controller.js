var helper = require('common.helper');

var roomController = {
    buildRoads: function(room) {
        var structures = room.find(FIND_MY_STRUCTURES);
        var sources = room.find(FIND_SOURCES);
        var places = structures.concat(sources);

        for (var i=0, ilen=places.length; i<ilen; i++)
        {
            for (var j=0, jlen=places.length; i<jlen; i++)
            {
                var path = room.findPath(places[i].pos,places[j].pos, {ignoreCreeps: true});
                for (var point in path)
                {
                    const pos = new RoomPosition(path[point].x, path[point].y, room.name);

                    var whatsHere = helper.whatstructureishere(pos);
                    if (whatsHere != STRUCTURE_ROAD && whatsHere != STRUCTURE_CONTROLLER) {
                        var createResult = room.createConstructionSite(path[point].x,path[point].y,STRUCTURE_ROAD);
                        console.log('Creating Road From:' + places[i].pos + ', To:' + places[j].pos + ',pos:{' + pos + '}, Result:' + helper.createResultToText(createResult)+', WhatHere:' + whatsHere);
                        return;
                    }
                }
            }
        }
    }
}

module.exports = roomController;