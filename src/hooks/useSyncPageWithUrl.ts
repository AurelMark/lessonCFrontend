'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTagBlogFilter } from '@/store/useTagBlogFilter'
import { useCourseFilter } from '@/store/useCourseFilter'
import { useTagNewsFilter } from '@/store/useTagNewsFilter'
import { useContactStore } from '../store/useContactFilter'

type Mode = "blog" | "courses" | 'news' | 'contact';

export function useSyncPageWithUrl(mode: Mode) {
    const searchParams = useSearchParams()
    const setPageBlog = useTagNewsFilter((state) => state.setPage);
    const setPageCourses = useCourseFilter((state) => state.setPage);
    const setPageNews = useTagBlogFilter((state) => state.setPage);
    const setPageContacts = useContactStore((state) => state.setPage);

    useEffect(() => {
        const pageParam = searchParams.get('page')
        const page = pageParam ? parseInt(pageParam, 10) : 1
        if (!isNaN(page)) {
            if (mode === "blog") {
                setPageBlog(page)
            } else if (mode === "courses") {
                setPageCourses(page)
            } else if (mode === 'news') {
                setPageNews(page)
            } else if (mode === 'contact') {
                setPageContacts(page)
            }
        }
    }, [searchParams, setPageBlog, setPageCourses, setPageNews, mode, setPageContacts])
}
