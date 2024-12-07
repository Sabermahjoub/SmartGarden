from flask import Flask, request, jsonify
import paho.mqtt.client as paho
from paho import mqtt
import time
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})
# CORS(app, resources={
#     r"/*": {
#         "origins": "http://localhost:4200",  # Allow requests only from your Angular app
#         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
#         "allow_headers": ["Content-Type", "Authorization"]
#     }
# })
# @app.before_request
# def handle_options_request():
#     if request.method == "OPTIONS":
#         response = app.make_response("")
#         response.headers["Access-Control-Allow-Origin"] = "http://localhost:4200"
#         response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
#         response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
#         return response


received_data = None
import mysql.connector
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'gardenpy'
}
# MQTT configuration
MQTT_BROKER = "5fbcd303cf5d4f4aa437ee13fb50fd99.s1.eu.hivemq.cloud"
MQTT_PORT = 8883
MQTT_USERNAME = "garden"
MQTT_PASSWORD = "Garden123"


import joblib
import numpy as np
import os

# Get the directory of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))

# Resolve the relative path
file_path1 = os.path.join(current_dir, './scaler.pkl')
file_path2 = os.path.join(current_dir, './model.pkl')

from flask import Flask, request, jsonify
import numpy as np
import joblib
import os
from sklearn.preprocessing import StandardScaler
import warnings
warnings.filterwarnings('ignore')

# Feature names and expected ranges
FEATURE_NAMES = [
    'soil_type',
    'watering_frequency',
    'fertilizer_type',
    'light_intensity',
    'humidity',
    'temperature'
]

# Expected ranges for numerical features
VALID_RANGES = {
    'watering_frequency': (1, 10),
    'light_intensity': (0, 100),
    'humidity': (0, 100),
    'temperature': (15, 35)
}

# Mapping for categorical variables (you'll need to fill these based on your training data)
SOIL_TYPE_MAPPING = {
    'clay': 0,
    'loam': 1,
    'sandy': 2
    # Add other soil types as needed
}

FERTILIZER_TYPE_MAPPING = {
    'organic': 0,
    'chemical': 1,
    'mixed': 2
    # Add other fertilizer types as needed
}

def validate_input(data):
    """Validate input data and return preprocessed values."""
    errors = []
    
    # Validate categorical variables
    try:
        soil_type = SOIL_TYPE_MAPPING.get(str(data.get('soil_type')).lower())
        if soil_type is None:
            errors.append(f"Invalid soil_type. Must be one of: {list(SOIL_TYPE_MAPPING.keys())}")
    except:
        errors.append("Invalid soil_type format")
        
    try:
        fertilizer_type = FERTILIZER_TYPE_MAPPING.get(str(data.get('fertilizer_type')).lower())
        if fertilizer_type is None:
            errors.append(f"Invalid fertilizer_type. Must be one of: {list(FERTILIZER_TYPE_MAPPING.keys())}")
    except:
        errors.append("Invalid fertilizer_type format")
    
    # Validate numerical variables
    for feature, (min_val, max_val) in VALID_RANGES.items():
        try:
            value = float(data.get(feature))
            if not min_val <= value <= max_val:
                errors.append(f"{feature} must be between {min_val} and {max_val}")
        except:
            errors.append(f"Invalid {feature} format")
    
    if errors:
        return None, errors
    
    # Create feature array in correct order
    features = np.array([
        soil_type,
        float(data['watering_frequency']),
        fertilizer_type,
        float(data['light_intensity']),
        float(data['humidity']),
        float(data['temperature'])
    ])
    
    return features, None

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        try:
            data = request.get_json()
            
            # Extract values from the JSON object
            soil_type = data['soil_type']
            watering_frequency = data['watering_frequency']
            fertilizer_type = data['fertilizer_type']
            light_intensity = data['light_intensity']
            humidity = data['humidity']
            temperature = data['temperature']
            
            # Prepare the data as a NumPy array
            data_array = np.array([
                soil_type, watering_frequency, fertilizer_type,
                light_intensity, humidity, temperature
            ])
            
            # Debug prints
            print("\nInput data:")
            print(f"Raw input array: {data_array}")
            
            # Load the scaler and model
            with open(file_path1, 'rb') as f:
                scaler = joblib.load(f)
                # Print scaler parameters
                print("\nScaler parameters:")
                print(f"Scale: {scaler.scale_}")
                print(f"Mean: {scaler.mean_}")
                print(f"Var: {scaler.var_}")
            
            with open(file_path2, 'rb') as f:
                clf = joblib.load(f)
            
            # Transform and debug print
            data_scaled = scaler.transform(data_array.reshape(1, -1))
            print("\nTransformed data:")
            print(f"Scaled array: {data_scaled}")
            
            # Get support vectors if using SVC
            if hasattr(clf, 'support_vectors_'):
                print("\nModel information:")
                print(f"Number of support vectors: {len(clf.support_vectors_)}")
                print(f"Support vector range: [{clf.support_vectors_.min()}, {clf.support_vectors_.max()}]")
            
            prediction = clf.predict(data_scaled)
            print(f"\nFinal prediction: {prediction}")

            return jsonify({'prediction': int(prediction[0])})

        except Exception as e:
            print(f"Error during prediction: {str(e)}")
            return jsonify({'error': str(e)}), 500

    return jsonify({'error': 'Method not allowed'}), 405


