import time
import paho.mqtt.client as paho
from paho import mqtt
import mysql.connector
import json

# MySQL connection
db = mysql.connector.connect(
    host="localhost",  # Replace with your MySQL host
    user="root",       # Replace with your MySQL username
    password="", # Replace with your MySQL password
    database="gardenpy" # The name of the database you created
)

cursor = db.cursor()

# MQTT event callbacks
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
        # Parse the incoming JSON data
        payload = json.loads(msg.payload.decode())
        temperature = payload['temp']
        humidity = payload['humidity']
        light_percentage = payload['light_percentage']

        print(f"Temperature: {temperature}, Humidity: {humidity}, Light: {light_percentage}%")

        # Insert data into MySQL
        insert_query = "INSERT INTO sensor_data (temperature, humidity, light_percentage) VALUES (%s, %s, %s)"
        cursor.execute(insert_query, (temperature, humidity, light_percentage))
        db.commit()
        print("Data inserted into MySQL")
    
    except (json.JSONDecodeError, KeyError) as e:
        print(f"Error processing message: {e}")

# MQTT Client Setup
client = paho.Client(client_id="pythonmqtt", userdata=None, protocol=paho.MQTTv5)
client.on_connect = on_connect
client.on_publish = on_publish
client.on_subscribe = on_subscribe
client.on_message = on_message

# Enable TLS encryption for the MQTT client
client.tls_set(tls_version=mqtt.client.ssl.PROTOCOL_TLS)

# Set username and password for MQTT connection
client.username_pw_set("garden", "Garden123")

# Connect to MQTT broker
client.connect("5fbcd303cf5d4f4aa437ee13fb50fd99.s1.eu.hivemq.cloud", 8883)

# Subscribe to the topic
client.subscribe("garden/#", qos=0)

# Start the MQTT loop to process messages
client.loop_forever()

# Close MySQL cursor and connection when done
cursor.close()
db.close()
