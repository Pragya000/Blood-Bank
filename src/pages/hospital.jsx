import { useParams } from "react-router-dom";

export default function Hospital() {
    const { hospitalId } = useParams();

    return (
        <div>
            <h1>Hospital {hospitalId}</h1>
        </div>
    );
}