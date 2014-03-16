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
    args = args[1].split(/\s*,\s*/);
    console.log(fncname, args);

    /*
    if (args.length < 5) {
        alert('not enough number of parameters');
        return;
    }
    */

    /*
    for (var i = 0; i < 4; i++) 
            args[i] = args[i].toNum();
            */
    args[4] = /[^'"]+/.exec(args[4]);

    console.log(args[5]);
    console.log(fncname);

    switch(fncname) {
        case "drawText":
            var e = drawText(args[0], args[1], args[2], args[3], args[4], args[5]);
            break;
        case "drawSensor":
            var e = drawSensor(args[0], args[1], args[2], args[3]);
            break;
        default:
            alert('function "' + fncname + '" not defined');
    }

    if (e !== 'undefined')
        $('.canvas').append(e.outerHTML);

    return;
}

/*
 * Library for Widgets
 */
function newWidget(dx, dy, posx, posy, scale) {
    var holder = $('.canvas');

    scale = defaultFor(scale, holder.data('scale'));
    var e = document.createElement('div');

    e.style.left = posx * holder.data('gridUnitX') * scale + 'px';
    e.style.top  = posy * holder.data('gridUnitY') * scale + 'px';
    e.style.width   = dx * holder.data('gridUnitX') * scale + 'px';
    e.style.height  = dy * holder.data('gridUnitY') * scale + 'px';

    return e;
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
            var e = newWidget(1, 1, i, j);
            e.className = 'grid';
            holder.append(e.outerHTML);
        }
    return;
}


function drawText(dx, dy, posx, posy, str, scale) {
    //scale = defaultFor(scale, $('.canvas').data('scale'));
    var e = newWidget(dx, dy, posx, posy);
    e.className = 'tile';
    e.innerHTML = str;
    return e;
}

function drawSensor(posx, posy, sensorid, scale) {
    var e = newWidget(4, 3, posx, posy);
    sensorname = 'sensor name';
    sensorvalue = 86;
    e.className = 'tile';
    var str =  '<div style="font-size: 10px; float: left">{0}</div>'.format(sensorname);
    str += '<div style="positon: absolute; top: 50; right: 10; font-size: 50px">{0}</div>'.format(sensorvalue);

    e.innerHTML = str;
    
    return e;
 
}
