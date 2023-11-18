from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import zipfile
import cv2
import csv
import time
from concurrent.futures import ThreadPoolExecutor
import tekstur
import shutil
import pandas as pd

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['IMG_FOLDER'] = 'img'
app.config['ALLOWED_EXTENSIONS'] = {'zip'}

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

def arrimgToVektor(path):
   arrObj = []
   arrGambar = os.listdir(path)
   start = time.time()
   i = 0
   for img in arrGambar:
       compared = cv2.imread(os.path.join(path, img))
       img_resize = cv2.resize(compared, (0,0), fx=0.5, fy=0.5)
       vektor = tekstur.features(img_resize)
       arrObj.append({
           "img": compared,
           "vektor": vektor
       })
       print(f"gambar ke-{i}")
       i += 1
   finish = time.time()
   selisih = finish - start
   print(f"waktu : {selisih}")

   return arrObj

def loadgambar(path, pathg,minimum):
    start = time.time()
    gambarpilihan = cv2.imread(pathg)
    imgref =cv2.resize(gambarpilihan, (0,0), fx=0.5,fy = 0.5)
    vektor1 = tekstur.features(imgref)

    sim_img =[]
    df = pd.read_csv("inputTexture.csv")
    df ['vektor'] = df['vektor'].apply(eval)

    arrGambar = os.listdir(path)
    arrObj = []
    i = 0
    for img in arrGambar:
        img_path = os.path.join(path, img)
        sim_img.append(img_path)

    j = 0
    for index, row in df.iterrows():

        vektor2 = row['vektor']
        similarity = tekstur.cosineSimilarity(vektor1,vektor2)*100
        if similarity >= minimum:
            arrObj.append({
                    "img" : sim_img[j],
                    "similarity" : similarity
                })
        print(f"Similarity gambar ke-{index}")
        j = j+1

    df = pd.DataFrame(arrObj)
    df_sorted_Obj = df.sort_values(by='similarity')

    jumlah_gambar = len(sim_img)
    selesai = time.time()
    durasi = selesai - start
    print(durasi)

    return df_sorted_Obj, jumlah_gambar ,durasi

def process_uploaded_images(zip_path, extract_path):
   extract_zip(zip_path, extract_path)
   arrObj = arrimgToVektor(extract_path)

   csv_filename = "inputTexture.csv"
   with open(csv_filename, 'w', newline='') as csvfile:
       fieldnames = ["img", "vektor"]
       csvwriter = csv.DictWriter(csvfile, fieldnames=fieldnames)
       csvwriter.writeheader()

       for obj in arrObj:
           img_array = obj.get("img")  # Get the image array from the dictionary
           if img_array is not None:
               img_path = os.path.join(extract_path, f"{time.time()}.png")
               cv2.imwrite(img_path, img_array)  # Save the image temporarily
               csvwriter.writerow({"img": img_path, "vektor": obj["vektor"]})

   print("CSV file created successfully")

# Function to perform image search
def perform_image_search(image_path, tab):
    # Add your image search logic here
    # This is just a placeholder for demonstration purposes
    print(f"Performing image search for image: {image_path} in tab: {tab}")
    # Replace this with your actual image search code

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
            zip_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(file.filename))
            file.save(zip_path)

            extract_path = os.path.join(app.config['UPLOAD_FOLDER'], 'extracted')
            os.makedirs(extract_path, exist_ok=True)

            # Process uploaded images using ThreadPoolExecutor
            with ThreadPoolExecutor() as executor:
                executor.submit(process_uploaded_images, zip_path, extract_path)

            return 'Dataset uploaded and processing started successfully'

        return 'Invalid file type', 400

    except Exception as e:
        return str(e), 500

# Endpoint for image upload and search
@app.route('/upload-search', methods=['POST'])
def upload_and_search():
    try:
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

        result, jumlah_gambar, durasi = loadgambar(extract_path, filepath, 99)

        # Convert the result to JSON and return it along with jumlah_gambar and durasi
        result_json = result.to_json(orient='records')

        return jsonify({
            'message': 'Upload and search successful',
            'result': result_json,
            'jumlah_gambar': jumlah_gambar,
            'durasi': durasi
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
   if not os.path.exists(app.config['UPLOAD_FOLDER']):
       os.makedirs(app.config['UPLOAD_FOLDER'])
   if not os.path.exists(app.config['IMG_FOLDER']):
       os.makedirs(app.config['IMG_FOLDER'])
   app.run(debug=True)

