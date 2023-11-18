import tekstur
import os
import cv2
import csv
import time

def arrimgToVektor(path):
    arrObjtxtr = []
    arrGambar = os.listdir(path)
    start = time.time()
    i = 0
    for img in arrGambar:
        img_path = os.path.join(path, img)
        compared = cv2.imread(img_path)
        img_resize = cv2.resize(compared, (0,0), fx=0.5,fy = 0.5)
        vektor = tekstur.features(img_resize)
        arrObjtxtr.append({
            "img" : img_path,
            "vektor" : vektor
        })
        print(f"gamabar ke-{i}")
        i = i+1
    finish = time.time()
    selisih = finish - start
    print (f"waktu : {selisih}")
    
    csv_filename = "output2.csv"
    with open(csv_filename, 'w', newline='') as csvfile:
            # Tentukan header
            fieldnames = ["img", "vektor"]

            # Inisialisasi objek writer
            csvwriter = csv.DictWriter(csvfile, fieldnames=fieldnames)

            # Tulis header
            csvwriter.writeheader()

            # Tulis data
            csvwriter.writerows(arrObjtxtr)

    return arrObjtxtr
path = "C:\\Users\\Dhinto\\Documents\\GitHub\\Algeo02-22123\\src\\dataset"
arrimgToVektor(path)
   


