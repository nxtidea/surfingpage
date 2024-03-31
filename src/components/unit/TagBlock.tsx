import { useMemo, useState } from "react"



export default function TagBlock({ tag, clickTag, selectedTags }:
    { tag: string, clickTag: (tag: string, single: boolean) => void, selectedTags: string[] }
) {

    const tagSelected = useMemo(() => {
        return selectedTags.includes(tag)
    }, [selectedTags, tag])

    return (
        <div className={"m-1 px-2 py-1 border rounded-lg cursor-pointer hover:text-primary hover:border-primary transition-all " + (tagSelected ? " text-primary border-primary text-lg" : "")}
            onClick={(e) => {
                //区分 ctrl 点击和单击
                if (e.ctrlKey) {
                    clickTag(tag, false)
                } else {
                    clickTag(tag, true)
                }
            }}>
            {
                tag === "收藏" ? '★' : '#'
            }{tag}
        </div>
    )
}