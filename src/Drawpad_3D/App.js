import './style.css';
import Header from './components/Header';
import SPDropzone from './components/SPDropzone';
import ThreeCanvas from './components/ThreeCanvas';
import { useState } from 'react';

const App = () => {
    const [file, setFile] = useState();
    return (
        <div className='dr3App'>
            <Header />
            <main className='wrap'>
                <SPDropzone />
                <ThreeCanvas />
            </main>

        </div>

    )
};

export default App;