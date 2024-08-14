import Link from "next/link";
import Button from "./button";

interface HeadingProps {
    title: string;
    description?: string;
}


export default function HeaderDefault({ title, description }: HeadingProps){
    return (
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <span className="text-black text-xl sm:text-2xl md:text-3xl">{title}</span>
            </div>
            <span className="text-black text-lg sm:text-xl md:text-2xl font-light">{description}</span>
        </div>
    );
};

export function HeaderReports(){
    return (
        <div className="w-full space-y-4 sm:space-y-6 py-4">
            <div className="flex flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-text text-3xl sm:text-5xl md:text-6xl font-bold ">Reports</h1>
                </div>
                <div className="flex flex-row gap-4">
                    <Button text="Export" />
                    <Button text="+ Add Report" link="/newReport" />
                </div>
            </div>
            <div className="h-1 bg-[#5e5e5e] rounded-full"></div>
        </div>
    )
}

export function HeaderNewReports(){
    return (
        <div className="w-full space-y-4 sm:space-y-6 py-4">
            <div className="flex flex-row justify-between items-center gap-4">
                {/* navigate to back to reports page */}
                <Button text="<-" link="/" />
                <h1 className="text-text text-3xl sm:text-5xl md:text-6xl font-bold ">New Reports</h1>
            </div>
            <div className="h-1 bg-[#5e5e5e] rounded-full"></div>
        </div>
    )
}