

export interface Order {
    OrderID: number;
    CustomerID: number;
    ProductID: number;
    OrderStatus: string;
    Address:string;
    Products:{};
    State:string;
    TreatedBy:string;

}

export interface Activity {
  ActivityID: number;
  OrderID: number;
  Staff: number;
  StartTime: Date;
  EndTime:Date | null;
  Duration:number | null;
  CheckedBy:number | null;
}

export interface User {
  CustomerID: number;
  CustomerFirstName: string;
  CustomerLastName: string;
  CustomerEmail:string;
  CustomerNumber:string;
  Active:boolean;
  Role:string
}

export interface RootState {
    auth: {
      role: string;
      access:string;
      isAuthenticated:boolean;
      user:User | null;
      failed:boolean

    };
  }


export interface OrderData {
  Queued: Order[],
  InProgress: Order[],
  QA: Order[],
}

export interface PickerOrder {
    InProgress: Order[],
    QA: Order[],
  }

export interface HeaderLink {
    label: string;
    url: string;
}

export interface HeaderProps {
    links: HeaderLink[] ;
}

export interface ProductProps {
    ProductID:number;
    ProductName:string;
    ProductPhotoURL:string;
    ProductStatus:string | null
}

export interface ProductItemProps {
   items: ProductProps[]
}
