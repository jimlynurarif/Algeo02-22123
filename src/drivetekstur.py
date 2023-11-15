import tekstur
import os
import cv2
import time

def arrimgToCooccurrence(path):
    arrObj = []
    arrGambar = os.listdir(path)
    start = time.time()
    gambarpilihan = cv2.imread("C:\\Users\\Dhinto\\Documents\\Tubes_algeo2\\src\\dataset\\0.jpg")
    imgref =cv2.resize(gambarpilihan, (0,0), fx=0.5,fy = 0.5)
    i = 0
    for img in arrGambar:
        compared = cv2.imread(os.path.join(path,img))
        img_resize = cv2.resize(compared, (0,0), fx=0.5,fy = 0.5)
        similarity = tekstur.cosineSimilarity(imgref, img_resize)
        print(f'Similarity with image_{i}.jpg: {similarity*100}')
        arrObj.append({
            "img" : compared,
            "similarity" : similarity
        })
        i = i+1
    finish = time.time()
    selisih = finish - start
    print (f"waktu : {selisih}")
    return arrObj

path = "C:\\Users\\Dhinto\\Documents\\Tubes_algeo2\\src\\dataset"
arrimgToCooccurrence(path)

