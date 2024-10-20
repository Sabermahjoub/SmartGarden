from flask import Flask, jsonify
import paho.mqtt.client as paho
from paho import mqtt
#very simple flask api
app = Flask(__name__)
received_data = None

# curl localhost:5000/hello
def on_message(client, userdata, message):
    global received_data
    received_data = message.payload.decode()

@app.route('/hello', methods=['GET'])
def hello():
    client = paho.Client(client_id="wokwi", userdata=None, protocol=paho.MQTTv5)
    # client.on_connect = on_connect
    client.on_message = on_message

    client.tls_set(tls_version=mqtt.client.ssl.PROTOCOL_TLS)
    client.username_pw_set("hivemq.webclient.1708862134429", "ldCh6534$sJGK.Yc#zD!")
    client.connect("5fbcd303cf5d4f4aa437ee13fb50fd99.s1.eu.hivemq.cloud", 8883)
    client.subscribe("climat/#")
    client.loop_start()
    global received_data
    
    while received_data is None:
        pass
    if received_data:
        return jsonify({'data': received_data})
    else:
        return jsonify({'message': 'No data received yet'})
    

if __name__ == '__main__':
    app.run(debug=True)