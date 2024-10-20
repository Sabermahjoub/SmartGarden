# ✨ Simple Flask API with MQTT Integration

This repository contains a very simple Flask API that integrates with an MQTT broker to receive and return data in JSON format.

## Dependencies
Flask and MQTT library for connecting with the broker and subscribing to messages
```bash
   pip install Flask paho-mqtt
```
## Running 
Run the application
```
python app.py
```
Example : using the ```hello``` endpoint 
Returns JSON data received from an MQTT topic ```climat```
```
curl localhost:5000/hello
```
## Output
```
{
  "data": "{\"humidity\": 90.5, \"temp\": 45.8}"
}
```