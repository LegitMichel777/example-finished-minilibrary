export function getGeneralTimeOfDayDescription() {
    let date = new Date();
    let time = date.getHours()*60+date.getSeconds();

    if (time < 11*60+30) {
        return "上午";
    }
    if (time < 13*60+30) {
        return "中午";
    }
    if (time < 18*60) {
        return "下午";
    }
    return "晚上";
}