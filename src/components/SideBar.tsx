"use client";
interface SideBarProps {
    flexRatio: number
}
const SideBar = ({flexRatio }: SideBarProps) => {
    return (
    <aside className="w-64  bg-gray-200 theme-obsidian"
    style={{backgroundColor :`var(--cm-foreground)`, flex : `${flexRatio}`}}>
        Sidebar
    </aside>
    )
}

export default SideBar
