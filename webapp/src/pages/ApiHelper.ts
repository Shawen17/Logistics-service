import axios from "axios";
import { Order, OrderData} from "../components/interfaces";


const PRODUCT_URL = '/api/products/'
const INPIPELINE_URL = '/api/orders/inpipeline';
const UPDATE_STATUS_URL = '/api/orders/update_status';
const LOGIN_URL = 'api/users/login'
const SIGNUP_URL = "api/users/register"



export const signup = async(CustomerEmail:string,CustomerPassword:string,CustomerFirstName:string,CustomerLastName:string,CustomerNumber:string)=>{

  const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let errorOccured = false
    let signupMessage
    const body = JSON.stringify({CustomerEmail , CustomerPassword, CustomerFirstName, CustomerLastName, CustomerNumber });

    try {
      const response = await axios.post(
        SIGNUP_URL,
        body,
        config
      );

      if (response?.status === 200) {

        signupMessage = response.data.message;


       } else {
         const message  = response.data.message;
         throw message;
       }
     } catch(err) {
       console.error(err);
       errorOccured = true;
     }
     return {signupMessage, errorOccured }

}

const login = async(CustomerEmail:string,CustomerPassword:string)=>{
  let loginData
  const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let errorOccured = false
    const body = JSON.stringify({CustomerEmail , CustomerPassword });

    try {
      const response = await axios.post(
        LOGIN_URL,
        body,
        config
      );

      if (response?.status === 200) {

        loginData = response.data.data;


       } else {
         const message  = response.data.message;
         throw message;
       }
     } catch(err) {
       console.error(err);
       errorOccured = true;
     }
     return {loginData, errorOccured }

}

const getAllProducts = async ()=>{
  let productData
  let errorOccured = false;
    try {
      const response = await axios.get(PRODUCT_URL);
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


const getInPipelineData = async () => {
    const orderData: OrderData = {
      Queued: [],
      InProgress: [],
      QA: [],
    };
    let errorOccured = false;
    try {
      const response = await axios.get(INPIPELINE_URL);
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



const updateOrderStatus = async (order: Order, newOrderStatus: string) => {
    const updatedOrder = { ...order, OrderStatus: newOrderStatus };
    let orderStatusUpdated = false;
    try {
        const response = await axios.post(UPDATE_STATUS_URL, updatedOrder);
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

export { getInPipelineData, INPIPELINE_URL, login, updateOrderStatus, UPDATE_STATUS_URL,getAllProducts,PRODUCT_URL };
