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

var GRP = {
    'group1': {
        name: 'Vessel Temperature';
    }


};
