from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import zipfile
import shutil
import drivetekstur
import drivercolor
import loadgambarColor
import loadgambarTexture

from flask_cors import CORS


app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'public/uploads'
app.config['IMG_FOLDER'] = 'img'
app.config['ALLOWED_EXTENSIONS'] = {'zip'}

CORS(app)

def allowed_file(filename):
   return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def extract_zip(zip_path, extract_path):
   with zipfile.ZipFile(zip_path, 'r') as zip_ref:
       zip_ref.extractall(extract_path)

def clear_upload_folder():
    # Clear the existing contents of UPLOAD_FOLDER
    for file_name in os.listdir(app.config['UPLOAD_FOLDER']):
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file_name)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print(f"Failed to delete {file_path}. Reason: {str(e)}")

    # Delete the output.csv file if it exists
    output_csv_path = os.path.join(app.config['UPLOAD_FOLDER'], 'inputTexture.csv')
    if os.path.exists(output_csv_path):
        os.unlink(output_csv_path)
    output_csv_path = os.path.join(app.config['UPLOAD_FOLDER'], 'inputColor.csv')
    if os.path.exists(output_csv_path):
        os.unlink(output_csv_path)

def clear_img_folder():
    img_folder_path = app.config['IMG_FOLDER']
    for file_name in os.listdir(img_folder_path):
        file_path = os.path.join(img_folder_path, file_name)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print(f"Failed to delete {file_path}. Reason: {str(e)}")

@app.route('/upload', methods=['POST'])
def upload_dataset():
    try:
        if 'images' not in request.files:
            return 'No file provided', 400

        file = request.files['images']

        if file and allowed_file(file.filename):
            # Clear the existing contents of UPLOAD_FOLDER
            clear_upload_folder()

            # Save the new dataset
            zip_name = secure_filename(file.filename)
            zip_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(file.filename))
            file.save(zip_path)

            extract_path = os.path.join(app.config['UPLOAD_FOLDER'], 'extracted')
            os.makedirs(extract_path, exist_ok=True)

            extract_zip(zip_path, extract_path)
            drivetekstur.arrimgToVektor(extract_path)
            drivercolor.arrimgToColor(extract_path)

            print("CSV file created successfully")

            # Get the list of files in the 'public/uploads' folder
            files_in_folder = os.listdir(app.config['UPLOAD_FOLDER'])

            # Send a response to the frontend with zip name and list of files
            return jsonify({
                'hideNotification': 1,
                'message': 'Dataset uploaded and processing started successfully',
                'zipName': zip_name,
                'filesInFolder': files_in_folder
            })

        return 'Invalid file type', 400

    except Exception as e:
        return str(e), 500

@app.route('/upload-search', methods=['POST'])
def upload_and_search():

        # Check if the 'file' and 'tab' fields exist in the request
        if 'image' not in request.files or 'tab' not in request.form:
            return jsonify({'error': 'Invalid request'}), 400

        file = request.files['image']

        # Check if the file is not empty
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        # Securely save the file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['IMG_FOLDER'], filename)
        file.save(filepath)

        # Access the tab valuet
        tab = request.form['tab']

        print('Image:', filename)
        print('Tab:', tab)

        # Get the path to the extracted folder

        extract_path = os.path.join(app.config['UPLOAD_FOLDER'], 'extracted')

        if tab == 'texture':
            result, jumlah_gambar, durasi = loadgambarTexture.loadgambar(extract_path, filepath, 60)
        elif tab == 'color':
            result, jumlah_gambar, durasi = loadgambarColor.loadgambar(extract_path, filepath, 60)

        if jumlah_gambar == 0:
            return jsonify({
                'result': {},
                'jumlah_gambar': 0,
                'durasi': 0
            }), 200

        # Convert the result to JSON and return it along with jumlah_gambar and durasi
        result_json = result.to_json(orient='records')

        return jsonify({
            'result': result_json,
            'jumlah_gambar': jumlah_gambar,
            'durasi': durasi
        }), 200

if __name__ == '__main__':
   if not os.path.exists(app.config['UPLOAD_FOLDER']):
       os.makedirs(app.config['UPLOAD_FOLDER'])
   if not os.path.exists(app.config['IMG_FOLDER']):
       os.makedirs(app.config['IMG_FOLDER'])

   app.run(debug=True)