# Callback to handle incoming messages
def on_message(client, userdata, message):
    global received_data
    received_data = message.payload.decode()


# Login route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"error": "Username and password are required."}), 400

    if username == MQTT_USERNAME and password == MQTT_PASSWORD:
        try:
            
            return jsonify({"message": "Login successful and connected to MQTT broker."}), 200
        except Exception as e:
            return jsonify({"error": f"MQTT connection failed: {str(e)}"}), 500
    else:
        return jsonify({"error": "Invalid username or password."}), 401

@app.route('/getData', methods=['GET'])
def get_data():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True) 
        query = "SELECT * FROM sensor_data order by timestamp desc LIMIT 1 "
        cursor.execute(query)
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        if result:
            return jsonify({'data': result})
        else:
            return jsonify({'message': 'No data found in the sensor_data table'})
    
    except mysql.connector.Error as err:
        return jsonify({'error': f'Database error: {err}'})
    
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'})


# Database configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'gardenpy'
}

@app.route('/getPlants', methods=['GET'])
def get_plants():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True) 
        query = "SELECT * FROM plant"
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        if result:
            return jsonify({'plants': result})
        else:
            return jsonify({'message': 'No data found in the sensor_data table'})
    
    except mysql.connector.Error as err:
        return jsonify({'error': f'Database error: {err}'})
    
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'})


