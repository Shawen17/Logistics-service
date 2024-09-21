import axios from "axios";
import { Order, OrderData,PickerOrder} from "../components/interfaces";
import { searchValue } from "./Performance/Performance";


const PRODUCT_URL = '/api/products/';
const INPIPELINE_URL = '/api/orders/inpipeline';
const UPDATE_STATUS_URL = '/api/orders/update_status';
const ACTIVITY_URL = 'api/activities'
const statusCode = [401,403,419]


const formatDate = (date:string)=>{
  const dateStr = new Date(date)
  return dateStr.toISOString().slice(0, 19).replace("T", " ")
}


const getAllActivities = async (input:searchValue)=>{
  
  let activityData = []
  let expired = false;
  let errorOccured = false;
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${localStorage.getItem("access")}`,
      Accept: "application/json",
    },
  };
    try {
      const queryParams = new URLSearchParams();
  if (input.order) queryParams.append("order", input.order.toString());
  if (input.staff) queryParams.append("staff", input.staff.toString());
  if (input.checked_by) queryParams.append("checked_by", input.checked_by.toString());
  if (input.start_date) queryParams.append("start_date", formatDate(input.start_date));
  if (input.end_date) queryParams.append("end_date", formatDate(input.end_date) );
      const response = await axios.get(`${ACTIVITY_URL}?${queryParams.toString()}`,config);
      if (response?.status === 200) {
          activityData = response.data.data;
} else {
        const message  = response.data.message;
        throw message;
      }
    } catch(err) {
      if (axios.isAxiosError(err)) {
        if(err.response){
          expired = statusCode.includes(err.response.status)
        }
      console.error(err);
      errorOccured = true;
    }
   } 
return {activityData, errorOccured, expired }
}


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





export { getInPipelineData, INPIPELINE_URL, updateOrderStatus, UPDATE_STATUS_URL, getAllProducts, PRODUCT_URL, pickerInpipelineOrder,getAllActivities };
