import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

interface SwitchProps {
    open: boolean
}

export default function Switch({open}: SwitchProps) {
    const [icon, setIcon] = useState("tabler:moon");

    useEffect(() => {
        if (open) {
            setIcon("tabler:moon");
        }
        else {
            setIcon("tabler:sun");
        }
    }, [open]);

    return (
        <div className={`w-6 h-4 dark:bg-zinc-600 bg-slate-300 rounded-full flex items-center px-px transition-colors`}>
            <div className={`w-3 h-3 dark:text-white text-black rounded-full transition-[transform,color] ${open ? "translate-x-3" : ""}`}>
                <Icon icon={icon} className="w-full h-full"/>
            </div>
        </div>
    )
}