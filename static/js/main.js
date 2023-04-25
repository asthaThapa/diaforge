var actors = [];
var objectElement = [];
var relationshipSet = [];
var counter = 0;
var relCounter = 0;

function changeDiagramTitle() {
    var diagramTitle = $('#title-element').val();
    $('#diagram-title').text(diagramTitle);
}

function addActors() {
    var actor = $('#actor-element').val();
    if (actor == '' || actor == undefined || actor == null) {
        alert("Cannot add empty actor name")
        $('#actor-element').val('');
        return false
    } else if (actor.toLowerCase().includes("actor") || actor.toLowerCase().includes("participant")) {
        alert("Please don't use the reserved key word 'actor' or 'participant'. Use any other actor name")
        $('#actor-element').val('');
        return false
    } else if (!(actors.includes(actor) || objectElement.includes(actor))) {
        actors.push(actor);
        addElementToOption(actor, 'actor_');
        createDiagram();
        addtotable(actor, 'Actor');
        $('#actor-element').val('');
    } else {
        alert("You cannot multiple actors with same name or let object and actors have same name!")
    }

}

function addObjectElements() {
    var objectEl = $('#object-element').val();
    if (objectEl == '' || objectEl == undefined || objectEl == null) {
        alert("Cannot add empty object name")
        return false
        $('#object-element').val();
    } else if (objectEl.toLowerCase().includes("actor") || objectEl.toLowerCase().includes("participant")) {
        alert("Please don't use the reserved key word 'actor' or 'participant'. Use any other object name")
        $('#actor-element').val('');
        return false
    } else if (!(objectElement.includes(objectEl) || actors.includes(objectEl))) {
        objectElement.push(objectEl);
        createDiagram();
        addElementToOption(objectEl, 'object_');
        addtotable(objectEl, 'Object');
        $('#object-element').val('');
    }
    else {
        alert("You cannot  multiple objects with same name or let object and actors have same name!")
    }
}

function createDiagram() {

    var diagramScript = getSequenceDiagramScript();

    var imageLink = getImageLink(diagramScript);

    console.log(imageLink)

    $('.diagram-area').html('');

    $('.diagram-area').html("<img id='theImg' src='" + imageLink + "'/>");

}

function textEncode(str) {
    if (window.TextEncoder) {
        return new TextEncoder('utf-8').encode(str);
    }
    var utf8 = unescape(encodeURIComponent(str));
    var result = new Uint8Array(utf8.length);
    for (var i = 0; i < utf8.length; i++) {
        result[i] = utf8.charCodeAt(i);
    }
    return result;
}

function getSequenceDiagramScript() {

    var seqDiagramScript = 'sequenceDiagram' + ' ';

    for (let i = 0; i < actors.length; i++) {
        seqDiagramScript += '\n' + ' actor ' + actors[i] + ' ';
    }

    for (let i = 0; i < objectElement.length; i++) {
        seqDiagramScript += '\n' + ' participant ' + objectElement[i] + ' ';
    }

    for (let i = 0; i < relationshipSet.length; i++) {
        var from = relationshipSet[i].from
        var to = relationshipSet[i].to
        var message = relationshipSet[i].message
        var relation = relationshipSet[i].messageRel
        seqDiagramScript += '\n' + ' ' + from + ' ' + relation + ' ' + to + ' : ' + message;
    }

    console.log(seqDiagramScript)
    return seqDiagramScript

}

