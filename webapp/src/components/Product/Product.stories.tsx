import { ComponentStory, ComponentMeta } from "@storybook/react";
import Product from "./Product";
import { ProductProps } from "../interfaces";

// Define metadata for the component
export default {
  title: "Components/Product",
  component: Product,
  argTypes: {
    product: { control: "object" },
  },
} as ComponentMeta<typeof Product>;

// Create a template for the component
const Template: ComponentStory<typeof Product> = (args) => (
  <Product {...args} />
);

// Define mock data for the product
const mockProduct: ProductProps = {
  ProductID: 10,
  ProductName: "Sample Product",
  ProductPhotoURL:
    "https://www.myredboxx.com/wp-content/uploads/2020/09/DSC5991-1-scaled.jpg",
  ProductStatus: "Active",
};

// Create a story for the default view of the component
export const Default = Template.bind({});
Default.args = {
  product: mockProduct,
};

// Create a story for the unavailable product
export const Unavailable = Template.bind({});
Unavailable.args = {
  product: {
    ...mockProduct,
    ProductStatus: "InActive",
  },
};

// Create a story for the product with null status
export const NullStatus = Template.bind({});
NullStatus.args = {
  product: {
    ...mockProduct,
    ProductStatus: null,
  },
};
