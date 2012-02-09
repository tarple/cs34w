var Calc= (function (){
    //first percentage 5%, second percentage 10%
    var fstMark = 5, sndMark = 10, totalCost, discountAmt;
    var defaultUrl = 'http://localhost/post/', defaultTime = 5, timer;
    var live = false, result; // set to true if server is on


    //private function to calculate discount
    var calcDiscount = function (cost) {
        if (cost >= 5000 && cost <= 9999)
            return (cost / 100) * fstMark;
        else if (cost >= 10000)
            return (cost / 100) * sndMark;
    };

    var saveResult = function (result) {
        localStorage.setItem('tCost',result);

        if(navigator.onLine && live) {
            smartSync(result,defaultTime,successCallback)
        }
    }

    var successCallback = function () {
        timer = null; // clear the timer object
        console.log("Success : Data successfully synced " + new Date().getDate());
    }

    var smartSync = function (result,sec,callback) {

        //if the timer is not null, which means the sync is not yet complete
        //clear the timer and recreate the timer object with the up to date value
        if(timer!=null)
            clearTimeout(timer);

        timer = setTimeout(doSync({
            url : defaultUrl,
            data : result,
            success:callback}),1000*sec)

    }

    //ajax method for syncing data with the server
    var doSync = function (obj) {
        $.ajax({
            type: 'POST',
            url: obj.url,
            data: obj.data,
            success: obj.success,
            dataType: 'json'
        });
    }

    return {
        //function to calculate total cost of tickets
        calculateCost : function () {
            display.value=""; //clear display
            totalCost = (txtAdultCount.valueAsNumber * 1000) + (txtChildCount.valueAsNumber * 500);
            discountAmt = (totalCost < 5000) ? 0 : calcDiscount(totalCost);
            result = totalCost + discountAmt;
            total.value = result;
            saveResult(result);

            if(totalCost >= 9500 && totalCost < 10000) {
                display.value = 'Purchases over $10,000 gives you a 10% discount!';
                return;
            }
        }

    }
})();


window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
        window.applicationCache.swapCache();
        if (confirm('A new version of this site is available. Load it?')) {
            window.location.reload();
        }
    }
}, false);