//Code reference: (n.d.). Encode Diagrams. Kroki. https://docs.kroki.io/kroki/setup/encode-diagram/#javascript
function getImageLink(diagramScript) {

    var data = textEncode(diagramScript)
    var compressed = pako.deflate(data, { level: 9, to: 'string' })
    var result = btoa(compressed)
        .replace(/\+/g, '-').replace(/\//g, '_')

    return "https://kroki.io/mermaid/svg/" + result
}

function addElementToOption(elementName, type) {

    $('#from-element').append($('<option>', {
        value: elementName,
        text: elementName
    }));

    $('#to-element').append($('<option>', {
        value: elementName,
        text: elementName
    }));

}

function addtotable(elementName, elementType) {
    var cols = '';
    counter++;
    const rowId = 'row_' + counter
    var newRow = $("<tr id=" + rowId + ">");
    cols += '<td class= "ele_name">' + elementName + '</td>';
    cols += '<td class="ele_type">' + elementType + '</td>';
    cols += "<td class='col-md-3'><button type='button' class='btn'><i class='fa fa-trash' onclick='removeThis(\"" + rowId + "\")'></i></button></td>";
    newRow.append(cols);
    $(".element_table").find("table").append(newRow);
}


function addRelationToTable(from, to, relationType, message) {
    debugger
    var cols = '';
    relCounter++;
    const rowId = 'rel_row_' + relCounter
    var relationDesc = getRelationDescription(relationType)
    var newRow = $("<tr id=" + rowId + ">");
    cols += '<td class= "from">' + from + '</td>';
    cols += '<td class="to">' + to + '</td>';
    cols += '<td class="relationType">' + relationDesc + '</td>';
    cols += '<td class="message">' + message + '</td>';
    cols += "<td class='col-md-3'><button type='button' class='btn'><i class='fa fa-trash' onclick='removeRelation(\"" + rowId + "\")'></i></button></td>";
    newRow.append(cols);
    $(".relation_table").find("table").append(newRow);
}



function addMessage() {
    var fromObj = $('#from-element').val()
    var toObj = $('#to-element').val()
    var relation = $('#relationship-element').val()
    var message = $('#message-element').val()

    if (fromObj == null || fromObj == '' || fromObj.length <= 0 || fromObj == 'none') {
        alert("Please select a from element!")
        return false;
    }

    if (toObj == null || toObj == '' || toObj.length <= 0 || toObj == 'none') {
        alert("Please select a To element!")
        return false;
    }

    if (relation == null || relation == '' || relation.length <= 0 || message == 'none') {
        alert("Please select a relationship!")
        return false;
    }

    if (message == null || message == '' || message.length <= 0) {
        alert("Please select write a message for the relationship!")
        return false;
    }

    var messageRel = getRelation(relation)

    var newRelation = {
        "from": fromObj,
        "to": toObj,
        "messageRel": messageRel,
        "message": message
    }

    if (!(relationshipSet.some(rel => rel.from == fromObj && rel.to == toObj && rel.message == message && rel.messageRel == messageRel))) {
        relationshipSet.push(newRelation)
    } else {
        alert("You have already defined this relationship!")
        resetRelation();
        return false
    }

    createDiagram();
    addRelationToTable(fromObj, toObj, messageRel, message);
    resetRelation();

}

function resetRelation() {
    $('#from-element').val("none")
    $('#to-element').val("none")
    $('#relationship-element').val("none")
    $('#message-element').val('')
}

function getRelation(messageType) {
    returnType = ''
    switch (messageType) {
        case "sync_message": case "Synchronous":
            returnType = "->>"
            break;
        case "async_message": case "Asynchronous":
            returnType = "-)"
            break;
        case "sync_reply": case "Synchronous Reply":
            returnType = "-->>";
            break;
        case "async_reply": case "Asynchronous Reply":
            returnType = "--)";
            break;
        default:
            returnType = "->>";
            break;
    }

    return returnType
}


function getRelationDescription(messageType) {
    returnType = ''
    switch (messageType) {
        case "->>":
            returnType = "Synchronous"
            break;
        case "-)":
            returnType = "Asynchronous"
            break;
        case "-->>":
            returnType = "Synchronous Reply";
            break;
        case "--)":
            returnType = "Asynchronous Reply";
            break;
        default:
            returnType = "Synchronous";
            break;
    }

    return returnType
}


function removeThis(rowId) {
    var row = $("#" + rowId)
    var elementType = row.find(".ele_type").text()
    var elementName = row.find(".ele_name").text()

    if (elementType == "Actor") {
        actors = actors.filter(function (actor) {
            return actor !== elementName;
        });
    } else if (elementType == "Object") {
        objectElement = objectElement.filter(function (objectEle) {
            return objectEle !== elementName;
        });
    }

    relationshipSet = relationshipSet.filter(obj => obj.from != elementName && obj.to != elementName);

    $(".relation_table").find('table > tbody  > tr').each(function (index, tr) {
        var row = $('#' + tr.id)
        var from = row.find(".from").text()
        var to = row.find(".to").text()

        if (from == elementName || to == elementName) {
            $(this).remove();
        }
    });

    removeElementfromOption(elementName);

    if (actors.length == 0 && objectElement.length == 0) {
        counter = 0
    }

    if (relationshipSet.length == 0) {
        relCounter = 0
    }

    row.remove()
    createDiagram()
}


function removeRelation(rowId) {
    var row = $("#" + rowId)
    var from = row.find(".from").text()
    var to = row.find(".to").text()
    var relationType = getRelation(row.find(".relationType").text())
    var message = row.find(".message").text()

    debugger
    relationshipSet = relationshipSet.filter(obj => obj.from != from && obj.to != to && obj.message != message && obj.messageRel != relationType);

    if (relationshipSet.length == 0) {
        relCounter = 0
    }

    row.remove()
    createDiagram()
}

function removeElementfromOption(elementName) {

    $("#from-element option[value='" + elementName + "']").remove();

    $("#to-element option[value='" + elementName + "']").remove();

}
