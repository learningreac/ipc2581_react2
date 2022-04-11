import React, { useEffect, useRef } from "react";

const FileForm = React.forwardRef((props, ref) => {
    return (
        <div className="upload-btn">
            <input type="file" name="file-input[]" ref={ref} multiple="" />
            <label htmlFor="file-input">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"></path></svg>
                <span>Upload</span>
            </label>
        </div>
    )
});

const Placeholder = () => {
    return (
        <div className="placeholder">
            <p>Drag glTF 2.0 file or folder here</p>
        </div>
    )
}

const SimpleDropzone = () => {
    const DropzoneRef = useRef(null);
    // const FileInputRef = useRef(null);
    const FileInputRef = React.createRef();
    let dropEl, inputEl;



    useEffect(() => {
        dropEl = DropzoneRef.current;
        inputEl = FileInputRef.current;
    }, [])

    return (
        <div className="dropzone" ref={DropzoneRef}>
            <Placeholder />
            <FileForm ref={FileInputRef} />
        </div>
    )

};

export default SimpleDropzone;

//