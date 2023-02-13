import { useState, useEffect, useCallback } from "react";
import usePagination from "../../../hooks/usePagination";
import LoadingSpinner from "../../spinner/LoadingSpinner";

type Photo = {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
};

const PicturesView = () => {
  const [pictures, setPictures] = useState<Photo[]>([]);
  const { page, hasMore, setHasMore, loading, setLoading, lastElementRef } =
    usePagination();

  const fetchData = useCallback(
    async (page: number) => {
      setLoading(true);
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/photos?_page=${page}`
      );
      const data = await res.json();
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setPictures((prevState) => prevState.concat(data));
      }
      setLoading(false);
      return;
    },
    [setHasMore, setLoading]
  );

  useEffect(() => {
    fetchData(page);
  }, [page, fetchData]);

  return (
    <div className="my-5 d-grid gap-5">
      {pictures.map((picture, index, arr) => (
        <div
          key={picture.id}
          style={{ width: "min(50rem, 90%)" }}
          className="d-grid justify-items-center p-3 mx-auto border border-2 border-primary bg-secondary rounded"
          ref={hasMore && index === arr.length - 1 ? lastElementRef : null}
        >
          <h2 className="text-center">{picture.title}</h2>
          <hr />
          <img className="mx-auto mw-100" src={picture.url} alt={picture.title} />
        </div>
      ))}
      {loading && (
        <LoadingSpinner>
          <span className="lead fs-1">Loading pictures...</span>
        </LoadingSpinner>
      )}
    </div>
  );
};

export default PicturesView;
