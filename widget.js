function newWidget(px, py, dx, dy, scale) {
    var e = document.createElement('div');
    var holder = $('.canvas');

    scale = defaultFor(scale, holder.data('scale'));
    e.dataset.scale = scale;

    e.style.left = px * holder.data('gridUnitX') + 'px';
    e.style.top  = py * holder.data('gridUnitY') + 'px';
    e.style.width   = dx * holder.data('gridUnitX') + 'px';
    e.style.height  = dy * holder.data('gridUnitY') + 'px';

    return e;
}

function sensorTemplate(e) {
    var scale = e.dataset.scale;

    var s0 = document.createElement('div');
    s0.style.position = 'absolute';
    s0.style.fontSize = 18*scale + 'px';
    s0.style.left = 5*scale + 'px';
    s0.innerHTML = this.name;
    s0.innerHTML += '<br>' + this.comment;
 
    var s1 = document.createElement('div');
    s1.id = this.id;
    s1.style.position = 'absolute';
    s1.style.fontSize = 60*scale + 'px';
    s1.style.right = 6*scale + 'px';
    s1.style.bottom = 0*scale + 'px';
    s1.innerHTML = (this.value === undefined)
        ? 'NAN'
        : this.value.toFixed(1);

    var s2 = document.createElement('div');
    s2.style.position = 'absolute';
    s2.style.fontSize = 12*scale + 'px';
    s2.style.right = 5*scale + 'px';
    s2.style.top = 20*scale + 'px';
    s2.innerHTML = this.unit;

    e.appendChild(s0);
    e.appendChild(s1);
    e.appendChild(s2);
}

function sensorFetchData1() {
    var id = this.id;
    $.get(this.url, function(data) {
        var arrayOfData = data.split(',');
        var value = parseFloat(
                arrayOfData[arrayOfData.length-1]
                ).toFixed(1);
        $('#'+id).html(value);
    });
}

function sensorFetchData() {
    var sensor = this;
    $.get(sensor.url, function(data) {
        var arrayOfData = data.split(',');
        var value = parseFloat(
                arrayOfData[arrayOfData.length-1]);
        sensor.value = value;
    });
}


function addSensor(px, py, sensorId, scale) {
    var e = newWidget(px, py, 5, 3, scale);
    e.className = 'tile';
    drawSensor = sensorTemplate.bind(SNS[sensorId]);
    drawSensor(e);
    return e;
}

function updateSensor(sensor) {
    var fetch = sensorFetchData.bind(sensor);
    fetch();
}

function updateAllSensors() {
    for (var key in SNS) {
        sensor = SNS[key];
        updateSensor(sensor);
        var value = (sensor.value === undefined)
            ? 'NAN'
            : sensor.value;
        $('#'+sensor.id).html(value.toFixed(3));
    }
}

function drawMeter(e) {
    var scale = e.dataset.scale;

}


function addMeter(px, py, sensorId, scale) {
    var e = newWidget(px,py,8,8,scale);
    return e;
}


function addSortableGroup(px, py, dx, dy, groupId, scale) {
    var w = newWidget(px, py, dx, dy, scale);
    w.className = 'group';
    
    var c = document.createElement('div');
    c.className = 'sortable';

    for (var i=0; i<10; i++) {
        var t = newWidget(0, 0, 2, 2, scale);
        t.className = 'subtile';
        t.innerHTML = i;
        $(c).append($(t));
    }

    $(w).append($(c));
    $(w).appendTo($(this));
}
