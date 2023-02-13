import { useState, useEffect, useCallback } from "react";
import usePagination from "../../../hooks/usePagination";
import LoadingSpinner from "../../spinner/LoadingSpinner";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const PostsView = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { page, hasMore, setHasMore, loading, setLoading, lastElementRef } =
    usePagination();

  const fetchData = useCallback(
    async (page: number) => {
      setLoading(true);
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}`
      );
      const data = await res.json();
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevState) => prevState.concat(data));
      }
      setLoading(false);
      return;
    },
    [setHasMore, setLoading]
  );

  useEffect(() => {
    fetchData(page);
  }, [page, fetchData])

  return (
    <div className="my-5 d-grid gap-5">
      {posts.map((post, index, arr) => (
        <div
          key={post.id}
          style={{ width: "min(50rem, 90%)" }}
          className="p-3 mx-auto border border-2 border-primary bg-secondary rounded"
          ref={hasMore && index === arr.length - 1 ? lastElementRef : null}
        >
          <h2>{post.title}</h2>
          <hr />
          <p>{post.body}</p>
        </div>
      ))}
      {loading && <LoadingSpinner><span className="lead fs-1">Loading posts...</span></LoadingSpinner>}
    </div>
  );
};

export default PostsView;