@app.route('/addPlant', methods=['POST'])
def add_plant():
    try:
        data = request.json
        required_fields = [
            "plant_name", "minTemp_day", "maxTemp_day", "minTemp_night", "maxTemp_night",
            "minHumidity", "maxHumidity", "Wind", "minUVIndex", "maxUVIndex",
            "minLight", "maxLight", "minSoilMoisture", "maxSoilMoisture",
            "lastDateOfIrrigation", "lastDateOfFertilizer", "lastDateOfPesticide", "lastDateOfNutrients"
        ]
        
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400
        
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        query = """
        INSERT INTO plant (
            plant_name, minTemp_day, maxTemp_day, minTemp_night, maxTemp_night,
            minHumidity, maxHumidity, Wind, minUVIndex, maxUVIndex,
            minLight, maxLight, minSoilMoisture, maxSoilMoisture,
            lastDateOfIrrigation, lastDateOfFertilizer, lastDateOfPesticide, lastDateOfNutrients
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        values = (
            data['plant_name'], data['minTemp_day'], data['maxTemp_day'], 
            data['minTemp_night'], data['maxTemp_night'], 
            data['minHumidity'], data['maxHumidity'], data['Wind'], 
            data['minUVIndex'], data['maxUVIndex'], 
            data['minLight'], data['maxLight'], 
            data['minSoilMoisture'], data['maxSoilMoisture'], 
            data['lastDateOfIrrigation'], data['lastDateOfFertilizer'], 
            data['lastDateOfPesticide'], data['lastDateOfNutrients']
        )
        
        cursor.execute(query, values)
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'Plant added successfully'}), 201
    
    except mysql.connector.Error as err:
        return jsonify({'error': f'Database error: {err}'}), 500
    
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

@app.route('/deletePlant/<plant_name>', methods=['DELETE'])
def delete_plant(plant_name):
    # test w/ curl -X DELETE "http://127.0.0.1:5000/deletePlant/Rose"

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        query = "DELETE FROM plant WHERE plant_name = %s"
        cursor.execute(query, (plant_name,))
        conn.commit()

        if cursor.rowcount > 0:
            response = {"message": f"Plant '{plant_name}' deleted successfully."}
            status_code = 200
        else:
            response = {"error": f"Plant '{plant_name}' not found."}
            status_code = 404

        cursor.close()
        conn.close()
        return jsonify(response), status_code

    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {err}"}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


@app.route('/updateIrrigationDate/<plant_name>', methods=['PUT'])
def update_irrigation_date(plant_name):
    try:
        data = request.get_json()
        new_date = data.get('lastDateOfIrrigation')

        if not new_date:
            return jsonify({"error": "Missing 'lastDateOfIrrigation' in the request body."}), 400

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        query = "UPDATE plant SET lastDateOfIrrigation = %s WHERE plant_name = %s"
        cursor.execute(query, (new_date, plant_name))
        conn.commit()

        if cursor.rowcount > 0:
            response = {"message": f"Irrigation date for plant '{plant_name}' updated successfully to {new_date}."}
            status_code = 200
        else:
            response = {"error": f"Plant '{plant_name}' not found."}
            status_code = 404

        cursor.close()
        conn.close()
        return jsonify(response), status_code

    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {err}"}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/updatePesticideDate/<plant_name>', methods=['PUT'])
def update_pesticide_date(plant_name):
    try:
        data = request.get_json()
        new_date = data.get('lastDateOfPesticide')

        if not new_date:
            return jsonify({"error": "Missing 'lastDateOfPesticide' in the request body."}), 400

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        query = "UPDATE plant SET lastDateOfPesticide = %s WHERE plant_name = %s"
        cursor.execute(query, (new_date, plant_name))
        conn.commit()

        if cursor.rowcount > 0:
            response = {"message": f"Pesticide date for plant '{plant_name}' updated successfully to {new_date}."}
            status_code = 200
        else:
            response = {"error": f"Plant '{plant_name}' not found."}
            status_code = 404

        cursor.close()
        conn.close()
        return jsonify(response), status_code

    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {err}"}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
@app.route('/updateNutrientsDate/<plant_name>', methods=['PUT'])
def update_nutrients_date(plant_name):
    try:
        data = request.get_json()
        new_date = data.get('lastDateOfNutrients')

        if not new_date:
            return jsonify({"error": "Missing 'lastDateOfNutrients' in the request body."}), 400

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        query = "UPDATE plant SET lastDateOfNutrients = %s WHERE plant_name = %s"
        cursor.execute(query, (new_date, plant_name))
        conn.commit()

        # Check if the update was successful
        if cursor.rowcount > 0:
            response = {"message": f"Nutrients date for plant '{plant_name}' updated successfully to {new_date}."}
            status_code = 200
        else:
            response = {"error": f"Plant '{plant_name}' not found."}
            status_code = 404

        cursor.close()
        conn.close()
        return jsonify(response), status_code

    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {err}"}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
