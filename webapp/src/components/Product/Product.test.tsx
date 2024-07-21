import { render, screen, fireEvent } from "@testing-library/react";
import Product from "./Product";
import { ProductProps } from "../interfaces";
import "@testing-library/jest-dom/extend-expect";
import { pink } from "@mui/material/colors";

const mockProduct: ProductProps = {
  ProductID: 123,
  ProductName: "Test Product",
  ProductPhotoURL: "https://via.placeholder.com/150",
  ProductStatus: "Active",
};

describe("Product Component", () => {
  it("renders product details correctly", () => {
    render(<Product product={mockProduct} />);

    // Check if product name is displayed
    expect(screen.getByText(mockProduct.ProductName)).toBeInTheDocument();

    // Check if product ID is displayed
    expect(
      screen.getByText(`Id: ${mockProduct.ProductID}`)
    ).toBeInTheDocument();

    // Check if product image is displayed
    const img = screen.getByAltText("product") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe(mockProduct.ProductPhotoURL);
  });

  it("toggles like state on click", () => {
    render(<Product product={mockProduct} />);

    const likeIcon = screen.getByTestId("like-icon");

    // Initially, like icon should not have the pink color
    expect(likeIcon).not.toHaveStyle({ color: pink[500] });

    // Click the like icon
    fireEvent.click(likeIcon);

    // After clicking, like icon should have the pink color
    expect(likeIcon).toHaveStyle({ color: pink[500] });

    // Click the like icon again
    fireEvent.click(likeIcon);

    // After clicking again, like icon should not have the pink color
    expect(likeIcon).not.toHaveStyle({ color: pink[500] });
  });

  it("renders the pick button", () => {
    render(<Product product={mockProduct} />);

    const pickButton = screen.getByText("Pick");

    // Check if the pick button is rendered
    expect(pickButton).toBeInTheDocument();

    // Check if the pick button has the correct class names
    expect(pickButton).toHaveClass(
      "bg-teal-500 text-white rounded text-2x1 p-1 mt-1 hover:bg-teal-600 hover:shadow-lg transition duration-300"
    );
  });
});
