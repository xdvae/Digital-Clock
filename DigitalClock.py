from flask import Flask ,render_template, jsonify,request
import requests
from datetime import datetime
import time
import pytz

app = Flask(__name__)

@app.route('/')
@app.route('/home')
def home():
     return render_template('home.html')
dev_mode = 0 # Dev mode.
old_city = 0
old_zone = "Local"
city = 0
weather = None
@app.route("/get_timzeone_via_ip", methods=['POST'])
def get_timezone_via_IP():
    data = request.get_json()
    my_ip =  data.get('IP')
    print("Function called\nIP: ",my_ip)
    url = f"http://ip-api.com/json/{my_ip}"
    response = requests.get(url)

    if response.status_code == 200:
        global city
        data = response.json()
        city = data['city']
        print("City: ",city)

        formatted_time = {
            "city_name":city
        }
        return formatted_time
    

@app.route('/get_city_time', methods=['POST'])
def get_city_time():
    data = request.get_json()
    city_name = str(data.get('City_name'))
    # print("City Name (GCT): ",city_name)
    # I'll Label this because its a mess below.
    # The city name gets sent to the function GET_TIMEZONE() which returns its timezone name('Asia/Tokyo).
    timezone_object = pytz.timezone(get_timezone(city_name))
    # print("\n\nTimezone Object (GCT): ",timezone_object)
    # This gets the current time from the timezone onject and returns it.
    now = datetime.now(timezone_object)
    # print("Time now (GCT): ",now)
    # print("Hour now (GCT): ",now.strftime("%I"))
    # print("2nd: ",weather)
    formatted_time = {
        "hour": now.strftime("%I"),
        "min": now.strftime("%M"),
        "sec": now.strftime("%S"),
        "am_pm": now.strftime("%p"),
        "current_timezone": get_timezone(city_name),
        "background_selector" : background_selector(now.hour),
        "city":city,
        "condition":weather['current']['condition']['text'],
        "temp":weather['current']['temp_c'],
        "temp_h":weather['forecast']['forecastday'][0]['day']['maxtemp_c'],
        "temp_l":weather['forecast']['forecastday'][0]['day']['mintemp_c']
        #Currently at temp low. TODO: 15/12/24: Make a feels like indicator, fill all the holders with data and Make the auto div generation possible using foreach. 
    }
    
    return formatted_time

def get_timezone(city_name):
    global old_city
    global old_zone
    global weather
    if(city_name != old_city):
        print("Sent New GET_TIMEZONE request to API.")
        old_city = city_name
        # DEVELOPMENT MODE: set the dev_mode var to 0 to work with live cities.
        if(dev_mode == 0):
            # url_1 = f"https://api.opencagedata.com/geocode/v1/json?q=Rua+Cafel%C3%A2ndia%2C+Carapicu%C3%ADba%2C+{city_name}&key=a3556c787c6a451cb1e5507351caf9fb&pretty=1"

            url_2 = f"https://api.weatherapi.com/v1/c/forecast.json?key=fdf65fe5213f4e5287d165833241212&q={city_name}"
            response = requests.get(url_2)
            if response.status_code == 200:

                weather = response.json()  
                # results = data['results'][0]['annotations']['timezone']['name']
                results = weather['location']['tz_id']
                # print(weather)
                old_zone = results
                print("results: ",results)
                return results
            else:
                return "UTC"
        else:
            print("In DEV MODE: no API used.")
            old_zone = "Asia/Kolkata"
            return "Asia/Kolkata"
    else:
        # print("Returned the saved timezone value.")

        return old_zone

def background_selector(hour):
    if(hour >= 5 and hour < 10):
        return "sunrise"
    elif(hour >= 10 and hour < 16):
        return "morning"
    elif(hour >= 16 and hour < 19):
        return "sunset"
    elif(hour >= 19 and hour <= 24) or (hour < 5):
        return "night"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


#TODO: 9/12/24: Rewrite the API code and test it's response in the scratch file before applying in the main file. DONE

#TODO: 13/12/24: When the website is loaded the Current timezone gets set to: Sao Palao, Find and fix the bug. DONE

#TODO: 13/12/24: After fixing The bug above. USE Weather API's api to show weather data. ADD another section for weather. 