String.prototype.toNum = function() {
    return parseInt(this);
}

// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

function defaultFor(arg, val) {
    return typeof arg !== 'undefined' ? arg : val;
}

function submitTest() {
    fncstring = $('#testfunction').val();

    var fncname = /^[a-zA-Z0-9]+/.exec(fncstring);
    var args =  /\(([^)]+)/.exec(fncstring);

    fncname = fncname[0];
    if (args !== null)
        args = args[1].split(/\s*,\s*/);

    switch(fncname) {
        case "drawText":
            args[4] = /[^'"]+/.exec(args[4]);
            var e = drawText(args[0], args[1], args[2], args[3], args[4], args[5]);
            break;
        case "drawSensor":
            var e = drawSensor(args[0], args[1], args[2], args[3]);
            break;
        case "addSensor":
            args[2] = /[^'"]+/.exec(args[2]);
            var e = addSensor(args[0], args[1], args[2], args[3]);
            break;
        case "updatePage":
            updatePage();
            break;
        case "addSortableGroup":
            addSortableGroup.call($('.canvas'),
                args[0], args[1], args[2], args[3], args[4], args[5]);
            break;
        default:
            alert('function "' + fncname + '" not defined');
    }

    if (e !== undefined)
        $('.canvas').append(e.outerHTML);

    return;
}

function toggleGrid() {
    var holder = $('.canvas');
    var attr = holder.attr('grid');

    if (typeof attr !== 'undefined' && attr !== false) {
        holder.children('.grid').remove();
        holder.removeAttr('grid');
        return;
    }

    holder.attr('grid', 'grid');
     
    for (var i = 0; i < holder.data('gridSizeX'); i++)
        for(var j = 0; j < holder.data('gridSizeY'); j++)
        {
            var e = newWidget(i, j, 1, 1);
            e.className = 'grid';
            holder.append(e.outerHTML);
        }
    return;
}


/*
 * Sensor List
 */
var urlbase = 'http://katrin.kit.edu/adei/services/getdata.php';
var SNS = {
    'sensor1': {
        id: 'sensorid1',
        name: '200mm from vessel wall',
        comment: '435-RTP-5-0-0103',
        min: 0,
        max: 100,
        unit: 'C',
        url: urlbase + '?db_server={0}&db_name={1}&db_group={2}&db_mask={3}&window=-1'.format(
                'temp0',
                'BakeOut2013',
                'TempMon',
                1),
    },
    'sensor2': {
        id: 'sensorid2',
        name: 'base #2 downstream up right',
        comment: '435-RTP-5-0-0300',
        min: 0,
        max: 100,
        unit: 'C',
        server: 'temp0',
        database: 'BakeOut2013',
        group: 'TempMon',
        mask: 2,
        url: urlbase + '?db_server={0}&db_name={1}&db_group={2}&db_mask={3}&window=-1'.format(
                'temp0',
                'BakeOut2013',
                'TempMon',
                2),
    },
};


function initPage2(sizeX, sizeY) {
    var unit0 = 50;
    var wgt = $(window).width() * 0.96;
    var hgt = ($(window).height()
                - $('.banner').css('height').toNum()
                - $('.footer').css('height').toNum())*0.96;

    var scale1 = wgt/ (sizeX*unit0);
    var scale2 = hgt/ (sizeY*unit0);
    var scale = (scale2 < scale1) ? scale2 : scale1;
    scale = Math.floor(scale*100)/100;

    var margin = ($(window).height()
                - $('.banner').css('height').toNum()
                - $('.footer').css('height').toNum()
                - sizeY * unit0 * scale)/2.;

    $('.canvas').css('margin-top', margin + 'px');
    $('.canvas').css('height', sizeY*unit0*scale + 'px');
    $('.canvas').css('width', sizeX*unit0*scale + 'px');

    $('.canvas').data('gridUnitX', unit0*scale);
    $('.canvas').data('gridUnitY', unit0*scale);
    $('.canvas').data('gridSizeX', sizeX);
    $('.canvas').data('gridSizeY', sizeY);
    $('.canvas').data('scale', scale);

    console.log('gridSize', sizeX, sizeY);
    console.log('unitX/Y', unit0*scale);
    console.log('scale', scale1, scale2, scale);
}

/*
 * Library for Widgets
 */

