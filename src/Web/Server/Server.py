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
    # Fungsi untuk memeriksa apakah ekstensi file diizinkan
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def extract_zip(zip_path, extract_path):
    # Fungsi untuk mengekstrak isi file zip ke suatu direktori
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_path)

def clear_upload_folder():
    # Fungsi untuk membersihkan konten folder UPLOAD_FOLDER
    for file_name in os.listdir(app.config['UPLOAD_FOLDER']):
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file_name)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print(f"Gagal menghapus {file_path}. Alasan: {str(e)}")

def clear_img_folder():
    # Fungsi untuk membersihkan konten folder IMG_FOLDER
    img_folder_path = app.config['IMG_FOLDER']
    for file_name in os.listdir(img_folder_path):
        file_path = os.path.join(img_folder_path, file_name)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print(f"Gagal menghapus {file_path}. Alasan: {str(e)}")

# Jika folder tidak ada, bersihkan kontennya
if not os.path.exists(app.config['UPLOAD_FOLDER']) or not os.path.exists(app.config['IMG_FOLDER']):
    clear_img_folder()
    clear_upload_folder()

@app.route('/upload', methods=['POST'])
def upload_dataset():
    try:
        if 'images' not in request.files:
            return 'Tidak ada file yang diberikan', 400

        file = request.files['images']

        if file and allowed_file(file.filename):
            # Bersihkan konten folder UPLOAD_FOLDER
            clear_upload_folder()

            # Simpan dataset baru
            zip_name = secure_filename(file.filename)
            zip_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(file.filename))
            file.save(zip_path)

            extract_path = os.path.join(app.config['UPLOAD_FOLDER'], 'extracted')
            os.makedirs(extract_path, exist_ok=True)

            extract_zip(zip_path, extract_path)
            drivetekstur.arrimgToVektor(extract_path)
            drivercolor.arrimgToColor(extract_path)

            print("File CSV berhasil dibuat")

            # Dapatkan daftar file di folder 'public/uploads'
            files_in_folder = os.listdir(app.config['UPLOAD_FOLDER'])

            # Kirim respons ke frontend dengan nama zip dan daftar file
            return jsonify({
                'notif': True,
                'zipName': zip_name,
                'filesInFolder': files_in_folder
            })

        return 'Tipe file tidak valid', 400

    except Exception as e:
        return str(e), 500

@app.route('/upload-search', methods=['POST'])
def upload_and_search():

    # Periksa apakah 'image' dan 'tab' ada dalam request
    if 'image' not in request.files or 'tab' not in request.form:
        return jsonify({'error': 'Permintaan tidak valid'}), 400

    file = request.files['image']

    # Periksa apakah file tidak kosong
    if file.filename == '':
        return jsonify({'error': 'Tidak ada file yang dipilih'}), 400

    # Simpan file dengan aman
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['IMG_FOLDER'], filename)
    file.save(filepath)

    # Akses nilai tab
    tab = request.form['tab']

    print('Image:', filename)
    print('Tab:', tab)

    # Dapatkan path ke folder yang diekstrak
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

    # Ubah hasil ke JSON dan kembalikan bersama jumlah_gambar dan durasi
    result_json = result.to_json(orient='records')

    return jsonify({
        'result': result_json,
        'jumlah_gambar': jumlah_gambar,
        'durasi': durasi
    }), 200

if __name__ == '__main__':
   
    input_color_path = 'inputColor.csv'
    input_texture_path = 'inputTexture.csv'
    
    if os.path.exists(input_color_path):
        os.unlink(input_color_path)
        
    if os.path.exists(input_texture_path):
        os.unlink(input_texture_path)


    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    if not os.path.exists(app.config['IMG_FOLDER']):
        os.makedirs(app.config['IMG_FOLDER'])

    clear_upload_folder()
    clear_img_folder()
    app.run(debug=True)
