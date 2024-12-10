import time
import paho.mqtt.client as paho
from paho import mqtt
import mysql.connector
import json

db = mysql.connector.connect(
    host="localhost", 
    user="root",       
    password="", 
    database="gardenpy" 
)

cursor = db.cursor()

def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print("Connected successfully")
    else:
        print("Connection failed with code %s." % rc)

def on_publish(client, userdata, mid, properties=None):
    print("Message published, mid: " + str(mid))

def on_subscribe(client, userdata, mid, granted_qos, properties=None):
    print("Subscribed with mid: " + str(mid) + " and QoS: " + str(granted_qos))

def on_message(client, userdata, msg):
    print(f"Received message on topic {msg.topic} with QoS {msg.qos} and payload {msg.payload.decode()}")

    try:
        payload = json.loads(msg.payload.decode())
        temperature = payload['temp']
        humidity = payload['humidity']
        light_percentage = payload['light_percentage']
        moisture = payload['moisture']
        

        print(f"Temperature: {temperature}, Humidity: {humidity}, Light: {light_percentage}%, Soil Moisture: {moisture}%")

        insert_query = "INSERT INTO sensor_data (temperature, humidity, light_percentage,moisture) VALUES (%s, %s, %s,%s)"
        cursor.execute(insert_query, (temperature, humidity, light_percentage,moisture))
        db.commit()
        print("Data inserted into MySQL")
    
    except (json.JSONDecodeError, KeyError) as e:
        print(f"Error processing message: {e}")

client = paho.Client(client_id="pythonmqtt", userdata=None, protocol=paho.MQTTv5)
client.on_connect = on_connect
client.on_publish = on_publish
client.on_subscribe = on_subscribe
client.on_message = on_message

client.tls_set(tls_version=mqtt.client.ssl.PROTOCOL_TLS)

client.username_pw_set("garden", "Garden123")

client.connect("5fbcd303cf5d4f4aa437ee13fb50fd99.s1.eu.hivemq.cloud", 8883)

client.subscribe("garden/#", qos=0)

client.loop_forever()

cursor.close()
db.close()
