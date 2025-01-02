const query = {
    selectNodeData : `select*from pohang_tp.sys_net_node order by sys_net_node_id`,
    insertWeatherCast: `INSERT INTO pohang_tp.sys_weather_cast ` +
    `(sys_net_node_id, sys_wt_cast_category, sys_wt_cast_value, sys_wt_base_date, sys_wt_fcst_date)` +
    ` VALUES($1, $2, $3, $4, $5);`
}

module.exports = query;