
(function() {
    
    const dayList = document.getElementById("item_list");
    const url = new URL(window.location.href);
    const habitId = url.searchParams.get("id");
    const startDate = document.getElementById("start_date");
    const endDate = document.getElementById("end_date");
    const searchBtn = document.getElementById("search");

    let currentDate;
    let sixtyDayBefore;

    /*
        This function finds the current date and 
        and finds a date at the range of 60 days

        adds min and max possible dates when page is loaded
    */

    function setMinMAXDateInDatePicker() {
        currentDate = moment().format('YYYY-MM-DD');
        sixtyDayBefore = moment(currentDate).subtract(60, 'days').format('YYYY-MM-DD');

        startDate.setAttribute("max", currentDate);
        endDate.setAttribute("max", currentDate);

        startDate.setAttribute("min", sixtyDayBefore);
        endDate.setAttribute("min", sixtyDayBefore);

        startDate.value = moment(currentDate).subtract(6, 'days').format('YYYY-MM-DD');
        endDate.value = currentDate;

    }

    setMinMAXDateInDatePicker();

    /* Update a perticular date object
        Task = DONE Or NOT DONE
        
        Function parameter 
            - date : pick a perticular date
            - value: update the value to this date
    */

    const updateDateInDB = async function(date, value) {
        const res = await fetch(`/updateDbDate?id=${habitId}&date=${date}&value=${value}`);
        const data = await res.json();
        console.log(data);
    }

    /* Helps in rendering the date list 
        In DB record is stored as Map -> date(key), status(value) 
    */

    const renderDaysList = function(count, record, endDate) {
        let i=0;

        while(i <= count){
            const formatedDate = moment(endDate).subtract(i, 'days').format('LL');
            const date = moment(endDate).subtract(i, 'days').valueOf() + "";
            const listEle = document.createElement("li");
            listEle.setAttribute("class", 'list_item'); // add status
            listEle.setAttribute("id", date);


            const dateDiv = document.createElement("div");
            dateDiv.setAttribute("class", "date_div");
            dateDiv.innerHTML = formatedDate;

            // if this date is current date
            if(moment(endDate).subtract(i, 'days').valueOf() == moment(currentDate).valueOf()) {
                dateDiv.innerHTML += " (TODAY)";
                listEle.style.backgroundColor = "lightGrey";
            }

            const statusDiv = document.createElement("div");
            statusDiv.setAttribute("class", "status");

            if(date in record) {
                console.log(`${date} : ${record[date]}`);

                if(record[date] == '0') {
                    // not done
                    statusDiv.innerHTML = 'NOT DONE';
                    listEle.style.backgroundColor = 'rgb(218, 108, 108)'
                }else if(record[date] == '1') {
                    // done
                    statusDiv.innerHTML = 'DONE';
                    listEle.style.backgroundColor = 'lightgreen'
                }else if(record[date] == '-1') {
                    // Un Marked
                    statusDiv.innerHTML = 'UNMARKED';
                    listEle.style.backgroundColor = 'lightgray'
                }
            }else {
                statusDiv.innerHTML = 'UNMARKED';
                listEle.style.backgroundColor = 'lightgray'
            }

            // when click on list item change color and status of the habit for perticular date
            listEle.onclick = function() {
                let value = 0;
                if (listEle.style.backgroundColor == "lightgray") {
                    statusDiv.innerHTML = 'DONE';
                    listEle.style.backgroundColor = "lightgreen"
                    value = '1';
                }
                else if (listEle.style.backgroundColor == "lightgreen") {
                    statusDiv.innerHTML = 'NOT DONE';
                    listEle.style.backgroundColor = "rgb(218, 108, 108)"
                    value = '0';
                }
                else if (listEle.style.backgroundColor == "rgb(218, 108, 108)") {
                    statusDiv.innerHTML = 'UNMARKED';
                    listEle.style.backgroundColor = "lightgray"
                    value = '-1';
                }

                updateDateInDB(date, value);
            }

            listEle.appendChild(dateDiv);
            listEle.appendChild(statusDiv);

            dayList.appendChild(listEle);
            i++;
        }
    }

    /* Function to fetch habit from DB  */
    const fetchFromDB = async function(id) {
        const res = await fetch(`/fetchHabit?id=${id}`);
        const data = await res.json();

        // console.log(data);
        return data
    }

    /* function to fetch habit details from DB via habitID */
    const renderOnLoad = async function(days, endDate) {
        const data = await fetchFromDB(habitId);
        console.log("jai:",data);
        const record = data.record;
        console.log(record);

        renderDaysList(days, record, endDate);
    }

    
    searchBtn.onclick = function() {
        let currentStartDate = moment(startDate.value);
        let currentEndDate = moment(endDate.value);

        let days = currentEndDate.diff(currentStartDate, 'days');

        if(days < 0) {
            alert("Start date cannot be greater than end date");
            return;
        }

        dayList.innerHTML = "";
        renderOnLoad(days, currentEndDate);
    }

    renderOnLoad(6, currentDate);

})();