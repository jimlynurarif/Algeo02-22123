import tekstur
import os
import cv2
import csv
import numpy as np
import time
import pandas as pd
import ast

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
        img_path = os.path.normpath(os.path.join(path, img))
        img_path = img_path.replace(os.sep, '/')
        sim_img.append(f"./uploads/extracted/{os.path.basename(img_path)}")

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
    if arrObj != []:
        df_sorted_Obj = df.sort_values(by='similarity', ascending=False)
    else:
        df_sorted_Obj = []


    jumlah_gambar = len(arrObj)
    selesai = time.time()
    durasi = selesai - start
    print(durasi)

    return df_sorted_Obj, jumlah_gambar ,durasi