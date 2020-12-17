exports.entryParser = function (entry){
    var attributes = {};
    for (let i = 0; i < entry.attributes.length; i++) {
        var attribute = entry.attributes[i]._vals;
        attributes[entry.attributes[i].type] = attribute.toString('utf8');
    }
    const { dn } = entry.object
    const entryParsered = {
        attributes,
        dn
    }
    
    console.log(entryParsered)
    return entryParsered;
}