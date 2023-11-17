import os
import cv2
import numpy as np
import time

start_time = time.time()

def rgb_to_hsv_vectorized(image):
    img = image.astype('float32') / 255.0
    r, g, b = img[..., 0], img[..., 1], img[..., 2]
    mx = np.max(img, axis=-1)
    mn = np.min(img, axis=-1)
    df = mx - mn

    h = np.zeros_like(mx)
    s = np.zeros_like(mx)
    v = mx

    # Avoid division by zero where df is zero
    df_zero = (df == 0)
    not_df_zero = ~df_zero

    # Calculate hue only where df is not zero
    # Red is max
    cond = (mx == r) & not_df_zero
    h[cond] = (60 * ((g[cond] - b[cond]) / df[cond]) + 360) % 360

    # Green is max
    cond = (mx == g) & not_df_zero
    h[cond] = (60 * ((b[cond] - r[cond]) / df[cond]) + 120)

    # Blue is max
    cond = (mx == b) & not_df_zero
    h[cond] = (60 * ((r[cond] - g[cond]) / df[cond]) + 240)

    # Saturation and value calculations
    s[mx != 0] = df[mx != 0] / mx[mx != 0]

    # Adjust hue to be in the range of 0 to 180
    h = h / 2

    hsv_image = np.stack([h, s, v], axis=-1)
    return hsv_image


def calculate_histogram(image):
    hsv_image = rgb_to_hsv_vectorized(image)
    h_bins = 8
    s_bins = 8
    hist, _ = np.histogramdd(hsv_image.reshape(-1, 3), bins=(h_bins, s_bins, s_bins), range=((0, 180), (0, 1), (0, 1)))
    hist = hist.flatten()
    hist = hist / np.sum(hist)
    return hist

def normalize_vector(v):
    norm = np.linalg.norm(v)
    if norm == 0: 
        return v
    return v / norm

def calculate_cosine_similarity(query_hist, dataset_hists):
    query_hist_normalized = normalize_vector(query_hist)
    similarity_scores = []
    for hist in dataset_hists:
        hist_normalized = normalize_vector(hist)
        similarity = np.dot(query_hist_normalized, hist_normalized)
        similarity = min(1.0, max(similarity, -1.0))
        similarity_scores.append(similarity)
    return similarity_scores

def search_similar_images(query_image_path, dataset_path, threshold=0.6):
    query_image = cv2.imread(query_image_path)
    if query_image is None:
        print(f"Error: Unable to read the image at {query_image_path}")
        return []

    query_hist = calculate_histogram(query_image)

    dataset_hists = []
    for filename in os.listdir(dataset_path):
        if filename.endswith(('.jpg', '.jpeg', '.png')):
            image_path = os.path.join(dataset_path, filename)
            image = cv2.imread(image_path)
            hist = calculate_histogram(image)
            dataset_hists.append(hist)

    similarity_scores = calculate_cosine_similarity(query_hist, dataset_hists)

    similar_indices = [i for i, score in enumerate(similarity_scores) if score >= threshold]
    similar_images = [(os.listdir(dataset_path)[i], similarity_scores[i]) for i in similar_indices]
    similar_images.sort(key=lambda x: x[1], reverse=True)

    return similar_images

# Example usage:
#r'C:\Users\Arif Rahmat\Documents\Kuliah\Tingkat 2\Algeo\Algeo02-22123\src\dataset\5.jpg'
query_image_path = input("Masukkan path gambar: ")
#r'C:\Users\Arif Rahmat\Documents\Kuliah\Tingkat 2\Algeo\Algeo02-22123\src\data'
dataset_path = input("Masukkan path dataset: ")

similar_images = search_similar_images(query_image_path, dataset_path)

# Print the results
print("Similar images:")
for image, similarity in similar_images:
    print(f"{image}: {similarity}")

#print running time
print("--- %s seconds ---" % (time.time() - start_time))
