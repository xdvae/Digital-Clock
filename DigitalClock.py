from flask import Flask ,render_template, jsonify,request
import requests
from datetime import datetime
import pytz

app = Flask(__name__)

@app.route('/')
@app.route('/home')
def home():
     return render_template('home.html')

old_city = 0
old_zone = "Local"

@app.route('/get_city_time', methods=['POST'])
def get_city_time():
    data = request.get_json()
    city_name = str(data.get('City_name'))
    city_name = city_name.lower()
    city_name = city_name.capitalize()
    city_timezone = get_timezone(city_name)
    timezone = pytz.timezone(city_timezone)
    print(city_timezone)
    now = datetime.now(timezone)
    # print(now.hour)
    formatted_time = {
        "hour": now.strftime("%I"),
        "min": now.strftime("%M"),
        "sec": now.strftime("%S"),
        "am_pm": now.strftime("%p"),
        "current_timezone": city_timezone,
        "background_selector" : background_selector(now.hour)
    }
    return formatted_time

def get_timezone(city_name):
    global old_city
    global old_zone
    if(city_name != old_city):
        old_city = city_name
        url = f"https://api.opencagedata.com/geocode/v1/json?q=Rua+Cafel%C3%A2ndia%2C+Carapicu%C3%ADba%2C+{city_name}&key=a3556c787c6a451cb1e5507351caf9fb&pretty=1"

        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()  

            results = data['results'][0]['annotations']['timezone']['name']
            old_zone = results
            
            return results
        else:
            return "UTC"
    else:
        print("returned old")
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

@app.route('/gettime')
def gettime():
    # time.sleep(1)
    now = datetime.now()
    print(now.hour)
    formatted_time = {
        "hour": now.strftime("%I"),
        "min": now.strftime("%M"),
        "sec": now.strftime("%S"),
        "am_pm": now.strftime("%p"),
        "current_timezone": "Local",
        "background_selector" : background_selector(now.hour)
    }

    return jsonify(formatted_time)
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


#TODO: 9/12/24: Rewrite the API code and test it's response in the scratch file before applying in the main file. 