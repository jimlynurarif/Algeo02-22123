import "./UploadImage.css";
import { Button } from "@material-tailwind/react";
import React, { useState, useRef } from "react";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

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
      className={`card ${isDragging || image ? "drag-over" : ""} `}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="top">
        <p>Drag & Drop image uploading</p>
      </div>
      {image ? (
        <div className="container">
          <div className="image">
            <span className="delete" onClick={deleteImage}>
              &times;
            </span>
            <img
              className="h-96 w-full rounded-lg object-cover object-center shadow-xl shadow-blue-gray-900/50"
              src={image.url}
              alt={image.name}
            />
          </div>
        </div>
      ) : (
        <div
          className={`drag-area ${isDragging ? "drag-over" : ""}  `}
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
              <span className="select" role="button" onClick={selectFiles}>
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
      <div className="mx-auto item-center text-center py-6">
        <Button variant="gradient" className="" color="green">
          Gradient
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
