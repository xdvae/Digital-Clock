let Run_Default_Time = 1;
let Run_City_Time = 0;
let Current_city = 0;
let ip = 0;

function fetch_ip_and_location(){
    console.log("Started step - 1: Fetching IP");
    let ip = 0;
    fetch("https://api.ipify.org?format=json")
    .then(response => response.json())
    .then(data => {
        ip = data.ip;
        console.log("IP: ",ip);
    

    if(ip != 0){
        console.log("Entered if statement. Sending Req to flask.");
        fetch("/get_timzeone_via_ip", {
            method: 'POST',
            headers: 
            { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "IP" : ip
        })}
    ) 
    .then(response => response.json()) 
    .then(data => { 

        Current_city = data.city_name;
        console.log("City Name: "+Current_city)
        Get_city_time()

    });
    }
})}

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
            document.getElementById('current-country-name').innerHTML = "Current Timezone: " + data.current_timezone + " |   Current City: "+Current_city;
            change_background(data.background_selector);
            document.getElementById("condition").innerHTML = data.condition;
            document.getElementById("temp").innerHTML = data.temp+" °C";
            document.getElementById("temp_hl").innerHTML =" High: "+ data.temp_h +"°C | Low: "+ data.temp_l +"°C";
        });
        setTimeout(Get_city_time, 1000);
    }
}

function change_background(background_selector){
    let background = document.getElementById('screen');

    if(background_selector == "sunrise"){
        background.style.backgroundPosition = "0rem";

    }
    else if(background_selector == "morning"){
        background.style.backgroundPosition = "-270rem";

    }
    else if(background_selector == "sunset"){
        background.style.backgroundPosition = "-525rem";

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

    }
}
function update_city_value(){
    Current_city = document.getElementById('search-bar-input').value;
    Get_city_time();
}
function SwitchTabs(){
    let Element_1 = document.getElementById('Show-Time-Button');
    let Element_2 = document.getElementById('Show-Weather-Button');
    let clock = document.getElementById('clock');
    let Weather = document.getElementById('Weather');

    if(Element_1.classList.contains('nav-btn-active')){

        Element_1.classList.remove('nav-btn-active')
        Element_2.classList.remove('nav-btn-inactive')

        Element_2.classList.add('nav-btn-active')
        Element_1.classList.add('nav-btn-inactive')

        clock.style.display = "none";
        Weather.style.display = "flex";
        
    }
    else{
        Element_1.classList.remove('nav-btn-inactive')
        Element_2.classList.remove('nav-btn-active')

        Element_2.classList.add('nav-btn-inactive')
        Element_1.classList.add('nav-btn-active')

        clock.style.display = "block";
        Weather.style.display = "none";
        
    }
}
window.onload = fetch_ip_and_location();



