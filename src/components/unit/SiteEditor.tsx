import { Label } from "@radix-ui/react-context-menu";
import { Input } from "../ui/input";
import { useContext, useEffect, useMemo, useState } from "react";
import { SiteType } from "@/types";
import { Autocomplete } from "../tag/autocomplete";
import { TagsContext } from "./Main";
import { TagInput } from "../tag/tag-input";


export default function SiteEditor(
    { site, setSite }: {
        site: SiteType,
        setSite: (site: SiteType) => void
    }
) {


    // homeUrl 为空时，尝试从 searchStr 中匹配
    const matchHome = useMemo<string>(() => {
        if (site.searchStr) {
            const matchHomes = site.searchStr.match(/https?:\/\/.*?\//g)
            if (matchHomes && matchHomes.length > 0) {
                return matchHomes[0]
            }
        }
        return ''
    }, [site.searchStr])

    useEffect(() => {
        if (site.homeUrl === '' || site.homeUrl === null) {
            setSite({ ...site, homeUrl: matchHome })
        }
    }, [matchHome])

    const allTags = useContext(TagsContext)
    const [tempTags, setTempTags] = useState<Array<{ id: string, text: string }>>(site.tags.map(tag => ({ id: tag, text: tag })))

    useEffect(() => {
        setSite({ ...site, tags: tempTags.map(tag => tag.text) })
    }, [tempTags])

    return (
        <div className="grid gap-4 py-4">
            <div className="grid items-center grid-cols-4 gap-4">
                <Label className="text-right" >
                    标题
                </Label>
                <Input className="col-span-3" value={site.title} onChange={(e) => setSite({ ...site, title: e.target.value })} />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
                <Label className="text-right">
                    描述
                </Label>
                <Input className="col-span-3" value={site.description} onChange={(e) => setSite({ ...site, description: e.target.value })} />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
                <Label className="text-right">
                    主页
                </Label>
                <Input className="col-span-3" value={site.homeUrl} onChange={(e) => setSite({ ...site, homeUrl: e.target.value })} />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
                <Label className="text-right">
                    搜索
                </Label>
                <Input className="col-span-3" value={site.searchStr} onChange={(e) => setSite({ ...site, searchStr: e.target.value })} />
            </div>
            <div className="grid items-center grid-cols-4 gap-4">
                <Label className="text-right">
                    标签
                </Label>
                {/* <Input id='sitetags' className="col-span-3" /> */}
                <div className="col-span-3">
                    <TagInput tags={tempTags} setTags={setTempTags} enableAutocomplete={true} autocompleteOptions={allTags.map(tag => ({ id: tag, text: tag }))} />
                </div>
            </div>
        </div >
    );
}
