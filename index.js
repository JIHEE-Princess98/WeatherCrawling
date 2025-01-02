const http = require('http');
require('dotenv').config();
const pool = require('./db/pool');
const sql = require('./sql/query');
const nodeData = require('./data/node_data');

//데이터 가져오기
const weatherCastServer = async (nows, time) => {

    for (let i = 0; i < nodeData.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));

        let url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${process.env.service_key}&pageNo=1&numOfRows=1000&dataType=json&base_date=${nows}&base_time=${time-1}30&nx=${nodeData[i].sys_net_grid_xpos}&ny=${nodeData[i].sys_net_grid_ypos}`

        fetch(url, {
            method: "GET",
            headers: { 'Content-Type': 'application/json', }
        }).then((res) => { return res.json() }).then(async (res) => {

            if (res.response.header.resultMsg === 'NO_DATA') {
                console.log('no data');
            } else {
                let items = res.response.body.items && res.response.body.items.item;
                items.forEach(async (element) => {
                    let value = [
                        nodeData[i].sys_net_node_id,
                        element.category,
                        element.fcstValue,
                        `${element.baseDate.substring(0, 4)}-${element.baseDate.substring(4, 6)}-${element.baseDate.substring(6, 8)} ${element.baseTime.substring(0, 2)}:${element.baseTime.substring(2, 4)}:00`,
                    ]
                    console.log(value);

                    pool.query(sql.insertWeatherCast, value, function(err, row, fields){
                        if(err) console.log(err);
                        console.log('data insert success!');
                    })
                });
            }

        }).catch((err) => {
            console.log(err);
        });
    }

}

const run = async () => {
    const utcNow = new Date();
    const koreaTime = new Date(utcNow.getTime() + (9 * 60 * 60 * 1000));
    const isoString = koreaTime.toISOString();
    const Nows = isoString.replace("T", " ").substring(0, 10);
    const date = Nows.replaceAll("-", '');
    const Times = isoString.replace("T", " ").substring(11, 13);

    await weatherCastServer(date, Times);
}

run().catch((err) => { console.log(err); });