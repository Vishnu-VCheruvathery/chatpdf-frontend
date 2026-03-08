import React, { useEffect, useRef, useState } from 'react'
import './drop-fileInput.css'
import { ImageConfig } from './ImageConfig';
import { socket } from '../socket';
import api from '../../api/instance';


interface DropFileInputProps {
  onFileChange: (files: File[]) => void;
  convId: string | undefined
}

const DropFileInput: React.FC<DropFileInputProps> = ({ onFileChange, convId }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [fileList, setFileList] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false)
  const onDragEnter = () => wrapperRef.current?.classList.add('dragover')

  const onDragLeave = () => wrapperRef.current?.classList.remove('dragover');
  
  const onDrop = () => wrapperRef.current?.classList.remove('dragover');

  const getFileIcon = (file: File): string => {
  const fileType = file.type.split('/')[1] as keyof typeof ImageConfig;
  return ImageConfig[fileType] ?? ImageConfig.default;
};

  const onFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0];
    if(newFile){
        const updatedList = [...fileList, newFile];
        setFileList(updatedList);
        onFileChange(updatedList)
    }
  }

  const fileRemove = (file: File) => {
    const updatedList = [...fileList]
    updatedList.splice(fileList.indexOf(file), 1);
    setFileList(updatedList);
    onFileChange(updatedList)
  }

useEffect(() => {
  const handler = (value: number) => {
    setShowProgress(true);
    setProgress(value);

    if (value === 100) {
      setTimeout(() => {
        setShowProgress(false);
        setFileList([]);
        setProgress(0);
      }, 500);
    }
  };

  socket.on("progress", handler);

  return () => {
    socket.off("progress", handler);
  };
}, []);


  const uploadFile = async() => {
    if(fileList.length > 0){
       const formData = new FormData();
    formData.append('file', fileList[0])
    if(convId){
         formData.append('convId', convId)
    }else{
      return
    }
    try {
      const response = await api.post(`/upload`, formData);
      console.log(response.data)
    } catch (error) {
      console.log(error);
    }
    }else{
      window.alert('Please select a file to upload!')
    }
  
  }


  return (
    <div className='w-full flex items-center flex-col'>
        <div
    ref={wrapperRef}
    className='drop-file-input'
    onDragEnter={onDragEnter}
    onDragLeave={onDragLeave}
    onDrop={onDrop}
    >
       {showProgress ? <div className="radial-progress" style={{ "--value": progress } as React.CSSProperties} 
  aria-valuenow={progress} role="progressbar">{progress}%</div> :
    <div className='drop-file-input_label'>
         <img src={"https://media.geeksforgeeks.org/wp-content/uploads/20240308113922/Drag-.png"}
                        alt="" />
      </div>
  }
     
      <input type='file' value="" onChange={onFileDrop}/>
    </div>
    {
      fileList.length > 0 ? (
        <div className='drop-file-preview'>
          <p className="drop-file-preview__title">
            Ready to upload
          </p>
          {
          fileList.map((item, index) => (
                                <div key={index} className="drop-file-preview__item">
                                    <img src={getFileIcon(item)} alt="" />
                                    <div className="drop-file-preview__item__info">
                                        <p>{item.name}</p>
                                        <p>{item.size}B</p>
                                    </div>
                                    <span className="drop-file-preview__item__del"
                                        onClick={() => fileRemove(item)}>
                                        x
                                    </span>
                                </div>
                            ))
          }
        </div>
      ) : null
    } 
          {fileList.length > 0 ?  <button className="btn btn-success" onClick={uploadFile}>Upload</button> : null}
          
    </div>


  )
}

export default DropFileInput