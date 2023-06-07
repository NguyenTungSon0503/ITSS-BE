//function to update timestamps because when recieve data from FE and save to database, it's -14 hours compared to the true result
function fixDate(originalDate) {
    var date = new Date(originalDate);
    date.setUTCHours(date.getUTCHours() + 14);
    // console.log(date.setUTCHours(date.getUTCHours() + 7))
    let updatedIsoDate = date.toISOString();
    return updatedIsoDate
}

export default fixDate;