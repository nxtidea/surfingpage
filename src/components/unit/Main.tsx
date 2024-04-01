

import { use, useEffect, useMemo, useReducer, useState } from "react";
import { MyInput } from "./MyInput";
import SiteContainer from "./SiteContainer";
import TagContainer from "./TagContainer";
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import { SiteType } from "@/types";
import { createContext } from "react";
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuRadioItem,
    ContextMenuRadioGroup,
} from '@/components/ui/context-menu';
import { SkeletonCard } from "./SkeletonCard";


export const TagsContext = createContext<string[]>([]);


export default function Main() {
    const { setTheme } = useTheme()
    const [currentTheme, setCurrentTheme] = useState<string>("system");
    useEffect(() => {
        setCurrentTheme(localStorage.getItem("theme") || "system");
    }, []);


    const [isLoading, setIsLoading] = useState(true);

    const GlobalConfigKey = "globalConfig";

    let globalConfig: { setting: any; sites: SiteType[] };
    // if (typeof window !== 'undefined') {
    //     if (localStorage.getItem(GlobalConfigKey)) {
    //         globalConfig = JSON.parse(localStorage.getItem(GlobalConfigKey) as string);
    //     } else {
    //         globalConfig = {
    //             setting: {},
    //             sites: [],
    //         };
    //     }
    // } else {
    //     globalConfig = {
    //         setting: {},
    //         sites: [],
    //     };
    // }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem(GlobalConfigKey)) {
                globalConfig = JSON.parse(localStorage.getItem(GlobalConfigKey) as string);
            } else {
                globalConfig = {
                    setting: {},
                    sites: [],
                };
            }
            dispatchSites({ type: "reset", payload: globalConfig.sites });
            setIsLoading(false);
        } else {
            globalConfig = {
                setting: {},
                sites: [],
            };
            dispatchSites({ type: "reset", payload: globalConfig.sites });
            setIsLoading(false);
        }
    }, []);



    // let globalConfig = {
    //     setting: {},
    //     sites: [],
    // };
    // if (typeof window !== 'undefined') {
    //     if (localStorage.getItem(GlobalConfigKey)) {
    //         globalConfig = JSON.parse(localStorage.getItem(GlobalConfigKey) as string);
    //     }
    // }

    // const [globalConfig, setGlobalConfig] = useState({ setting: {}, sites: [] });
    // useEffect(() => {
    //     setGlobalConfig(JSON.parse(localStorage.getItem(GlobalConfigKey) as string) || globalConfig);
    // }, []);

    // let globalConfig = localStorage.getItem(GlobalConfigKey) ? JSON.parse(localStorage.getItem(GlobalConfigKey) as string) : {
    //     setting: {},
    //     sites: [],
    // }
    const exportConfigToFile = () => {
        const data = JSON.parse(localStorage.getItem(GlobalConfigKey) as string) || globalConfig;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        const downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", dataStr);
        // get time like YYYYMMDD-HHmmss, 获取当地时间
        function formatTime(date: Date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，需要加 1
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}${month}${day}-${hours}${minutes}${seconds}`;
        }
        let currentTime = formatTime(new Date());
        let fileName = `config-${currentTime}.json`;

        downloadAnchorNode.setAttribute("download", fileName);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };
    const importConfigFromFile = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const result = e.target?.result;
                    if (result) {
                        let jsondata = JSON.parse(result as string);
                        if (!checkConfig(jsondata)) {
                            return;
                        }
                        globalConfig = jsondata;
                        // setGlobalConfig(jsondata);
                        dispatchSites({ type: "reset", payload: globalConfig.sites });
                    }
                };
                reader.readAsText(file);
            };
        }
        input.click();
    };
    const checkConfig = (config: any): boolean => {
        if (!config.sites) {
            alert('配置文件缺少 sites 字段');
            return false;
        } else {
            let checkResult = ''
            config.sites.forEach((site: any) => {
                if (!site.title) {
                    checkResult += "有网站没有标题\n";
                }
                if (!site.homeUrl && !site.searchStr) {
                    checkResult += `${site.title} 既没有主页链接也没有搜索链接\n`;
                }
                if (!site.tags || site.tags.length === 0) {
                    checkResult += `${site.title} 至少需要一个标签\n`;
                }
            });
            if (checkResult !== '') {
                alert(checkResult);
                return false;
            }
        }
        return true;
    };


    function sitesReducer(state: SiteType[], action: { type: string; payload: any }) {
        switch (action.type) {
            case "add":
                return [...state, action.payload];
            case "remove":
                return state.filter((site: SiteType) => site.createdAt !== action.payload.createdAt);
            case "update":
                const index = state.findIndex((site: SiteType) => site.createdAt === action.payload.createdAt);
                const newState = [...state];
                newState[index] = action.payload;
                return newState;
            case "reset":
                return action.payload;
            default:
                throw new Error("Unknown action type");
        }
    }
    const [sites, dispatchSites] = useReducer(sitesReducer, []);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(GlobalConfigKey, JSON.stringify({ ...globalConfig, sites: sites }));
        }
    }, [sites]);


    const [inputValue, setInputValue] = useState<string>('');



    const ignoreTags = ["收藏"];
    const tags = useMemo<string[]>((): string[] => {
        const tagSet = new Set<string>();
        sites.forEach((site: SiteType) => {
            site.tags.forEach((tag: string) => {
                if (!ignoreTags.includes(tag)) {
                    tagSet.add(tag);
                }
            });
        });
        return Array.from(tagSet);
    }, [sites]);


    const [selectedTags, setSelectedTags] = useState<string[]>(["收藏"]);
    const clickTag = (tag: string, single: boolean = true) => {
        if (single) {
            if (tag === "收藏") {
                setSelectedTags(selectedTags.includes(tag) ? [] : [tag]);
            } else {
                setSelectedTags(selectedTags.includes(tag) ? ["收藏"] : [tag]);
            }
        } else {
            const newSelectedTags = selectedTags.includes(tag) ? selectedTags.filter(t => t !== tag) : [...selectedTags, tag];
            setSelectedTags(newSelectedTags);
        }
    }


    const filteredSites = useMemo<SiteType[]>(() => {
        if (selectedTags.length === 0) {
            return sites;
        }
        return sites.filter((site: SiteType) => {
            //selectedTags 的所有标签都在 site.tags 中
            return selectedTags.every((tag: string) => site.tags.includes(tag));
        });
    }, [sites, selectedTags]);


    if (isLoading) {
        return <SkeletonCard />;  // or return a loading spinner
    }

    return (
        <div className="flex flex-col h-screen w-3/5 items-center">
            <ContextMenu>
                <ContextMenuTrigger className="w-full min-h-16">
                </ContextMenuTrigger>
                <ContextMenuContent id="main-menu" className="min-w-fit">
                    {/* <ContextMenuItem onClick={() => {
                        setCurrentTheme(themes[(themes.indexOf(currentTheme) + 1) % themes.length]);
                    }}>
                        {
                            currentTheme === "light" ? "主题：浅色" : currentTheme === "dark" ? "主题：深色" : "主题：系统"
                        }
                    </ContextMenuItem> */}
                    <ContextMenuRadioGroup value={currentTheme} onValueChange={(value) => {
                        setCurrentTheme(value);
                        setTheme(value);
                    }}>
                        <ContextMenuRadioItem value="light">浅色</ContextMenuRadioItem>
                        <ContextMenuRadioItem value="dark">深色</ContextMenuRadioItem>
                        <ContextMenuRadioItem value="system">系统</ContextMenuRadioItem>
                    </ContextMenuRadioGroup>
                    <ContextMenuSeparator />
                    <ContextMenuItem onClick={() => importConfigFromFile()}>导入配置</ContextMenuItem>
                    <ContextMenuItem onClick={() => exportConfigToFile()}>导出配置</ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
            <div className="mb-8 flex justify-center w-full">
                <MyInput
                    className="w-2/3 transition-all duration-300 text-center focus:scale-110 focus:text-lg focus:border-primary outline-none focus:shadow dark:shadow-gray-900"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            window.open(`https://www.google.com/search?q=${inputValue}`);
                            setInputValue("");
                        }
                    }}
                />
            </div>
            <div className="my-8">
                <TagContainer
                    tags={tags}
                    clickTag={clickTag}
                    selectedTags={selectedTags}
                    ignoreTags={ignoreTags}
                />
            </div>
            <Separator />
            <TagsContext.Provider value={tags}>
                <SiteContainer
                    filteredSites={filteredSites}
                    dispatchSites={dispatchSites}
                    inputValue={inputValue}
                />
            </TagsContext.Provider>
        </div>
    );
}

