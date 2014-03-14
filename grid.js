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
    testfuncstring = $('#testfunction').val();

    var funcname = /^[a-zA-Z0-9]+/.exec(testfuncstring);
    var args =  /\(([^)]+)/.exec(testfuncstring);
    var fn = window[funcname];

    console.log(funcname, args);
    console.log(fn);
    console.log(typeof fn);

    if (fn == null || typeof fn !== "function") {
        alert('function "' + funcname + '" not defined');
    }

    args = args[1].split(/\s*,\s*/);
    if (args.length < 5) {
        alert('not enough number of parameters');
    }
    for (var i = 0; i < 4; i++) args[i] = args[i].toNum();

    try {
        if (typeof fn === "function") {
            callreturn = fn.apply(null, args);
        }
        $('.canvas').append( callreturn );
    }
    catch (e) {
        console.log(e);
    }
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


function drawGrid() {
    var holder = $('.canvas');
     
    for (var i = 0; i < holder.data('gridSizeX'); i++)
        for(var j = 0; j < holder.data('gridSizeY'); j++)
        {
            var e = newWidget(1, 1, i, j);
            e.className = 'grid';
            holder.append(e.outerHTML);
        }
}


function drawText(dx, dy, posx, posy, str, scale) {
    scale = defaultFor(scale, $('.canvas').data('scale'));
    unitx = $('.canvas').data('gridUnitX');
    unity = $('.canvas').data('gridUnitY');
    
    var left_ = posx * unitx * scale;
    var top_ = posy * unity * scale;
    var sizex_ = dx * unitx * scale;
    var sizey_ = dy * unity * scale;

    var newdiv = "<div class={0} style='left: {1}px; top: {2}px; width: {3}px; height: {4}px'> {5}</div>".format(
            'tile', left_, top_, sizex_, sizey_, str);
    return newdiv;
}
