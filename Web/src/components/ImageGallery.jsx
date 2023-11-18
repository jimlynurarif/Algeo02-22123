import React, { useState } from 'react';
import { DefaultPagination } from './Pagination';

const ImageGallery = ({ searchResult, jumlahGambar, durasi }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage] = useState(6);

  // const imagesList = Array.from({ length: 100 }, (_, index) => ({
  //   src: `https://via.placeholder.com/300x200?text=Image${index + 1}`,
  //   alt: `Image ${index + 1}`,
  // }));

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = searchResult.slice(indexOfFirstImage, indexOfLastImage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='m-auto min-h-screen justify-center flex-1'>
      <div>
        <h1 className='flex justify-center items-center text-3xl text-accent font-bold'>Seach Result</h1>
      </div>
      <div className='flex justify-between p-5'>
      <p>{jumlahGambar} Results in {durasi} seconds</p>
      </div>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 " >
          {currentImages.map((item, index) => (
            <div key={index} className="image-container">
              <img
                className="rounded-xl object-center object-cover h-48 w-full shadow-blue-gray-900/50 shadow-xl"
                src={item.img}
                alt={`Image ${index + 1}`}
              />
              <p>{`Similarity: ${item.similarity}%`}</p>
            </div>
          ))}
        </div>
      </div>
      
      <DefaultPagination
        itemsPerPage={imagesPerPage}
        totalItems={searchResult.length}
        setActivePage={handlePageChange}
      />
    </div>
  );
};

export default ImageGallery;
