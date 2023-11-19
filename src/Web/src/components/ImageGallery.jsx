import React, { useState } from 'react';
import { DefaultPagination } from './Pagination';

const ImageGallery = ({ searchResult, jumlahGambar, durasi }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage] = useState(8);

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = searchResult.slice(indexOfFirstImage, indexOfLastImage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='m-auto  justify-center flex-1'>
        <div>
          <div className="bg-gradient-to-r from-green-400 to-green-600 p-8 text-white rounded-2xl">
            <h1 className="text-4xl text-center font-bold mb-6">Search Result</h1>
            <div className="flex justify-between p-5 bg-white rounded-md shadow-md">
              <p className="text-gray-700">
                {jumlahGambar} Results in {durasi} seconds
              </p>
            </div>
          </div>
      <div className="grid grid-rows-3 pt-7 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-2 lg:grid-cols-4 gap-4">
      {currentImages.map((item, index) => (
        <div key={index} className="image-container">
          <div className="relative group">
            <img
              className="h-45 w-full rounded-lg object-cover object-center shadow-xl shadow-blue-gray-900/50 aspect-auto transition-transform transform hover:scale-105"
              src={item.img}
              alt={`Image ${index + 1}`}
            />
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-green-600/50 p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white font-bold text-sm text-center">{`Similarity: ${item.similarity}%`}</p>
            </div>
          </div>
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
