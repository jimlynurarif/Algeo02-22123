import "./UploadImage.css";
import { 
  Button, 
  Typography,   
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import React, { useState, useRef } from "react";


const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef(null);

  

  
  const data = [
    {
      label: "TEXTURE",
      value: "texture",
      desc: `Explore intricate visual details.`,
    },
    {
      label: "COLOR",
      value: "color",
      desc: `Discover vibrancy in images.`,
    },
  ];

  function selectFiles() {
    fileInputRef.current.click();
  }

  function onFileSelect(event) {
    const files = event.target.files;
    if (files.length === 0) return;

    handleImage(files[0]);
  }

  function handleImage(selectedFile) {
    setIsDragging(false); // Set isDragging to false to hide the drag area

    if (selectedFile.type.split("/")[0] === "image") {
      setImage({
        name: selectedFile.name,
        url: URL.createObjectURL(selectedFile),
      });
    }
  }

  function deleteImage() {
    setImage(null);
    setIsDragging(false); // Set isDragging to true to show the drag area
  }

  function handleDragEnter(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation(); // Stop the event from propagating to parent elements
    setIsDragging(true);
  }

  function handleDrop(e) {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImage(files[0]);
    }
  }

  return (
    <div
      className={`card ${isDragging || image ? "drag-over" : ""} px-4 w-full min-h-screen pb-[100px]`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="top">
        <h1 className="font-bold text-3xl text-accent">Image Processing</h1>
      </div>
      <div className="max-w-[1240px] mx-auto grid md:grid-cols-2 py-9">
        {image ? (
          <div className="container mx-auto flex items-center justify-center">
            <div className="image">
              <span className="delete" onClick={deleteImage}>
                &times;
              </span>
              <img
                className="h-96 w-full rounded-lg object-cover object-center shadow-xl shadow-blue-gray-900/50 aspect-auto"
                src={image.url}
                alt={image.name}
              />
              <Typography as="caption" variant="small" className="mt-2 text-center font-normal">
                {image.name}
              </Typography>
            </div>
          </div>
        ) : (
            <div
              className={`drag-area ${isDragging || isHovered ? "drag-over" : ""} text-gray-600 aspect-square`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
            {isDragging ? (
              <span className="select">Drop image here</span>
            ) : (
              <>
                Drag & drop image here or{" "}
                <span
                  className="select text-blue-400"
                  role="button"
                  onClick={selectFiles}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  Browse
                </span>
              </>
            )}
            <input
              type="file"
              name="file"
              className="file"
              ref={fileInputRef}
              onChange={onFileSelect}
            ></input>
          </div>
        )}
        <div className="mx-auto text-center flex flex-col justify-center items-center">
          <div className="py-10 pb-[100px] ">
            <Button variant="filled" className="" color="green">
              Upload Dataset
            </Button>
          </div>
          <Tabs value="texture" className="w-[300px] ">
            <TabsHeader className="font-bold bg-green-300">
              {data.map(({ label, value }) => (
                <Tab key={value} value={value} className="font-semibold">
                  {label}
                </Tab>
              ))}
            </TabsHeader>
            <TabsBody>
              {data.map(({ value, desc }) => (
                <TabPanel key={value} value={value}>
                  {desc}
                </TabPanel>
              ))}
            </TabsBody>
          </Tabs>
          <div className="py-5">
            <Button variant="filled" className="" color="green">
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
