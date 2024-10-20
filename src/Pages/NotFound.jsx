import { TbFaceIdError } from "react-icons/tb";

import ErrorBoundary from "antd/es/alert/ErrorBoundary"

export default function NotFound() {
    return(
        <div className="flex justify-center items-center min-h-screen min-w-screen">
            <ErrorBoundary/>
            <TbFaceIdError className="text-9xl" />
            <h1 className="text-4xl font-bold text-black">Page Not Found</h1>
        </div>
    )
};
