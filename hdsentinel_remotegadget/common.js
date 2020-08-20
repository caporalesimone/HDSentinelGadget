//thanks to DanRollins for the original version of this function
function resize(sElemId, widthAdd, heightAdd) {
    document.body.leftMargin = 0;
    document.body.topMargin = 0;
    var oElem = document.getElementById(sElemId);
    var nHigh = oElem.offsetHeight + heightAdd;
    var nWide = oElem.offsetWidth + widthAdd;
    document.body.style.height = nHigh;
    document.body.style.width = nWide;
}