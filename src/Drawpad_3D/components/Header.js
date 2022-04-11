const Header = () => {
    return (
        <header>
            <h1><a href="/">glTF Viewer</a></h1>
            <span className="separator layout-md"> | </span>
            <a className="item layout-md" target="_blank" href="https://github.com/mrdoob/three.js/tree/r139">
                three.js r139
            </a>
            <span className="separator layout-md"> | </span>
            <a className="item layout-md" target="_blank" href="https://github.com/mrdoob/three.js/blob/r139/examples/js/loaders/GLTFLoader.js">
                THREE.GLTFLoader@r139
            </a>
            <span className="separator"> | </span>
            <a className="item" target="_blank" href="https://github.com/donmccurdy/three-gltf-viewer/issues/new">
                help & feedback
            </a>
            <span className="separator"> | </span>
            <a className="item" target="_blank" href="https://github.com/donmccurdy/three-gltf-viewer">
                source
            </a>
            <span className="flex-grow"></span>
            <button id="download-btn" className="item" style={{ display: 'none' }}>⬇&nbsp;&nbsp;&nbsp;Download</button>
        </header>

    )
};

export default Header;