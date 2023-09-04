import { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import { Typography} from '@mui/material';

 export default function ApploadFile({setImages,maxWidth,margin}) {
  const [file, setFile] = useState([]);
  const inputRef = useRef(null);

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (!e.target.files) {
      return;
    }
  
    setFile([...e.target.files]);
    setImages([...e.target.files])
  };


  return (
    <div>
      <Button  color="secondary" variant="outlined"  sx={{borderColor:"black", maxWidth:maxWidth, margin:margin}} onClick={handleUploadClick}>
       <Typography sx={{color:'black'}} fontSize="0.7rem">
        {file.length>0 ?'Loaded': 'Upload location images'}
       </Typography>

      </Button>

      {/* 👇 Notice the `display: hidden` on the input */}
      <input
        accept="image/*"
        multiple
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );

 }
