import React, { useState } from 'react';
import { DefaultPagination } from './Pagination';

const ImageGallery = ({ images }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage] = useState(8);

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='m-auto min-h-screen justify-center flex-1'>
      <div>
        <h1 className='flex justify-center items-center text-3xl text-accent font-bold'>Seach Result</h1>
      </div>
      <div className='flex justify-between p-5'>
        <p>54 Results in 0.57 seconds</p>
      </div>
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 " >
                {currentImages.map((image, index) => (
                    <img
                    key={index}
                    className="rounded-xl object-center object-cover h-48 w-full shadow-blue-gray-900/50 shadow-xl"
                    src={image.src}
                    alt={image.alt}
                    />
                    
                    ))}
            </div>
        </div>
            
      <DefaultPagination
        itemsPerPage={imagesPerPage}
        totalItems={images.length}
        setActivePage={handlePageChange}
      />
    </div>
  );
};

export default ImageGallery;
