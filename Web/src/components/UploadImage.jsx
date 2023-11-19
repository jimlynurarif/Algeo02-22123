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
import axios from "axios";
import Dropzone from "react-dropzone";
import ImageGallery from "./ImageGallery";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileZipper } from '@fortawesome/free-regular-svg-icons';



const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef(null);
  const [currentTab, setCurrentTab] = useState("texture");
  const [searchResult, setSearchResult] = useState(null); // New state to track search result
  const [filesInFolder, setFilesInFolder] = useState([]);
  const [zipName, setZipName] = useState(null);


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

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const uploadFolder = async () => {
    if (!file) {
      console.error('No image selected');
      toast.error("Please select a zip file", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000, // Auto close the notification after 3000 milliseconds (adjust as needed)
      });
      return;
    }

    const formData = new FormData();
    formData.append('images', file);

    try {
      // Display a success notification
      toast.success("Dataset uploaded and processing started successfully", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 4000,
      });
      // Send the request to the backend
      const response = await axios.post('http://localhost:5000/upload', formData);
      
      const { zipName, filesInFolder, notif } = response.data;

      console.log('zipname: ',zipName);
      console.log('file: ',filesInFolder);
      console.log('notif: ',notif);

      setZipName(zipName);
      setFilesInFolder(filesInFolder);
      if (notif === 1) {
        toast.success("Processing completed!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 4000,
        });
      }

      if (response.data && response.data.hideNotification) {
        toast.dismiss();  // Hide the initial notification
      }

      console.log('Folder uploaded successfully!');
    } catch (error) {
      console.error('Error uploading folder:', error);
    }
  };

  const search = async () => {

    if (!image || !image.file) {
      
      toast.error("Please select an image before searching", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000, // Auto close the notification after 3000 milliseconds (adjust as needed)
      });

      return;
    }
  
    const formData = new FormData();
    formData.append('image', image.file);
    formData.append('tab', currentTab);
  
    try {
      const response = await axios.post('http://localhost:5000/upload-search', formData);
  
      // Assuming the result, jumlah_gambar, and durasi are in the response
      const { result, jumlah_gambar, durasi } = response.data;
  
      console.log('Result:', result);
      console.log('Jumlah Gambar:', jumlah_gambar);
      console.log('Durasi:', durasi);
  
      // Check if the result object is empty
      if (Object.keys(result).length === 0 && result.constructor === Object) {
        // Handle the case when no result is found
        setSearchResult(null); // Clear the existing search result
        toast.warn("No result found", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000, // Auto close the notification after 3000 milliseconds (adjust as needed)
        });
      } else {
        // Call the onSearchResult function with the received data
        setSearchResult({
          images: JSON.parse(result),
          jumlahGambar: jumlah_gambar,
          durasi: durasi,
        });
      }
    } catch (error) {
      // Handle errors
      console.error('Error uploading image:', error);
    }
  };
  

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
        file: selectedFile,
        name: selectedFile.name,
        url: URL.createObjectURL(selectedFile),
      });
    }
  }

  function deleteImage() {
    setImage(null);
    setIsDragging(false); // Set isDragging to true to show the drag area
  }

  function deleteSelectedFile () {
    setFile(null);
  };

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
      onDroP={handleDrop}
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
              onDroP={handleDrop}
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
            {filesInFolder.length > 0 && (
              <div className="mt-4 p-4 border border-gray-300 rounded bg-gray-100">
                <p className="text-lg font-bold text-gray-800">
                  The dataset loaded is <span className="text-green-600">{zipName}</span>
                </p>
              </div>
            )}
          <div className="py-10 pb-[80px] ">
            <div className="pb-5"> 
            <Dropzone onDrop={onDrop} accept=".zip" multiple={false}>
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps({
                  className: 'dropzone bg-white border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer',
                })}
              >
                <input {...getInputProps()} />
                {file ? (
                  <>
                    <FontAwesomeIcon icon={faFileZipper} bounce size="2xl"   style={{ color: '#00d636'}} />
                    <p className="text-sm text-gray-600 pt-6">
                      <strong>Selected file:</strong> {file.name}
                    </p>
                    <button
                      className="text-sm text-red-500 hover:text-red-700 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring focus:border-blue-300"
                      onClick={deleteSelectedFile}
                    >
                      Delete and Select Again
                    </button>
                  </>
                ) : (
                <>
                  <FontAwesomeIcon icon={faFileZipper} size="2xl" />
                  <p className="text-sm text-gray-600 pt-6">Drag & drop a ZIP file here, or click to select</p>
                </>
                )}
              </div>
            )}
          </Dropzone>
          </div>
          <Button type="button" variant="filled" className="" color="green" onClick={uploadFolder}>
            Upload Dataset
          </Button>
            <ToastContainer/>
          </div>

          <div>
          <Tabs value={currentTab} className="w-[300px] ">
            <TabsHeader className="font-bold bg-green-300">
              {data.map(({ label, value }) => (
                <Tab
                  key={value}
                  value={value}
                  className={`font-semibold ${currentTab === value ? '' : ''}`}
                  onClick={() => setCurrentTab(value)}
                >
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
          </div>
          <div className="py-1">
            <Button variant="filled" className="" color="green" onClick={search}>
              Search
            </Button>
            <ToastContainer />
          </div>
        </div>
      </div>
            {searchResult && (
              <div className="max-w-[1240px] mx-auto">
                {/* Conditionally render ImageGallery when search result is available */}
                <ImageGallery
                  searchResult={searchResult.images}
                  jumlahGambar={searchResult.jumlahGambar}
                  durasi={searchResult.durasi}
                />
              </div>
            )}
    </div>
  );
};

export default ImageUpload;
