import type { AdminData } from "../types/types";

const adminData: AdminData = {
  username: "admin",
  password: "admin",
  id: "admin",
  pendingOrders: [
    {
      name: "USB SamDisk 2.0 64GB",
      price: "10.99€",
      id: "12345",
      quantity: 2,
      image: "usb.jpg",
    },
  ],
  finishedOrders: [],
};

export default adminData;
