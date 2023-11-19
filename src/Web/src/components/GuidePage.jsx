import React from 'react';

const StepCard = ({ title, description }) => (
  <div className=" p-6 bg-gray-100 outline outline-primary  rounded-lg shadow-xl mb-8">
    <h2 className="text-2xl font-semibold mb-4 ">{title}</h2>
    <p className="text-gray-700">{description}</p>
  </div>
);

const GuidePage = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-12">
        <h1 className="text-4xl text-primary font-bold mb-8 text-center">How to Use Our Website</h1>

        <StepCard
          title="Step 1: Upload Dataset"
          description="Start by uploading a dataset of images. Click the 'Upload Dataset' button and select the folder containing your images."
        />

        <StepCard
          title="Step 2: Upload Query Image"
          description="After uploading the dataset, proceed to upload the image you want to compare. Click the 'Upload Query Image' button and select the image file."
        />

        <StepCard
          title="Step 3: Choose Similarity Type"
          description="Choose the type of similarity you want to use – either by color or texture. Use the dropdown menu to make your selection."
        />

        <StepCard
          title="Step 4: Press the Search Button"
          description="Once everything is set, press the 'Search' button. The website will process the images and display the search results, including the percentage of similarity."
        />

        <div className="bg-gray-100 p-6 rounded-lg shadow-xl outline outline-primary">
          <h2 className="text-2xl font-semibold mb-4">Additional Tips</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Make sure your dataset folder contains valid image files.</li>
            <li>Choose the similarity type based on your preference – color or texture.</li>
            <li>Explore the search results to find images with the highest similarity percentage.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GuidePage;
