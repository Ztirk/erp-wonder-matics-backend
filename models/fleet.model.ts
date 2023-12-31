import sql from "mssql";
import { devConfig } from "../config/devDb.config";
import { fleetMainColumn } from "../utils/fleet.mainColumn";

export const selectFleet = async (filter: string, page: string) => {
  try {
    let pool = await sql.connect(devConfig);
    let result = await pool
      .request()
      .input("filter", sql.NVarChar, filter)
      .input("page", sql.Int, page)
      .query(
        `
        WITH Fleet As (
            SELECT 
                ${fleetMainColumn}
        
            FROM DevelopERP_ForTesting..Fleet f
            WHERE f.fleet_name LIKE @filter
        )
        
        SELECT * FROM Fleet
        WHERE no BETWEEN (@page-1)*10+1 AND (@page-1)*10+10
        `
      );
    return {
      customer: result.recordset,
    };
  } catch (err) {
    return { response: err };
  }
};