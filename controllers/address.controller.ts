import { Request, Response } from "express";
import { selectAddress } from "../models/address.model";

export const getAddress = async (req: Request, res: Response) => {
  console.log("GET /address");
  try {
    const query = req.query;
    const filter = `%${query.filter}%`;
    const page = query.page;
    if (typeof query.filter == "string" && typeof page == "string") {
      let data = await selectAddress(filter, page);
      console.log("Success");
      return res.status(200).json(data);
    }
    throw new Error("ใส่ Filter กับ Page พร้อมกันนะแจ๊ะ");
  } catch (err) {
    if (err instanceof Error) {
      console.log("Failed");
      return res.status(404).json({ Error: err.message });
    }
  }
};
