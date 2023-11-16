

import os
import cv2
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import normalize

def calculate_histogram(image):
    # Convert the image to the HSV color space
    hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    
    # Calculate the 2D histogram (hist) using the hue and saturation channels
    hist = cv2.calcHist([hsv_image], [0, 1], None, [180, 256], [0, 180, 0, 256])
    
    # Normalize the histogram to have values between 0 and 1
    hist = cv2.normalize(hist, hist).flatten()
    
    return hist

def calculate_cosine_similarity(query_hist, dataset_hists):
    # Reshape the histograms for sklearn's cosine_similarity function
    query_hist = query_hist.reshape(1, -1)
    dataset_hists = np.vstack(dataset_hists)

    # Compute cosine similarity between the query histogram and dataset histograms
    similarity_scores = cosine_similarity(query_hist, dataset_hists)

    return similarity_scores.flatten()

def search_similar_images(query_image_path, dataset_path, threshold=0.6):
    query_image = cv2.imread(query_image_path)
    if query_image is None:
      print(f"Error: Unable to read the image at {query_image_path}")
    query_hist = calculate_histogram(query_image)
    dataset_hists = []

    for filename in os.listdir(dataset_path):
        if filename.endswith(('.jpg', '.jpeg', '.png')):
            image_path = os.path.join(dataset_path, filename)
            image = cv2.imread(image_path)
            hist = calculate_histogram(image)
            dataset_hists.append(hist)

    similarity_scores = calculate_cosine_similarity(query_hist, dataset_hists)

    # Get indices of images with similarity above the threshold
    similar_indices = np.where(similarity_scores >= threshold)[0]

    # Get the filenames of similar images
    similar_images = [(os.listdir(dataset_path)[i], similarity_scores[i]) for i in similar_indices]

    # Sort the similar images by similarity score (descending order)
    similar_images.sort(key=lambda x: x[1], reverse=True)

    return similar_images

# Example usage:
query_image_path = r'C:\Users\Arif Rahmat\Documents\Kuliah\Tingkat 2\Algeo\Tubes2\CBIR\bg_laptop\lion.jpeg'
dataset_path = r'C:\Users\Arif Rahmat\Documents\Kuliah\Tingkat 2\Algeo\Tubes2\CBIR\bg_laptop'


similar_images = search_similar_images(query_image_path, dataset_path)

# Print the results
print("Similar images:")
for image, similarity in similar_images:
    print(f"{image}: {similarity}")
