import color
import os
import cv2
import csv
import time

def arrimgToColor(path):
    arrObjcolor = []
    arrGambar = os.listdir(path)
    start = time.time()
    i = 0
    for img in arrGambar:
        compared = cv2.imread(os.path.join(path,img))
        img_resize = cv2.resize(compared, (0,0), fx=0.5,fy = 0.5)
        vektor = color.normalize_vector(img_resize)
        arrObjcolor.append({
            "img" : compared,
            "vektor" : vektor
        })
        print(f"gamabar ke-{i}")
        i = i+1
    finish = time.time()
    selisih = finish - start
    print (f"waktu : {selisih}")

    csv_filename = "inputColor.csv"
    with open(csv_filename, 'w', newline='') as csvfile:
            # Tentukan header
            fieldnames = ["img", "vektor"]

            # Inisialisasi objek writer
            csvwriter = csv.DictWriter(csvfile, fieldnames=fieldnames)

            # Tulis header
            csvwriter.writeheader()

            # Tulis data
            csvwriter.writerows(arrObjcolor)