import { useState } from "react";
import SiteBlock from "./SiteBlock";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
} from '@/components/ui/context-menu';
import { Button } from "../ui/button";
import SiteEditor from "./SiteEditor";
import { SiteType } from "@/types";

export default function SiteContainer(
    { filteredSites, dispatchSites, inputValue }: {
        filteredSites: SiteType[],
        dispatchSites: (action: { type: string, payload: SiteType }) => void,
        inputValue: string
    }
) {


    const [newSite, setNewSite] = useState<SiteType>({
        "title": "",
        "description": "",
        "homeUrl": "",
        "searchStr": "",
        "tags": [],
        "createdAt": new Date().toISOString(),
    });

    const resetNewSite = () => {
        setNewSite({
            "title": "",
            "description": "",
            "homeUrl": "",
            "searchStr": "",
            "tags": [],
            "createdAt": new Date().toISOString(),
        })
    }

    return (
        <>
            <Dialog>
                <ContextMenu>
                    <ContextMenuTrigger id="context-menu-trigger" className="w-full h-full">
                        <div className="p-8 flex flex-wrap justify-center items-center">
                            {filteredSites.map((site, index) => (
                                <div className="m-1" key={index} onClick={(e) => { e.stopPropagation() }}>
                                    <SiteBlock
                                        site={site}
                                        dispatchSites={dispatchSites}
                                        inputValue={inputValue}
                                    />
                                </div>
                            ))}
                        </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent id="context-menu-content" className="min-w-fit">
                        <DialogTrigger>
                            <ContextMenuItem onClick={() => { }}>添加网站</ContextMenuItem>
                        </DialogTrigger>
                    </ContextMenuContent>
                </ContextMenu>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>添加网站</DialogTitle>
                    </DialogHeader>
                    <SiteEditor site={newSite} setSite={setNewSite} />
                    <DialogFooter>
                        <DialogClose>
                            <Button type="submit" onClick={() => {
                                dispatchSites({ type: "add", payload: newSite })
                                resetNewSite()
                            }}>
                                确定
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </>
    );
}
