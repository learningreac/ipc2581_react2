import React, { useCallback} from 'react'
import { useDropzone } from 'react-dropzone'

//MyDropzone
const FileDropZone = ({ setxmlDoc }) => {

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()
      const parser = new DOMParser();

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        // Do whatever you want with the file contents
        const xmlStr = reader.result
      //  console.log(xmlStr, 'xmlStr');
        const parsedXLM = parser.parseFromString(xmlStr, 'text/xml');
        setxmlDoc(parsedXLM);

      }
      reader.readAsText(file)
    })

  }, [setxmlDoc]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });



  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop xmlFile here, or click to select file</p>
    </div>
  )
}

export default FileDropZone;
