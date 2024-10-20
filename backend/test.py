import time
import paho.mqtt.client as paho
from paho import mqtt

#CALLBACKS
def on_connect(client, userdata, flags, rc, properties=None):
    print("CONNACK received with code %s." % rc)

def on_publish(client, userdata, mid, properties=None):
    print("mid: " + str(mid))

def on_subscribe(client, userdata, mid, granted_qos, properties=None):
    print("Subscribed: " + str(mid) + " " + str(granted_qos))

def on_message(client, userdata, msg):
    print(msg.topic + " " + str(msg.qos) + " " + str(msg.payload))

client = paho.Client(client_id="wokwi", userdata=None, protocol=paho.MQTTv5)
client.on_connect = on_connect
client.tls_set(tls_version=mqtt.client.ssl.PROTOCOL_TLS)
client.username_pw_set("hivemq.webclient.1708862134429", "ldCh6534$sJGK.Yc#zD!")
client.connect("5fbcd303cf5d4f4aa437ee13fb50fd99.s1.eu.hivemq.cloud", 8883)
client.on_subscribe = on_subscribe
client.on_message = on_message
client.on_publish = on_publish

#pub sub
client.subscribe("testtopic/#", qos=1)
client.publish("climat", payload="hot", qos=1)

#loop
client.loop_forever()


    