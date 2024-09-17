import axios from "axios";
import { Order, OrderData,PickerOrder} from "../components/interfaces";


const PRODUCT_URL = '/api/products/';
const INPIPELINE_URL = '/api/orders/inpipeline';
const UPDATE_STATUS_URL = '/api/orders/update_status';









const getAllProducts = async ()=>{
  let productData
  let errorOccured = false;
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
    try {
      const response = await axios.get(PRODUCT_URL,config);
      if (response?.status === 200) {

       productData = response.data.data;


      } else {
        const message  = response.data.message;
        throw message;
      }
    } catch(err) {
      console.error(err);
      errorOccured = true;
    }
    return {productData, errorOccured }
}

const pickerInpipelineOrder = async (picker:string) => {
  const orderData: PickerOrder = {
    InProgress: [],
    QA: [],
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${localStorage.getItem("access")}`,
      Accept: "application/json",
    },
  };
  let errorOccured = false;
  try {
    const response = await axios.get(`/api/orders/pickerinpipeline?user=${picker}`,config);
    if (response?.status === 200) {
      const { data } = response.data;
      data.forEach((order: Order) => {
        orderData[order.OrderStatus as keyof PickerOrder].push(order);
      });
    } else {
      const { message } = response.data;
      throw message;
    }
  } catch(err) {
    console.error(err);
    errorOccured = true;
  }
  return { orderData, errorOccured };
};





const getInPipelineData = async () => {
    const orderData: OrderData = {
      Queued: [],
      InProgress: [],
      QA: [],
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
        Accept: "application/json",
      },
    };
    let errorOccured = false;
    try {
      const response = await axios.get(INPIPELINE_URL,config);
      if (response?.status === 200) {
        const { data } = response.data;
        data.forEach((order: Order) => {
          orderData[order.OrderStatus as keyof OrderData].push(order);
        });
      } else {
        const { message } = response.data;
        throw message;
      }
    } catch(err) {
      console.error(err);
      errorOccured = true;
    }
    return { orderData, errorOccured };
};



const updateOrderStatus = async (order: Order, newOrderStatus: string, user:string) => {
    const updatedOrder = { ...order, OrderStatus: newOrderStatus, TreatedBy : user};
    let orderStatusUpdated = false;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
        Accept: "application/json",
      },
    };
    try {
        const response = await axios.put(UPDATE_STATUS_URL, updatedOrder,config);
        if (response?.status === 200) orderStatusUpdated = true;
        else {
            const { message } = response.data;
            throw message;
        }
    } catch(err) {
        console.error(err);
    }
    return orderStatusUpdated;
};

const handlePrint = () => {
  const printWindow = window.open('', '', 'height=800,width=600');
  
  if (printWindow) {
    const headingElement = document.querySelector('h2');
    const orderSheetElement = document.querySelector('OrderSheetPage');

    if (headingElement && orderSheetElement) {
      printWindow.document.write('<html><head><title>Print Order Sheet</title>');
      printWindow.document.write('<link rel="stylesheet" href="./PickerDashBoard/print.css">'); // Include print-specific CSS if needed
      printWindow.document.write('</head><body>');
      printWindow.document.write(headingElement.outerHTML); // Print the Order Sheet heading
      printWindow.document.write(orderSheetElement.outerHTML); // Print the Order Sheet content
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    } else {
      console.error('Required elements not found for printing.');
    }
  }
};



export { getInPipelineData, INPIPELINE_URL, updateOrderStatus, UPDATE_STATUS_URL, getAllProducts, PRODUCT_URL, pickerInpipelineOrder, handlePrint };
