// Database Configuration
export const idbConfig = {
  databaseName: "cart",
  version: 1,
  stores: [
    {
      name: "products",
      id: { keyPath: "id", autoIncrement: true },
      indices: [
        { name: "id", keyPath: "id", options: { unique: true } },
        { name: "quantity", keyPath: "quantity" },
      ],
    },
  ],
};