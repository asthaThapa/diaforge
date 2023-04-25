var states = [];
var relationshipSet = [];
var counter = 0;
var relCounter = 0;

function changeDiagramTitle() {
    var diagramTitle = $('#title-element').val();
    $('#diagram-title').text(diagramTitle);
}

function addStates() {
    var state = $('#actor-element').val().replace(/\s+/g, '')
    if (state == '' || state == undefined || state == null) {
        alert("Cannot add empty state name")
        $('#actor-element').val('');
        return false
    } else if (state.toLowerCase().includes("state") || state.toLowerCase().includes("stateDiagram-v2")) {
        alert("Please don't use the reserved key word 'state' or 'stateDiagram-v2'. Use any other state name")
        $('#actor-element').val('');
        return false
    } else if (!(states.includes(state))) {
        states.push(state);
        addElementToOption(state,);
        createDiagram();
        addtotable(state);
        $('#actor-element').val('');
    } else {
        alert("You cannot multiple states with same name!")
    }

}


function createDiagram() {

    var diagramScript = getStateDiagram();

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

function getStateDiagram() {

    var stateDiagramScript = 'stateDiagram-v2' + ' ';

    if (relationshipSet.length == 0) {

        for (let i = 0; i < states.length; i++) {
            stateDiagramScript += '\n' + ' ' + states[i] + ' ';
        }

    } else {

        for (let i = 0; i < relationshipSet.length; i++) {
            var from = relationshipSet[i].from

            var to = relationshipSet[i].to
            var message = relationshipSet[i].message

            stateDiagramScript += '\n' + ' ' + from + ' --> ' + to + ' : ' + message;
        }

    }

    console.log(stateDiagramScript)
    return stateDiagramScript

}

//Code reference: (n.d.). Encode Diagrams. Kroki. https://docs.kroki.io/kroki/setup/encode-diagram/#javascript
function getImageLink(diagramScript) {
    var data = textEncode(diagramScript)
    var compressed = pako.deflate(data, { level: 9, to: 'string' })
    var result = btoa(compressed)
        .replace(/\+/g, '-').replace(/\//g, '_')

    return "https://kroki.io/mermaid/svg/" + result
}

function addElementToOption(elementName) {

    $('#from-element').append($('<option>', {
        value: elementName,
        text: elementName
    }));

    $('#to-element').append($('<option>', {
        value: elementName,
        text: elementName
    }));

}

function addtotable(elementName) {
    var cols = '';
    counter++;
    const rowId = 'row_' + counter
    var newRow = $("<tr id=" + rowId + ">");
    cols += '<td class= "ele_name">' + elementName + '</td>';
    cols += "<td class='col-md-3'><button type='button' class='btn'><i class='fa fa-trash' onclick='removeThis(\"" + rowId + "\")'></i></button></td>";
    newRow.append(cols);
    $(".element_table").find("table").append(newRow);
}

function addRelationToTable(from, to, message) {
    var cols = '';
    relCounter++;
    const rowId = 'rel_row_' + relCounter
    var newRow = $("<tr id=" + rowId + ">");
    cols += '<td class= "from">' + from + '</td>';
    cols += '<td class="to">' + to + '</td>';
    cols += '<td class="message">' + message + '</td>';
    cols += "<td class='col-md-3'><button type='button' class='btn'><i class='fa fa-trash' onclick='removeRelation(\"" + rowId + "\")'></i></button></td>";
    newRow.append(cols);
    $(".relation_table").find("table").append(newRow);
}


function addMessage() {
    var fromObj = $('#from-element').val()
    var toObj = $('#to-element').val()
    var message = $('#message-element').val()

    if (fromObj == null || fromObj == '' || fromObj.length <= 0 || fromObj == 'none') {
        alert("Please select a from element!")
        return false;
    }

    if (toObj == null || toObj == '' || toObj.length <= 0 || toObj == 'none') {
        alert("Please select a To element!")
        return false;
    }

    if (message == null || message == '' || message.length <= 0) {
        message = ""
    }


    var newRelation = {
        "from": fromObj,
        "to": toObj,
        "message": message
    }

    if (!(relationshipSet.some(rel => rel.from == fromObj && rel.to == toObj && rel.message == message))) {
        relationshipSet.push(newRelation)
    } else {
        alert("You have already defined this relationship!")
        resetRelation();
        return false
    }

    createDiagram();
    addRelationToTable(fromObj, toObj, message);
    resetRelation();

}

function resetRelation() {
    $('#from-element').val("none")
    $('#to-element').val("none")
    $('#message-element').val('')
}



function removeThis(rowId) {
    var row = $("#" + rowId)
    var elementName = row.find(".ele_name").text()


    states = states.filter(function (state) {
        return state !== elementName;
    });


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

    if (states.length == 0) {
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

