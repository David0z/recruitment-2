import { useState, useCallback, useRef} from 'react'

const usePagination = () => {
  const observer = useRef<IntersectionObserver>()
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)

  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;

    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])


  return {page, hasMore, setHasMore, loading, setLoading, lastElementRef}
}

export default usePagination;