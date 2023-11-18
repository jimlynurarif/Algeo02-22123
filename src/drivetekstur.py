import tekstur
import os
import cv2
import csv
import time

def arrimgToVektor(path):
    arrObj = []
    arrGambar = os.listdir(path)
    start = time.time()
    # gambarpilihan = cv2.imread("C:\\Users\\Dhinto\\Documents\\Tubes_algeo2\\src\\dataset\\0.jpg")
    # imgref =cv2.resize(gambarpilihan, (0,0), fx=0.5,fy = 0.5)
    i = 0
    for img in arrGambar:
        compared = cv2.imread(os.path.join(path,img))
        img_resize = cv2.resize(compared, (0,0), fx=0.5,fy = 0.5)
        vektor = tekstur.features(img_resize)
        arrObj.append({
            "img" : compared,
            "vektor" : vektor
        })
        print(f"gamabar ke-{i}")
        i = i+1
    finish = time.time()
    selisih = finish - start
    print (f"waktu : {selisih}")
    
    csv_filename = "output.csv"
    with open(csv_filename, 'w', newline='') as csvfile:
            # Tentukan header
            fieldnames = ["img", "vektor"]

            # Inisialisasi objek writer
            csvwriter = csv.DictWriter(csvfile, fieldnames=fieldnames)

            # Tulis header
            csvwriter.writeheader()

            # Tulis data
            csvwriter.writerows(arrObj)

    return arrObj
path = "C:\\Users\\Dhinto\\Documents\\GitHub\\Algeo02-22123\\src\\dataset"
arrimgToVektor(path)
   


