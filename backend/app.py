from flask import Flask, jsonify
import paho.mqtt.client as paho
from paho import mqtt
import time

app = Flask(__name__)
received_data = None

# Callback to handle incoming messages
def on_message(client, userdata, message):
    global received_data
    received_data = message.payload.decode()

@app.route('/hello', methods=['GET'])
def hello():
    client = paho.Client(client_id="pythonmqtt", userdata=None, protocol=paho.MQTTv5)
    client.on_message = on_message
    client.tls_set(tls_version=mqtt.client.ssl.PROTOCOL_TLS)
    client.username_pw_set("domotique", "Domotique123")
    client.connect("5fbcd303cf5d4f4aa437ee13fb50fd99.s1.eu.hivemq.cloud", 8883)
    client.subscribe("domotique/#")
    client.loop_start()

    global received_data
    received_data = None  # Reset received data each time the endpoint is called

    # Wait for a message with a timeout to avoid blocking forever
    timeout = 10  # Wait for up to 10 seconds
    start_time = time.time()

    while received_data is None and time.time() - start_time < timeout:
        time.sleep(0.1)  # Sleep for a short period to avoid excessive CPU usage

    client.loop_stop()  # Stop the loop once done

    if received_data:
        return jsonify({'data': received_data})
    else:
        return jsonify({'message': 'No data received yet or timeout reached'})

if __name__ == '__main__':
    app.run(debug=True)
