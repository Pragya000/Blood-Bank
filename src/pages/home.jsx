import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Logo from '../assets/logo.png';

export default function Home() {
    return (
        <div className="w-screen h-screen grid place-content-center">
            <LazyLoadImage
                alt='Blood Connect'
                effect='blur'
                src={Logo}
                className='w-[250px]'
            />
        </div>
    )
}