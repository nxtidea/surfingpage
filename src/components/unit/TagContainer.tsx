
import TagBlock from "./TagBlock"


export default function TagContainer(
    { tags, clickTag, selectedTags, ignoreTags }: {
        tags: string[],
        clickTag: (tag: string) => void,
        selectedTags: string[],
        ignoreTags: string[]
    }) {
    return (
        <div className="flex flex-wrap justify-center items-center">
            {
                ignoreTags.map((tag, index) => (
                    <TagBlock key={index + 1} tag={tag} clickTag={clickTag} selectedTags={selectedTags} />
                ))
            }
            {
                tags.map((tag, index) => (
                    <TagBlock key={index + ignoreTags.length + 1} tag={tag} clickTag={clickTag} selectedTags={selectedTags} />
                ))
            }
        </div>
    )
}