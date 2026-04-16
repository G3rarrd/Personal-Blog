"use client";

import Divider from '@/components/Divider';
import MarkdownEditor from '@/components/MarkdownEditor';

import SideBar from '@/components/SideBar';
import { useRef, useState } from 'react';


const HomePage = () => {
    const homePageRef = useRef(null);
    const [ratio, setRatio] = useState(0.3); // 30% sidebar


    return (
        <div ref={homePageRef} className="w-screen h-screen flex items-stretch">
            <SideBar
            flexRatio={ratio}
            />
            <Divider 
            parentRef={homePageRef}
            ratio={ratio}
            setRatio={setRatio}
            />
            <MarkdownEditor
            flexRatio={ratio}
            theme={'obsidian'}
            />
        </div>
    )
}

export default HomePage
