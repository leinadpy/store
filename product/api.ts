import axios from "axios";
import { Product } from "./types";
import Papa from "papaparse";

export const api = {
  list: async (): Promise<Product[]> => {
    return axios
      .get(
        `https://docs.google.com/spreadsheets/d/e/2PACX-1vS2-cebqRd1t_hMufpJjGqCpP69XLGrX--9dYTOzHtzvB0VkNTToXU0bNdu5lH_Ak26OuS-uxLqwmwL/pub?output=csv`,
        {
          responseType: "blob",
        }
      )
      .then(
        (response) =>
          new Promise<Product[]>((resolve, reject) => {
            Papa.parse(response.data, {
              header: true,
              complete: (results) => {
                const products = results.data as Product[];

                return resolve(
                  products.map((product) => ({
                    ...product,
                    price: Number(product.price),
                  }))
                );
              },
              error: (error) => reject(error.message),
            });
          })
      );
  },
};
