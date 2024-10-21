import network
import time
import ujson
from machine import Pin, SoftI2C
from i2c_lcd import I2cLcd
import dht
from umqtt.simple import MQTTClient

# Connect to WiFi
sta_if = network.WLAN(network.STA_IF)
sta_if.active(True)
sta_if.connect('HexaByteADD08', 'carlitoprimo')
while not sta_if.isconnected():
    print(".", end="")
    time.sleep(0.1)
print(" Connected!")

# Connect to MQTT server
print("Connecting to MQTT server... ", end="")
client = MQTTClient(
    client_id=b"domotique",
    server=b"5fbcd303cf5d4f4aa437ee13fb50fd99.s1.eu.hivemq.cloud",
    port=8883,
    user=b"hivemq.webclient.1708862134429",
    password=b"ldCh6534$sJGK.Yc#zD!",
    keepalive=7200,
    ssl=True,
    ssl_params={'server_hostname': '5fbcd303cf5d4f4aa437ee13fb50fd99.s1.eu.hivemq.cloud'}
)
client.connect()
print("Connected!")

# Initialize LCD
heart = bytearray([0x00, 0x00, 0x1B, 0x1F, 0x1F, 0x0E, 0x04, 0x00])
bell = bytearray([0x04, 0x0E, 0x0E, 0x0E, 0x1F, 0x00, 0x04, 0x00])

I2C_ADDR = 0x27
i2c = SoftI2C(scl=Pin(22), sda=Pin(21), freq=10000)
lcd = I2cLcd(i2c, I2C_ADDR, 2, 16)
lcd.custom_char(0, heart)
lcd.custom_char(1, bell)
lcd.putstr(chr(0) + " Domotique " + chr(0))

# DHT11 sensor
sensor = dht.DHT11(Pin(15))

# Main loop
while True:
    lcd.clear()
    
    # Measure temperature and humidity
    sensor.measure()
    time.sleep(2)
    
    temperature = sensor.temperature()
    humidity = sensor.humidity()

    # Print to console
    print(f"Temperature: {temperature} Celsius")
    print(f"Humidity: {humidity} %")

    # Display on LCD
    lcd.putstr(f" Temp : {temperature} C")
    lcd.move_to(0, 1)
    lcd.putstr(f" Humidity: {humidity} %")
    time.sleep(1)
    
    # Publish MQTT message
    message = ujson.dumps({
        "temp": temperature,
        "humidity": humidity
    })
    client.publish("domotique", message)
    
    time.sleep(2)

