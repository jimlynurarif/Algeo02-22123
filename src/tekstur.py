import cv2
import os
import numpy as np 
import math

img = cv2.imread("C:\\Users\\Dhinto\\Documents\\Tubes_algeo2\\src\\dataset\\0.jpg")
img2 = cv2.imread("C:\\Users\\Dhinto\\Documents\\Tubes_algeo2\\src\\dataset\\1.jpg")

def processImg(gambar):
    r, g, b = cv2.split(gambar)
    r = r * 0.29
    g = g * 0.587
    b = b * 0.114
    gr = r+g+b
    grInt = gr.astype(int)
    return grInt

def coOccureanceMat(gambar):
    image = processImg(gambar)
    cooccurrence_Matrix = np.zeros((256, 256), dtype=int)
    height, width = image.shape

    for i in range(height):
        for j in range(width-1):
            cooccurrence_Matrix[image[i, j], image[i, j+1]] += 1
    
    cooccurrence_Matrix = np.transpose(cooccurrence_Matrix) + cooccurrence_Matrix
    sum_matrix = np.sum(cooccurrence_Matrix)
    normalized_matrix = cooccurrence_Matrix / sum_matrix

    return normalized_matrix

def features(gambar):
    cooccurence = coOccureanceMat(gambar)
    contrast = np.sum(np.square(np.arange(256)[:, np.newaxis] - np.arange(256)[np.newaxis, :]) * cooccurence)
    entropy = -np.sum(cooccurence * np.log(cooccurence + np.finfo(float).eps))
    homogeneity = np.sum(cooccurence / (1 + np.abs(np.arange(256)[:, np.newaxis] - np.arange(256)[np.newaxis, :])))
    vektor = [0,0,0]
    vektor[0] =  contrast
    vektor[1] =  homogeneity
    vektor[2] =  entropy
    return vektor

def cosineSimilarity(vektor1, vektor2):
    a = 0
    b = 0
    c = 0
    for i in range(3):
        a += vektor1[i] * vektor2[i]
        b += vektor1[i]**2
        c += vektor2[i]**2
    akarb = b**0.5
    akarc = c**0.5
    bawah = akarb*akarc
    similarity = a/bawah
    return similarity 
        




