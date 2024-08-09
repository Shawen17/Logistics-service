import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ProductsPage from "./ProductsPage";
import { getAllProducts } from "../ApiHelper";

// Mocking getAllProducts function
jest.mock("../ApiHelper", () => ({
  getAllProducts: jest.fn(),
}));

describe("ProductsPage", () => {
  const mockProducts = [
    {
      ProductID: 1,
      ProductName: "Product 1",
      ProductPhotoURL: "url1",
      ProductStatus: "Active",
    },
    {
      ProductID: 2,
      ProductName: "Product 2",
      ProductPhotoURL: "url2",
      ProductStatus: "Active",
    },
  ];

  it("displays a loading spinner while fetching products", async () => {
    (getAllProducts as jest.Mock).mockResolvedValueOnce({
      productData: [],
      errorOccured: false,
    });

    render(
      <Router>
        <ProductsPage />
      </Router>
    );

    expect(screen.getByTestId("loading-spinner-container")).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.queryByTestId("loading-spinner-container")
      ).not.toBeInTheDocument()
    );
  });

  it("displays the products after loading", async () => {
    (getAllProducts as jest.Mock).mockResolvedValueOnce({
      productData: mockProducts,
      errorOccured: false,
    });

    render(
      <Router>
        <ProductsPage />
      </Router>
    );

    await waitFor(() =>
      expect(screen.getByText("Product 1")).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.getByText("Product 2")).toBeInTheDocument()
    );
  });

  it("displays an error message if fetching products fails", async () => {
    (getAllProducts as jest.Mock).mockResolvedValueOnce({
      productData: [],
      errorOccured: true,
    });

    render(
      <Router>
        <ProductsPage />
      </Router>
    );

    await waitFor(() =>
      expect(screen.getByTestId("error-container")).toBeInTheDocument()
    );
  });
});
