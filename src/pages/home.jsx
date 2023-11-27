import Logo from '../assets/logo.png';
import MyImage from '../components/common/MyImage';

export default function Home() {
    return (
        <div className="w-screen h-screen grid place-content-center">
            <MyImage
                alt='Blood Connect'
                src={Logo}
                className='w-[250px]'
            />
        </div>
    )
}