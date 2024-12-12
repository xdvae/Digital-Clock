let Run_Default_Time = 1;
let Run_City_Time = 0;
let Current_city = 0;

function Get_time(){
    
    if(Run_Default_Time == 1){
        Run_City_Time = 0;
        fetch('/gettime') 
        .then(response => response.json()) 
        .then(data => { 
            console.log(data.hour);
            document.getElementById('hour').innerText = data.hour + ':';
            document.getElementById('min').innerText = data.min + ':';
            document.getElementById('sec').innerText = data.sec;
            document.getElementById('am-pm-text').innerText = data.am_pm;
            change_background(data.background_selector);

        });
        setTimeout(Get_time, 1000);

    }
}

let dark_mode = 0;


// function next_time(){
//     console.log("reached here");
//     let background = document.getElementById('screen');
//     let currentPosition = window.getComputedStyle(background).backgroundPosition;

//     if(currentPosition == '-130rem 0px'){
//         background.style.backgroundPosition = '100rem';
//     }
//     else{
//         background.style.backgroundPosition = '-130rem'
//     }
    
// }
// function set_Dark_Mode(){
//     if(dark_mode == 0){
//         dark_mode = 1;
//         document.getElementById('body').style.color = 'white';
//         document.getElementById('body').style.backgroundColor = 'black';
//         document.getElementById('set_Dark_Mode').textContent = 'Set Light Mode';
//         change_btn_class();
//     }
//     else if(dark_mode == 1){
//         dark_mode = 0;
//         document.getElementById('body').style.color = 'black';
//         document.getElementById('body').style.backgroundColor = 'white';
//         document.getElementById('set_Dark_Mode').textContent = 'Set Dark Mode';
//         change_btn_class();
//     }
// }

function change_btn_class(){
    var btn = document.getElementById("set_Dark_Mode");
    if(btn.classList.contains('Dark_mode_btn_1')){
        btn.classList.remove('Dark_mode_btn_1');
        btn.classList.add('Dark_mode_btn_2');
    }
    else{
        btn.classList.remove('Dark_mode_btn_2');
        btn.classList.add('Dark_mode_btn_1');
    }
}
// TODO: Add getlocation to show time in user's current location when they enter the site. : done

function Get_city_time(){
    Run_City_Time = 1;
    if(Run_City_Time == 1){
        Run_Default_Time = 0;
    
        const city_name = Current_city;
        fetch('/get_city_time', {
            method: 'POST',
            headers: 
            { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            City_name: city_name
        })}
    )
        .then(response => response.json()) 
        .then(data => { 
            console.log(data.hour);
            document.getElementById('hour').innerText = data.hour + ':';
            document.getElementById('min').innerText = data.min + ':';
            document.getElementById('sec').innerText = data.sec;
            document.getElementById('am-pm-text').innerText = data.am_pm;
            document.getElementById('current-country-name').innerHTML = "Current Timezone: " + data.current_timezone;
            change_background(data.background_selector);
        });
        setTimeout(Get_city_time, 1000);
    }
}

function change_background(background_selector){
    let background = document.getElementById('screen');

    if(background_selector == "sunrise"){
        background.style.backgroundPosition = "0rem";
        starsEffect.stopStars();
    }
    else if(background_selector == "morning"){
        background.style.backgroundPosition = "-270rem";
        starsEffect.stopStars();
    }
    else if(background_selector == "sunset"){
        background.style.backgroundPosition = "-525rem";
        starsEffect.stopStars()
    }
    else if(background_selector == "night"){
        var hour = document.getElementById("hour");
        var min = document.getElementById("min");
        var sec = document.getElementById("sec");
        var am_pm = document.getElementById("am-pm-text");
        var country_name = document.getElementById("current-country-name");
        background.style.backgroundPosition = "-850rem";
        hour.style.color = "white";
        min.style.color = "white";
        sec.style.color = "white";
        am_pm.style.color = "white";
        country_name.style.color = "white";
        starsEffect.startStars();
    }
}
function update_city_value(){
    Current_city = document.getElementById('search-bar-input').value;
    Get_city_time();
}
window.onload = Get_time;

//Below is the code for stars

