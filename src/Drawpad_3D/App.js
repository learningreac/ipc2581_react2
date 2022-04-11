import './style.css';
import Header from './components/Header';
import SimpleDropzone from './components/SimpleDropzone';
import ThreeCanvas from './components/ThreeCanvas';

const App = () => {
    return (
        <div className='dr3App'>
            <Header />
            <main className='wrap'>
                <SimpleDropzone />
                <ThreeCanvas />
            </main>

        </div>

    )
};

export default App;