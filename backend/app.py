from flask import Flask, request, jsonify
import paho.mqtt.client as paho
from paho import mqtt
import time
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})


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




# ML imports
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

# Load the model when the application starts
# Get the directory of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, './ml_model.pkl')
clf = joblib.load(model_path)

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
                soil_type, light_intensity, watering_frequency,
                fertilizer_type, temperature, humidity
            ])

            # Make a prediction using the loaded model
            result = int(clf.predict(data_array.reshape(1, -1))[0])
            return jsonify({'prediction': result})

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

@app.route('/getTasks', methods=['GET'])
def get_tasks():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True) 
        query = "SELECT * FROM task order by id desc LIMIT 1 "
        cursor.execute(query)
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        if result:
            return jsonify({'data': result})
        else:
            return jsonify({'message': 'No data found in the tasks table'})
    
    except mysql.connector.Error as err:
        return jsonify({'error': f'Database error: {err}'})
    
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'})
@app.route('/deleteTask/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    # test w/ curl -X DELETE "http://127.0.0.1:5000/deleteTask/111"
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        query = "DELETE FROM task WHERE id = %s"
        cursor.execute(query, (task_id,))
        conn.commit()

        if cursor.rowcount > 0:
            response = {"message": f"Task '{task_id}' deleted successfully."}
            status_code = 200
        else:
            response = {"error": f"PlTaskant '{task_id}' not found."}
            status_code = 404

        cursor.close()
        conn.close()
        return jsonify(response), status_code

    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {err}"}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/addLog', methods=['POST'])
def add_log():
    try:
        data = request.json
        required_fields = [
            "id", "plant_name", "operation", "date"
        ]
        
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400
        
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        query = """
        INSERT INTO logs (id,
            plant_name, operation, date
        ) VALUES (%s, %s, %s, %s)
        """
        
        values = (
            data['id'], data['plant_name'], data['operation'], 
            data['date']
        )
        
        cursor.execute(query, values)
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'Log added successfully'}), 201
    
    except mysql.connector.Error as err:
        return jsonify({'error': f'Database error: {err}'}), 500
    
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500   

@app.route('/addTask', methods=['POST'])
def add_task():
    try:
        data = request.json
        required_fields = [
            "task_name", "description", "task_type",
            "starting_time", "ending_time", "plant", "done"
        ]
        
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400
        
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        query = """
        INSERT INTO task (
            task_name, description, task_type, starting_time,
            ending_time, plant, done
        ) VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        
        values = (
            data['task_name'], data['description'], data['task_type'],
            data['starting_time'], data['ending_time'], data['plant'],
            int(data['done'])  # Convert to integer for TINYINT field
        )
        
        cursor.execute(query, values)
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'Task created successfully'}), 201
    
    except mysql.connector.Error as err:
        return jsonify({'error': f'Database error: {err}'}), 500
    
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

@app.route('/updateTaskStatus/<int:task_id>', methods=['PUT'])
def update_task_status(task_id):
    try:
        done = request.json.get('done') # 1 or 0
        
        if done not in [0, 1]:
            return jsonify({'error': "'done' must be 0 or 1"}), 400
        
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        query = "UPDATE task SET done = %s WHERE task_id = %s"
        cursor.execute(query, (done, task_id))
        conn.commit()
        
        if cursor.rowcount == 0:
            return jsonify({'error': f'Task with task_id {task_id} not found'}), 404
        
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'Task status updated successfully'}), 200
    
    except mysql.connector.Error as err:
        return jsonify({'error': f'Database error: {err}'}), 500
    
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

@app.route('/getLogs', methods=['GET'])
def get_logs():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True) 
        query = "SELECT * FROM logs order by id desc LIMIT 1 "
        cursor.execute(query)
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        if result:
            return jsonify({'data': result})
        else:
            return jsonify({'message': 'No data found in the logs table'})
    
    except mysql.connector.Error as err:
        return jsonify({'error': f'Database error: {err}'})
    
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'})

@app.route('/deleteLog/<log_id>', methods=['DELETE'])
def delete_log(task_id):
    # test w/ curl -X DELETE "http://127.0.0.1:5000/deleteLog/111"
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        query = "DELETE FROM task WHERE id = %s"
        cursor.execute(query, (task_id,))
        conn.commit()

        if cursor.rowcount > 0:
            response = {"message": f"Task '{task_id}' deleted successfully."}
            status_code = 200
        else:
            response = {"error": f"PlTaskant '{task_id}' not found."}
            status_code = 404

        cursor.close()
        conn.close()
        return jsonify(response), status_code

    except mysql.connector.Error as err:
        return jsonify({"error": f"Database error: {err}"}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

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