"use client"

import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
} from '@/components/ui/context-menu';
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { useEffect, useMemo, useState } from 'react';
import { DialogClose } from '@radix-ui/react-dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import SiteEditor from './SiteEditor';
import { SiteType } from '@/types';



export default function SiteBlock(
    { site, dispatchSites, inputValue }: {
        site: SiteType,
        dispatchSites: (action: { type: string, payload: SiteType }) => void,
        inputValue: string
    }
) {


    function clickSite(site: SiteType) {
        if (inputValue !== '') {
            window.open(site.searchStr.replace('%s', inputValue))
        } else {
            window.open(site.homeUrl)
        }
    }

    const [newSite, setNewSite] = useState<SiteType>({
        title: '',
        description: '',
        homeUrl: '',
        searchStr: '',
        tags: [],
        createdAt: new Date().toISOString(),
    })


    const showInactive = useMemo(() => {
        let showInactive = inputValue !== '' && site.searchStr === ''
        return showInactive
    }, [inputValue])


    const siteFavorate = useMemo(() => {
        return site.tags.includes('收藏')
    }, [site])


    function changeFavorate() {
        let newSite = { ...site }
        if (siteFavorate) {
            newSite.tags = newSite.tags.filter(tag => tag !== '收藏')
        } else {
            newSite.tags.push('收藏')
        }
        dispatchSites({ type: 'update', payload: newSite })
    }


    return (
        <>
            <Dialog>
                <ContextMenu>
                    <ContextMenuTrigger className={"px-2 py-1 border rounded-lg transition-all hover:text-primary hover:border-primary " + (showInactive ? 'opacity-20 cursor-not-allowed' : '')}>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className={showInactive ? ' cursor-not-allowed' : ''}>
                                    <span onClick={(e) => {
                                        clickSite(site)
                                    }}>
                                        {siteFavorate ? '★' : ''} {site.title}
                                    </span>
                                </TooltipTrigger>
                                {site.description && (
                                    <TooltipContent>
                                        {site.description}
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </TooltipProvider>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="min-w-fit">
                        <ContextMenuItem onClick={() => changeFavorate()}>
                            {siteFavorate ? '取消收藏' : '添加收藏'}
                        </ContextMenuItem>
                        <DialogTrigger>
                            <ContextMenuItem onClick={() => { setNewSite(site) }}>
                                修改网站
                            </ContextMenuItem>
                        </DialogTrigger>
                        <ContextMenuItem onClick={() => dispatchSites({ type: 'remove', payload: site })}>
                            删除网站
                        </ContextMenuItem>
                    </ContextMenuContent >
                </ContextMenu >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>修改网站</DialogTitle>
                    </DialogHeader>
                    <SiteEditor site={newSite} setSite={setNewSite} />
                    <DialogFooter>
                        <DialogClose>
                            <Button type="submit" onClick={() => {
                                dispatchSites({ type: 'update', payload: newSite })
                            }}>
                                确定
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog >
        </>
    )
}
