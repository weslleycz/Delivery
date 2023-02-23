import { api } from "@/services/apí";
import AddIcon from "@mui/icons-material/Add";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Box, Container, Fab } from "@mui/material";
import { getCookie } from "cookies-next";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { MRT_Localization_PT_BR } from "material-react-table/locales/pt-BR";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Pros } from "../../components/CardRestaurant";
import { ButtonsCrud } from "../ButtonsCrud";

type Props = {
    setPage: any;
    restaurant: Pros | undefined;
};

type Product = {
    id: string;
    name: string;
    price: number;
    description: string;
    type: string;
    img: string;
    discount: string;
    cartId: string;
    restaurantId: string;
    orderId: string;
};

export const ProductsRestaurant = ({ setPage, restaurant }: Props) => {
    const token = getCookie("@tokenAdmin");

    const fetchUsers = async () => {
        const res = await api.get(`/product/restaurant/${restaurant?.id}`, {
            headers: {
                Authorization: token,
            },
        });
        return res.data;
    };

    const { data, status, isLoading, refetch } = useQuery(
        "restaurants",
        fetchUsers
    );

    const [rowSelection, setRowSelection] = useState({});

    const columns = useMemo<MRT_ColumnDef<Product>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Nome",
            },
            {
                accessorKey: "price",
                header: "Preço",
                Cell: ({ cell }) => (
                    <Box
                        component="span"
                        sx={(theme) => ({
                            backgroundColor: "#bd77eb",
                            borderRadius: "0.25rem",
                            color: "#fff",
                            maxWidth: "9ch",
                            p: "0.25rem",
                        })}
                    >
                        {(cell.getValue<number>() / 100).toLocaleString?.(
                            "pt-br",
                            {
                                style: "currency",
                                currency: "BRL",
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            }
                        )}
                    </Box>
                ),
            },
            {
                accessorKey: "type",
                header: "Tipo",
            },
        ],
        []
    );

    return (
        <>
            <Container sx={{ m: 7 }}>
                <ChevronLeftIcon
                    sx={{ cursor: "pointer" }}
                    onClick={() => setPage("restaurants")}
                />
                <MaterialReactTable
                    enableRowSelection
                    pageCount={5}
                    maxLeafRowFilterDepth={5}
                    paginateExpandedRows={true}
                    selectAllMode={"page"}
                    onRowSelectionChange={setRowSelection}
                    state={{ rowSelection }}
                    columns={columns}
                    rowNumberMode={"static"}
                    localization={MRT_Localization_PT_BR}
                    initialState={{ pagination: { pageSize: 4, pageIndex: 0 } }}
                    data={data}
                    renderTopToolbarCustomActions={({ table }) => {
                        return (
                            <>
                                <ButtonsCrud
                                    setRowSelection={setRowSelection}
                                    refetch={refetch}
                                    data={data}
                                    rowSelection={rowSelection}
                                />
                            </>
                        );
                    }}
                    renderBottomToolbarCustomActions={({ table }) => {
                        return (
                            <>
                                <Box sx={{ p: 1 }}>
                                    <Fab color="primary" aria-label="add">
                                        <AddIcon />
                                    </Fab>
                                </Box>
                            </>
                        );
                    }}
                />
            </Container>
        </>
    );
};
