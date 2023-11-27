import useCustomTitle from "../hooks/useCustomTitle"

export default  function Error() {

    useCustomTitle("Blood Connect | 404 Page Not Found")

    return (
        <div>
            404 - Page Not Found
        </div>
    )
}