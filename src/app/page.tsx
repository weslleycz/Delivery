"use client";
import { IProduct } from "@/types/Product";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Pagination, PaginationItem } from "@mui/material";
import { useState } from "react";
import { useQuery } from "react-query";
import "react-toastify/dist/ReactToastify.css";
import { api } from "../services/apí";

export default function Home() {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const fetchProjects = (page = 1) =>
        api.get(`/product?page=${page}`).then((res) => {
            res.data.totalPages != totalPages
                ? setTotalPages(
                      res.data.totalPages != 0 ? res.data.totalPages : 1
                  )
                : null;
            return res.data;
        });

    const { isLoading, isError, error, data, isFetching, isPreviousData } =
        useQuery({
            queryKey: ["projects", page],
            queryFn: () => fetchProjects(page),
            keepPreviousData: true,
        });

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <>
            {isLoading ? (
                <>Loading...</>
            ) : (
                <ul>
                    {data.products.map((product: IProduct) => (
                        <li key={product.id}>{product.name}</li>
                    ))}
                </ul>
            )}
            <Pagination
                count={totalPages}
                page={page}
                onChange={handleChange}
                renderItem={(item) => (
                    <PaginationItem
                        slots={{
                            previous: ArrowBackIcon,
                            next: ArrowForwardIcon,
                        }}
                        {...item}
                    />
                )}
            />
        </>
    );
}
